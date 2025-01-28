document.getElementById('addItemBtn').addEventListener('click', function() {
    document.getElementById('addItemModal').style.display = 'flex';
});

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('addItemModal').style.display = 'none';
});

document.getElementById('saveItemBtn').addEventListener('click', function() {
    const productName = document.getElementById('productName').value;
    const productImage = document.getElementById('productImage').files[0];
    const date = new Date().toISOString().split('T')[0];
    const status = 'In Store';

    if (!productName || !productImage) {
        alert('Please enter a product name and select an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const productGrid = document.getElementById('productGrid');
        const newItem = document.createElement('div');
        newItem.className = 'grid-item';

        newItem.innerHTML = `
                    <img src="${e.target.result}" alt="Image of ${productName}">
                    <h3>${productName}</h3>
                    <p>Date: ${date}</p>
                    <p class="status status-in-store">${status}</p>
                    <button class="btn btn-toggle">Toggle Status</button>
                    <button class="btn btn-delete">Remove</button>
                `;

        productGrid.appendChild(newItem);
        document.getElementById('addItemModal').style.display = 'none';

        const noItemsMessage = document.getElementById('noItemsMessage');
        if (noItemsMessage) {
            noItemsMessage.style.display = 'none';
        }

        newItem.querySelector('.btn-toggle').addEventListener('click', function() {
            const statusElement = newItem.querySelector('.status');
            if (statusElement.classList.contains('status-in-store')) {
                statusElement.classList.remove('status-in-store');
                statusElement.classList.add('status-out');
                statusElement.textContent = 'Out';
            } else {
                statusElement.classList.remove('status-out');
                statusElement.classList.add('status-in-store');
                statusElement.textContent = 'In Store';
            }
        });

        newItem.querySelector('.btn-delete').addEventListener('click', function() {
            productGrid.removeChild(newItem);
            if (productGrid.children.length === 1) {
                noItemsMessage.style.display = 'block';
            }
        });
    };
    reader.readAsDataURL(productImage);
});