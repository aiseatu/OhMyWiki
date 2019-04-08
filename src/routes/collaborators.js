const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/collaborators/add", collaboratorController.add);
router.post("/wikis/:id/collaborators/create", collaboratorController.create);
router.get("/wikis/:id/collaborators/delete", collaboratorController.delete);
router.post("/wikis/:id/collaborators/destroy", collaboratorController.destroy);

module.exports = router;
