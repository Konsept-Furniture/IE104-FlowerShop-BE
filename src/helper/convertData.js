const { arrayMonthChar } = require("../helper/date");

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

const formatDataDay = (day, arrayAmount, date) => {
  let array = [];
  let arrayLabels = [];
  const mapData = new Map();

  // console.log(day);
  // console.log(arrayAmount);
  // console.log(date.getDate());
  mapData.set(date.getDate(), 0);
  arrayLabels.push(
    date.getDate() +
      " " +
      arrayMonthChar[date.getMonth()] +
      " " +
      date.getFullYear()
  );
  for (let i = 0; i < day - 1; i++) {
    date.setDate(date.getDate() - 1);
    mapData.set(date.getDate(), 0);
    arrayLabels.push(
      date.getDate() +
        " " +
        arrayMonthChar[date.getMonth()] +
        " " +
        date.getFullYear()
    );
  }

  for (let i = 0; i < arrayAmount.length; i++) {
    mapData.set(arrayAmount[i]._id.day, arrayAmount[i].total);
  }
  array = Array.from(mapData.values());

  return {
    data: array,
    labels: arrayLabels,
  };
};
module.exports = { formatDataMonth, formatDataDay };
