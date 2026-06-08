const path = require("path");

//apenas o nome do arquivo
console.log(path.basename(__filename));

//nome do diretório atual
console.log(path.dirname(__filename));

//extenção do arquivo
console.log(path.extname(__filename));

//criar o objeto path
console.log(path.parse(__filename));

console.log(path.join(__dirname, "test", "test.txt"));
