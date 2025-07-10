"use client";

export default function FormTextArea({ id, name, value, onChange, rows = 6, placeholder }) { 
    return (
        <>
        <textarea
            id={id}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </>
    )
}