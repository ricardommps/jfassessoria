import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { alpha, styled, useTheme } from '@mui/material/styles';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import { m, useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionContainer, varFade } from 'src/components/animate';
// components
import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// layouts
import { HEADER } from 'src/layouts/config-layout';
// theme
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_3.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    marginTop: HEADER.H_DESKTOP_OFFSET,
  },
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const heroRef = useRef(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  const isLight = theme.palette.mode === 'light';

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [heroRef, scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 60 * 4,
    repeat: Infinity,
  };

  const opacity = 1 - percent / 100;

  const hide = percent > 120;

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        mx: 'auto',
        maxWidth: 480,
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        },
      }}
    >
      <m.div variants={varFade().in}>
        <Stack direction={{ xs: 'column-reverse', sm: 'row' }}>
          <Stack alignItems="center">
            <Image disabledEffect alt={'home'} src={`/assets/images/home/hero/home.svg`} />
          </Stack>
        </Stack>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack sx={{ textAlign: 'center' }}>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Link
              href="https://www.instagram.com/_joanaf/"
              underline="none"
              sx={{
                '&:hover': {
                  bgcolor: alpha('#E02D69', 0.08),
                },
              }}
            >
              <Iconify color={'#E02D69'} icon={'ant-design:instagram-filled'} width={30} />
            </Link>
          </Stack>
        </Stack>
      </m.div>
    </Stack>
  );

  const renderSlides = (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        height: '150%',
        position: 'absolute',
        opacity: opacity > 0 ? opacity : 0,
        transform: `skew(${-16 - percent / 24}deg, ${4 - percent / 16}deg)`,
      }}
    >
      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{
          width: 344,
          position: 'relative',
        }}
      >
        <Box
          component={m.img}
          animate={{ y: ['0%', '100%'] }}
          transition={transition}
          alt={isLight ? 'light_1' : 'dark_1'}
          src={
            isLight
              ? `/assets/images/home/hero/light_1.webp`
              : `/assets/images/home/hero/dark_home.svg`
          }
          sx={{ position: 'absolute', mt: -5 }}
        />
        <Box
          component={m.img}
          animate={{ y: ['-100%', '0%'] }}
          transition={transition}
          alt={isLight ? 'light_1' : 'dark_1'}
          src={
            isLight
              ? `/assets/images/home/hero/light_1.webp`
              : `/assets/images/home/hero/dark_home.svg`
          }
          sx={{ position: 'absolute' }}
        />
      </Stack>

      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{ width: 720, position: 'relative', ml: -5 }}
      >
        <Box
          component={m.img}
          animate={{ y: ['100%', '0%'] }}
          transition={transition}
          alt={isLight ? 'light_2' : 'dark_2'}
          src={
            isLight
              ? `/assets/images/home/hero/light_2.webp`
              : `/assets/images/home/hero/dark_home.svg`
          }
          sx={{ position: 'absolute', mt: -5 }}
        />
        <Box
          component={m.img}
          animate={{ y: ['0%', '-100%'] }}
          transition={transition}
          alt={isLight ? 'light_2' : 'dark_2'}
          src={
            isLight
              ? `/assets/images/home/hero/light_2.webp`
              : `/assets/images/home/hero/dark_home.svg`
          }
          sx={{ position: 'absolute' }}
        />
      </Stack>
    </Stack>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <StyledWrapper>
          <Container component={MotionContainer} sx={{ height: 1 }}>
            <Grid container columnSpacing={{ md: 10 }} sx={{ height: 1 }}>
              <Grid xs={12} md={6}>
                {renderDescription}
              </Grid>

              {mdUp && <Grid md={6}>{renderSlides}</Grid>}
            </Grid>
          </Container>
        </StyledWrapper>
      </StyledRoot>
    </>
  );
}
