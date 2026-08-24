import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { ContentCreation } from "@/components/ContentCreation";
import { CrossTrackLink } from "@/components/CrossTrackLink";
import { Contact } from "@/components/Contact";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useHashScroll } from "@/hooks/useHashScroll";

/**
 * The creator track. Leads with reach and the Zaio contract; the developer work
 * appears as the reason the content is credible.
 */
const Creator = () => {
  useDocumentMeta({
    title: "Jay Mthethwa | Social Media Content Creator",
    description:
      "Short-form tech education for South African students. 1.7M+ views across two TikTok accounts, on contract with Zaio Institute of Technology. Scripted, shot and edited end to end.",
  });
  useHashScroll();

  return (
    <Layout>
      <Hero variant="creator" />
      <ContentCreation />
      <CrossTrackLink from="creator" />
      <Contact />
    </Layout>
  );
};

export default Creator;
