const http = require("http");
const url = require("url");
const Database = require("./modules/database");
const MESSAGES = require("./lang/en/messages");

const API_PATH = "/lab5/api/v1/sql";
const PORT = process.env.PORT || 3000;

class Server {
    constructor(db) {
        this.db = db;
    }

    start() {
        http.createServer((req, res) => this.handleRequest(req, res)).listen(PORT, () => {
            console.log(MESSAGES.SERVER_RUNNING + PORT);
        });
    }

    handleRequest(req, res) {
        const q = url.parse(req.url, true);
        const path = q.pathname || "";

        if (req.method === "OPTIONS") {
            this.send(res, 204, null);
        } else if (req.method === "POST" && path === API_PATH) {
            this.handleInsert(req, res);
        } else if (req.method === "GET" && path.startsWith(API_PATH + "/")) {
            this.handleSelect(path, res);
        } else {
            this.send(res, 404, { error: MESSAGES.NOT_FOUND });
        }
    }

    handleInsert(req, res) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {
            try {
                const data = JSON.parse(body);
                if (!Array.isArray(data.patients)) {
                    this.send(res, 400, { error: MESSAGES.INVALID_BODY });
                    return;
                }
                const count = await this.db.insertPatients(data.patients);
                this.send(res, 201, { message: count + MESSAGES.INSERT_SUCCESS });
            } catch (err) {
                this.send(res, 400, { error: MESSAGES.ERROR_PREFIX + err.message });
            }
        });
    }

    async handleSelect(path, res) {
        try {
            let sql = decodeURIComponent(path.substring(API_PATH.length + 1)).trim();

            if (sql.startsWith('"') && sql.endsWith('"')) {
                sql = sql.slice(1, -1).trim();
            }
            if (sql === "") {
                this.send(res, 400, { error: MESSAGES.QUERY_EMPTY });
                return;
            }

            const rows = await this.db.runQuery(sql);
            this.send(res, 200, rows);
        } catch (err) {
            this.send(res, 400, { error: MESSAGES.ERROR_PREFIX + err.message });
        }
    }

    send(res, status, data) {
        res.writeHead(status, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end(data === null ? "" : JSON.stringify(data));
    }
}

const server = new Server(new Database());
server.start();