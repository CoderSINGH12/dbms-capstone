import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { seasonService } from '../services/seasonService.js';

export const fetchSeasons = createAsyncThunk(
  'season/fetchSeasons',
  async (_, { rejectWithValue }) => {
    try {
      return await seasonService.getSeasons();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch seasons');
    }
  }
);

const seasonSlice = createSlice({
  name: 'season',
  initialState: {
    selectedSeasonId: 1, // Default: 2024/25
    seasonsList: [
      { id: 1, label: '2024/25', start_year: 2024, end_year: 2025, status: 'current', coverage: 'verified' },
      { id: 2, label: '2023/24', start_year: 2023, end_year: 2024, status: 'completed', coverage: 'verified' },
      { id: 3, label: '2022/23', start_year: 2022, end_year: 2023, status: 'completed', coverage: 'verified' },
      { id: 4, label: '2021/22', start_year: 2021, end_year: 2022, status: 'completed', coverage: 'partial' },
      { id: 5, label: '2020/21', start_year: 2020, end_year: 2021, status: 'completed', coverage: 'partial' },
      { id: 6, label: '2014/15', start_year: 2014, end_year: 2015, status: 'completed', coverage: 'verified' },
    ],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedSeasonId(state, action) {
      state.selectedSeasonId = Number(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeasons.fulfilled, (state, action) => {
        state.loading = false;
        state.seasonsList = action.payload;
      })
      .addCase(fetchSeasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedSeasonId } = seasonSlice.actions;
export default seasonSlice.reducer;
