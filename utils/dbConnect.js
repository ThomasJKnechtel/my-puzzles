import mssql from "mssql"
const sqlConfig = {
    user:'MyPuzzles',
    password: process.env.PASSWORD,
    server: 'localhost',
    database: 'MyPuzzles',
    options:{
        encrypt: true,
        trustServerCertificate: true
    }
}
const db = mssql
db.connect(sqlConfig)
export default db
