const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {
  add(req, res, next){
    //console.log(req.params);
    res.render("collaborators/add", {wikiId: req.params.id});
  },
  create(req, res, next){
    collaboratorQueries.createCollaborator(req, (err, collaborator) => {
      if(err){
        //console.log(err);
        req.flash("error", err);
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  delete(req, res, next){
    res.render("collaborators/delete", {wikiId: req.params.id});
  },
  destroy(req, res, next){
    //console.log(req.body.collaboratorEmail);
    collaboratorQueries.destroyCollaborator(req, (err, collaborator) => {
      if(err) {
        req.flash("error", err);
        res.redirect(`/wikis/${req.params.id}`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }

}
