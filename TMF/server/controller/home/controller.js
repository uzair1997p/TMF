const HomeService = require('../../services/homeservice');
const fs = require('fs');
const path = require('path');

//----------------------------------Added for file uploading
const mongodb = require('mongodb')
const binary = mongodb.Binary;
//----------------------------------------


class Controller {
    async GetHome(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {

            fs.readFile(path.join(__dirname, '/../../../client_end/home.html'), null, function(error, data) {
                //console.log(path.join(__dirname, '/../../../client_side/login_signup.html'));
                if (error) {
                    res.writeHead(404);
                    res.write('Whoops! File not found!');
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });
                    res.write(data);
                    //res.json(orders);
                }
                res.end();
            });
        } else
            res.redirect('/login');
    }

    async SaveData(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            let result = await HomeService.SaveData(req);
            if (result)
                res.status(200).redirect('/home');
            else
                res.status(400).send(result);
        } else
            res.redirect('/login');
    }

    async SaveCompletedData(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            let result = await HomeService.SaveCompletedData(req);
            if (result)
                res.status(200).redirect('/home');
            else
                res.status(400).send(result);
        } else
            res.redirect('/login');
    }

    async GetCompletedHome(req, res) {
        //console.log("Hello" + req.session.ACTIVE_USER);
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            fs.readFile(path.join(__dirname, '/../../../client_end/completed.html'), null, function(error, data) {
                //console.log(path.join(__dirname, '/../../../client_side/login_signup.html'));
                if (error) {
                    res.writeHead(404);
                    res.write('Whoops! File not found!');
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });
                    res.write(data);
                    //res.json(orders);
                }
                res.end();
            });
        } else
            res.redirect('/login');
    }

    async GetOrders(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            const orders = await HomeService.getHomeData(req);
            await HomeService.FirstTimeColumnsLoad(req);
            const types = await HomeService.getColumnTypes(req);
            let final = { 'orders': orders, 'types': types };
            orders.push({
                'store_logo_path': "assets/" + req.session.ACTIVE_USER_ID + req.session.ACTIVE_USER + '.png',
                'store_logo': req.session.ACTIVE_USER_ID + req.session.ACTIVE_USER,
                'user_id': req.session.ACTIVE_USER_ID
            });
            res.status(200).json(final);
        } else
            res.redirect('/login');
    }

    async GetCompletedOrders(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            const orders = await HomeService.getCompletedHomeData(req);
            const types = await HomeService.getCompletedColumnTypes(req);
            let final = { 'orders': orders, 'types': types };
            orders.push({
                'store_logo_path': "assets/" + req.session.ACTIVE_USER_ID + req.session.ACTIVE_USER + '.png',
                'store_logo': req.session.ACTIVE_USER_ID + req.session.ACTIVE_USER,
                'user_id': req.session.ACTIVE_USER_ID
            });
            res.status(200).json(final);
        } else
            res.redirect('/login');
    }

    async GetGraph(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {

            fs.readFile(path.join(__dirname, '/../../../client_end/graph.html'), null, function(error, data) {
                //console.log(path.join(__dirname, '/../../../client_side/login_signup.html'));
                if (error) {
                    res.writeHead(404);
                    res.write('Whoops! File not found!');
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });
                    res.write(data);
                    //res.json(orders);
                }
                res.end();
            });
        } else
            res.redirect('/login');
    }

    async GetGraphData1(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            let final = await HomeService.getGraphData1(req);
            res.status(200).json(final);
        }

    }

    async NewCustomerForm(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {

            fs.readFile(path.join(__dirname, '/../../../client_end/newcustomer.html'), null, function(error, data) {
                //console.log(path.join(__dirname, '/../../../client_side/login_signup.html'));
                if (error) {
                    res.writeHead(404);
                    res.write('Whoops! File not found!');
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    });
                    res.write(data);
                    //res.json(orders);
                }
                res.end();
            });
        } else
            res.redirect('/login');
    }

    async SaveCustomerData(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            let result = await HomeService.SaveCustomerData(req, req.files);
            if (result)
                res.status(200).redirect('/newcustomer');
            else
                res.status(400).send(result);
        } else
            res.redirect('/login');
    }

    async UpdateCustomerData(req, res)
    {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null)
        {
            let result = await HomeService.UpdateCustomerData(req, req.files);
            if (result)
                res.status(200).redirect('/newcustomer');
            else
                res.status(400).send('Business name not found!');
        }
        else
            res.redirect('/login');
    }

    async DeleteCustomerData(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            let result = await HomeService.DeleteCustomerData(req, req.files);
            if (result)
                res.status(200).redirect('/newcustomer');
            else
                res.status(400).send(result);
        } else
            res.redirect('/login');
    }

    async UploadLogo(req, res)
    {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            let result = await HomeService.UploadLogo(req);
            if (result)
                res.status(200).redirect('/home');
            else
                res.status(400).send(result);
        } else
            res.redirect('/login');
    }

    

    async GetCustomers(req, res)
    {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null)
        {
            await HomeService.DeleteFile();
            const customers = await HomeService.getCustomersData(req);
            res.status(200).json(customers);
        } else
            res.redirect('/login');
    }

    async GetCustomer(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null)
        {
            const customer = await HomeService.getCustomerData(req);
            res.status(200).json(customer);
        }
        else
            res.redirect('/login');
    }

    async GetCustomersBusinessName(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            const customers = await HomeService.getCustomerBusinessName(req);
            res.status(200).json(customers);
        } else
            res.redirect('/login');
    }

    async DownloadFile(req, res) {
        if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
            const result = await HomeService.DownloadFile(req);
            if(result)
                res.status(200).send(result);
            else
                res.status(400).send("No Attachment with the associated column...");

        } else
            res.redirect('/login');
    }

    // async DeleteFile(req, res) {
    //     if (req.session.ACTIVE_USER != "" && req.session.ACTIVE_USER != undefined && req.session.ACTIVE_USER != null) {
    //         const result = await HomeService.DeleteFile(req.body);
    //         res.status(200).send(result);

    //     } else
    //         res.redirect('/login');
    // }

}

module.exports = new Controller();