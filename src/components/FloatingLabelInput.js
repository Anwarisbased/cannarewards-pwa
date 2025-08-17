// src/components/FloatingLabelInput.js
'use client';

export default function FloatingLabelInput({ id, label, value, onChange, type = 'text', autoComplete = 'off', required = false }) {
  return (
    <div className="relative border-b-2 border-gray-300 focus-within:border-black transition-colors">
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className="block w-full appearance-none focus:outline-none bg-transparent pt-6 pb-2"
        placeholder=" " // The space is important for the CSS to work
      />
      <label
        htmlFor={id}
        className="absolute top-0 left-0 pt-6 pb-2 text-gray-500 duration-300 origin-0 transform 
                   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                   peer-focus:scale-75 peer-focus:-translate-y-4
                   scale-75 -translate-y-4" // This last line handles pre-filled inputs
      >
        {label}
      </label>
    </div>
  );
}