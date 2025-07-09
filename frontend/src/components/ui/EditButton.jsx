
export default function EditButton({ title, onClick }) {
  return (
    <button
      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer"
      onClick={onClick}
    >
      {title}
    </button>
  );
}
