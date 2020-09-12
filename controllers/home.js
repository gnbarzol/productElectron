const { ipcRenderer } = require('electron');

const bodyTable = document.getElementById("body-table");

const products = [];


ipcRenderer.on('new-product', (e, newProduct) => {
    products.unshift(newProduct);

    const item = `
        <tr class="animate__animated animate__backInDown table-light">
            <th scope="row">${newProduct.name}</th>
            <td>${newProduct.tipo}</td>
            <td>$${newProduct.precio}</td>
            <td>Delete</td>
        </tr>
    `;
    bodyTable.innerHTML += item;
});







