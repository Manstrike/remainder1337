const mysql = require('mysql2/promise');

export class DBConnection {
    async create () {
        if (this.connection) return;

        this.connection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_SCHEMA,
            port: 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

    }

    async execute (query) {
        if (!this.connection) await this.create();

        return await this.connection.execute(query);
    }
}