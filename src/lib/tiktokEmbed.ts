/**
 * Lazy loader for TikTok's embed script.
 *
 * The script is fetched at most once per page load and only when something
 * actually needs it, so nothing third-party is requested during first paint.
 *
 * TikTok's embed.js scans for `.tiktok-embed` blockquotes at the moment it
 * runs and offers no public re-scan API. In a single-page app the blockquotes
 * appear after navigation, so a later activation has to re-run the script.
 * `reprocessEmbeds` does that by replacing the tag; the file is served from
 * cache, so the cost is a parse rather than a download.
 */

const EMBED_SRC = "https://www.tiktok.com/embed.js";
const SCRIPT_MARKER = "data-tiktok-embed-loader";

let loadPromise: Promise<void> | null = null;

const injectScript = (): Promise<void> =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.setAttribute(SCRIPT_MARKER, "true");
    // Resolve on failure too: the plain link in every card is the fallback, so a
    // blocked or failed script must never leave the UI stuck in a loading state.
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });

/** Loads embed.js once. Safe to call repeatedly. */
export const ensureEmbedScript = (): Promise<void> => {
  if (typeof document === "undefined") return Promise.resolve();
  if (loadPromise) return loadPromise;

  // Guard against a second tag if anything else already injected one.
  const existing = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_MARKER}]`);
  if (existing) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }

  loadPromise = injectScript();
  return loadPromise;
};

/**
 * Forces embed.js to scan again, for blockquotes added after it first ran.
 */
export const reprocessEmbeds = (): Promise<void> => {
  if (typeof document === "undefined") return Promise.resolve();

  document
    .querySelectorAll<HTMLScriptElement>(`script[${SCRIPT_MARKER}]`)
    .forEach((tag) => tag.remove());

  loadPromise = injectScript();
  return loadPromise;
};
