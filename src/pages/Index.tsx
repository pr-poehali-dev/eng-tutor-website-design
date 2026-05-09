import { Nav, Hero } from "@/components/NavHero";
import { About, Services, Advantages, Reviews } from "@/components/ContentSections";
import { Pricing, Contact, Footer } from "@/components/PricingContact";

export default function Index() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      <Nav />
      <Hero />
      <About />
      <Services />
      <Advantages />
      <Reviews />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
