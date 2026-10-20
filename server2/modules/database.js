/**
 * Claude was used to help write, review, and refine the code.
 */

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
        const ca = fs.readFileSync(__dirname + "/../ca.pem");

        this.writer = this.createPool(process.env.DB_WRITER_USER, process.env.DB_WRITER_PASS, ca);
        this.reader = this.createPool(process.env.DB_READER_USER, process.env.DB_READER_PASS, ca);
    }

    createPool(user, password, ca) {
        return mysql.createPool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_NAME,
            user: user,
            password: password,
            ssl: { ca: ca },
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