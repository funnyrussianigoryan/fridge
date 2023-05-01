import express from 'express';
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt'; 
import mongoose from 'mongoose';
import {validationResult} from 'express-validator'; //функция для проверки валидации

import {registerValidator} from './validations/auth.js'; // мидлвары для валидации
import checkAuth from './utils/checkAuth.js'; // мидлвары для проверки токена авторизации

import UserModel from './models/User.js';

mongoose.connect(
    'mongodb://127.0.0.1:27017/fridge',
    ).then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json()); //чтобы експресс понимал json

app.get('/', (req, res) => {
    res.send('Hello wo111rld')
})

//метод пост: первый параметр - роут, второй - мидлвара с валидацией данных, третий параметр - колбэк для обра=ботки запроса/ответа
app.post('/auth/register', registerValidator, async (req, res) => {
    
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
        })

        //сохраняем документ пользователя в бд
        const user = await doc.save();

        //создаем токен: в токене шифруем id из бд, ключ - 'secret123', действие токена - 30 дней
        const token = jwt.sign({
            _id: user._id,
        }, 'secret123',
        {
            expiresIn: '30d',
        })

        //формируем тело ответа и возвращаем его пользователю
        const {passwordHash, ...userData} = user._doc;
        res.json({...userData, token});
    } catch(error) {
        console.log(error);
        res.status(500).json('Ошибка регистрации')
    }
})

app.post('/auth/login', registerValidator, async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});
        
        if (!user) {
            return res.status(404).json({
                message: 'Неверный пользователь или пароль'
            })
        }

        const isValidPwd = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        
        if (!isValidPwd) {
            return res.status(404).json({
                message: 'Неверный пользователь или пароль'
            })            
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123',
        {
            expiresIn: '30d',
        })
        
        const {passwordHash, ...userData} = user._doc;
        res.json({...userData, token});

    } catch(error){
        console.log(error);
        res.status(500).json('Ошибка авторизации')
    }
})

app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        res.json({
            success: true
        })
    } catch(error) {}
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server ok');
});

