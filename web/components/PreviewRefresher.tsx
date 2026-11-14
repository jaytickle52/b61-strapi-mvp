"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// When the site is shown inside Strapi's preview panel, Strapi posts a
// "strapiUpdate" message after each save. Re-render so the draft appears
// without the editor reloading anything.
export default function PreviewRefresher({ strapiOrigin }: { strapiOrigin: string }) {
  const router = useRouter();
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== strapiOrigin) return;
      if (event.data?.type === "strapiUpdate") router.refresh();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router, strapiOrigin]);
  return null;
}
