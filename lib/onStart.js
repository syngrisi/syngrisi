// this code should runs only once at server start
const fs = require('fs');
const mongoose = require('mongoose');
const User = mongoose.model('VRSUser');
const hasha = require('hasha');
const dir = '../.tmp';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
User.findOne({username: 'Administrator'}).then((user)=>{
    // console.log(hasha('defPassword'));
    if(!user){
        console.log('Create the default Administrator');
        User.create({
            username: 'Administrator',
            role: 'admin',
            firstName: 'AdminFn',
            lastName: 'AdminLn',
            password: 'c8cf5e6a41b2adf72ce45ab9943cb5bb5b745b434def282a70abfae6c5e727eb3e74b82b4a7651a86b95531376c64cfc9c92956210ce9b70a471f25a063bf0be',
            updatedDate: new Date()
        }).then((admin)=>{
            console.log(`Administrator with id: '${admin._id}' was created`);
        })
    }
})
