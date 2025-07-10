import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks($first: Int, $after: String, $filter: BookFilterInput) {
    books(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          title
          description
          published_date
          cover_url
          author {
            id
            name
          }
          average_rating
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        cursor
      }
      totalCount
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      description
      published_date
      cover_url
      author {
        id
        name
        biography
        born_date
      }
      reviews {
        id
        rating
        comment
        createdAt
      }
      average_rating
    }
  }
`;

export const GET_AUTHORS = gql`
  query GetAuthors($first: Int, $after: String, $filter: AuthorFilterInput) {
    authors(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          name
          biography
          born_date
          photo_url
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        cursor
      }
      totalCount
    }
  }
`;

export const GET_AUTHOR = gql`
  query GetAuthor($id: ID!) {
    author(id: $id) {
      id
      name
      biography
      born_date
      photo_url
      books {
        id
        title
        description
        published_date
        cover_url
      }
      totalBooks
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      id
      title
      description
      published_date
      cover_url
      author {
        id
        name
      }
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: BookUpdateInput!) {
    updateBook(id: $id, input: $input) {
      id
      title
      description
      published_date
      cover_url
      author {
        id
        name
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: AuthorInput!) {
    createAuthor(input: $input) {
      id
      name
      biography
      born_date
      photo_url
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $input: AuthorUpdateInput!) {
    updateAuthor(id: $id, input: $input) {
      id
      name
      biography
      born_date
      photo_url
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($book_id: ID!, $rating: Int!, $comment: String) {
    createReview(book_id: $book_id, rating: $rating, comment: $comment) {
      id
      rating
      comment
      createdAt
    }
  }
`;
