import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProfileTypesSection from "@/components/home/ProfileTypesSection";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import FeaturedPlayersSection from "@/components/home/FeaturedPlayersSection";
import NewsSection from "@/components/home/NewsSection";
import CTASection from "@/components/home/CTASection";
import PartnershipSection from "@/components/home/PartnershipSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProfileTypesSection />
        <OpportunitiesSection />
        <NewsSection />
        <CTASection />
        <PartnershipSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
