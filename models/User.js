import mongoose from 'mongoose';


//если поле обязательное, то передаем объект, если нет - просто строчку
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: String,
    },
    {
        timestamps: true
    })

    export default mongoose.model('User', UserSchema);