const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: String
    photo_url: String
    books: [Book!]!
    totalBooks: Int!
    createdAt: String!
    updatedAt: String!
  }

  type AuthorNameId {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: String!
    author_id: ID!
    cover_url: String
    author: Author!
    reviews: [Review!]!
    average_rating: Float
    createdAt: String!
    updatedAt: String!
  }

  type Review {
    id: ID!
    book_id: ID!
    rating: Int!
    comment: String
    helpful_count: Int!
    createdAt: String!
    updatedAt: String!
  }

  type BookConnection {
    edges: [BookEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type BookEdge {
    node: Book!
    cursor: String!
  }

  type AuthorConnection {
    edges: [AuthorEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type AuthorEdge {
    node: Author!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    nextCursor: String
    previousCursor: String
  }

  input BookInput {
    title: String!
    description: String
    published_date: String!
    author_id: ID!
    cover_url: String
  }

  input BookUpdateInput {
    title: String
    description: String
    published_date: String
    author_id: ID
    cover_url: String
  }

  input AuthorInput {
    name: String!
    biography: String
    born_date: String
    photo_url: String
  }

  input AuthorUpdateInput {
    name: String
    biography: String
    born_date: String
    photo_url: String
  }

  input BookFilterInput {
    title: String
    author_name: String
    published_year: Int
  }

  input AuthorFilterInput {
    name: String
    birth_year: Int
  }

  type Query {
    books(
      first: Int
      after: String
      filter: BookFilterInput
    ): BookConnection!
    
    book(id: ID!): Book
    
    authors(
      first: Int
      after: String
      before: String
      filter: AuthorFilterInput
    ): AuthorConnection!
    
    author(id: ID!): Author
    
    authorNameId: [AuthorNameId!]!
    
    reviews(book_id: ID!): [Review!]!
  }

  type Mutation {
    createBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookUpdateInput!): Book!
    deleteBook(id: ID!): Boolean!
    
    createAuthor(input: AuthorInput!): Author!
    updateAuthor(id: ID!, input: AuthorUpdateInput!): Author!
    deleteAuthor(id: ID!): Boolean!
    
    createReview(book_id: ID!, rating: Int!, comment: String): Review!
    updateReview(id: ID!, rating: Int, comment: String): Review!
    deleteReview(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
