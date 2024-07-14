require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    server: process.env.SERVER,
    database: {
      uri: process.env.DB_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiredIn: process.env.JWT_EXPIRED_IN,
    },      
}