const { ipcRenderer } = require('electron');
const form = document.querySelector('form');

form.addEventListener('submit', e => {
    e.preventDefault();
    console.log('subnmot')
    const [name, tipo, precio]=document.querySelectorAll('input');
    const dataIsOk = validateData(name.value, tipo.value, precio.value);
    if(dataIsOk) {
        const newProduct = {
            name: name.value,
            tipo: tipo.value,
            precio: precio.value
        }

        // A través de ipcRenderer envio un archivo con el evento new-product al mainProcesses
        ipcRenderer.send('new-product', newProduct );
    }
});


function validateData(name, tipo, precio) {
    if(!name || !tipo || !precio) {
        return false;
    }
    return true;
};