import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { playerService } from '../services/playerService.js';

export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await playerService.getPlayers(params);
      return response; // { data: [...], pagination: {...} }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch players from server');
    }
  }
);

export const fetchPlayerById = createAsyncThunk(
  'players/fetchPlayerById',
  async (id, { rejectWithValue }) => {
    try {
      return await playerService.getPlayerById(id);
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch player ${id}`);
    }
  }
);

export const fetchNationalities = createAsyncThunk(
  'players/fetchNationalities',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await playerService.getNationalities(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch nationalities');
    }
  }
);

const initialState = {
  items: [],
  selectedPlayer: null,
  nationalities: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  },
  filters: {
    q: '',
    position: 'All',
    nationality: 'All',
    teamId: null, // null means all or specific team
    sort: 'goals_desc',
  },
  loading: false,
  error: null,
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayerFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetPlayerFilters(state) {
      state.filters = { q: '', position: 'All', nationality: 'All', teamId: null, sort: 'goals_desc' };
    },
    clearPlayersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPlayers
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      // fetchPlayerById
      .addCase(fetchPlayerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlayer = action.payload;
      })
      .addCase(fetchPlayerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchNationalities
      .addCase(fetchNationalities.fulfilled, (state, action) => {
        state.nationalities = action.payload || [];
      });
  },
});

export const { setPlayerFilters, resetPlayerFilters, clearPlayersError } = playersSlice.actions;
export default playersSlice.reducer;