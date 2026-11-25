import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamService } from '../services/teamService.js';

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (seasonId = null, { rejectWithValue }) => {
    try {
      return await teamService.getTeams(seasonId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

export const fetchTeamSeasonSummary = createAsyncThunk(
  'teams/fetchTeamSeasonSummary',
  async ({ teamId, seasonId }, { rejectWithValue }) => {
    try {
      return await teamService.getTeamSeasonSummary(teamId, seasonId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch team season summary');
    }
  }
);

export const fetchTeamSquad = createAsyncThunk(
  'teams/fetchTeamSquad',
  async ({ teamId, seasonId }, { rejectWithValue }) => {
    try {
      return await teamService.getTeamSquad(teamId, seasonId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch squad');
    }
  }
);

const initialState = {
  items: [],
  selectedTeam: null,
  teamSummary: null,
  teamSquad: [],
  loading: false,
  error: null,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setSelectedTeam(state, action) {
      state.selectedTeam = action.payload;
    },
    clearTeamsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTeams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchTeamSeasonSummary
      .addCase(fetchTeamSeasonSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamSeasonSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.teamSummary = action.payload;
      })
      .addCase(fetchTeamSeasonSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchTeamSquad
      .addCase(fetchTeamSquad.fulfilled, (state, action) => {
        state.teamSquad = action.payload || [];
      });
  },
});

export const { setSelectedTeam, clearTeamsError } = teamsSlice.actions;
export default teamsSlice.reducer;
