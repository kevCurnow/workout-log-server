require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('./middleware/headers'));

let user = require("./controllers/usercontroller");
app.use("/user", user);

let sequelize = require("./db");
sequelize.sync();

app.listen(process.env.PORT, function () {
    console.log('App is listening on port 3000');
});