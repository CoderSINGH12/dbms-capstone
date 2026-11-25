import { adminService } from '../services/adminService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDatabaseStats();
  res.json({ status: 'success', data: stats });
});

// Teams
export const createTeam = asyncHandler(async (req, res) => {
  const team = await adminService.createTeam(req.body);
  res.status(201).json({ status: 'success', data: team });
});

export const updateTeam = asyncHandler(async (req, res) => {
  const team = await adminService.updateTeam(req.params.id, req.body);
  res.json({ status: 'success', data: team });
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const result = await adminService.deleteTeam(req.params.id);
  res.json({ status: 'success', data: result });
});

// Players
export const createPlayer = asyncHandler(async (req, res) => {
  const player = await adminService.createPlayer(req.body);
  res.status(201).json({ status: 'success', data: player });
});

export const updatePlayer = asyncHandler(async (req, res) => {
  const player = await adminService.updatePlayer(req.params.id, req.body);
  res.json({ status: 'success', data: player });
});

export const deletePlayer = asyncHandler(async (req, res) => {
  const result = await adminService.deletePlayer(req.params.id);
  res.json({ status: 'success', data: result });
});

// Registrations
export const createRegistration = asyncHandler(async (req, res) => {
  const registration = await adminService.createRegistration(req.body);
  res.status(201).json({ status: 'success', data: registration });
});

export const deleteRegistration = asyncHandler(async (req, res) => {
  const result = await adminService.deleteRegistration(req.params.id);
  res.json({ status: 'success', data: result });
});

// Matches
export const createMatch = asyncHandler(async (req, res) => {
  const match = await adminService.createMatch(req.body);
  res.status(201).json({ status: 'success', data: match });
});

export const updateMatch = asyncHandler(async (req, res) => {
  const match = await adminService.updateMatch(req.params.id, req.body);
  res.json({ status: 'success', data: match });
});

export const deleteMatch = asyncHandler(async (req, res) => {
  const result = await adminService.deleteMatch(req.params.id);
  res.json({ status: 'success', data: result });
});

// Import batches
export const getImportBatches = asyncHandler(async (req, res) => {
  const batches = await adminService.getImportBatches();
  res.json({ status: 'success', data: batches });
});
