import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { formatEventDate, getEvents, getNews } from "@/lib/strapi";

export const metadata = { title: "Parent feed", robots: { index: false } };

const COOKIE = "parent_access";
// Stand-in for real parent logins: one shared password per school, from PARENT_PASSWORD.
const accessKey = () => createHash("sha256").update(`b61:${process.env.PARENT_PASSWORD ?? ""}`).digest("hex");

async function signIn(formData: FormData) {
  "use server";
  if (process.env.PARENT_PASSWORD && formData.get("password") === process.env.PARENT_PASSWORD) {
    (await cookies()).set(COOKIE, accessKey(), { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 30, path: "/" });
    redirect("/parents");
  }
  redirect("/parents?error=1");
}

async function signOut() {
  "use server";
  (await cookies()).delete(COOKIE);
  redirect("/parents");
}

function Badge({ audience }: { audience: string }) {
  return audience === "parents" ? (
    <span className="rounded-full bg-accent/25 px-2.5 py-0.5 text-xs font-semibold text-ink">Parents only</span>
  ) : (
    <span className="rounded-full bg-paper-muted px-2.5 py-0.5 text-xs font-semibold text-ink-soft">Public</span>
  );
}

export default async function ParentsPage({ searchParams }: PageProps<"/parents">) {
  const signedIn = (await cookies()).get(COOKIE)?.value === accessKey() && Boolean(process.env.PARENT_PASSWORD);
  const { error } = await searchParams;

  if (!signedIn) {
    return (
      <>
        <PageHeader eyebrow="Families" title="Parent feed" intro="Events and updates for current families. Enter the parent password from the school office." />
        <section className="mx-auto w-full max-w-md px-5 py-14">
          <form action={signIn} className="space-y-4 rounded-2xl border border-line p-6">
            <label className="block text-sm font-semibold" htmlFor="password">Parent password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password"
              className="w-full rounded-xl border border-line px-4 py-3 text-base outline-none focus:border-brand" />
            {error && <p role="alert" className="text-sm text-red-700">That password didn't work. Please try again.</p>}
            <button type="submit" className="btn btn-primary w-full justify-center">See the parent feed</button>
          </form>
        </section>
      </>
    );
  }

  const [events, news] = await Promise.all([getEvents({ audience: "all", limit: 20 }), getNews({ audience: "all", limit: 20 })]);

  return (
    <>
      <PageHeader eyebrow="Families" title="Parent feed" intro="Everything for current families, in one place. Parents-only items never appear on the public website." />
      <div className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <section aria-labelledby="feed-events">
          <h2 id="feed-events" className="mb-5 text-2xl">Coming up</h2>
          <ul className="space-y-4">
            {events.map((e) => (
              <li key={e.documentId} className="rounded-2xl border border-line p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-brand">{formatEventDate(e.startsAt, { withTime: true })}</span>
                  <Badge audience={e.audience} />
                </div>
                <p className="font-heading text-lg">{e.title}</p>
                {e.location && <p className="soft text-sm">{e.location}</p>}
                {e.summary && <p className="mt-2 text-[0.95rem]">{e.summary}</p>}
              </li>
            ))}
            {events.length === 0 && <p className="soft">Nothing on the calendar yet.</p>}
          </ul>
        </section>
        <section aria-labelledby="feed-news">
          <h2 id="feed-news" className="mb-5 text-2xl">Updates</h2>
          <ul className="space-y-4">
            {news.map((n) => (
              <li key={n.documentId} className="rounded-2xl border border-line p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-brand">{formatEventDate(n.date)}</span>
                  <Badge audience={n.audience} />
                </div>
                <p className="font-heading text-lg">{n.title}</p>
                {n.summary && <p className="mt-2 text-[0.95rem]">{n.summary}</p>}
              </li>
            ))}
            {news.length === 0 && <p className="soft">No updates yet.</p>}
          </ul>
        </section>
      </div>
      <form action={signOut} className="mx-auto w-full max-w-5xl px-5 pb-14 sm:px-8">
        <button type="submit" className="text-sm underline">Sign out</button>
      </form>
    </>
  );
}
