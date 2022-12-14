const nodemailer = require ("nodemailer")
const sgMail = require('@sendgrid/mail');   // Yo Cristhian Alban comente esta linea por que me estaba rompiendo el back, era de madrugada y no queria molestar a nadie

const emailRegistro =  async (data) => {
    
    // Configuracion
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Envio de Email mailtrap
    // const {email,name,token} = data
    // const info = await transport.sendMail({
    //     from: "ReMusic",
    //     to: email,
    //     subject: "Comprueba tu cuenta en ReMusic",
    //     text: "Comprueba tu cuenta en ReMusic",
    //     html: `<p>Hola ${name}, comprueba tu cuenta en ReMusic.</p>
    //     <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
    //     <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>
    //     <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
    //     `
    // })
    // console.log("Mensaje enviado: %s", info.messageId)
    // };

    //¡¡¡¡¡¡¡¡¡¡¡ENVIO DE EMAIL REALES!!!!!!!!!!!!!!! NO BORRARR!!!!!!!
    const {email,name,token} = data 
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
    to: email,
    from: 'music_app@tmails.net',
    subject: 'Comprueba tu cuenta en ReMusic',
    text: 'Comprueba tu cuenta en ReMusic',
    html: `<p>Hola ${name}, comprueba tu cuenta en ReMusic.</p>
            <p> Tu cuenta ya esta lista, solo debes comprobarla con el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>
            <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
         `
    };
    await sgMail.send(msg);   
    console.log("MENSAJE ENVIADO CORRECTAMENTE");
};

const emailContact = async (data) => {
    // Configuracion
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    //Envio de Email
    const emailContact = 'cjfernandez29@gmail.com'
    const emailContact2 = 'julianlechuga12@gmail.com';
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const {email,name,message} = data;
    const msg = {
        from: "music_app@tmails.net",
        to: emailContact2,
        subject: "Mensaje de contacto",
        html: `
            <b> Mensaje del formulario de Contacto </b>
            <div><b>Nombre:</b> ${name}</div>
            <div><b>Email:</b> ${email}</div>
            <div><b>Mensaje:</b> ${message}</div>
        `
    };
    await sgMail.send(msg);  
}; 

const emailNotificacions = async (data) => {
    // Configuracion
    // const transport = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     // secure: true,
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS
    //     }
    // });
    
    //Envio de Email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const {email, nameUser, nameFollow} = data;
    const msg = {
        from: "music_app@tmails.net",
        to: email,
        subject: "Mensaje de seguidores",
        html: `
            Hola <b> ${nameUser} </b>, te comunicamos que ${nameFollow} comenzó a seguirte.
        `
    };
    await sgMail.send(msg);  

    // await transport.sendMail({
    //     from: "ReMusic",
    //     to: email,
    //     subject: "Mensaje de seguidores",
    //     html: `
    //     Hola <b> ${nameUser} </b>, te comunicamos que ${nameFollow} comenzo a seguirte.
    //     `
    // });

}; 

module.exports = { emailRegistro, emailContact,emailNotificacions };


