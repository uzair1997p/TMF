const LoginService = require('../../services/loginservice');
let fs = require('fs');
const path = require('path');
class Controller
{
    
    GetLoginPage (request, response)
    {    
      fs.readFile(path.join(__dirname, '/../../../client_end/login_signup.html'), null,function (error, data)
      {
          //console.log(path.join(__dirname, '/../../../client_side/login_signup.html'));
          if (error)
          {
              response.writeHead(404);
              response.write('Whoops! File not found!');
          }
          else
          {
            response.writeHead(200, {
              'Content-Type': 'text/html'
            });
            response.write(data);
          }
          response.end();
      });
    }

    async InsertbyIdandPass(req, res)
    {
           
      let r = await LoginService.UserInsert(req.body);
      if (!r)
      {
        res.status(500).json("This username already exists");
      }
      else
      {
        //User = req.body.username;
        res.status(200).redirect('/login'); // Redirect to login 
      }
    }

    async GetbyIdandPass(req, res)
    {
          
      let r = await LoginService.byId(req);
      if (!r)
      {
        res.status(404).json('Invalid Username or Password!');
      }
      else
      {
        res.status(200).redirect('/');
      }
    }
}

module.exports = new Controller();