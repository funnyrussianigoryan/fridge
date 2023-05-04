import { validationResult } from "express-validator";

import ProductLibModel from "../models/ProductLib.js";

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const doc = new ProductLibModel({
      name: req.body.name,
      user: req.userId,
      products: [...req.body.products],
    });

    const productLib = await doc.save();
    res.json({ ...productLib._doc });
  } catch (error) {
    console.log(error);
    res.status(500).json("Ошибка при добвалении productLib");
  }
};

export const remove = async (req, res) => {
  try {
    const productLibId = req.params.id;

    const doc = await ProductLibModel.findOneAndDelete({
      _id: productLibId,
      user: req.userId,
    });

    if (!doc) {
      return res.status(404).json({
        message: "Библиотека продуктов не найдена",
      });
    }

    res.json({
      success: true,
      ...doc,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось удалить библиотеку продуктов",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const productLibId = req.params.id;

    const doc = await ProductLibModel.findOne({
      _id: productLibId,
    });

    if (!doc) {
      return res.status(404).json({
        message: "Библиотека продуктов не найдена",
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось удалить библиотеку продуктов",
    });
  }
};
