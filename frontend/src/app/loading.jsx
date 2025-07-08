
function skeletonBookItem() {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Books</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Empty placeholders for additional books */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 opacity-50">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function skeletonAuthorItem() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-700 mb-6">Recent Authors</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 opacity-50">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
    // TODO: - Add fallback UI that will be shown while the route is loading.
    return <div>Loading...</div>
  }