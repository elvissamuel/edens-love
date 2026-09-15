import { Countdown } from "@/components/Countdown";
import { Footer } from "@/components/Footer";
import { GiftPreview } from "@/components/GiftPreview";
import { Navbar } from "@/components/Navbar";
import { OurStory } from "@/components/OurStory";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { RsvpForm } from "@/components/RsvpForm";
import { Venue } from "@/components/Venue";
import { WeddingDate } from "@/components/WeddingDate";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main>
        <PhotoCarousel />
        <Countdown />
        <OurStory />
        <WeddingDate />
        <Venue />
        <RsvpForm />
        <GiftPreview />
      </main>
      <Footer />
    </div>
  );
}
