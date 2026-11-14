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
