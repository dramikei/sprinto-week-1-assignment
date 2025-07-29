import Image from "next/image";
import Link from "next/link";

export default function BookCards({ books, showPublishedDate = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map(({ node: book }) => (
          <Link href={`/books/${book.id}`} key={book.id}>
            <div key={book.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="bg-gray-200 rounded-lg h-60 w-full flex items-center justify-center mb-4 overflow-clip">
                {book.cover_url ? (
                  <Image width={196} height={256} src={book.cover_url} alt={book.title} />
                ) : (
                  <span className="text-gray-500">No Cover</span>
                )}
              </div>
              <h4 className="font-semibold text-lg text-slate-700 mb-1">
                {book.title}
              </h4>
              <p className="text-gray-600 text-sm">by {book.author.name}</p>
              {showPublishedDate && (
                <p className="text-gray-600 text-sm mb-1 text-left mt-2">
                  Published: {book.published_date?.split("-")[0]}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
  );
}