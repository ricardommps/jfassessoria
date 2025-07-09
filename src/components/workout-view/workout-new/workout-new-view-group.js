import '../slider.css'; // Inclui o CSS personalizado

import { CardHeader } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';

import WorkoutItem from './workout-item';

export default function WorkoutNewViewGroup({ media, mediaInfo, isWorkoutLoad, checkList = [] }) {
  const theme = useTheme();

  const handleType = () => {
    if (media.length === 2) {
      return 'BISET';
    }

    if (media.length === 3) {
      return 'TRISET';
    }

    return 'CIRCUITO';
  };

  const carousel = useCarousel({
    slidesToShow: 1,
    infinite: false,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
  return (
    <Box sx={{ py: 2, overflow: 'hidden', borderRadius: 2 }}>
      <CardHeader
        title={handleType()}
        action={<CarouselArrows onNext={carousel.onNext} onPrev={carousel.onPrev} />}
        sx={{
          p: 1,
        }}
      />
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {media.map((subMedia, index) => (
          <WorkoutItem
            key={subMedia.id}
            media={subMedia}
            mediaInfo={mediaInfo}
            isWorkoutLoad={isWorkoutLoad}
            checkList={checkList}
          />
        ))}
      </Carousel>
    </Box>
  );
}
