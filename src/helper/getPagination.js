//offset: quantity of items to skip
//limit: quantity of items to fetch
const getPagination = (pageIndex, size) => {
  const page = +pageIndex - 1;
  const limit = size ? size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

module.exports = getPagination;
