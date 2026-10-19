const API_URL = "https://YOUR-APP.onrender.com/lab5/api/v1/sql";

const PATIENTS = [
    { name: "Sara Brown", dateOfBirth: "1901-01-01" },
    { name: "John Smith", dateOfBirth: "1941-01-01" },
    { name: "Jack Ma", dateOfBirth: "1961-01-30" },
    { name: "Elon Musk", dateOfBirth: "1999-01-01" }
];

class ApiClient {
    constructor(url) {
        this.url = url;
    }

    async insert(patients) {
        const response = await fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patients: patients })
        });
        return response.json();
    }

    async select(sql) {
        const response = await fetch(this.url + "/" + encodeURIComponent(sql));
        return response.json();
    }
}

class App {
    constructor(api) {
        this.api = api;
        this.insertBtn = document.getElementById("insertBtn");
        this.submitBtn = document.getElementById("submitBtn");
        this.queryInput = document.getElementById("queryInput");
        this.output = document.getElementById("response");
    }

    init() {
        document.title = STRINGS.TITLE;
        document.getElementById("title").textContent = STRINGS.TITLE;
        this.insertBtn.textContent = STRINGS.INSERT_BUTTON;
        this.submitBtn.textContent = STRINGS.SUBMIT_BUTTON;
        this.queryInput.placeholder = STRINGS.PLACEHOLDER;

        this.insertBtn.addEventListener("click", () => this.onInsert());
        this.submitBtn.addEventListener("click", () => this.onSubmit());
    }

    onInsert() {
        this.show(this.api.insert(PATIENTS));
    }

    onSubmit() {
        const sql = this.queryInput.value.trim();
        if (sql === "") {
            this.output.textContent = STRINGS.EMPTY_QUERY;
            return;
        }
        this.show(this.api.select(sql));
    }

    async show(request) {
        this.output.textContent = STRINGS.LOADING;
        try {
            const data = await request;
            this.output.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
            this.output.textContent = STRINGS.NETWORK_ERROR;
        }
    }
}

const app = new App(new ApiClient(API_URL));
app.init();