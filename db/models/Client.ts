// db/models/Client.ts
//
// The same `clients` collection F:/allbotix reads — one Mongo database
// shared by both apps. This site only ever reads it (trust signals on the
// landing page), never writes to it.

import { Schema, model, models } from 'mongoose'

const ClientSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
  },
  { strict: false, timestamps: false }
)

export default models.Client ?? model('Client', ClientSchema, 'clients')
