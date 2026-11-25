import React, { useState } from 'react';
import { validatePlayerForm } from '../../utils/validators.js';

const PlayerForm = ({ initialValues = {}, onSubmit, onCancel, isSubmitting = false }) => {
  const [values, setValues] = useState({
    name: initialValues.name || '',
    nationality: initialValues.nationality || '',
    date_of_birth: initialValues.date_of_birth || '',
    image_url: initialValues.image_url || '',
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
    const validationErrors = validatePlayerForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...values,
      date_of_birth: values.date_of_birth || null,
      nationality: values.nationality || null,
      image_url: values.image_url || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="e.g. Lamine Yamal Nasraoui Ebana"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
        />
        {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={values.nationality}
            onChange={handleChange}
            placeholder="e.g. Spain"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={values.date_of_birth}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Profile Photo URL</label>
        <input
          type="url"
          name="image_url"
          value={values.image_url}
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
          {isSubmitting ? 'Saving...' : 'Save Player Record'}
        </button>
      </div>
    </form>
  );
};

export default PlayerForm;
