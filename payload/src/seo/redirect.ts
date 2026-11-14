import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { findRedirect } from '@/lib/data'
import { normalizePath } from './config'

/** Nothing lives here: follow the school's redirect for this old address, or show "not found". */
export async function redirectOrNotFound(path: string): Promise<never> {
  const hit = await findRedirect(normalizePath(path))
  if (hit) (hit.permanent ? permanentRedirect : redirect)(hit.to)
  notFound()
}
