// db/connect.ts
//
// MongoDB connection singleton, via Mongoose.
//
// Next.js dev mode hot-reloads route modules on every change, which would
// open a fresh connection on every edit if we just called mongoose.connect()
// at module scope. Caching the promise on `globalThis` survives the reload
// and keeps one connection (or one in-flight connect) for the life of the
// process, in both dev and prod.

import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL ?? ''

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = globalThis.__mongooseCache ?? { conn: null, promise: null }
globalThis.__mongooseCache = cache

export async function dbConnect(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn

  if (!MONGODB_URI) {
    throw new Error('DATABASE_URL is not set. Add it to .env (or .env.local).')
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  try {
    cache.conn = await cache.promise
  } catch (err) {
    cache.promise = null
    throw err
  }

  return cache.conn
}
