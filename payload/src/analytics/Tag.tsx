import Script from 'next/script'

/** Google Analytics (gtag.js) for a school's live site. The layout decides when to include it. */
export default function AnalyticsTag({ id }: { id: string }) {
  const tag = id.trim()
  if (!/^G-[A-Z0-9]{4,}$/.test(tag)) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${tag}`} strategy="afterInteractive" />
      <Script id="b61-ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tag}');`}
      </Script>
    </>
  )
}
