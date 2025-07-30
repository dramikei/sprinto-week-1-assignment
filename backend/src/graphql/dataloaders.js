const DataLoader = require('dataloader');
const { Op } = require('sequelize');
const Book = require('../models/postgres/Book');
const Author = require('../models/postgres/Author');
const Review = require('../models/mongodb/Review');

// DataLoader for batching author lookups by ID
const createAuthorLoader = () => new DataLoader(async (authorIds) => {
  const authors = await Author.findAll({
    where: { id: { [Op.in]: authorIds } }
  });
  
  // Create a map for O(1) lookup
  const authorMap = new Map();
  authors.forEach(author => authorMap.set(author.id, author));
  
  // Return authors in the same order as requested IDs
  return authorIds.map(id => authorMap.get(id) || null);
});

// DataLoader for batching books by author_id
const createBooksByAuthorLoader = () => new DataLoader(async (authorIds) => {
  const books = await Book.findAll({
    where: { author_id: { [Op.in]: authorIds } },
    include: [Author]
  });
  
  // Group books by author_id
  const booksByAuthor = new Map();
  authorIds.forEach(id => booksByAuthor.set(id, []));
  
  books.forEach(book => {
    const authorId = book.author_id;
    if (booksByAuthor.has(authorId)) {
      booksByAuthor.get(authorId).push(book);
    }
  });
  
  // Return books arrays in the same order as requested author IDs
  return authorIds.map(id => booksByAuthor.get(id) || []);
});

// DataLoader for batching book counts by author_id
const createBookCountByAuthorLoader = () => new DataLoader(async (authorIds) => {
  const results = await Book.findAll({
    attributes: [
      'author_id',
      [Book.sequelize.fn('COUNT', Book.sequelize.col('id')), 'count']
    ],
    where: { author_id: { [Op.in]: authorIds } },
    group: ['author_id'],
    raw: true
  });
  
  // Create a map for O(1) lookup
  const countMap = new Map();
  results.forEach(result => countMap.set(result.author_id, parseInt(result.count)));
  
  // Return counts in the same order as requested author IDs
  return authorIds.map(id => countMap.get(id) || 0);
});

// DataLoader for batching reviews by book_id
const createReviewsByBookLoader = () => new DataLoader(async (bookIds) => {
  // Convert to integers for MongoDB query
  const intBookIds = bookIds.map(id => parseInt(id));
  const reviews = await Review.find({ book_id: { $in: intBookIds } });
  
  // Group reviews by book_id
  const reviewsByBook = new Map();
  bookIds.forEach(id => reviewsByBook.set(parseInt(id), []));
  
  reviews.forEach(review => {
    const bookId = review.book_id;
    if (reviewsByBook.has(bookId)) {
      reviewsByBook.get(bookId).push(review);
    }
  });
  
  // Return reviews arrays in the same order as requested book IDs
  return bookIds.map(id => reviewsByBook.get(parseInt(id)) || []);
});

// DataLoader for batching average ratings by book_id
const createAverageRatingByBookLoader = () => new DataLoader(async (bookIds) => {
  // Convert to integers for MongoDB aggregation
  const intBookIds = bookIds.map(id => parseInt(id));
  
  const averageRatings = await Review.aggregate([
    { $match: { book_id: { $in: intBookIds } } },
    {
      $group: {
        _id: '$book_id',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  // Create a map for O(1) lookup
  const ratingMap = new Map();
  averageRatings.forEach(result => ratingMap.set(result._id, result.averageRating));
  
  // Return average ratings in the same order as requested book IDs
  return bookIds.map(id => ratingMap.get(parseInt(id)) || null);
});

// Factory function to create all loaders
const createDataLoaders = () => ({
  authorLoader: createAuthorLoader(),
  booksByAuthorLoader: createBooksByAuthorLoader(),
  bookCountByAuthorLoader: createBookCountByAuthorLoader(),
  reviewsByBookLoader: createReviewsByBookLoader(),
  averageRatingByBookLoader: createAverageRatingByBookLoader()
});

module.exports = { createDataLoaders };
