import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-24 text-center sm:px-8">
      <h1 className="text-4xl">Page not found</h1>
      <p className="soft mt-4">The page you're looking for isn't here, or it hasn't been published yet.</p>
      <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
    </section>
  );
}
