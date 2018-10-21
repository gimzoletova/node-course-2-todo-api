const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let pass = 'torah1';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(pass, salt, (err, hash) => {
//         console.log(hash);
        
//     })
// });

let h_pass = '$2a$10$GpTu0A74z2/1uB9SJNytXusd1m5bS3ZUUW6y6vFwpHmwhslRErOJu';

bcrypt.compare(pass, h_pass, (err, res) => {
    console.log(res);
    
})

// let data = {
//     id: 4
// }
// let token = jwt.sign(data, '123asd');
// console.log(token);

// let decoded = jwt.verify(token, '123asd');
// console.log(decoded);


// let msg = 'I am user num 3';

// let hash = SHA256(msg).toString();

// console.log('msg: ', msg);
// console.log('hash: ', hash);

// let data = {
//     id: 4
// }
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//     console.log('trusted request');    
// }
// else {
//     console.log('untrusted request');    
// }