import FeaturedProducts from '@/components/landing-page/featured-products';
import LandingPage from '@/components/landing-page/landing-page';
import RecentlyLaunchedProducts from '@/components/landing-page/recently-launched-products';

export default function Home() {
  return (
    <div>
      <LandingPage />

      <FeaturedProducts />

      <RecentlyLaunchedProducts />
    </div>
  );
}
