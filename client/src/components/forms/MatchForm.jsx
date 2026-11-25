import React, { useState } from 'react';
import { validateMatchForm } from '../../utils/validators.js';

const MatchForm = ({ teams = [], seasonId = 1, initialValues = {}, onSubmit, onCancel, isSubmitting = false }) => {
  const [values, setValues] = useState({
    season_id: initialValues.season_id || seasonId,
    matchday: initialValues.matchday || 1,
    home_team_id: initialValues.home_team_id || (teams[0]?.id || 1),
    away_team_id: initialValues.away_team_id || (teams[1]?.id || 2),
    kickoff_utc: initialValues.kickoff_utc ? initialValues.kickoff_utc.replace(' ', 'T').substring(0, 16) : '',
    status: initialValues.status || 'scheduled',
    home_score: initialValues.home_score !== null && initialValues.home_score !== undefined ? initialValues.home_score : '',
    away_score: initialValues.away_score !== null && initialValues.away_score !== undefined ? initialValues.away_score : '',
    venue: initialValues.venue || '',
    referee: initialValues.referee || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...values,
      season_id: Number(values.season_id),
      matchday: Number(values.matchday),
      home_team_id: Number(values.home_team_id),
      away_team_id: Number(values.away_team_id),
      home_score: values.home_score !== '' ? Number(values.home_score) : null,
      away_score: values.away_score !== '' ? Number(values.away_score) : null,
      kickoff_utc: values.kickoff_utc ? values.kickoff_utc.replace('T', ' ') + ':00' : null,
    };

    const validationErrors = validateMatchForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Matchday (1–38) *</label>
          <input
            type="number"
            min={1}
            max={38}
            name="matchday"
            value={values.matchday}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
          {errors.matchday && <p className="text-xs text-rose-400 mt-1">{errors.matchday}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Status *</label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          >
            <option value="scheduled">Scheduled</option>
            <option value="finished">Finished</option>
            <option value="postponed">Postponed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Home Club *</label>
          <select
            name="home_team_id"
            value={values.home_team_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.home_team_id && <p className="text-xs text-rose-400 mt-1">{errors.home_team_id}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Away Club *</label>
          <select
            name="away_team_id"
            value={values.away_team_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.away_team_id && <p className="text-xs text-rose-400 mt-1">{errors.away_team_id}</p>}
        </div>
      </div>

      {values.status === 'finished' && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div>
            <label className="block text-xs font-semibold text-amber-400 mb-1">Home Score *</label>
            <input
              type="number"
              min={0}
              name="home_score"
              value={values.home_score}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-lg font-bold text-center"
            />
            {errors.home_score && <p className="text-xs text-rose-400 mt-1">{errors.home_score}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-amber-400 mb-1">Away Score *</label>
            <input
              type="number"
              min={0}
              name="away_score"
              value={values.away_score}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-lg font-bold text-center"
            />
            {errors.away_score && <p className="text-xs text-rose-400 mt-1">{errors.away_score}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Kickoff (Date & Time)</label>
          <input
            type="datetime-local"
            name="kickoff_utc"
            value={values.kickoff_utc}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Referee</label>
          <input
            type="text"
            name="referee"
            value={values.referee}
            onChange={handleChange}
            placeholder="e.g. Gil Manzano"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Stadium</label>
        <input
          type="text"
          name="venue"
          value={values.venue}
          onChange={handleChange}
          placeholder="e.g. Estadi Olímpic Lluís Companys"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg bg-[#004D98] hover:bg-[#003870] text-white font-semibold shadow-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? 'Saving Match...' : 'Save Fixture'}
        </button>
      </div>
    </form>
  );
};

export default MatchForm;
