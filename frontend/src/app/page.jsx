import Link from 'next/link';

const recentBooks = [];
const recentAuthors = [];

// TODO: - design and implement the home page
export default function HomePage() {
  return (
    <div>
      <section>
        <h1>Welcome to Book Management</h1>
        <p>Manage your collection of books and authors</p>
        <div>
          <Link href="/books/new">
            Add New Book
          </Link>
          <Link href="/authors/new">
            Add New Author
          </Link>
        </div>
      </section>
      
      <section>
        <h2>Recent Books</h2>
        <div>
          {recentBooks.map(({ node: book }) => (
            <div key={book.id}>
              <Link href={`/books/${book.id}`}>
                <div>
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} />
                  ) : (
                    <div>No Cover</div>
                  )}
                </div>
                <div>
                  <h3>{book.title}</h3>
                  <p>by {book.author.name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Link href="/books">
          View All Books →
        </Link>
      </section>
      
      <section>
        <h2>Recent Authors</h2>
        <div>
          {recentAuthors.map(({ node: author }) => (
            <div key={author.id}>
              <Link href={`/authors/${author.id}`}>
                <div>
                  {author.photo_url ? (
                    <img src={author.photo_url} alt={author.name} />
                  ) : (
                    <div>📚</div>
                  )}
                </div>
                <div>
                  <h3>{author.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Link href="/authors">
          View All Authors →
        </Link>
      </section>
    </div>
  )
}