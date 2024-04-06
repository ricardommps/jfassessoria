export const removeItems = (array, itemToRemove) => {
  return array.filter((v) => {
    return !itemToRemove.includes(v.id);
  });
};
