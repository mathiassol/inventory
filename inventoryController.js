document.addEventListener('DOMContentLoaded', loadProducts);
document.getElementById('addItemBtn').addEventListener('click', function () {
    document.getElementById('addItemModal').style.display = 'flex';
});
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('addItemModal').style.display = 'none';
});
document.getElementById('saveItemBtn').addEventListener('click', async function () {
    const productName = document.getElementById('productName').value.trim();
    const productImage = document.getElementById('productImage').files[0];

    if (!productName || !productImage) {
        alert('Please enter a product name and image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        const stock = 1;
        const product = {
            name: productName,
            image: e.target.result,
            stock
        };

        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        const savedProduct = await response.json();
        addProductToGrid(savedProduct);
    };
    reader.readAsDataURL(productImage);
});

function addProductToGrid(product) {
    const productGrid = document.getElementById('productGrid');
    const existingItem = [...document.querySelectorAll('.grid-item')].find(item =>
        item.querySelector('h3') && item.querySelector('h3').textContent === product.name
    );

    if (existingItem) {
        const stockElement = existingItem.querySelector('.stock');
        let stock = parseInt(stockElement.textContent.split(': ')[1], 10);
        stock++;
        stockElement.textContent = `Stock: ${stock}`;
        updateAvailability(existingItem, stock);
    } else {
        const newItem = document.createElement('div');
        newItem.className = 'grid-item';
        newItem.innerHTML = `
            <img src="${product.image}" alt="Image of ${product.name}">
            <h3>${product.name}</h3>
            <p class="stock">Stock: ${product.stock}</p>
            <p class="status status-in-store">Available</p>
        `;
        if (!window.location.pathname.includes('guestView.html')) {
            newItem.innerHTML += `
                <button class="btn btn-plus">+</button>
                <button class="btn btn-minus">-</button>
                <button class="btn btn-delete">Remove</button>
            `;
        }
        productGrid.appendChild(newItem);

        if (!window.location.pathname.includes('guestView.html')) {
            attachEventListeners(newItem);
        }
        updateAvailability(newItem, product.stock);
    }
}

async function loadProducts() {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();

    const noItems = document.getElementById('noItemsMessage');
    if (products.length === 0) {
        noItems.style.display = 'block';
    } else {
        noItems.style.display = 'none';
        products.forEach(addProductToGrid);
    }
}
function attachEventListeners(item) {
    const plusBtn = item.querySelector('.btn-plus');
    const minusBtn = item.querySelector('.btn-minus');
    const deleteBtn = item.querySelector('.btn-delete');
    const stockElement = item.querySelector('.stock');
    const productName = item.querySelector('h3').textContent;

    plusBtn.addEventListener('click', function () {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let product = products.find(p => p.name === productName);
        if (product) {
            product.stock++;
            localStorage.setItem('products', JSON.stringify(products));
            stockElement.textContent = `Stock: ${product.stock}`;
            updateAvailability(item, product.stock);
        }
    });
    minusBtn.addEventListener('click', function () {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let product = products.find(p => p.name === productName);
        if (product && product.stock > 0) {
            product.stock--;
            localStorage.setItem('products', JSON.stringify(products));
            stockElement.textContent = `Stock: ${product.stock}`;
            updateAvailability(item, product.stock);
        }
    });
    deleteBtn.addEventListener('click', function () {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.name !== productName);
        localStorage.setItem('products', JSON.stringify(products));
        item.remove();

        const productGrid = document.getElementById('productGrid');
        const noItems = document.getElementById('noItemsMessage');

        if (!productGrid.querySelector('.grid-item')) {
            noItems.style.display = 'block';
        }
    });
}
function updateAvailability(item, stock) {
    const statusElement = item.querySelector('.status');
    if (stock === 0) {
        statusElement.classList.remove('status-in-store');
        statusElement.classList.add('status-out');
        statusElement.textContent = 'Out of Stock';
    } else {

        statusElement.classList.remove('status-out');
        statusElement.classList.add('status-in-store');
        statusElement.textContent = 'Available';
    }
}