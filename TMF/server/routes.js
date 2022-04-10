const Login = require('./controller/login/controller');
const Home = require('./controller/home/controller');
let fs = require('fs');

function routes(app) {
    app.get('/newcustomer', (Home.NewCustomerForm));
    app.post('/updatecustomer', (Home.UpdateCustomerData));
    app.get('/getcustomers', (Home.GetCustomers));
    app.post('/getcustomer', (Home.GetCustomer));
    app.get('/getcustomersname', (Home.GetCustomersBusinessName));
    app.post('/uploadnewcustomer', (Home.SaveCustomerData));
    app.post('/deletecustomer', (Home.DeleteCustomerData));

    app.post('/uploadlogo', (Home.UploadLogo));


    app.post('/filedownload', (Home.DownloadFile));
    app.post('/filedelete', (Home.DownloadFile));

    app.get(['/graph'], (Home.GetGraph));
    app.get(['/graphdata'], (Home.GetGraphData1));

    app.get(['/', '/home'], (Home.GetHome));

    app.get('/home/orders', (Home.GetOrders));

    app.post('/home/orders/save', (Home.SaveData));


    app.get('/home/completed', (Home.GetCompletedHome));

    app.get('/home/completedorders', (Home.GetCompletedOrders));

    app.post('/home/orders/savecompleted', (Home.SaveCompletedData));


    app.post('/login/signup', (Login.InsertbyIdandPass));

    app.post('/login/signin', (Login.GetbyIdandPass));

    app.get('/login', (Login.GetLoginPage));

    app.get('/logout', (req, res) =>
    {
        console.log(req.session.ACTIVE_USER);
        req.session.ACTIVE_USER = "";
        process.env.ACTIVE_USER = "";
        res.redirect('/login');
    });
}

module.exports = routes;