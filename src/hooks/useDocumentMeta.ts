import { useEffect } from "react";

interface DocumentMeta {
  title: string;
  description: string;
}

const setMetaContent = (selector: string, attr: string, key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

/**
 * Sets the document title and description for a route.
 *
 * Caveat worth knowing: this site is client-rendered, so these values are
 * applied by JavaScript after load. Google executes JS and will see them, but
 * link-preview scrapers (LinkedIn, WhatsApp, Slack, X) generally do not — they
 * read the static index.html and will show the same card for every route.
 * Making previews differ per route requires prerendering or SSR.
 */
export const useDocumentMeta = ({ title, description }: DocumentMeta) => {
  useEffect(() => {
    document.title = title;
    setMetaContent('meta[name="description"]', "name", "description", description);
    setMetaContent('meta[property="og:title"]', "property", "og:title", title);
    setMetaContent('meta[property="og:description"]', "property", "og:description", description);
    setMetaContent('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaContent('meta[name="twitter:description"]', "name", "twitter:description", description);
  }, [title, description]);
};
