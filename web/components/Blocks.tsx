import type { ReactNode } from "react";
import { mediaUrl, type Block } from "@/lib/strapi";

// Renders Strapi's rich text ("blocks") field. Covers what the editor produces:
// paragraphs, headings, lists, quotes, links, images and bold/italic/underline.

type TextNode = { type: "text"; text: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean };

function renderInline(nodes: Block[] = [], keyPrefix = ""): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}${i}`;
    if (node.type === "text") {
      const t = node as unknown as TextNode;
      let out: ReactNode = t.text;
      if (t.code) out = <code>{out}</code>;
      if (t.bold) out = <strong>{out}</strong>;
      if (t.italic) out = <em>{out}</em>;
      if (t.underline) out = <u>{out}</u>;
      if (t.strikethrough) out = <s>{out}</s>;
      return <span key={key}>{out}</span>;
    }
    if (node.type === "link") {
      return (
        <a key={key} href={String(node.url ?? "#")}>
          {renderInline(node.children, `${key}-`)}
        </a>
      );
    }
    if (node.type === "list-item") {
      return <li key={key}>{renderInline(node.children, `${key}-`)}</li>;
    }
    return <span key={key}>{renderInline(node.children, `${key}-`)}</span>;
  });
}

export default function Blocks({ content }: { content?: Block[] | null }) {
  if (!content?.length) return null;
  return (
    <div className="prose-blocks">
      {content.map((block, i) => {
        const children = renderInline(block.children, `${i}-`);
        switch (block.type) {
          case "heading": {
            const level = Number(block.level ?? 2);
            if (level <= 2) return <h2 key={i}>{children}</h2>;
            return <h3 key={i}>{children}</h3>;
          }
          case "list":
            return block.format === "ordered" ? <ol key={i}>{children}</ol> : <ul key={i}>{children}</ul>;
          case "quote":
            return <blockquote key={i}>{children}</blockquote>;
          case "image": {
            const img = block.image as { url: string; alternativeText?: string } | undefined;
            const src = mediaUrl(img ?? null);
            return src ? <img key={i} src={src} alt={img?.alternativeText ?? ""} /> : null;
          }
          case "code":
            return <pre key={i}>{children}</pre>;
          default:
            return <p key={i}>{children}</p>;
        }
      })}
    </div>
  );
}
