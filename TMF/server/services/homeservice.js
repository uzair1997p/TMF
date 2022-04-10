const Orders = require('../models/orders.js');
const Columns = require('../models/columns.js');
const Customers = require('../models/customer.js');
const mongodb = require('mongodb')
const fs = require('fs')
const binary = mongodb.Binary;
const os = require('os');

class HomeDatabase {


    async DeleteCustomerData(data) {
        if (data.body.business_name === "" || data.body.business_name === undefined || data.body.business_name == null)
            return false;
        console.log("Deleting Customer Data ...");
        await Customers.deleteMany({ $and: [{ user_id: data.session.ACTIVE_USER_ID }, { business_name: data.body.business_name }] });
        console.log("Successfully Deleted!");
        return true;
    }

    async UpdateCustomerData(data,files)
    {
        if (data.body.business_name === "" || data.body.business_name === undefined || data.body.business_name == null)
            return false;
         
        //console.log(files);
        //console.log(data);

        let newfileindex = data.body.isfileupdated.split(',');
        //console.log(newfileindex);

        let customer = await Customers.findOne({ user_id: Number(data.session.ACTIVE_USER_ID), business_name: data.body.business_name}).exec();
        customer = customer.toObject();
        if(customer === undefined || customer === null)
            return false;
        
        customer['contact_name'] = data.body["contact_name"];
        customer['customer_address'] = data.body["customer_address"];
        customer['customer_contact_no'] = data.body["customer_contact_no"];
        customer['customer_email'] = data.body["customer_email"];

        if(files === null || files===undefined) // No attachements sent
        {
            for (let index = 1; index < 11; index++) 
            {
                customer['filename_' + index] = data.body['filename_' + index];
            }

        }
        else if(files.uploadedFile[0] === undefined || files.uploadedFile[0] === null ) //Single attachement sent. Front end doesn't send array for a single record in files that why we cannot use []
        {
            for (let index = 1; index < 11; index++) // 10 attachements in customer table
            {
                customer['filename_' + index] = data.body['filename_' + index];
                if (customer['filename_' + index] !== "" && files.uploadedFile !== undefined && files.uploadedFile !== null && newfileindex[index - 1] === '1') {
                    customer['file_' + index] = files.uploadedFile;
                    }
            }
        }
        else
        {
            let file_index = 0;
            for (let index = 1; index < 11; index++) // 10 attachements in customer table (file1 to file10)
            {
                customer['filename_' + index] = data.body['filename_' + index];
                if (customer['filename_' + index] !== "" && files.uploadedFile[file_index] !== undefined && files.uploadedFile[file_index] !== null && newfileindex[index - 1] === '1') {
                    customer['file_' + index] = files.uploadedFile[file_index];
                    file_index++;
                }
            }
        }
        //console.log(customer);
        console.log("Updating Customer Data ...");
        await Customers.deleteMany({ $and: [{ user_id: data.session.ACTIVE_USER_ID }, { business_name: data.body.business_name }] });
        await Customers.insertMany(customer);
        console.log("Successfully Updated!");
        return true;

    }

    async SaveCustomerData(data, files) {
        if (data.body.business_name === "" || data.body.business_name === undefined || data.body.business_name == null)
            return false;
         
        //console.log(files);
        //console.log(data);
        let final_data = { business_name: data.body.business_name, contact_name: data.body.contact_name, customer_address: data.body.customer_address, customer_email: data.body.customer_email, customer_contact_no: data.body.customer_contact_no, user_id: data.session.ACTIVE_USER_ID };
        if(files === null || files===undefined) // No attachements
        {
            for (let index = 1; index < 11; index++) 
            {
                final_data['filename_' + index] = data.body['filename_' + index];
            }

        }
        else if(files.uploadedFile[0] === undefined || files.uploadedFile[0] === null )// Single attachement. Front end doesn't send array for a single record in files that why we cannot use []
        {
            for (let index = 1; index < 11; index++) 
            {
                final_data['filename_' + index] = data.body['filename_' + index];
                if (final_data['filename_' + index] !== "" && files.uploadedFile !== undefined && files.uploadedFile !== null) {
                    final_data['file_' + index] = files.uploadedFile;
                    }
            }
        }
        else // More than 1 attachement
        {
            let file_index = 0;
            for (let index = 1; index < 11; index++) 
            {
                final_data['filename_' + index] = data.body['filename_' + index];
                if (final_data['filename_' + index] !== "" && files.uploadedFile[file_index] !== undefined && files.uploadedFile[file_index] !== null) {
                    final_data['file_' + index] = files.uploadedFile[file_index];
                    file_index++;
                }
            }
        }
        //console.log(final_data);
        console.log("Saving Customer Data ...");
        await Customers.deleteMany({ $and: [{ user_id: data.session.ACTIVE_USER_ID }, { business_name: data.body.business_name }] });
        await Customers.insertMany(final_data);
        console.log("Successfully Saved!");
        return true;
    }

