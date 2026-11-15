import Link from "next/link";

// The tab title for a missing page. (Next.js sends missing pages as a 404 with a light
// HTML shell and draws this message in the browser; search engines go by the 404.)
export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
      <h1 className="text-4xl">Page not found</h1>
      <p className="soft mt-4">The page you're looking for isn't here, or it hasn't been published yet.</p>
      <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
    </section>
  );
}
