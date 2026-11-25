import React, { useState } from 'react';
import { validateTeamForm } from '../../utils/validators.js';

const TeamForm = ({ initialValues = {}, onSubmit, onCancel, isSubmitting = false }) => {
  const [values, setValues] = useState({
    name: initialValues.name || '',
    short_name: initialValues.short_name || '',
    tla: initialValues.tla || '',
    city: initialValues.city || '',
    stadium: initialValues.stadium || '',
    founded_year: initialValues.founded_year || '',
    crest_url: initialValues.crest_url || '',
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
    const validationErrors = validateTeamForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...values,
      founded_year: values.founded_year ? parseInt(values.founded_year, 10) : null,
      tla: values.tla ? values.tla.toUpperCase() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Club Full Name *</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="e.g. Real Betis Balompié"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
        />
        {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Short Name *</label>
          <input
            type="text"
            name="short_name"
            value={values.short_name}
            onChange={handleChange}
            placeholder="e.g. Real Betis"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
          {errors.short_name && <p className="text-xs text-rose-400 mt-1">{errors.short_name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">TLA Code (3 Letters)</label>
          <input
            type="text"
            name="tla"
            maxLength={5}
            value={values.tla}
            onChange={handleChange}
            placeholder="e.g. BET"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 uppercase"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
          <input
            type="text"
            name="city"
            value={values.city}
            onChange={handleChange}
            placeholder="e.g. Seville"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
          {errors.city && <p className="text-xs text-rose-400 mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Founded Year</label>
          <input
            type="number"
            name="founded_year"
            value={values.founded_year}
            onChange={handleChange}
            placeholder="e.g. 1907"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Stadium *</label>
        <input
          type="text"
          name="stadium"
          value={values.stadium}
          onChange={handleChange}
          placeholder="e.g. Benito Villamarín"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
        />
        {errors.stadium && <p className="text-xs text-rose-400 mt-1">{errors.stadium}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Crest Image URL</label>
        <input
          type="url"
          name="crest_url"
          value={values.crest_url}
          onChange={handleChange}
          placeholder="https://..."
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
          className="px-5 py-2 rounded-lg bg-[#A50044] hover:bg-[#850036] text-white font-semibold shadow-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? 'Saving to Database...' : 'Save Club Record'}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
