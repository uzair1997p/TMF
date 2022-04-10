const fs = require ('fs');

function init()
{
    if (!fs.existsSync(__dirname+'/../../client_end/Downloads'))
    {
        fs.mkdirSync(__dirname+'/../../client_end/Downloads');
    }

    if (!fs.existsSync(__dirname+'/../../client_end/assets'))
    {
        fs.mkdirSync(__dirname+'/../../client_end/assets');
    }
}

module.exports = init;