    async DownloadFile(data) {
        let customer = await Customers.findOne({ user_id: Number(data.session.ACTIVE_USER_ID), business_name: data.body.business_name }).exec();
        customer = customer.toObject();
        if(customer[data.body.file] === undefined || customer[data.body.file] === null)
            return false;
        let file_extension = (customer[data.body.file].name.split('.')); // Getting extension from the object's name retrieved from the db
        file_extension = file_extension[file_extension.length - 1];
        const file = customer[data.body.file].data.buffer;
        const download_path = __dirname+'/../../client_end/Downloads/'+data.body.path + '.' + file_extension;
        //console.log(download_path);
        fs.writeFileSync(download_path, file);
        return data.body.path + '.' + file_extension;
    }

    async UploadLogo(file)
    {
        let file_extension = (file.files.uploadedFile.name.split('.')); // Getting extension from the object's name retrieved from the db
        file_extension = file_extension[file_extension.length - 1];
        if(file_extension !== 'jpg' && file_extension !== 'png')
            return false;
        const download_file = binary(file.files.uploadedFile.data).buffer;
        const download_path = __dirname+'/../../client_end/assets/'+file.session.ACTIVE_USER_ID + file.session.ACTIVE_USER+ '.' + "png";
        //console.log(download_path);
        fs.writeFileSync(download_path, download_file);
        return true;
    }

    async DeleteFile()
    {
        const directory = __dirname+'/../../client_end/Downloads/';

        fs.readdir( directory, (err, files) =>
        {
            if (err)
                throw err;

            for (const file of files)
            {
                fs.unlink(directory+file, err =>
                {
                    if (err) throw err;
                });
            }   
        }); 
    }

    async getCustomerBusinessName(data) {
        return await Customers.find({ user_id: Number(data.session.ACTIVE_USER_ID) }, { business_name: 1, _id: 0 });
    }

    async getCustomersData(data) {
        return await Customers.find({ user_id: Number(data.session.ACTIVE_USER_ID) },{file_1:0,file_2:0,file_3:0,file_4:0,file_5:0,file_6:0,file_7:0,file_8:0,file_9:0,file_10:0});
    }

    async getCustomerData(data) {
        return await Customers.find({ user_id: Number(data.session.ACTIVE_USER_ID),business_name: data.body.business_name});
    }

    async getHomeData(data) {
        return await Orders.find({ $and: [{ user_id: Number(data.session.ACTIVE_USER_ID) }, { completed: { $ne: "Completed" } }] });
    }

    async getCompletedHomeData(data) {
        return await Orders.find({ $and: [{ user_id: Number(data.session.ACTIVE_USER_ID) }, { completed: "Completed" }] });
    }

    async getColumnTypes(data) {
        return await Columns.find({ user_id: Number(data.session.ACTIVE_USER_ID), order_type: 'I' });
    }

    async getCompletedColumnTypes(data) {
        return await Columns.find({ user_id: Number(data.session.ACTIVE_USER_ID), order_type: 'C' });
    }

    async getGraphData1(data) {
        return await Orders.aggregate(
            [
                { "$match": { 'user_id': Number(data.session.ACTIVE_USER_ID) } },
                { "$group": { "_id": "$customer_name", "count": { "$sum": 1 } } },
                { '$replaceWith': { 'label': "$_id", 'y': '$count' } }

            ]);
    }

