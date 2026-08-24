/**
 * The six flagship videos surfaced on /creator.
 *
 * `label` is an excerpt of each video's real TikTok caption, retrieved from
 * TikTok's public oEmbed endpoint and committed here so the page makes no
 * third-party request to render. Hashtags are stripped and long captions are
 * clamped at a word boundary; no wording is authored by hand.
 *
 * View counts are never stored here — those come from the live TikTok embed,
 * so no metric on this site can go stale.
 */
export type VideoHandle = "realjaycoding" | "jaywithzaio";

export interface PortfolioVideo {
  id: string;
  handle: VideoHandle;
  url: string;
  label: string;
}

export const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  {
    id: "7578211660041604373",
    handle: "realjaycoding",
    url: "https://www.tiktok.com/@realjaycoding/video/7578211660041604373",
    label: "I wish someone told me this before I started Computer Science… It’s not about typing fast. It’s not about knowing every language. It’s…",
  },
  {
    id: "7592322607232322837",
    handle: "realjaycoding",
    url: "https://www.tiktok.com/@realjaycoding/video/7592322607232322837",
    label: "Being a first year computer science student is overwhelming — and no one prepares you for that. You go from high school to: • heavy…",
  },
  {
    id: "7639824910348848404",
    handle: "realjaycoding",
    url: "https://www.tiktok.com/@realjaycoding/video/7639824910348848404",
    label: "A degree alone is no longer enough. Students need projects, skills, and experience if they want opportunities after graduation.",
  },
  {
    id: "7662874041081941268",
    handle: "jaywithzaio",
    url: "https://www.tiktok.com/@jaywithzaio/video/7662874041081941268",
    label: "I looked at 50 junior software developer portfolios. 3 got callbacks. The difference wasn’t the code 👇",
  },
  {
    id: "7664669956885335317",
    handle: "jaywithzaio",
    url: "https://www.tiktok.com/@jaywithzaio/video/7664669956885335317",
    label: "Everyone explains GitHub like you already know GitHub. Here’s the whole thing from zero 👇",
  },
  {
    id: "7665457358855884052",
    handle: "jaywithzaio",
    url: "https://www.tiktok.com/@jaywithzaio/video/7665457358855884052",
    label: "Replying to @chozilungu MCP does not replace APIs. Everyone explaining it wrong is making you feel behind for no reason 👇",
  },
];

/** Human-readable description of what each account is, used by the video grid. */
export const ACCOUNT_LABELS: Record<VideoHandle, string> = {
  realjaycoding: "@realjaycoding",
  jaywithzaio: "@jaywithzaio",
};
