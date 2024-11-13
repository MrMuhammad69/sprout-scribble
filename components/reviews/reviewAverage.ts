export const getReviewAverage = (reviews: any[]) => {
  if (reviews.length === 0) return '0'; // Handle no reviews
  
  const total = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  const average = total / reviews.length;
  return average.toFixed(2); // Returns the average rating as a string with 2 decimal places
};
  