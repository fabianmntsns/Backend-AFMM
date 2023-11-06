import dotenv from "dotenv";

dotenv.config();

export default {
    apiserver: {
        port: process.env.PORT
    },

    mongo: {
        url: process.env.MONGO_URL,
        url_db: process.env.MONGO_URL_DB,
        db_name: process.env.DB_NAME,
        secret: process.env.MONGO_SECRET_WORD,
    },

    github:{
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        callback_url: process.env.CALLBACK_URL,
    },

    admin: {
        email: process.env.EMAIL_ADMIN,
        password: process.env.PASSWORD_ADMIN,
    }


}