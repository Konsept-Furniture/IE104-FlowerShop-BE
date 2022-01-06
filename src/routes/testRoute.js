const express = require("express");
const router = express.Router();

const fakeDB = [
  {
    id: Math.floor(Math.random() * 100),
    email: "test@example.com",
  },
];

router.get("/", (req, res) => {
  return res.status(200).json({ data: fakeDB });
});

router.post("/send", (req, res) => {
  fakeDB.push({
    id: Math.floor(Math.random() * 100),
    email: req.body.email,
  });
  return res.status(201).json({ data: fakeDB });
});

router.put("/update/:id", (req, res) => {
  const obj = fakeDB.find((el) => el.id === Number(req.params.id));
  obj.email = req.body.email;
  return res.status(200).json({ data: fakeDB });
});

router.delete("/destroy/:id", (req, res) => {
  const i = fakeDB.findIndex((el) => el.id === Number(req.params.id));
  fakeDB.splice(i, 1);
  return res.status(200).json({ data: fakeDB });
});

module.exports = router;
