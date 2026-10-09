// db/models/Robot.ts
//
// The product catalogue — the same `robots` collection F:/allbotix reads.
// This app only ever queries the single `id: 'cleaning-robots'` family
// document out of it, then filters that family's `models` array down to
// the two models this micro-site is scoped to (AT60s, AT20s Pro).
//
// Loose schema (`strict: false`): a robot family's shape varies by family
// and this is catalogue content read wholesale, not queried field-by-field.

import { Schema, model, models } from 'mongoose'

const RobotSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
  },
  { strict: false, timestamps: false }
)

export default models.Robot ?? model('Robot', RobotSchema, 'robots')
