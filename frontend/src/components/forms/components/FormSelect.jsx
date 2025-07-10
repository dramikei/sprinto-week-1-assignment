export default function FormSelect({ id, name, value, onChange, children }) {
  return (
    <select id={id} name={name} value={value} onChange={onChange} className="w-full p-2 border pr-4 border-gray-300 rounded-md">
      {children}
    </select>
  );
}