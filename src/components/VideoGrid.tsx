import { useEffect, useRef, useState } from "react";
import { PORTFOLIO_VIDEOS, ACCOUNT_LABELS, type VideoHandle } from "@/data/videos";
import { ensureEmbedScript } from "@/lib/tiktokEmbed";
import { VideoFacadeCard } from "./VideoFacadeCard";

const ACCOUNT_ORDER: VideoHandle[] = ["realjaycoding", "jaywithzaio"];

const ACCOUNT_BLURB: Record<VideoHandle, string> = {
  realjaycoding: "My own channel.",
  jaywithzaio: "The brand channel I create and manage for Zaio.",
};

/**
 * The six flagship videos.
 *
 * Nothing third-party is requested during first paint. An IntersectionObserver
 * with a generous margin warms embed.js once the grid is approaching, so the
 * first activation feels instant, but the embeds themselves are still injected
 * one at a time on activation rather than six at once.
 */
export const VideoGrid = () => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    // Without IntersectionObserver, skip the warm-up entirely; activation still
    // loads the script on demand.
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void ensureEmbedScript().then(() => setScriptReady(true));
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sentinelRef}>
      {ACCOUNT_ORDER.map((handle) => {
        const videos = PORTFOLIO_VIDEOS.filter((video) => video.handle === handle);
        if (videos.length === 0) return null;

        return (
          <section key={handle} className="mb-12 last:mb-0" aria-labelledby={`videos-${handle}`}>
            <div className="mb-5">
              <h4 id={`videos-${handle}`} className="text-xl font-bold text-neutral-900">
                <a
                  href={`https://www.tiktok.com/@${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 transition-colors"
                >
                  {ACCOUNT_LABELS[handle]}
                </a>
              </h4>
              <p className="text-sm text-neutral-600 mt-1">{ACCOUNT_BLURB[handle]}</p>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
              {videos.map((video) => (
                <li key={video.id} className="h-full">
                  <VideoFacadeCard video={video} scriptReady={scriptReady} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="text-xs text-neutral-500 leading-relaxed">
        View counts come from TikTok&rsquo;s own embed, so they are always current
        rather than typed in by hand.
      </p>
    </div>
  );
};
