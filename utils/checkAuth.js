import jwt from "jsonwebtoken";

//мидлвара для проверки авторизован ли юзер. Принимает 3 параметра - запрос, ответ и cb, вызов которого означает, что в роуте можно переходить к следующему cb

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); //получаем токен, убираем из него Bearer (слово появляется в токене из-за инсомнии)

  if (token) {
    try {
      /*если токен получен, то расшифровываем его и в req 
            добавляем поле с ID юзреа и далее вызываем функцию next(), 
            которая говорит о том, что нужно переходить к следующему cb в роуте*/

      const decoded = jwt.verify(token, "secret123");

      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
