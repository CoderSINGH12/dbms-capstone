import { useSelector, useDispatch } from 'react-redux';
import { setSelectedSeasonId } from '../redux/seasonSlice.js';

export const useSelectedSeason = () => {
  const dispatch = useDispatch();
  const { selectedSeasonId, seasonsList, loading, error } = useSelector((state) => state.season);

  const selectedSeason = seasonsList.find((s) => s.id === selectedSeasonId) || seasonsList[0];

  const changeSeason = (seasonId) => {
    dispatch(setSelectedSeasonId(seasonId));
  };

  return {
    selectedSeasonId,
    selectedSeason,
    seasonsList,
    changeSeason,
    loading,
    error,
  };
};

export default useSelectedSeason;
