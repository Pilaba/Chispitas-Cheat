const mysql = require("mysql")
require('dotenv').config();                             //Cargar variables de entorno .env  

function saveInDB(data) {
    try{
        var connection = mysql.createConnection({
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER,
            password : process.env.DB_PASS,
            database : process.env.DB_DBNAME
        });
        console.log(process.env.DB_HOST);
        
        connection.connect(err => {
            if (err) {  throw err;  }
            connection.query('SELECT 1', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
            });
        });
    }catch(error){
        console.error(error)
    }
}

saveInDB()