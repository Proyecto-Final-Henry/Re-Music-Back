const axios = require ("axios");
const { User } = require ("../../db.js");
const bcrypt = require ("bcrypt");
const { emailRegistro } = require("../../helpers/emailRegistro");
const { emailOlvidePassword } = require("../../helpers/emailOlvidePassword.js")
const { generarJWT } = require("../../helpers/generarJWT");
const { generarId } = require("../../helpers/generarId.js")

const registrar = async (req, res) => {
    const { email, name } = req.body;

    const existeUsuario = await User.findOne({ where : {email: email } });

    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    };

    try {
        const usuario = await User.create(req.body);
        usuario.password = await bcrypt.hash(usuario.password , 10);
        await usuario.save();
        //Enviar Email
        emailRegistro({email,name,token:usuario.token});

        res.json(usuario);
    } catch (error) {
        console.log(error);
    };
};

const confirmar = async (req ,res) => {
    const { token } = req.params;

    const usuarioConfirmar = await User.findOne({ where: {token : token}});

    if(!usuarioConfirmar){
        const error = new Error ("Token no valido")
        return res.status(404).json({msg: error.message})
    };

    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    };
};

const autenticar = async (req,res) => {
    const { email , password } = req.body

    const usuario = await User.findOne({ where : { email : email}})

    if(!usuario){
        const error = new Error ("Usuario inexistente")
        return res.status(404).json({msg: error.message})
    };

    if(!usuario.confirmado){
        const error = new Error ("Tu cuenta aun no a sido confirmada")
        return res.status(403).json({msg: error.message})
    };

    if(await bcrypt.compare(password, usuario.password)){
        usuario.token = generarJWT(usuario.id)
        await usuario.save()
        res.json(usuario)
    } else {
        const error = new Error("El password es incorrecto")
        return res.status(404).json({msg : error.message}) 
    };
};

const perfil = async (req,res) => {
    const  usuario  = req.usuario

    res.json({
        id: usuario.id,
        name: usuario.name,
        userImg: usuario.userImg,
        email: usuario.email,
        role: usuario.role,
        createdDate: usuario.createdDate,
        userImg: usuario.userImg,
    });
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const usuarioExiste = await User.findOne({ where: { email : email }});

    if(!usuarioExiste){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    try {
        usuarioExiste.token = generarId();
        await usuarioExiste.save();

        //Envio de Email
        emailOlvidePassword({
            email,
            name: usuarioExiste.name,
            token: usuarioExiste.token
        });

        res.json({msg: "Hemos enviado el mail con las instrucciones"})

    } catch (error) {
        console.log(error);
    };
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await User.findOne({ where: { token : token }});
    
    if(tokenValido){
        res.json({msg:"Token valido y el usuario existe"})
    } else {
        const error = new Error("Token no valido")
        return res.status(400).json({msg: error.message})
    };
};

const nuevaPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await User.findOne({ where: { token: token }});
    console.log(usuario);
    if(!usuario){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    };

    try {
        usuario.token = null;
        usuario.password = await bcrypt.hash(password , 10);
        await usuario.save();
        res.json({msg: "Password modificada correctamente"});
    } catch (error) {
        console.log(error);
    };
};

const sendEmailContact = async (req, res) => {
    const { email, name, message } = req.body;
    try {
        if (name && email && message) {
            emailContact({email, name, message})
            res.status(200).json({email, name, message});
        }else{
            const error = new Error('Falta ingresar algún dato');
            return res.status(400).json({msg: error.message});
        }
    } catch (error) {
        return res.status(404).json({msg : error.message});
    };
};

module.exports = {
    registrar,
    confirmar,
    autenticar,
    perfil,
    sendEmailContact,
    olvidePassword,
    comprobarToken,
    nuevaPassword,
};