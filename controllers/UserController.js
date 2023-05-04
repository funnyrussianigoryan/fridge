import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator"; //функция для проверки валидации

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req); //проверяем валидность введенных данных

    //если были ошибки при проверке валидности, то отправляем клиенту ошибку
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    //создаем хэш пароля
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //создаем документ пользователя
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    //сохраняем документ пользователя в бд
    const user = await doc.save();

    //создаем токен: в токене шифруем id из бд, ключ - 'secret123', действие токена - 30 дней
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    //формируем тело ответа и возвращаем его пользователю
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Ошибка регистрации");
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Неверный пользователь или пароль",
      });
    }

    const isValidPwd = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPwd) {
      return res.status(404).json({
        message: "Неверный пользователь или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Ошибка авторизации");
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
