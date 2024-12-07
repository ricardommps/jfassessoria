import './slider.css'; // Inclui o CSS personalizado

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import Carousel, { CarouselArrows, useCarousel } from 'src/components/carousel';

import WorkoutItemGroup from './workout-item-group';

export default function WorkoutViewGroup({ media, exerciseInfo, workoutLoad }) {
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
    slidesToShow: 4,
    infinite: false,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
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
          <WorkoutItemGroup
            key={subMedia.id}
            media={subMedia}
            exerciseInfo={exerciseInfo}
            workoutLoad={workoutLoad}
            index={index + 1}
          />
        ))}
      </Carousel>
    </Box>
  );
}
