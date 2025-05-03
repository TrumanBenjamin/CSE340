function formatVehicleDetails(vehicle) {
    return `
        <div class="vehicle-details">
            <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-image">
            <div class="vehicle-info">
                <h1>${vehicle.year} ${vehicle.make} ${vehicle.model}</h1>
                <p><strong>Price:</strong> ${formatPrice(vehicle.price)}</p>
                <p><strong>Mileage:</strong> ${formatMileage(vehicle.mileage)}</p>
                <p><strong>Color:</strong> ${vehicle.color}</p>
                <p><strong>Description:</strong> ${vehicle.description}</p>
            </div>
        </div>
    `;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

function formatMileage(mileage) {
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles';
}

module.exports = { formatVehicleDetails };
