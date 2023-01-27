import { IDatabase } from './IDatabase'
import { SQLiteDatabaseDriver } from './sqlite/SQLiteDatabaseDriver'

export const database: IDatabase = new SQLiteDatabaseDriver()
