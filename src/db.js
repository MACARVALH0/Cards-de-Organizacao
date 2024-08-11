const sqlite3 = require('sqlite3').verbose();

const db_path = "./data/AppData.db";
const db = new sqlite3.Database(db_path, (err) =>
{
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        // Lógica de tratamento de erro aqui, se necessário
    } else {
        console.log("Conexão bem-sucedida com o banco de dados.");
    }
});

// const db2 = new sqlite3.Database(":memory:", (err)=>{if(err){console.log("Erro ao criar banco na memória.");}else{console.log("aooooba, tudo certo.")}})

module.exports = db;