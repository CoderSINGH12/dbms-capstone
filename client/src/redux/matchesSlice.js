import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { matchService } from '../services/matchService.js';

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await matchService.getMatches(params);
      return response; // { data: [...], pagination: {...} }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch matches from server');
    }
  }
);

export const fetchMatchById = createAsyncThunk(
  'matches/fetchMatchById',
  async (matchId, { rejectWithValue }) => {
    try {
      return await matchService.getMatchById(matchId);
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch match ${matchId}`);
    }
  }
);

const initialState = {
  items: [],
  selectedMatch: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  },
  filters: {
    status: 'All',
    teamId: null,
    matchday: null,
  },
  loading: false,
  error: null,
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatchFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMatchFilters(state) {
      state.filters = { status: 'All', teamId: null, matchday: null };
    },
    clearMatchesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMatches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      // fetchMatchById
      .addCase(fetchMatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMatch = action.payload;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setMatchFilters, clearMatchFilters, clearMatchesError } = matchesSlice.actions;
export default matchesSlice.reducer;