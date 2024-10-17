const fs = require('fs');
const filePath = 'nature.json';

let empty = [0, 0, 0, 0];
let key = ['heading', 'authors', 'description', 'date'];


fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;

    let jsonData = JSON.parse(data);

    jsonData.forEach((el) => {
        for (let i = 0; i < key.length; i++) {
            if (el[key[i]] === '') {
                empty[i] += 1;
            }
        }
    });

    let notNull = 0;
    let fullSum = 0;
    empty.forEach((el) => {
        if (el !== 0) {
            notNull += 1;
        }
        fullSum += el;
    });

    let res = notNull / 4 * fullSum * 100 / jsonData.length; 
    console.log(empty, '\n', notNull, '\n', fullSum, '\n', jsonData.length, '\n', res);   
});

