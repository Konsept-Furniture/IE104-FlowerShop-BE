//offset: quantity of items to skip
//limit: quantity of items to fetch
const getPagination = (page, size) => {
  const limit = size ? size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

module.exports = getPagination;
