// db/queries/clients.ts
//
// Read-side helper for the Client collection — the same one F:/allbotix
// reads, filtered here into the client/partner split `type` already carries
// in the stored documents.

import { cache } from 'react'
import { dbConnect } from '@db/connect'
import Client from '@db/models/Client'

export type ClientDoc = {
  id: number
  name: string
  icon: string
  description: string
  link: string
  type: 'client' | 'partner'
}

export const getClients = cache(async (): Promise<ClientDoc[]> => {
  await dbConnect()
  const docs = await Client.find({}).sort({ id: 1 }).lean()
  return JSON.parse(JSON.stringify(docs))
})

export async function getClientList(): Promise<ClientDoc[]> {
  return (await getClients()).filter((c) => c.type === 'client')
}

export async function getPartnerList(): Promise<ClientDoc[]> {
  return (await getClients()).filter((c) => c.type === 'partner')
}
