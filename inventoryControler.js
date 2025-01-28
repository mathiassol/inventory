const equipmentList = [];

function addEquipment() {
    const equipmentName = document.getElementById('equipmentName').value;
    if (equipmentName.trim() === '') {
        alert('Please enter equipment name.');
        return;
    }

    const newEquipment = {
        name: equipmentName,
        status: 'inInventory'
    };

    equipmentList.push(newEquipment);
    document.getElementById('equipmentName').value = '';
    renderEquipmentList();
}

function toggleStatus(index) {
    equipmentList[index].status =
        equipmentList[index].status === 'inInventory' ? 'lentOut' : 'inInventory';
    renderEquipmentList();
}

function renderEquipmentList() {
    const listElement = document.getElementById('equipmentList');
    listElement.innerHTML = '';

    equipmentList.forEach((equipment, index) => {
        const listItem = document.createElement('li');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = equipment.name;

        const statusSpan = document.createElement('span');
        statusSpan.textContent =
            equipment.status === 'inInventory' ? 'In Inventory' : 'Lent Out';
        statusSpan.className =
            equipment.status === 'inInventory' ? 'status-inventory' : 'status-lent';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Status';
        toggleButton.onclick = () => toggleStatus(index);

        listItem.appendChild(nameSpan);
        listItem.appendChild(statusSpan);
        listItem.appendChild(toggleButton);

        listElement.appendChild(listItem);
    });
}