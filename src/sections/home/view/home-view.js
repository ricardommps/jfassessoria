'use client';

import Box from '@mui/material/Box';
// @mui
import { styled } from '@mui/material/styles';
import { useScroll } from 'framer-motion';
// components
import ScrollProgress from 'src/components/scroll-progress';
// layouts
import MainLayout from 'src/layouts/main';

import HomeAdvertisement from '../home-advertisement';
import HomeCleanInterfaces from '../home-clean-interfaces';
import HomeColorPresets from '../home-color-presets';
import HomeDarkMode from '../home-dark-mode';
import HomeForDesigner from '../home-for-designer';
//
import HomeHero from '../home-hero';
import HomeHugePackElements from '../home-hugepack-elements';
import HomeLookingFor from '../home-looking-for';
import HomeMinimal from '../home-minimal';
import HomePricing from '../home-pricing';

// ----------------------------------------------------------------------

const StyledPolygon = styled('div')(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));

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
