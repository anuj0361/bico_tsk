export const epochToDatenTime = (epochInSecions) => {
  return new Date(epochInSecions * 1000).toLocaleString();
};