    async SaveCompletedData(data) {
        const session = await Orders.startSession();
        session.startTransaction();
        try {
            await Orders.deleteMany({ user_id: data.session.ACTIVE_USER_ID });
            //console.log(data.table_data);
            //console.log(data.open_orders);
            //console.log(data.data_types);
            if (data.body.open_orders != undefined)
                await Orders.insertMany(data.body.open_orders, { strict: false });
            if (data.body.table_data != undefined || data.body.table_data === null)
                await Orders.insertMany(data.body.table_data, { strict: false });

            if (data.body.data_types != undefined) {
                await Columns.deleteMany({ $and: [{ user_id: data.session.ACTIVE_USER_ID }, { order_type: 'C' }] }, () => {});
                let count = 0;
                for (let k in data.body.data_types) {
                    await Columns.create({ 'sr_no': count, 'column_name': k, 'column_type': data.body.data_types[k], 'order_type': 'C', 'user_id': data.session.ACTIVE_USER_ID });
                    count++;
                }
            }
            await session.commitTransaction();
            session.endSession();
            return true;
        } catch (error) {
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

    }

    async SaveData(data) // Function to save data for open orders
        {
            const session = await Orders.startSession();
            session.startTransaction();
            try {
                await Orders.deleteMany({ user_id: data.session.ACTIVE_USER_ID });
                //console.log(data.table_data);
                //console.log(data.completed_orders);
                //console.log(data.data_types);
                if (data.body.table_data != undefined)
                    await Orders.insertMany(data.body.table_data, { strict: false });
                if (data.body.completed_orders != undefined)
                    await Orders.insertMany(data.body.completed_orders, { strict: false });
                if (data.body.data_types != undefined) {
                    await Columns.deleteMany({ $and: [{ user_id: data.session.ACTIVE_USER_ID }, { order_type: 'I' }] }, () => {});
                    let count = 0;
                    for (let k in data.body.data_types) {
                        await Columns.create({ 'sr_no': count, 'column_name': k, 'column_type': data.body.data_types[k], 'order_type': 'I', 'user_id': data.session.ACTIVE_USER_ID });
                        count++;
                    }
                }
                await session.commitTransaction();
                session.endSession();
                return true;
            } catch (error) {
                // If an error occurred, abort the whole transaction and
                // undo any changes that might have happened
                await session.abortTransaction();
                session.endSession();
                throw error;
            }

        }

    async FirstTimeColumnsLoad(data) // This function only runs once. Creates the by default columns for a new user.
        {
            const column = await Columns.findOne({ user_id: data.session.ACTIVE_USER_ID }).exec();
            if (column === null || column === undefined) {
                await Columns.insertMany([
                    { "sr_no": 0, "column_name": "▬", "column_type": "text", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 1, "column_name": "customer_name", "column_type": "text", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 2, "column_name": "product_name", "column_type": "text", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 3, "column_name": "codes", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 4, "column_name": "code_date", "column_type": "date", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 5, "column_name": "design", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 6, "column_name": "design_date", "column_type": "date", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 7, "column_name": "design_approval", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 8, "column_name": "design_approval_date", "column_type": "date", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 9, "column_name": "printing", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 10, "column_name": "printing_date", "column_type": "date", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 11, "column_name": "stapling", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 12, "column_name": "stapling_date", "column_type": "date", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 13, "column_name": "shipping", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 14, "column_name": "ship_date", "column_type": "date", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 15, "column_name": "received", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 16, "column_name": "received_date", "column_type": "date", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 17, "column_name": "completed", "column_type": "dropdown", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 18, "column_name": "file", "column_type": "text", "order_type": "C", "user_id": data.session.ACTIVE_USER_ID }
                ]);

                await Columns.insertMany([
                    { "sr_no": 0, "column_name": "▬", "column_type": "text", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 1, "column_name": "customer_name", "column_type": "text", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 2, "column_name": "product_name", "column_type": "text", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 3, "column_name": "codes", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 4, "column_name": "code_date", "column_type": "date", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 5, "column_name": "design", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 6, "column_name": "design_date", "column_type": "date", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 7, "column_name": "design_approval", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 8, "column_name": "design_approval_date", "column_type": "date", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 9, "column_name": "send_to_printer", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 10, "column_name": "send_to_printer_date", "column_type": "date", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 11, "column_name": "proof_approval", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 12, "column_name": "proof_approval_date", "column_type": "date", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 13, "column_name": "shipping", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 14, "column_name": "ship_date", "column_type": "date", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 15, "column_name": "received", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 16, "column_name": "received_date", "column_type": "date", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 17, "column_name": "completed", "column_type": "dropdown", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 18, "column_name": "notes", "column_type": "text", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID },
                    { "sr_no": 19, "column_name": "file", "column_type": "text", "order_type": "I", "user_id": data.session.ACTIVE_USER_ID }
                ]);

                return true;
            }
            return false;
        }

}
module.exports = new HomeDatabase();