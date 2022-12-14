const express = require("express");
const {
  registrar,
  confirmar,
  autenticar,
  perfil,
  sendEmailContact,
  olvidePassword,
  comprobarToken,
  nuevaPassword,
  crearPagoMELI,
  baseApremium,
  googleLogin,
  setProfilePicture,
  deactivateAccount,
  restoreAccount,
  giveAdmin,
  takeAdmin,
  givePremium,
  takePremium,
  pruebaEmail,
} = require("./FuncionesUsers.js");
const { checkAutenticacion } = require("../../middleware/authMiddleware");
const usersRoutes = express.Router();

usersRoutes.post("/create_preference", checkAutenticacion, crearPagoMELI); // tarjetas adentro de la funcion crearPagoMELI

usersRoutes.get(`/feedback/:id`, baseApremium);

usersRoutes.post("/googleLogin", googleLogin);

usersRoutes.post("/register", registrar);

usersRoutes.get("/confirmar/:token", confirmar);

usersRoutes.post("/login", autenticar);

usersRoutes.post("/olvide-password", olvidePassword);

usersRoutes.get("/olvide-password/:token", comprobarToken);

usersRoutes.post("/olvide-password/:token", nuevaPassword);

usersRoutes.get("/perfil", checkAutenticacion, perfil);

usersRoutes.post("/sendEmailContact", sendEmailContact);

usersRoutes.post("/profileImg", setProfilePicture);

usersRoutes.put("/deactivate", deactivateAccount);

usersRoutes.put("/restore", restoreAccount);

usersRoutes.put("/givepremium", givePremium);

usersRoutes.put("/takepremium", takePremium);

usersRoutes.put("/giveadmin", giveAdmin);

usersRoutes.put("/takeadmin", takeAdmin);

usersRoutes.post("/prueba", pruebaEmail);

usersRoutes.get("*", (req, res) => {
  res.send("Ruta invalida, revisa el nombre de la ruta");
});

module.exports = usersRoutes;
