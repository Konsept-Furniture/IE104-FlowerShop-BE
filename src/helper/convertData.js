const { arrayMonthChar, arrayMonthNumber } = require("../helper/date");

const formatDataMonth = (month, arrayAmount) => {
  let array = [];
  let arrayLabels = [];
  const mapData = new Map();

  for (let i = 1; i <= month; i++) {
    mapData.set(i, 0);
  }

  for (let i = 0; i < arrayAmount.length; i++) {
    mapData.set(arrayAmount[i]._id, arrayAmount[i].total);
  }

  for (let i = 1; i <= month; i++) {
    array.push(mapData.get(i));
    arrayLabels.push(`${arrayMonthChar[i - 1]}`);
  }

  return {
    data: array,
    labels: arrayLabels,
  };
};

const formatDataDay = () => {
  
};
module.exports = { formatDataMonth, formatDataDay };
