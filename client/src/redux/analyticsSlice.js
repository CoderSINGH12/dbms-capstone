import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../services/analyticsService.js';

export const fetchTopScorers = createAsyncThunk(
  'analytics/fetchTopScorers',
  async ({ seasonId = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await analyticsService.getTopScorers(seasonId, limit);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch top scorers');
    }
  }
);

export const fetchTopAssists = createAsyncThunk(
  'analytics/fetchTopAssists',
  async ({ seasonId = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await analyticsService.getTopAssists(seasonId, limit);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch top assists');
    }
  }
);

export const fetchCards = createAsyncThunk(
  'analytics/fetchCards',
  async ({ seasonId = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await analyticsService.getCards(seasonId, limit);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch disciplinary rankings');
    }
  }
);

export const fetchMinutes = createAsyncThunk(
  'analytics/fetchMinutes',
  async ({ seasonId = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      return await analyticsService.getMinutes(seasonId, limit);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch minutes leaders');
    }
  }
);

export const fetchHeadToHead = createAsyncThunk(
  'analytics/fetchHeadToHead',
  async ({ teamA = 1, teamB = 2 }, { rejectWithValue }) => {
    try {
      return await analyticsService.getHeadToHead(teamA, teamB);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch head-to-head');
    }
  }
);

export const fetchSeasonComparison = createAsyncThunk(
  'analytics/fetchSeasonComparison',
  async (seasons = '1,2,6', { rejectWithValue }) => {
    try {
      return await analyticsService.compareSeasons(seasons);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch season comparison');
    }
  }
);

export const fetchPlayerComparison = createAsyncThunk(
  'analytics/fetchPlayerComparison',
  async ({ playerA, playerB, seasonId }, { rejectWithValue }) => {
    try {
      return await analyticsService.comparePlayers(playerA, playerB, seasonId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch player comparison');
    }
  }
);

const initialState = {
  topScorers: [],
  topAssists: [],
  cards: [],
  minutes: [],
  headToHead: null,
  seasonComparison: [],
  playerComparison: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopScorers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTopScorers.fulfilled, (state, action) => { state.loading = false; state.topScorers = action.payload; })
      .addCase(fetchTopScorers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(fetchTopAssists.fulfilled, (state, action) => { state.topAssists = action.payload; })
      .addCase(fetchCards.fulfilled, (state, action) => { state.cards = action.payload; })
      .addCase(fetchMinutes.fulfilled, (state, action) => { state.minutes = action.payload; })
      
      .addCase(fetchHeadToHead.fulfilled, (state, action) => { state.headToHead = action.payload; })
      .addCase(fetchSeasonComparison.fulfilled, (state, action) => { state.seasonComparison = action.payload; })
      .addCase(fetchPlayerComparison.fulfilled, (state, action) => { state.playerComparison = action.payload; });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
