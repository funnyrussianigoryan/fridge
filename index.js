import express from "express";
import mongoose from "mongoose";

import { registerValidator, loginRegistration } from "./validations/auth.js"; // мидлвары для валидации
import checkAuth from "./utils/checkAuth.js"; // мидлвары для проверки токена авторизации

import * as UserController from "./controllers/UserController.js";
import * as ProductLibController from "./controllers/ProductLibController.js";
//import * as ProductLibController from "./controllers/ProductLibController.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/fridge")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json()); //чтобы экспресс понимал json

//метод пост: первый параметр - роут, второй - мидлвара с валидацией данных, третий параметр - колбэк для обработки запроса/ответа
app.post("/auth/register", registerValidator, UserController.register);
app.post("/auth/login", loginRegistration, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/productlib", checkAuth, ProductLibController.create);
app.delete("/productlib/:id", checkAuth, ProductLibController.remove);
app.get("/productlib/:id", checkAuth, ProductLibController.getOne);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server ok");
});

//app.get("/fridge") все твои холодильники
//app.get("/fridge?id=1") холодильник c выбранным id = 1
//app.patch("/fridge?id=1") изменить холодильник c выбранным id = 1
//app.delete("/fridge?id=1") удалить холодильник с id = 1
//app.post("/fridge") создать новый холодильник
