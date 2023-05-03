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

    ProductLibModel.findOneAndDelete(
      {
        _id: productLibId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить библиотеку продуктов",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Не удалось найти библиотеку продуктов",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось удалить получить библиотеку продуктов",
    });
  }
};
