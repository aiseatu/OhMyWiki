const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;

module.exports = {
  createCollaborator(req, callback){
    User.findAll({where: {email: req.body.collaboratorEmail}})
    .then((user) => {
      Collaborator.findAll({
        where: {userId: user[0].id}
      })
      .then((collaborators) => {
        if(collaborators.length != 0){
          //console.log('already added');
          callback('already added');
        } else {
          Collaborator.create({
            userId: user[0].id,
            wikiId: req.params.id
          })
          .then((collaborator) => {
            callback(null, collaborator);
          })
          .catch((err) => {
            callback(err);
          });
        }
      })
      .catch((err) => {
        callback(err);
      })
    })
    .catch((err) => {
      callback('cannot find user');
    });
  },
  destroyCollaborator(req, callback){
    User.findAll({where: {email: req.body.collaboratorEmail}})
    .then((user) => {
      Collaborator.findAll({where: {userId: user[0].id}})
      .then((collaborator) => {
        collaborator[0].destroy()
        .then((res) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          callback(err);
        });
      })
      .catch((err) => {
        callback('cannot find collaborator');
      });
    })
    .catch((err) => {
      callback('cannot find user');
    });
  }
}
