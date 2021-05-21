import {formRegistro,modalEmail} from './selectores.js';

import Registro from './clases/Registro.js';
import UI from './clases/UI.js';
import EmailObj from './clases/Email.js';

const registro = new Registro();
const email = new EmailObj();
const ui = new UI();

let emailData = {};

let objRegistro = {
    title:'',
    descrip:'',
    date:'',
    price:'',
    type:''
};

let db;

let modeRegistro = false;

function dataCompany(){
    const dataLocal  = JSON.parse(localStorage.getItem('data-company'));

    const data = dataLocal  ?? {
        name: prompt("Nombre de tu Empresa:"),
        id: prompt("NIT de tu Empresa")
    };
    const {name,id} = data;

    if(!(name || id)){
        location.reload();
        return;
    };
    if(name === '' || name.length > 25 || isNaN(id) || id.length < 5 || id.length > 11){
        location.reload();
        return;
    };
    localStorage.setItem('data-company',JSON.stringify({name: name.trim(),id:id.trim()}));
    ui.viewCompanyData(data);
};
function sendDataEmail(e){
    e.preventDefault();

    const {email:emailInput} = e.target;
    if(emailInput.value !== ''){
        email.sendEmail({...emailData},emailInput.value);
        modalEmail.classList.add('hidden');
        emailData = {};
        e.target.reset();
        return;
    };
    const p = document.createElement('p');
    p.textContent = 'Debes colocar tu email completo';
    p.classList.add('text-red-700','bg-red-300','shadow-md','rounded-md','my-1','font-bold','text-center','error');

    if(!e.target.querySelector('.error')){
        e.target.insertBefore(p,e.target.querySelector('.ctn-submit'));
        setTimeout(() => p.remove(),3000);
    };
};
function addRegistro(e){
    e.preventDefault();

    const {title, descrip, date, price, type } = e.target;

    if(!modeRegistro){
        objRegistro = {
            title:title.value,
            descrip:descrip.value,
            date:date.value,
            price:price.value,
            type:type.value
        };
        const validate = Object.entries(objRegistro).every( ([key,value]) => value !== '');

        if(validate){
            objRegistro.idRegistro = Date.now();

            registro.addRegistro({...objRegistro});

            e.target.reset();
            ui.viewAllRegistros();
            ui.viewAllResult();
            rObjRegistro();
            return;
        };
        ui.formRegistroMessage("Debes completar todos los Campos");
    }else{
        objRegistro.title = title.value;
        objRegistro.descrip = descrip.value;
        objRegistro.date = date.value;
        objRegistro.price = price.value;
        objRegistro.type = type.value;

        const validate = Object.entries(objRegistro).every( ([key,value]) => value !== '');

        if(validate){
            registro.editRegistro({...objRegistro});

            formRegistro.querySelector('[type="submit"]').textContent = "Agregar";
            modeRegistro = false;

            e.target.reset();
            ui.viewAllRegistros();
            ui.viewAllResult();
            rObjRegistro();
            return;
        };
        ui.formRegistroMessage("Debes completar todos los Campos");
    };
};
function rObjRegistro(){
    for(let value in objRegistro){
        objRegistro[value] = '';
    };
};
function restartApp(){
    Swal.fire({
        title:"¿Estás Seguro de Eliminar Todos tus registros?",
        text:"Si Eliminas todo no podrás recuperarlo de ninguna manera",
        showCancelButton:true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar Todo',
        icon:"warning",
    }).then(result => {
        if(result.isConfirmed){
            window.indexedDB.deleteDatabase('contab-min');
            localStorage.removeItem('data-company');
            setTimeout(() => location.reload(),500);
        };
    });
};
function registroHtml(obj){
    const {title,descrip,type,price,date} = obj;

    const boxRegistro = document.createElement('div');
    boxRegistro.classList.add('p-2','mt-1','bg-gray-400','rounded-sm','cursor-move','item-history');

    const ctnRegistro = document.createElement('div');
    ctnRegistro.classList.add('sm:grid','grid-cols-6','gap-x-3','ctn-item');

    const typeResult = {'egreso':'bg-red-600','ingreso':'bg-green-500'};

    const info = document.createElement('div');
    info.classList.add('col-span-4','my-1');
    info.innerHTML = `
    <p class="font-medium pb-1 sm:pb-2 flex flex-nowrap justify-between border-b border-gray-500"><span class="line-clamp-1 text-shadow-md">${title}</span><span class="px-2 ${typeResult[type]} rounded-md">${type}</span></p>
    <p class="line-clamp-2 text-gray-200 sm:line-clamp-3">${descrip}</p>
    <div class="flex items-center justify-between">
        <p class="px-2 py-1 font-medium bg-gray-100 shadow-sm text-shadow-sm max-w-max bg-opacity-30 rounded-xl">${date}</p>
        <p class="px-2 py-1 bg-orange-200 shadow-sm bg-opacity-70 text-shadow-sm max-w-max rounded-xl"><span class="font-semibold">$</span>${price}</p>
    </div>
    `;
    const btns = document.createElement('div');
    btns.classList.add('flex','flex-wrap','items-center','col-span-2','gap-1','btns','justify-center');

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('text-xs','bg-red-600','text-shadow-sm');
    btnDelete.textContent = 'X';
    btnDelete.onclick = () => {
        delRegistro(obj);
    };

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('text-xs','bg-blue-500','text-shadow-sm');
    btnEditar.textContent = '✏️';
    btnEditar.onclick = () => {
        editRegistro(obj);
    };

    const btnSend = document.createElement('button');
    btnSend.classList.add('text-xs','bg-gray-800','text-shadow-sm');
    btnSend.textContent = '📧';
    btnSend.onclick = () => {
        sendEmail(obj);
    };

    btns.appendChild(btnEditar);
    btns.appendChild(btnDelete);
    btns.appendChild(btnSend);

    ctnRegistro.appendChild(info);
    ctnRegistro.appendChild(btns);

    boxRegistro.appendChild(ctnRegistro);

    return boxRegistro;
};
function delRegistro(obj){
    Swal.fire({
        title:"¿Estás Seguro de Eliminar el Registro?",
        text:"Si lo eliminas no podrás hacer algo para restaurarlo...",
        showCancelButton:true,
        icon:"warning",
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar'
    }).then(result => {
        if(result.isConfirmed){
            registro.deleteRegistro(obj);
            ui.viewAllRegistros();
            ui.viewAllResult();
        };
    });
};
function sendEmail(obj){
    const {title,descrip,type,price,date} = obj;

    modalEmail.classList.remove('hidden');

    const boxInfo = modalEmail.querySelector('#info-register');
    boxInfo.innerHTML = `
    <p class="border-b border-gray-400">${title}</p>
    <p class="text-gray-800 line-clamp-4">${descrip}</p>
    <p>${type}</p>
    <p>$${price}</p>
    <p>${date}</p>
    `;

    emailData = {...obj};
};
function editRegistro(obj){
    objRegistro = {...obj};

    const {title, descrip, date, price, type } = formRegistro;

    title.value = objRegistro.title;
    descrip.value = objRegistro.descrip;
    date.value = objRegistro.date;
    price.value = objRegistro.price;
    type.value = objRegistro.type;

    formRegistro.querySelector('[type="submit"]').textContent = "Editar";

    window.scroll({top:0,behavior:'smooth'});

    modeRegistro = true;
};
function crearDB(){
    const creada = window.indexedDB.open('contab-min',1);

    creada.onsuccess = ()=>{
        db = creada.result;

        ui.viewAllRegistros();
        ui.viewAllResult();
        ui.otherOptions();
    };
    creada.onerror = (e) => console.log(`Ha Habido un error ${e}`);

    creada.onupgradeneeded = (e) => {
        db = e.target.result;

        console.log("Base de datos Recreda y Lista");

        const registros = db.createObjectStore('registros',{
            keyPath:'idRegistro',
            autoIncrement:true
        });

        registros.createIndex('titleRegistro','titleRegistro',{unique:false});
        registros.createIndex('typeRegistro','typeRegistro',{unique:false});
        registros.createIndex('detailsRegistro','detailsRegistro',{unique:false});
        registros.createIndex('dateRegistro','dateRegistro',{unique:false});
        registros.createIndex('priceRegistro','priceRegistro',{unique:false});
        registros.createIndex('idRegistro','idRegistro',{unique:true});

    };
};

export {
    crearDB,addRegistro,dataCompany,
    restartApp,db,registroHtml,sendDataEmail,ui
};