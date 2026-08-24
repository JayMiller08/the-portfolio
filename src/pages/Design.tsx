import { Layout } from "@/components/Layout";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

/**
 * The design track — STRUCTURE ONLY, INTENTIONALLY EMPTY.
 *
 * Gated behind FEATURES.design (off by default) and linked from nowhere. The
 * layout below is ready for real case studies from the Fiverr work
 * (July 2020 - June 2022); until those assets exist, this route ships no
 * placeholder projects, no stock imagery and no invented case studies. An
 * unlinked empty route is recoverable; a fabricated portfolio is not.
 *
 * To populate: drop real case studies into CASE_STUDIES, then set
 * VITE_ENABLE_DESIGN=true.
 */

interface DesignCaseStudy {
  title: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
}

/** Deliberately empty. Add real work here — nothing invented. */
const CASE_STUDIES: DesignCaseStudy[] = [];

const Design = () => {
  useDocumentMeta({
    title: "Jay Mthethwa | Design",
    description: "Graphic design work by Jay Mthethwa.",
  });

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-neutral-950 tracking-tight">
              Design
            </h1>
            <p className="text-lg text-neutral-600 font-medium max-w-2xl">
              Two years of paid graphic design work, July 2020 to June 2022.
            </p>

            {CASE_STUDIES.length === 0 ? (
              <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
                <p className="text-neutral-600 font-medium">
                  This page is not published yet.
                </p>
                <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
                  The layout is ready and waiting on real case studies. Nothing
                  placeholder will be shown here.
                </p>
              </div>
            ) : (
              <div className="mt-12 grid gap-8 md:grid-cols-2">
                {CASE_STUDIES.map((study) => (
                  <article
                    key={study.title}
                    className="rounded-2xl border border-neutral-200/60 bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                  >
                    <img
                      src={study.imageSrc}
                      alt={study.imageAlt}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-neutral-900 mb-2">{study.title}</h2>
                      <p className="text-neutral-600 leading-relaxed">{study.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Design;
