import { forwardRef } from "react";

const FormInput = forwardRef(
  ({ type, id, name, value, onChange, disabled, placeholder, accept, required, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        accept={accept}
        required={required}
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    );
  }
);

export default FormInput;
