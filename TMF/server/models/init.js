
const customer = require('./customer');
const user = require('./users');
const orders = require('./orders');
const products = require('./product');
const files = require('./files');
const columns = require('./columns');

function init()
{
    customer.init();
    user.init();
    orders.init();
    products.init();
    files.init();
    columns.init();
}

module.exports = init;