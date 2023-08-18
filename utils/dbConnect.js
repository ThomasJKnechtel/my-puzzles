import mssql from "mssql"
const sqlConfig = {
    user:'MyPuzzles',
    password: process.env.PASSWORD,
    server: 'localhost',
    database: 'MyPuzzles.com',
    options:{
        encrypt: true,
        trustServerCertificate: true
    }
}
const db = mssql
db.connect(sqlConfig)
export default db