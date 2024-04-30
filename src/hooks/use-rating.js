import { useCallback } from 'react';
import { getRatings } from 'src/redux/slices/rating';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useRating() {
  const dispatch = useDispatch();
  const { ratings, ratingsStatus } = useSelector((state) => state.rating);

  const onGetRatings = useCallback(() => {
    dispatch(getRatings());
  }, [dispatch]);

  return {
    onGetRatings,
    ratings,
    ratingsStatus,
  };
}
