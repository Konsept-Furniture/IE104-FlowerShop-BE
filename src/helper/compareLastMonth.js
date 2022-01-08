//Compare date current month vs last month

// 8 5 4 2
const compareLastMonth = (currentMonth, lastMonth) => {
  return (+currentMonth / (+lastMonth + +currentMonth)) * 100;
};

module.exports = compareLastMonth;
