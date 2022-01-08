//Compare date current month vs last month

// 8 5 4 2
const compareLastMonth = (currentMonth, lastMonth) => {
  return ((+currentMonth - +lastMonth) / +lastMonth) * 100;
};

const sumSales = (orders) => {
  let sum = 0;
  for (const order of orders) {
    sum += order.amount;
  }

  return sum;
};

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

module.exports = { compareLastMonth, sumSales, kFormatter };
