import React from 'react';

export function FormInput({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input className="form-input" {...props} />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export function FormSelect({ label, options, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select className="form-select" {...props}>
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export function FormTextarea({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <textarea className="form-textarea" {...props} />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
