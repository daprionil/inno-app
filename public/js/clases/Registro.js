import {db,ui} from '../funciones.js';

export default class Registro{
    addRegistro(obj){
        const transaction = db.transaction('registros','readwrite');
        const objectStore = transaction.objectStore('registros');

        objectStore.add(obj);
        transaction.oncomplete = () => ui.successAlert("Agregado Correctamente");
    };
    editRegistro(obj){
        const transaction = db.transaction('registros','readwrite');
        const objectStore = transaction.objectStore('registros');

        objectStore.put(obj);
        transaction.oncomplete = () => ui.successAlert("Editado Correctamente");
    };
    deleteRegistro({idRegistro}){
        const transaction = db.transaction('registros','readwrite');
        const objectStore = transaction.objectStore('registros');

        objectStore.delete(idRegistro);
        transaction.oncomplete = () => ui.successAlert("Eliminado Correctamente");
    };
};