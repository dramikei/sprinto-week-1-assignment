const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book_id: {
    type: Number,
    required: true,
    ref: 'Book',
  },
  user_id: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  helpful_count: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

reviewSchema.index({ book_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
