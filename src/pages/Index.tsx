import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { RouteChooser } from "@/components/RouteChooser";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { WorkbookLaunchPopup } from "@/components/WorkbookLaunchPopup";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useHashScroll } from "@/hooks/useHashScroll";

/**
 * The landing page.
 *
 * It disambiguates between the two tracks, but is not a splash screen: someone
 * who reads nothing else still gets the name, both stat rows, the story and a
 * way to make contact.
 */
const Index = () => {
  useDocumentMeta({
    title: "Jay Mthethwa | Web Developer & Content Creator",
    description:
      "Third-year Computer Science student at Tshwane University of Technology. I build web applications, and create tech education content on contract for Zaio Institute of Technology.",
  });
  useHashScroll();

  return (
    <Layout>
      <Hero variant="landing" />
      <RouteChooser />
      <About />
      <Contact />
      <WorkbookLaunchPopup />
    </Layout>
  );
};

export default Index;
