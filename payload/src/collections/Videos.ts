import type { CollectionAfterDeleteHook, CollectionConfig } from 'payload'
import { publishersOnly } from '../access'
import { refuseDeleteWhenUsed, usageEndpoint, usageField } from '../usage/fields'
import { deleteVideo, videoGuid } from '../video/bunny'

/**
 * The school's videos, so one upload can be used on any number of pages
 * (Jay, 19 Nov 2026). Every video uploaded from an element lands here too;
 * any video field can pick one again with "Choose a video". Editors never see
 * where the files are kept. Deleting one that is still used is refused; deleting
 * an unused one also removes the file, so storage doesn't fill with leftovers.
 */
const removeFile: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const guid = videoGuid(doc?.link)
  if (!guid) return
  // Another library entry may point at the same file (copied by hand); keep it then.
  const others = await req.payload.find({ collection: 'videos' as any, where: { link: { contains: guid } }, limit: 1, depth: 0, overrideAccess: true, req })
  if (others.totalDocs) return
  await deleteVideo(guid).catch((err) => req.payload.logger.error({ err }, `Removing video ${guid} failed`))
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Video', plural: 'Videos' },
  // Everyone at the school uploads; only Editors and School Admins delete.
  access: { read: () => true, delete: publishersOnly },
  admin: {
    group: 'Files',
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    description:
      'Videos for the website. Upload one here or from any video field; then pick it anywhere with "Choose a video", without uploading it again.',
  },
  hooks: {
    beforeValidate: [({ data }) => (data && !data.title ? { ...data, title: 'Video' } : data)],
    beforeDelete: [refuseDeleteWhenUsed('videos')],
    afterDelete: [removeFile],
  },
  endpoints: [usageEndpoint('videos')],
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      admin: { description: 'How the video is listed when you choose one, e.g. "Campus tour 2026".' },
    },
    {
      name: 'link',
      label: 'Video',
      type: 'text',
      required: true,
      admin: {
        components: { Field: { path: '@/video/VideoField#VideoField', clientProps: { uploadFirst: true, inLibrary: true } } },
      },
    },
    usageField('videos'),
  ],
}
