const almantZod = require('./index.js');

const valid = almantZod.string().validate(234);

console.log(valid)