import { createDb, seedDb } from './repositories'

export const db = seedDb(createDb())
