export default function DeleteButton({ title, onClick }) {
    return (
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition-colors cursor-pointer" onClick={onClick}>
            {title}
        </button>
    )
}