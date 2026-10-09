// db/queries/robots.ts
//
// Read-side helpers for the Robot collection, scoped to this micro-site's
// one family (`cleaning-robots`) and, within it, to the two models the site
// is about: AT60s ("Bungalow Cleaner") and AT20s Pro ("Flat Cleaner").

import { cache } from 'react'
import { dbConnect } from '@db/connect'
import Robot from '@db/models/Robot'

/** Loose on purpose — see db/models/Robot.ts. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RobotDoc = Record<string, any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RobotModel = Record<string, any>

/** The ids of the two models this site covers, T60 first then T20. */
const CLEANING_MODEL_IDS = ['at60s', 'at20s-pro'] as const

/** The `cleaning-robots` family document. Request-memoized via React's
 *  `cache()` so every component calling this in the same render shares one
 *  query instead of one each. */
export const getCleaningRobotFamily = cache(async (): Promise<RobotDoc | null> => {
  await dbConnect()
  const doc = await Robot.findOne({ id: 'cleaning-robots' }).lean()
  if (!doc) return null
  return JSON.parse(JSON.stringify(doc))
})

/** The family's `models` array, filtered down to AT60s and AT20s Pro, in
 *  that order — regardless of the order they're stored in. */
export function getCleaningModels(family: RobotDoc): RobotModel[] {
  const models: RobotModel[] = Array.isArray(family.models) ? family.models : []
  return CLEANING_MODEL_IDS
    .map((id) => models.find((m) => m.id === id))
    .filter((m): m is RobotModel => Boolean(m))
}
