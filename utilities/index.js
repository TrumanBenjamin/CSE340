const invModel = require("../models/inventory-model")
const Util = {}


Util.getNav = async function () {
  try {
    // getClassifications() now returns an array of rows
    const classifications = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'

    // loop over the array, not data.rows
    classifications.forEach((row) => {
      list += '<li>'
      list += '<a href="/inv/type/' + row.classification_id +
              '" title="See our inventory of ' + row.classification_name +
              ' vehicles">' + row.classification_name + '</a>'
      list += '</li>'
    })

    list += '</ul>'
    return list
  } catch (error) {
    console.error('getNav error: ' + error)
    throw error
  }
}


Util.buildClassificationList = async function (selectedId = null) {
  const classifications = await invModel.getClassifications();
  let list = '<select name="classification_id" id="classificationList" required>';
  list += '<option value="">Choose a Classification</option>';
  classifications.forEach(row => {
    list += `<option value="${row.classification_id}"` +
            (row.classification_id == selectedId ? ' selected' : '') +
            `>${row.classification_name}</option>`;
  });
  list += '</select>';
  return list;
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



Util.buildClassificationGrid = async function (data) {
  // if data is missing or not an array, show “no vehicles” and bail
  if (!Array.isArray(data) || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  // start building your UL
  let grid = '<ul id="inv-display">';

  data.forEach(vehicle => {
    grid += '<li>';
    grid +=  '<a href="/inv/detail/' + vehicle.inv_id +
             '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model +
             ' details"><img src="' + vehicle.inv_thumbnail +
             '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model +
             ' on CSE Motors" /></a>';
    grid += '<div class="namePrice">';
    grid += '<hr />';
    grid += '<h2>';
    grid += '<a href="/inv/detail/' + vehicle.inv_id +
             '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model +
             ' details">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
    grid += '</h2>';
    grid += '<span>$' +
             new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
             '</span>';
    grid += '</div>';
    grid += '</li>';
  });

  grid += '</ul>';
  return grid;
};


function buildVehicleDetail(vehicle) {
  const formatter = new Intl.NumberFormat("en-US");

  return `
  <div class="vehicle-detail-container">
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
    </div>
    <div class="vehicle-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <p><strong>Price:</strong> $${formatter.format(vehicle.inv_price)}</p>
      <p><strong>Mileage:</strong> ${formatter.format(vehicle.inv_miles)} miles</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p><strong>Description:</strong> ${vehicle.inv_description}</p>
    </div>
  </div>
  `;
}

Util.buildVehicleDetail = buildVehicleDetail

module.exports = Util