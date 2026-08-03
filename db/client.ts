import { drizzle } from 'drizzle-orm/expo-sqlite';

import * as SQLite from 'expo-sqlite';

import * as schema from './schema';
import { DATABASE_NAME } from '@/constants';

const sqliteDatabase = SQLite.openDatabaseSync(DATABASE_NAME);

export const database = drizzle(sqliteDatabase, { schema });
