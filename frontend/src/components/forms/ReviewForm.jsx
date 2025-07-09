'use client';

import { useState } from 'react';

export default function ReviewForm({ onSubmit, onComplete }) {
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call
      console.log('Submitting review:', { rating, comment });
      
      // Simulate API call
      await onSubmit({comment, rating});
      
      // Reset form
      setComment('');
      setRating('5');
      
      // You might want to refresh the page or update the reviews list
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Dropdown */}
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Comment Textarea */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Write your review here..."
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !comment.trim()}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${
          isSubmitting || !comment.trim()
            ? 'bg-blue-300 text-blue-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

// Optional: Add metadata for better SEO (Server Component)
export async function generateMetadata({ params }) {
  const book = await getBook(params.id);
  
  return {
    title: `${book.title} - Book Management`,
    description: `Read details and reviews for "${book.title}" by ${book.author.name}`,
  };
}