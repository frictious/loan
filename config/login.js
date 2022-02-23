const   LocalStrategy               = require("passport-local").Strategy,
        bcrypt                      = require("bcryptjs"),
        User                        = require("../models/user");
    
module.exports = ((passport)=> {
    passport.use(new LocalStrategy({usernameField : "email"}, (email, password, done) => {
        User.findOne({
            email : email
        }).then(user => {
            if(user){
                //Comparing if the password entered matches the saved password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err){
                        throw err;//If passwords do not match
                    }

                    if(isMatch){
                        return done(null, user);//If passwords matches, then log user in
                    }else{
                        console.log("PASSWORDS DO NOT MATCH");
                        return done(null, false, {message : "Email/Password do not match"});
                    }
                });
            }else{
                return done(null, false, {message : "Email/Password do not match"});
            }
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(null, user);
        });
    });
});