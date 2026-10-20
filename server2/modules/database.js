const fs = require("fs");
const mysql = require("mysql2/promise");

const CREATE_TABLE_SQL =
    "CREATE TABLE IF NOT EXISTS patient (" +
    "patientid INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, " +
    "name VARCHAR(100) NOT NULL, " +
    "dateOfBirth DATETIME NOT NULL" +
    ") ENGINE=InnoDB";

const INSERT_SQL = "INSERT INTO patient (name, dateOfBirth) VALUES (?, ?)";

class Database {
    constructor() {
        const ssl = process.env.DB_SSL === "false"
            ? undefined
            : { ca: fs.readFileSync(__dirname + "/../ca.pem") };

        this.writer = this.createPool(process.env.DB_WRITER_USER, process.env.DB_WRITER_PASS, ssl);
        this.reader = this.createPool(process.env.DB_READER_USER, process.env.DB_READER_PASS, ssl);
    }

    createPool(user, password, ssl) {
        return mysql.createPool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_NAME,
            user: user,
            password: password,
            ...(ssl ? { ssl: ssl } : {}),
            dateStrings: true
        });
    }

    async insertPatients(patients) {
        await this.writer.query(CREATE_TABLE_SQL);
        for (const patient of patients) {
            await this.writer.execute(INSERT_SQL, [patient.name, patient.dateOfBirth]);
        }
        return patients.length;
    }


    async runQuery(sql) {
        const [rows] = await this.reader.query(sql);
        return rows;
    }
}

module.exports = Database;