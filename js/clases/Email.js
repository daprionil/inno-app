import { ui } from "../funciones.js";

export default class EmailObj{
    constructor(text,email){
        this.text = text;
        this.email = email;
    };
    sendEmail(obj,email){
        const {title,descrip,type,price,date} = obj;
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "davidarenaoflol23@gmail.com",
            Password : "A7CB35D55FA3F9237DAE75A38D700CF71766",
            To : email,
            From : "davidarenaoflol23@gmail.com",
            Subject : `${title} - Inno App`,
            Body : `<b>${title}</b><br>
            <b>Contenido: </b>${descrip}<br>
            <b>Tipo de Registro: </b>${type}<br>
            <b>Total del Registro: </b>$ ${price} USD<br>
            <b>Fecha del Registro: </b>${date}<br>
            <center><b>Gracias por Usar Nuestra Aplicación - InnoApp</b></center>`,
        }).then(message => {
            if(message == 'OK'){
                ui.successAlert("Email enviado Correctamente");
                return;
            };
            Swal.fire({
                title:"No se Envió... Intentalo de Nuevo",
                icon:"danger",
            });
        });
    };
};