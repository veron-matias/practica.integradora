const passport = require("passport");
const local = require("passport-local");
const gitHubStrategy = require("passport-github2");

const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        //Le decis que queres acceder al objeto request
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        if (email == "adminCoder@coder.com") return done(null, false);
        try {
          //Verificamos si ya existe un registro con ese mail
          let user = await UserModel.findOne({ email: email });
          if (user) return done(null, false);
          //Si no existe, voy a crear un registro nuevo:
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            rol: "user",
            password: createHash(password),
          };

          let result = await UserModel.create(newUser);
          //Si todo resulta bien, podemos mandar done con el usuario generado.
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Agregamos otra estrategia, ahora para el "login":
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
          const user = {
            _id: 1,
            email: email,
            password: password,
            first_name: "admin_name",
            last_name: "admin_last_name",
            age: 30,
            rol: "admin",
          };
          return done(null, user);
        } else {
          try {
            //Primero verifico si existe un usuario con ese email:
            const user = await UserModel.findOne({ email });
            if (!user) {
              console.log("User doest exist");
              return done(null, false);
            }
            //Si existe, verifico la contraseña:
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      }
    )
  );

  passport.use(
    "github",
    new gitHubStrategy(
      {
        clientID: "Iv1.92ea28a259efe203",
        clientSecret: "5741a42a217c2c72a271cc6396b69cabc564dc07",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //Opcional: si ustedes quieren ver como lllega el perfil del usuario:
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            //Si no encuentro ningun usuario con este email, lo voy a crear:
            let newUser = {
              first_name: profile._json.name,
              last_name: "secreto",
              age: 37,
              email: profile._json.email,
              rol: "user",
              password: "secreto",
            };
            //Una vez que tengo el nuevo usuario, lo guardo en MongoDB
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    if (id == 1) {
      const user = {
        _id: 1,
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        first_name: "admin_name",
        last_name: "admin_last_name",
        age: 30,
        rol: "admin",
      };
      done(null, user);
    } else {
      let user = await UserModel.findById({ _id: id });
      done(null, user);
    }
  });
};

module.exports = initializePassport;

//Instalamos: npm i passport passport-local