import {
    formRegistro as form, boxRegistros,
    count,modalEmail,companyName,idCompany
} from '../selectores.js';

import {db,registroHtml} from '../funciones.js';
import Sortable from '../../../node_modules/sortablejs/modular/sortable.esm.js';

export default class UI{
    viewAllRegistros(){
        this.clearHtmlRegistros();

        const objectStore = db.transaction('registros').objectStore('registros');

        objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;
            if(cursor){
                boxRegistros.appendChild(registroHtml(cursor.value));
                cursor.continue();
            };
        };
    };
    viewAllResult(){
        const objectStore = db.transaction('registros').objectStore('registros');
        const data = new Promise(resolve => {
            objectStore.getAll().onsuccess = (e) => {
                resolve(e.target.result);
            };
        });
        data.then( valores => {
            const valorTotal = valores.reduce((val,data) => val + Number(data.price) ,0);
            const val = valores.reduce((val,data) => {
                return data.type == 'ingreso' ? val + Number(data.price) : val - Number(data.price);
            } ,0);
            count.innerHTML = `${val}<span class="font-medium"> $</span>`;

            if(val < 0){
                count.classList.add('bg-red-500');
                count.classList.remove('bg-green-500','bg-yellow-400');
            }else if(val > valorTotal * 0.20){
                count.classList.add('bg-green-500');
                count.classList.remove('bg-red-500','bg-yellow-400');
            }else if(val < valorTotal * 0.20 || val > 0){
                count.classList.add('bg-yellow-400');
                count.classList.remove('bg-red-500','bg-green-500');
            };
        });
    };
    clearHtmlRegistros(){
        while(boxRegistros.firstChild){
            boxRegistros.removeChild(boxRegistros.firstChild);
        };
    };
    formRegistroMessage(text){
        const p = document.querySelector('p');
        p.textContent = text;
        p.classList.add('error-alert','text-center','mx-4','text-sm','sm:text-base','text-red-800','font-semibold','px-1','border-b','border-red-400');

        if(!form.querySelector('.error-alert')){
            form.insertBefore(p,form.querySelector('.ctn-form'));
            setTimeout(() => p.remove(),3000);
        };
    };
    successAlert(text){
        const alert = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (alert) => {
                alert.addEventListener('mouseenter', Swal.stopTimer);
                alert.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });
        alert.fire({
            icon: 'success',
            title: text
        });
    };
    viewCompanyData({name,id}){
        companyName.textContent = name;
        idCompany.innerHTML = `<span class="font-bold">NIT: </span>${id}`;
    };
    otherOptions(){
        new Sortable(boxRegistros,{
            swap :  true ,
            animation :  150 
        });
        modalEmail.addEventListener('click',(e) => {
            if(e.target.classList.contains('modal-email')){
                modalEmail.classList.add('hidden');
            };
        });
    };
};