const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

const token = jwt.sign(data, '123abc');
console.log(`Token: ${token}`);

const decoded = jwt.verify(token, '123abc');
console.log(`Verify:`,decoded);

// var message = "I am user number 3";
//
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();
//
// if (resultHash === token.hash){
//   console.log("Data was not changed")
// } else {
//   console.log('Data was changed, dont trust');
// }
