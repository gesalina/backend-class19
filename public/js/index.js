const socket = io();

const tableBody = document.getElementById('productBody');
const btn = document.getElementById('addProduct');
const deleteBtn = document.querySelectorAll('.buttonsDel');


const deleteButton = async (data) => {
    try {
        const response = await fetch(`/api/products/${data.value}`,{
            method: "DELETE"
        })
        const result = await response.json();
          if(result.status === "error"){
            alert('Ocurrio un error');
        }
        else{

            const getProducts = await fetch('/api/products');
            const resultProducts = await getProducts.json();
        socket.emit('productList', resultProducts.payload);
        }
    } catch (error) {
        console.log(error)
    }
}

deleteBtn.forEach(button => {
    button.addEventListener('click', function(){deleteButton(button)});
})



btn.addEventListener('click', async () => {

    const body = {
        title: document.getElementById('title').value,
        description:document.getElementById('description').value,
        price: document.getElementById('price').value,
        thumbnail: `/content/img/${document.getElementById('thumbnail').value}`,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value
    }

    const response = await fetch('/api/products/', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }})
    try {
        const result = await response.json();
        if(result.status === 'error') {
            throw new Error(result.error);
        } else {
            const getProducts = await fetch('/api/products');
            const resultProducts = await getProducts.json();

            if(resultProducts.status === 'error'){
                throw new Error(resultProducts.error);
            } else {


            socket.emit("productList", resultProducts.payload);

            alert('Producto agregado con exito!');

        document.getElementById('title').value = "";
        document.getElementById('description').value = "";
        document.getElementById('price').value = "";
        document.getElementById('thumbnail').value = "";
        document.getElementById('code').value = "";
        document.getElementById('stock').value = "";

        }
    }
    } catch (error) {
        alert(`Ocurrio un error ${error}`);
    }})


    socket.on("updateProducts", products => {
        tableBody.innerHTML = "";

        products.forEach(product => {
            let row = document.createElement('tr');
            row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700';
            row.innerHTML = `
            <td class="px-6 py-4">
                    ${product.id}
                </td>
                <td class="px-6 py-4">
                    <img class="w-10 h-10 rounded" src="${product.thumbnail}" alt="${product.thumbnail}">
                </td>
                <td class="px-6 py-4">
                ${product.title}
                </td>
                <td class="px-6 py-4">
                ${product.description}
                </td>
                <td class="px-6 py-4">
                ${product.code}
                </td>
                <td class="px-6 py-4">
                ${product.stock}
                </td>
                <td class="px-6 py-4">
                ${product.price}
                </td>
                <td class="px-6 py-4">
                    <button type="button" id="deleteBtn" value="${product.id}" class="buttonsDel focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete</button>
                </td>`
                tableBody.appendChild(row);
        });
    })
