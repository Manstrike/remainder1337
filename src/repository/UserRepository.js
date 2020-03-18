export class UserRepository {
    constructor ({connection}) {
        this.table = 'users';
        this.connection = connection;
    }

    async create ({chatId, username}) {
        console.log({chatId, username});

        if (!chatId || !username) return 'No data specified!';
        try {
            await this.connection.execute([
                'INSERT INTO',
                `${this.table} (chatId, username)`,
                'VALUES', 
                `(${chatId}, "${username}")`
            ].join(' '));

            return 'User was added!';
        } catch (e) {

            return `Error: ${e}`;
        
        }
    }

    async update ({chatId, ...arghs}) {
        if (!chatId) return;

        const fields = Object.keys(arghs);

        for (const field of fields) {
            try {
                await this.connection.execute(`
                    UPDATE 
                        ${this.table}
                    SET 
                        ${field} = ${this.wrapWithQuotes(arghs[field])}
                    WHERE 
                        chatId = ${chatId}
                `);

                return 'Updated.';
            } catch (e) {
                return `Error: ${e}`;
            }
        }
    }

    async read ({row, value}) {  
        try {
            return await this.connection.execute(`
                SELECT * 
                FROM 
                    ${this.table}
                WHERE 
                    ${row} = ${this.wrapWithQuotes(value)}
            `);
        } catch (e) {
            return 'Error: ' + e;
        }
    }

    async delete ({chatId}) {
        try {
            await this.connection.execute(`
                DELETE FROM 
                    ${this.table}
                WHERE 
                    chatId = ${chatId}
            `);

            return 'Deleted.';
        } catch (e) {
            return 'Error: ' + e;
        }
    }

    
    wrapWithQuotes (value) {
        if (typeof value === 'string') {
            return `"${value}"`;
        }

        return value;
    }
}
