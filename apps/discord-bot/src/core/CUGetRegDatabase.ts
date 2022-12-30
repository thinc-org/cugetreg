import { IDatabase } from '../database/IDatabase'
import { SQLiteDatabaseDriver } from '../database/sqlite/SQLiteDatabaseDriver'

export const CUGetRegDatabase: IDatabase = new SQLiteDatabaseDriver()
