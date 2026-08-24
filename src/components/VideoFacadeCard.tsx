import { useEffect, useRef, useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import type { PortfolioVideo } from "@/data/videos";
import { ACCOUNT_LABELS } from "@/data/videos";
import { ensureEmbedScript, reprocessEmbeds } from "@/lib/tiktokEmbed";

interface VideoFacadeCardProps {
  video: PortfolioVideo;
  /** True once the grid has neared the viewport and embed.js has been fetched. */
  scriptReady: boolean;
}

/**
 * A single video, shown first as a cheap typographic card.
 *
 * The real TikTok embed — and with it the live view count, so no metric on this
 * page is ever hand-typed — is injected only when the visitor activates the
 * card. Six embeds mounted eagerly would mean six third-party iframes on first
 * paint, which is exactly the wrong trade on a mobile connection.
 */
export const VideoFacadeCard = ({ video, scriptReady }: VideoFacadeCardProps) => {
  const [activated, setActivated] = useState(false);
  const embedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activated) return;
    // The blockquote only exists now, so embed.js has to scan again.
    void (scriptReady ? reprocessEmbeds() : ensureEmbedScript().then(reprocessEmbeds));
  }, [activated, scriptReady]);

  const handle = ACCOUNT_LABELS[video.handle];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-neutral-200/60 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Fixed ratio so activating an embed does not shove the grid around. */}
      <div className="relative w-full aspect-[9/16] bg-neutral-50">
        {activated ? (
          <div ref={embedRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden">
            <blockquote
              className="tiktok-embed"
              cite={video.url}
              data-video-id={video.id}
              style={{ maxWidth: "100%", minWidth: "auto", margin: 0 }}
            >
              <section>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={handle}
                >
                  {handle}
                </a>
              </section>
            </blockquote>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play video from ${handle}: ${video.label}`}
            className="group absolute inset-0 flex flex-col justify-between p-5 text-left bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white transition-transform duration-300 motion-safe:hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
              {handle}
            </span>

            {/* Typographic poster: the caption itself carries the card. */}
            <span className="text-lg md:text-xl font-black leading-snug line-clamp-6">
              {video.label}
            </span>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 motion-safe:group-hover:scale-110 transition-transform">
                <Play aria-hidden="true" className="h-4 w-4 fill-current" />
              </span>
              Play here
            </span>
          </button>
        )}
      </div>

      {/* Always present, so the card still works if the embed is blocked or
          TikTok changes its embed API. */}
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-inset"
      >
        <span className="truncate">Watch on TikTok</span>
        <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
      </a>
    </div>
  );
};
