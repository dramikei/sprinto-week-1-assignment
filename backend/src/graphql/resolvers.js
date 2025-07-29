const { Op } = require('sequelize');
const Book = require('../models/postgres/Book');
const Author = require('../models/postgres/Author');
const Review = require('../models/mongodb/Review');

const encodeCursor = (id) => Buffer.from(id.toString()).toString('base64');
const decodeCursor = (cursor) => parseInt(Buffer.from(cursor, 'base64').toString());

const PAGE_SIZE = 10;
const resolvers = {
  Query: {
    books: async (_, { first = 10, after, before, filter, ...rest }) => {
      const limit = Math.min(first, PAGE_SIZE);
      const where = {};

      if (after) {
        where.id = { [Op.gt]: decodeCursor(after) };
      }

      if (before) {
        where.id = { [Op.lt]: decodeCursor(before) };
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
          nextCursor: edges.length > 0 ? edges.at(-1).cursor : null,
          previousCursor: edges.length > 0 ? edges.at(0).cursor : null,
        },
        totalCount,
      };
    },

    book: async (_, { id }) => {
      return await Book.findByPk(id, { include: [Author] });
    },

    authors: async (_, { first = 10, after, before, filter }) => {
      const limit = Math.min(first, PAGE_SIZE);
      const where = {};

      if (after) {
        where.id = { [Op.gt]: decodeCursor(after) };
      }

      if (before) {
        where.id = { [Op.lt]: decodeCursor(before) };
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
          nextCursor: edges.length > 0 ? edges.at(-1).cursor : null,
          previousCursor: edges.length > 0 ? edges.at(0).cursor : null,
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

    authorNameId: async () => {
      return await Author.findAll({
        attributes: ['id', 'name'],
      });
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
      return await Author.create({ ...input, born_date: input.born_date ? new Date(input.born_date) : null });
    },
    
    updateAuthor: async (_, { id, input }) => {
      await Author.update(input, { where: { id } });
      return await Author.findByPk(id);
    },
    
    deleteAuthor: async (_, { id }) => {
      const deleted = await Author.destroy({ where: { id } });
      return deleted > 0;
    },

    createReview: async (_, { book_id, rating, comment }) => {
      const review = new Review({
        book_id: parseInt(book_id),
        user_id: 1, // TODO: Get from auth
        rating,
        comment
      });
      return await review.save();
    },
    
    updateReview: async (_, { id, rating, comment }) => {
      const updateData = {};
      if (rating != null) updateData.rating = rating;
      if (comment != null) updateData.comment = comment;
      
      return await Review.findByIdAndUpdate(id, updateData, { new: true });
    },
    
    deleteReview: async (_, { id }) => {
      const deleted = await Review.findByIdAndDelete(id);
      return !!deleted;
    },
  },
  Author: {
    books: async (author) => {
      // TODO: add pagination
      return await Book.findAll({ where: { author_id: author.id } });
    },
    totalBooks: async (author) => {
      return await Book.count({ where: { author_id: author.id } });
    }
  },
  Book: {
    author: async (book) => {
      return await Author.findByPk(book.author_id);
    },
    
    reviews: async (book) => {
      // TODO: add pagination
      return await Review.find({ book_id: book.id });
    },
    
    average_rating: async (book) => {
      const reviews = await Review.find({ book_id: book.id });
      if (reviews.length === 0) return null;
      
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.length;
    },
  },
};

module.exports = resolvers;
