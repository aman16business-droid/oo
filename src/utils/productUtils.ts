
/**
 * Generates a deterministic "heart" count for a product based on its ID and Title.
 * This ensures consistency across different views without needing a database.
 * 
 * @param productId - The unique identifier of the product
 * @param productTitle - The title of the product
 * @returns number of hearts in the range 25-140 + time-based growth
 */
export const getProductHearts = (productId: string, productTitle: string): number => {
  let hash = 0;
  const str = productId + productTitle;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  
  // Base range 25-140
  const baseHearts = 25 + (Math.abs(hash) % 116);
  
  // Time-based growth: +1 heart every 2 days
  const refDate = new Date('2024-06-01').getTime();
  const now = new Date().getTime();
  const growthHearts = Math.floor((now - refDate) / (1000 * 60 * 60 * 24 * 2));
  
  return baseHearts + growthHearts;
};
