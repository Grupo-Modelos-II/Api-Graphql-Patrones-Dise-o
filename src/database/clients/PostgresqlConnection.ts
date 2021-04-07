import { Pool } from 'pg';
import { keys } from '../config/keys';
import ConnectionDatabase from "./Connection";
import { getIdDB, getUpdateText, getValueText, toArray } from '../functions/proccesData';

export default class PostgresqlConnection extends ConnectionDatabase {

    protected poolDatabase!: Pool;

    constructor() {
        super();
    }

    protected connect(): void {
        this.poolDatabase = new Pool(keys);
        this.poolDatabase.connect();
    }

    protected async query(queryString: string, data: any[] = []): Promise<any[]> {
        return (await this.poolDatabase.query(queryString, data)).rows;
    }

    public async getAll(table: string): Promise<any[]> {
        return await this.query(`SELECT * FROM ${table};`);
    }

    public async get(id: number | string, table: string): Promise<any> {
        return (await this.query(`SELECT * FROM ${table} WHERE ${getIdDB(table)} = $1;`, [id]))[0];
    }

    public async create(table: string, data: any): Promise<any> {
        return (await this.query(`INSERT INTO ${table}${getValueText(table, data)} RETURNING *;`, data.getArray()))[0];
    }

    public async delete(id: number | string, table: string): Promise<any> {
        return (await this.query(`DELETE FROM ${table} WHERE ${getIdDB(table)} = $1 RETURNING *;`, [id]))[0];
    }

    public async update(data: any, table: string): Promise<any> {
        return (await this.query(`UPDATE ${table} SET ${getUpdateText(table,data)} WHERE id = ? RETURNING *;`, toArray(table, data)))[0];
    }

}