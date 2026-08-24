import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { CrossTrackLink } from "@/components/CrossTrackLink";
import { Contact } from "@/components/Contact";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useHashScroll } from "@/hooks/useHashScroll";

/**
 * The developer track. Leads with the projects and the stack; the content work
 * is present, but condensed to a single line.
 */
const Dev = () => {
  useDocumentMeta({
    title: "Jay Mthethwa | Junior Web Developer",
    description:
      "Junior web developer and third-year Computer Science student at Tshwane University of Technology. React, TypeScript, Supabase and Java. Projects include StudentOS and AmanziGuard.",
  });
  useHashScroll();

  return (
    <Layout>
      <Hero variant="dev" />
      <Projects />
      <Skills />
      <CrossTrackLink from="dev" />
      <Contact />
    </Layout>
  );
};

export default Dev;
