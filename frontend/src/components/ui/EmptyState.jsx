export default function EmptyState({ 
  title, 
  description, 
  icon,
  children,
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-gray-700 mb-2">
        {title}
      </h4>
      <p className="text-gray-500 mb-6">
        {description}
      </p>
      {children}
    </div>
  );
} 