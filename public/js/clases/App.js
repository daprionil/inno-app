import {
    crearDB,addRegistro,
     dataCompany,restartApp,
     sendDataEmail
} from '../funciones.js';

import {
    formRegistro,btnRestart,formEmail
} from '../selectores.js';

export default class App{
    constructor(){
        this.start = this.initApp();
    };
    initApp(){
        document.addEventListener('DOMContentLoaded',() => {
            dataCompany();
            crearDB();
            //formulario add registro
            formRegistro.addEventListener('submit',addRegistro);
            //Btn restart
            btnRestart.addEventListener('click',restartApp);
            //Email Send
            formEmail.addEventListener('submit',sendDataEmail);
        });
    };
};