const { ipcRenderer } = require('electron');

const bodyTable = document.getElementById("body-table");
const products = [];

ipcRenderer.on('new-product', (e, newProduct) => {
    products.push(newProduct);
    const { name, tipo, precio } = newProduct;
    const item = `
        <tr class="animate__animated animate__backInDown table-light" id="${name}">
            <th scope="row">${name}</th>
            <td>${tipo}</td>
            <td>$${precio}</td>
            <td>
                <a href="#" class="text-danger" onclick="removeProduct(event)">Remove</a>
            </td>
        </tr>
    `;
    bodyTable.innerHTML += item;
    setTimeout(() => {
        document.getElementById(name).classList.remove('animate__animated', 'animate__backInDown');
    }, 1000);
});

ipcRenderer.on('clear-products', () => {
    bodyTable.innerHTML = '';
})


function removeProduct(e) {
    const element = e.target.parentElement.parentElement;
    element.classList.add('animate__animated', 'animate__backOutDown');
    setTimeout(() => {
        element.remove();
    },600);
    
}





