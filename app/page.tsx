import FeaturedProducts from '@/components/landing-page/featured-products';
import LandingPage from '@/components/landing-page/landing-page';
import RecentlyLaunchedProducts from '@/components/landing-page/recently-launched-products';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div>
      <LandingPage />

      <FeaturedProducts />

      <Suspense fallback={<div>LOading...</div>}>
        <RecentlyLaunchedProducts />
      </Suspense>
    </div>
  );
}
