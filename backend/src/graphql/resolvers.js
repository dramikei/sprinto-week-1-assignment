const { Op } = require('sequelize');
const Book = require('../models/postgres/Book');
const Author = require('../models/postgres/Author');
const Review = require('../models/mongodb/Review');

const encodeCursor = (id) => Buffer.from(id.toString()).toString('base64');
const decodeCursor = (cursor) => parseInt(Buffer.from(cursor, 'base64').toString());

const PAGE_SIZE = 10;
const resolvers = {
  Query: {
    books: async (_, { first = 10, after, filter }) => {
      const limit = Math.min(first, PAGE_SIZE);
      const where = {};

      if (after) {
        where.id = { [Op.gt]: decodeCursor(after) };
      }

      if (filter) {
        if (filter.title) {
          where.title = { [Op.iLike]: `%${filter.title}%` };
        }
        if (filter.published_year) {
          where.published_date = {
            [Op.and]: [
              { [Op.gte]: new Date(`${filter.published_year}-01-01`) },
              { [Op.lt]: new Date(`${filter.published_year + 1}-01-01`) },
            ],
          };
        }
      }

      const books = await Book.findAll({
        where,
        limit: limit + 1,
        order: [["id", "ASC"]],
        include: [Author],
      });

      const hasNextPage = books.length > limit;
      const edges = books.slice(0, limit).map((book) => ({
        node: book,
        cursor: encodeCursor(book.id),
      }));

      const totalCount = await Book.count({ where });

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          cursor: edges.length > 0 ? edges.at(-1).cursor : null,
        },
        totalCount,
      };
    },

    book: async (_, { id }) => {
      return await Book.findByPk(id, { include: [Author] });
    },

    authors: async (_, { first = 10, after, filter }) => {
      const limit = Math.min(first, PAGE_SIZE);
      const where = {};

      if (after) {
        where.id = { [Op.gt]: decodeCursor(after) };
      }

      if (filter) {
        if (filter.name) {
          where.name = { [Op.iLike]: `%${filter.name}%` };
        }
        if (filter.birth_year) {
          where.born_date = {
            [Op.and]: [
              { [Op.gte]: new Date(`${filter.birth_year}-01-01`) },
              { [Op.lt]: new Date(`${filter.birth_year + 1}-01-01`) },
            ],
          };
        }
      }

      const authors = await Author.findAll({
        where,
        limit: limit + 1,
        order: [["id", "ASC"]],
      });

      const hasNextPage = authors.length > limit;
      const edges = authors.slice(0, limit).map((author) => ({
        node: author,
        cursor: encodeCursor(author.id),
      }));

      const totalCount = await Author.count({ where });

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          cursor: edges.length > 0 ? edges.at(-1).cursor : null,
        },
        totalCount,
      };
    },

    author: async (_, { id }) => {
      return await Author.findByPk(id);
    },

    reviews: async (_, { book_id }) => {
      return await Review.find({ book_id: parseInt(book_id) });
    },
  },
  Mutation: {
    createBook: async (_, { input }) => {
      const book = await Book.create(input);
      return await Book.findByPk(book.id, { include: [Author] });
    },
    
    updateBook: async (_, { id, input }) => {
      await Book.update(input, { where: { id } });
      return await Book.findByPk(id, { include: [Author] });
    },
    
    deleteBook: async (_, { id }) => {
      const deleted = await Book.destroy({ where: { id } });
      return deleted > 0;
    },
    
    createAuthor: async (_, { input }) => {
      return await Author.create(input);
    },
    
    updateAuthor: async (_, { id, input }) => {
      await Author.update(input, { where: { id } });
      return await Author.findByPk(id);
    },
    
    deleteAuthor: async (_, { id }) => {
      const deleted = await Author.destroy({ where: { id } });
      return deleted > 0;
    },
  },
  Author: {},
  Book: {},
};

module.exports = resolvers;
