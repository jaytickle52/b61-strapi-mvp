import Link from "next/link";
import { mediaUrl, type getSettings } from "@/lib/data";

type Settings = Awaited<ReturnType<typeof getSettings>>;

export function SiteHeader({ settings }: { settings: Settings }) {
  const logo = mediaUrl(settings.logo);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          {logo ? (
            <img src={logo} alt="" className="h-10 w-auto" />
          ) : (
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-brand font-heading text-lg text-white">
              {settings.schoolName.charAt(0)}
            </span>
          )}
          <span className="font-heading text-lg leading-tight">{settings.schoolName}</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 text-[0.95rem] lg:flex">
          {(settings.navigation ?? []).map((item) => (
            <Link key={item.url!} href={item.url!} className="hover:text-brand">{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/parents" className="hidden text-sm font-semibold text-brand sm:inline">Parents</Link>
          {settings.headerButton?.label && (
            <Link href={settings.headerButton.url ?? "/"} className="btn btn-primary hidden whitespace-nowrap !py-2.5 !text-sm sm:inline-flex">{settings.headerButton.label}</Link>
          )}
        </div>
      </div>
      <nav aria-label="Main (mobile)" className="flex gap-5 overflow-x-auto border-t border-line px-5 py-2.5 text-sm lg:hidden">
        {(settings.navigation ?? []).map((item) => (
          <Link key={item.url!} href={item.url!} className="whitespace-nowrap">{item.label}</Link>
        ))}
        <Link href="/parents" className="whitespace-nowrap font-semibold text-brand">Parents</Link>
      </nav>
    </header>
  );
}

export function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="tone-dark mt-auto">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3 sm:px-8">
        <div>
          <p className="font-heading text-xl">{settings.schoolName}</p>
          {settings.tagline && <p className="soft mt-2">{settings.tagline}</p>}
        </div>
        <div className="soft space-y-1 text-sm">
          {settings.address && <p className="whitespace-pre-line">{settings.address}</p>}
          {settings.phone && <p><a href={`tel:${settings.phone}`}>{settings.phone}</a></p>}
          {settings.email && <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>}
        </div>
        <nav aria-label="Footer" className="soft flex flex-col gap-1 text-sm">
          {(settings.navigation ?? []).map((item) => (
            <Link key={item.url!} href={item.url!}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function PreviewBanner() {
  return (
    <div role="status" className="sticky top-0 z-40 flex items-center justify-center gap-4 bg-accent px-4 py-2 text-sm font-semibold text-[#1b1f24]">
      <span>Preview: you are seeing unpublished changes.</span>
      <form action="/next/exit-preview" method="post">
        <button type="submit" className="underline">Exit preview</button>
      </form>
    </div>
  );
}
