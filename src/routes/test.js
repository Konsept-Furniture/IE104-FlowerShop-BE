// cái này là t ví dụ cho 7 ngày gần nhất thì 
// - array labels là cái label trục x; 
// - dataset gồm 2 cái, 1 cái data cho năm nay, 1 cái cho năm ngoái. mặc định ordinal 1 cho cái primary là this year, bên FE t sẽ cho mày primary. còn ordinal 2 thì t sẽ để màu secondary

// Toàn bộ label là BE trả về hết nha, cả trong dataset lẫn array labels. Hiện mình để mặc định dataset là this year với last year thôi, còn labels thì m tự sinh ra

const data = {
  datasets: [
    {
      ordinal: 1,
      data: [18, 5, 19, 27, 29, 19, 20],
      label: "This year",
    },
    {
      ordinal: 2,
      data: [11, 20, 12, 29, 30, 25, 13],
      label: "Last year",
    },
  ],
  labels: ["1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug", "7 aug"],
};


const dataMenu = [
  {
    label: "Total Customer",
    value: "1,6k",
    compareLastMonth: 0.16,
  },
  {
    label: "Total Orders",
    value: "300",
    compareLastMonth: -0.16,
  },
  {
    label: "Sales",
    value: "$23k",
    compareLastMonth: 0.5,
  },
];