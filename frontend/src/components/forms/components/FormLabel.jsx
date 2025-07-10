export default function FormLabel({ label, name, required = false }) {
    return (
        <>
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </>
    )
}