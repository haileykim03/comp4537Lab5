# Lab 5

## Run everything locally (recommended)

You do not need an Aiven account, a database address, or a `.env` file to try
the assignment locally. Install and start Docker Desktop, then open a terminal
in this project folder and run:

```text
docker compose up --build
```

Wait until the API prints `Server is running on port 3000`. Then open
<http://localhost:8080> in your browser.

- **Insert sample patients** inserts the four required patients each time you
  press it.
- Enter `SELECT * FROM patient` and press **Submit query** to read the rows.
- The database is MySQL 8.4. Its data and the two restricted DB accounts are
  created automatically for local use.
- Open <http://localhost:3000/lab5/api/v1/sql/SELECT%20*%20FROM%20patient> to
  test the required GET endpoint directly.

Stop the services with `Ctrl+C`. To remove the local database and all inserted
rows as well, run `docker compose down -v`.

The credentials in `compose.yaml` and `server2/docker/init-local.sql` are only
for a database inside this local Docker setup. Do not reuse them for a hosted
database.

## Submit/deploy

The assignment asks for the client and API to be hosted on two different
origins. The local setup demonstrates the client at port 8080 and the API at
port 3000, but is not public hosting. For a hosted submission:

1. Create a MySQL database with your hosting provider and use its connection
   details. Do not use the local Docker credentials.
2. Run `server2/setup.sql` after replacing its `CHANGE_ME` passwords with
   strong passwords. Give the writer only `CREATE` and `INSERT`, and the
   reader only `SELECT`.
3. Set the matching `DB_*` environment variables on the API host. Use
   `DB_SSL=true` and the provider CA certificate when required.
4. Change `API_URL` in `server1/js/config.js` to the public API URL and host
   the `server1` folder separately from the API.

Never commit `server2/.env` or publish its credentials. Use
`server2/.env.example` as a reference for hosted environment variables.
