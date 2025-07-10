export default function PaginationButton({
  onClick,
  children,
  disabled,
}) {
  return (
    disabled ? (
    <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-md cursor-not-allowed" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ) : (
      <button className="px-3 py-1 text-gray-500 bg-gray-100 rounded-md cursor-pointer" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    )
  );
}