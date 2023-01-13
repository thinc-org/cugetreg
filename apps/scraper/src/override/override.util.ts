/**
 * Calculates the average rating from a list of ratings.
 * @param ratings List of rating integers (0-10) which is double of the actual rating (0-5)
 * @returns a 2-point precision string representation of the average rating (0.00-5.00)
 */
export function findAvgRating(ratings: number[]): string {
  let total = 0
  for (const rating of ratings) {
    total += rating
  }
  return (total / (2 * ratings.length)).toFixed(2)
}
