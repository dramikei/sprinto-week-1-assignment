require('dotenv').config();
const { Sequelize } = require('sequelize');
const Author = require('../src/models/postgres/Author');
const Book = require('../src/models/postgres/Book');

describe('Models', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
    });
    
    // Redefine models with test database
    Author.init(Author.rawAttributes, { sequelize, modelName: 'Author' });
    Book.init(Book.rawAttributes, { sequelize, modelName: 'Book' });
    
    Author.hasMany(Book, { foreignKey: 'author_id' });
    Book.belongsTo(Author, { foreignKey: 'author_id' });
    
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Author Model', () => {
    it('should create an author', async () => {
      const author = await Author.create({
        name: 'Test Author',
        biography: 'Test biography',
        born_date: '1980-01-01',
      });

      expect(author.name).toBe('Test Author');
      expect(author.biography).toBe('Test biography');
    });

    it('should require a name', async () => {
      await expect(Author.create({})).rejects.toThrow();
    });
  });

  describe('Book Model', () => {
    let author;

    beforeEach(async () => {
      author = await Author.create({
        name: 'Test Author',
      });
    });

    it('should create a book', async () => {
      const book = await Book.create({
        title: 'Test Book',
        description: 'Test description',
        published_date: '2023-01-01',
        author_id: author.id,
      });

      expect(book.title).toBe('Test Book');
      expect(book.author_id).toBe(author.id);
    });

    it('should require a title and author_id', async () => {
      await expect(Book.create({})).rejects.toThrow();
    });
  });
});
