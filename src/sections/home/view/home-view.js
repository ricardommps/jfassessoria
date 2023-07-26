'use client';

import { useScroll } from 'framer-motion';
import ScrollProgress from 'src/components/scroll-progress';
import MainLayout from 'src/layouts/main';

import HomeHero from '../home-hero';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />
    </MainLayout>
  );
}
