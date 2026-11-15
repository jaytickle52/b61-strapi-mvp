/** Structured data for search engines (schema.org JSON-LD). Rendered in the page head/body. */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // "<" is escaped so nothing in the data can close the script tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
