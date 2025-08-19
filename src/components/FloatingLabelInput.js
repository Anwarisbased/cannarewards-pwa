'use client';

// A beautifully styled floating label input that mimics the target aesthetic.
export default function FloatingLabelInput({ 
    id, 
    label, 
    value, 
    onChange, 
    type = 'text', 
    autoComplete = 'off', 
    required = false,
    disabled = false // Added a disabled prop
}) {
  return (
    <div className="relative z-0">
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        // The `peer` class is key here. It lets the label react to the input's state.
        className={`
          block w-full appearance-none bg-transparent 
          py-2.5 px-0 text-base text-gray-900 
          border-0 border-b-2 border-gray-300 
          focus:outline-none focus:ring-0 focus:border-primary
          peer
          ${disabled ? 'text-gray-500 cursor-not-allowed' : ''}
        `}
        placeholder=" " // The space is crucial for the floating label effect
      />
      <label
        htmlFor={id}
        className={`
          absolute text-base text-gray-500 duration-300 transform 
          -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
          peer-focus:text-primary 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75 peer-focus:-translate-y-6
          ${disabled ? 'text-gray-400' : ''}
        `}
      >
        {label}
      </label>
    </div>
  );
}