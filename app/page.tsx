import { BuiltForLongRoad } from "@/components/BuiltForLongRoad";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Nav } from "@/components/Nav";
import { OneWordUpClose } from "@/components/OneWordUpClose";
import { ThePromise } from "@/components/ThePromise";
import { YourSixMonths } from "@/components/YourSixMonths";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-bg text-ink">
      <Nav />
      <Hero />
      <ThePromise />
      <HowItWorks />
      <OneWordUpClose />
      <BuiltForLongRoad />
      <YourSixMonths />
      <FinalCTA />
      <Footer />
    </main>
  );
}
