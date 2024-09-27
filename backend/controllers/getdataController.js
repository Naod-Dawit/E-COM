const axios = require("axios");
const Item = require("../models/Item");

const Getdata = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
const ProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item" });

    console.error(err);
  }
};
module.exports = { Getdata, ProductById };
