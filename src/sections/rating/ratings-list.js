import Box from '@mui/material/Box';
import { useEffect } from 'react';
import EmptyContent from 'src/components/empty-content';
import useRating from 'src/hooks/use-rating';

import RatingItem from './rating-item';

export default function RatingsList({ setLoading }) {
  const { onGetRatings, ratings } = useRating();

  useEffect(() => {
    onGetRatings();
  }, []);
  const notFound = !ratings || ratings.length === 0;
  return (
    <>
      {notFound ? (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
          }}
        />
      ) : (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {ratings.map((rating) => (
            <RatingItem key={rating.id} setLoading={setLoading} rating={rating} />
          ))}
        </Box>
      )}
    </>
  );
}
