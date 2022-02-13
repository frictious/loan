const       express                 = require('express'),
            session                 = require("express-session"),
            methodOverride          = require("method-override"),
            passport                = require("passport"),
            mongoose                = require("mongoose"),
            Index                   = require("./routes/index"),
            Admin                   = require("./routes/admin");

require("dotenv").config();
const app = express();

// MONGOOSE CONNECTION
global.Promise = mongoose.Promise
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

// CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(session({
    secret: 'Njala SRMS',//setting the secret key to create sessions
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

// ROUTERS
app.use("/", Index);
app.use("/admin", Admin);

// LISTENING ON PORT
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`);
})
