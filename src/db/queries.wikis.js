const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const Authorizer = require("../policies/application");

module.exports = {

  getAllPublicWikis(callback){
    return Wiki.all({where: { private: false}})
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },

  getCollaboratorWikis(collaborator, callback){
    return Wiki.all({
      where: {
        [Op.or]: [{private: false}, {id: collaborator.wikiId}]
      }
    })
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },

  getAllWikis(callback){
    return Wiki.all()
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },

  downgradeWikis(req, callback){
    return Wiki.all()
    .then((wikis) => {
      wikis.forEach((wiki) => {
        if(wiki.userId = req.user.id && wiki.private == true){
          wiki.update({private: false});
        }
      });
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },

  addWiki(newWiki, callback){
    // console.log("DEBUG: queries.wikis.js#addWiki");
    // console.dir(newWiki);
    // console.log("-------\n\n");
    return Wiki.create(newWiki)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    });
  },

  getWiki(req, callback){
    console.log(req.params.id);
    return Wiki.findById(req.params.id, {
      include: [
        {model: Collaborator, as: "collaborators", include: [
          {model: User}
        ]}
      ]
    })
    .then((wiki) => {
      console.log(wiki.body);
      if(wiki.private != true){
        callback(null, wiki);
      } else {
        if(req.user.role == 1 || req.user.role == 2){
          callback(null, wiki);
        } else if(req.user.role == 0){
          Collaborator.findAll({where: {userId: req.user.id}})
          .then((collaborator) => {
            //console.log(collaborator);
            if(collaborator.length == 0){
              callback('not collaborator');
            } else if(collaborator[0].wikiId == wiki.id){
              callback(null, wiki);
            } else {
              callback('not authorized');
            }
          })
          .catch((err) => {
            callback(err);
          });
        } else {
          callback('not authorized');
        }
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  },

  deleteWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki);
      if(authorized){
        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        })
      } else {
        req.flash("notice", "You are not authorized to do that");
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },

  updateWiki(req, updatedWiki, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }
      const authorized = new Authorizer(req.user).update();
      if(authorized){
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  }

}
