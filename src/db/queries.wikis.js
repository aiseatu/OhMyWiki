const Wiki = require("./models").Wiki;
const User = require("./models").User;

module.exports = {

  getAllPublicWikis(callback){
    return Wiki.all({where: {private: false}})
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },

  addWiki(newWiki, callback){
    return Wiki.create(newWiki)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    });
  },

}
