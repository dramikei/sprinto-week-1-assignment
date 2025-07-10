import Link from "next/link";

export default function AuthorCards({ authors, showBirthDate = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {authors.map(({ node: author }) => (
          <Link href={`/authors/${author.id}`} key={author.id}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4 overflow-clip">
                {author.photo_url ? (
                  <img src={author.photo_url} alt={author.name} />
                ) : (
                  <div className="text-4xl">👤</div>
                )}
              </div>
              <h4 className="font-semibold text-lg text-slate-700 text-center">
                {author.name}
              </h4>
              {showBirthDate && (
                <p className="text-gray-600 text-sm mb-1 text-center">
                  {author.born_date}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
  );
}