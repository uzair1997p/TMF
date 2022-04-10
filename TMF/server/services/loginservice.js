const User = require('../models/users.js');
const bcrypt = require('bcrypt');

class UserDatabase
{
    async byId(data)
    {
      return this.validPassword(data.body.username, String(data.body.password),data);
    }

    async UserInsert(data)
    {
      const user = await User.findOne({username: data.username}).exec();
      if(user)
        return false;      
      var obj = (await User.find({},{"userid":1, "_id"  : 0}).sort({userid:-1}).limit(1).exec());
      let userid_db;
      if(obj.length != 0)
          userid_db = obj[0].toObject().userid + 1;
      else
          userid_db = 1;
        
      let options = {
        'userid' : userid_db,
        'username' : data.username,
        'password' : this.generateHash(data.password),
        'userlogo' : '../assets/'+userid_db+data.username+'.png'
      };
      const NewUser = new User(options);
      return await NewUser.save();
    }

    // hash the password
    generateHash = function (password)
    {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }

    // checking if password is valid
    validPassword = async function(username_param,password_param,req)
    {
      const user = await User.findOne({username: username_param}).exec();
      if(user === null || user === undefined)
        return false;
      
      let password_db = user.toObject().password;   
      if(password_db)
      {
        req.session.ACTIVE_USER = user.toObject().username;
        req.session.ACTIVE_USER_ID = user.toObject().userid;
        req.session.ACTIVE_USER_LOGO = user.toObject().userlogo;
        // process.env.ACTIVE_USER = user.toObject().username;
        // process.env.ACTIVE_USER_ID = user.toObject().userid;
        // process.env.ACTIVE_USER_LOGO = user.toObject().userlogo;
        return bcrypt.compareSync(password_param , password_db); //compare with obj password
      }
      else
          return false;
    };
}
module.exports = new UserDatabase();