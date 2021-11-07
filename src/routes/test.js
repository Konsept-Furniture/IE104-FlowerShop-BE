const date = new Date();
const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

try {
  const data = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
} catch (err) {
  res.status(500).json(err);
}
