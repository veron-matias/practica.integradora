const express = require("express");
const app = express();
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const path = require("path");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const PORT = 8080;
const authRouter = require("./routes/auth.router.js");

require("./dababase.js");

//Middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "secretcoder",
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 24 * 60 * 60 * 1000},
  store: MongoStore.create({
    mongoUrl:"mongodb+srv://mgvCoderhouse:coderhouse@cluster0.dbexm8g.mongodb.net/ecommerce?retryWrites=true&w=majority", ttl: 100
})
}))


// Inicio seerver
const httpServer = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});


// Handlebars 
app.engine("handlebars", exphbs.engine({
  jsonStringify(object) {
    return JSON.stringify(object)
}
}));

app.set("view engine", "handlebars");
app.set("views", "src/views");

// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/auth", authRouter);