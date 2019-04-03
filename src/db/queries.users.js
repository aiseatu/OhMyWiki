const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.findOne({
      where: {email: newUser.email}
    })
    .then((existingUser) => {
      if(existingUser){
        callback("email cannot duplicate");
      } else {
        User.create({
          username: newUser.username,
          email: newUser.email,
          password: hashedPassword
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
      }
    })
    .catch((err) => {
      callback(err);
    });

    // return User.create({
    //   username: newUser.username,
    //   email: newUser.email,
    //   password: hashedPassword
    // })
    // .then((user) => {
    //   callback(null, user);
    // })
    // .catch((err) => {
    //   callback(err);
    // })
  },

  upgrade(req, callback){
    return User.findById(req.user.id)
    .then((user) => {
      if(user){
        user.update({role: 1})
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        return callback('User not found');
      }
    });
  },

  downgrade(req, callback){
    return User.findById(req.user.id)
    .then((user) => {
      if(user){
        user.update({role: 0})
        .then((user) => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        return callback("User not found");
      }
    });
  }
}
