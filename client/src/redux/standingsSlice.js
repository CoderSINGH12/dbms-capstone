import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { standingsService } from '../services/standingsService.js';

export const fetchStandingsData = createAsyncThunk(
  'standings/fetchStandings',
  async (seasonId = 1, { rejectWithValue }) => {
    try {
      return await standingsService.getStandings(seasonId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch standings from server');
    }
  }
);

export const fetchReconciliationAudit = createAsyncThunk(
  'standings/fetchReconciliation',
  async (seasonId = 2, { rejectWithValue }) => {
    try {
      return await standingsService.reconcileStandings(seasonId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reconciliation audit');
    }
  }
);

const initialState = {
  items: [],
  audit: null,
  loading: false,
  error: null,
};

const standingsSlice = createSlice({
  name: 'standings',
  initialState,
  reducers: {
    clearStandingsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStandingsData
      .addCase(fetchStandingsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandingsData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchStandingsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      // fetchReconciliationAudit
      .addCase(fetchReconciliationAudit.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReconciliationAudit.fulfilled, (state, action) => {
        state.loading = false;
        state.audit = action.payload;
      })
      .addCase(fetchReconciliationAudit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStandingsError } = standingsSlice.actions;
export default standingsSlice.reducer;
