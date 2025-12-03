import { supabase } from './supabase'

export type Moped = {
  id: string
  brand: string
  model: string
  licensePlate: string
  photo?: string
  status: "available" | "rented" | "maintenance"
  grnz?: string
  vinCode?: string
  color?: string
  mileage?: number | string
  condition?: "new" | "good" | "broken"
  insuranceDate?: string
  techInspectionDate?: string
  createdAt: string
}

// Simple in-memory cache to avoid repeated full fetches per card/modal
let mopedCache: Map<string, Moped> | null = null
let mopedCacheTimestamp = 0
const MOPED_CACHE_TTL_MS = 60_000

// Map database column names to our type
function mapDbToMoped(dbMoped: any): Moped {
  return {
    id: dbMoped.id,
    brand: dbMoped.brand,
    model: dbMoped.model,
    licensePlate: dbMoped.license_plate,
    photo: dbMoped.photo,
    status: dbMoped.status,
    grnz: dbMoped.grnz,
    vinCode: dbMoped.vin_code,
    color: dbMoped.color,
    mileage: dbMoped.mileage,
    condition: dbMoped.condition,
    insuranceDate: dbMoped.insurance_date,
    techInspectionDate: dbMoped.tech_inspection_date,
    createdAt: dbMoped.created_at,
  }
}

// Map our type to database column names
function mapMopedToDb(moped: Partial<Moped>): any {
  const dbMoped: any = {}
  if (moped.brand !== undefined) dbMoped.brand = moped.brand
  if (moped.model !== undefined) dbMoped.model = moped.model
  if (moped.licensePlate !== undefined) dbMoped.license_plate = moped.licensePlate
  if (moped.photo !== undefined) dbMoped.photo = moped.photo
  if (moped.status !== undefined) dbMoped.status = moped.status
  if (moped.grnz !== undefined) dbMoped.grnz = moped.grnz
  if (moped.vinCode !== undefined) dbMoped.vin_code = moped.vinCode
  if (moped.color !== undefined) dbMoped.color = moped.color
  if (moped.mileage !== undefined) dbMoped.mileage = moped.mileage
  if (moped.condition !== undefined) dbMoped.condition = moped.condition
  if (moped.insuranceDate !== undefined) dbMoped.insurance_date = moped.insuranceDate
  if (moped.techInspectionDate !== undefined) dbMoped.tech_inspection_date = moped.techInspectionDate
  return dbMoped
}

export async function getMopeds(): Promise<Moped[]> {
  try {
    const { data, error } = await supabase
      .from('mopeds')
      .select('*')
      .order('brand', { ascending: true })

    if (error) {
      console.error('Error fetching mopeds:', error)
      return []
    }

    const mapped = data.map(mapDbToMoped)
    // refresh cache
    mopedCache = new Map(mapped.map((m: Moped) => [m.id, m]))
    mopedCacheTimestamp = Date.now()
    return mapped
  } catch (error) {
    console.error('Error fetching mopeds:', error)
    return []
  }
}

export async function getMopedByIdCached(id: string): Promise<Moped | null> {
  try {
    const cacheValid = mopedCache && Date.now() - mopedCacheTimestamp < MOPED_CACHE_TTL_MS
    if (!cacheValid) {
      const all = await getMopeds()
      mopedCache = new Map(all.map((m) => [m.id, m]))
      mopedCacheTimestamp = Date.now()
    }
    return (mopedCache && mopedCache.get(id)) || null
  } catch (e) {
    console.error('Error reading cached moped by id:', e)
    return null
  }
}

export async function saveMopeds(mopeds: Moped[]): Promise<void> {
  // This function is not really needed with Supabase, but kept for compatibility
  // We'll update each moped individually or in batch
  try {
    for (const moped of mopeds) {
      const dbMoped = mapMopedToDb(moped)
      await supabase
        .from('mopeds')
        .update(dbMoped)
        .eq('id', moped.id)
    }
  } catch (error) {
    console.error('Error saving mopeds:', error)
  }
}

export async function addMoped(moped: Omit<Moped, "id" | "createdAt">): Promise<Moped | null> {
  try {
    const dbMoped = mapMopedToDb(moped)
    
    const { data, error } = await supabase
      .from('mopeds')
      .insert([dbMoped])
      .select()
      .single()

    if (error) {
      console.error('Error adding moped:', error)
      return null
    }

    return mapDbToMoped(data)
  } catch (error) {
    console.error('Error adding moped:', error)
    return null
  }
}

export async function updateMoped(id: string, updates: Partial<Omit<Moped, "id" | "createdAt">>): Promise<void> {
  try {
    const dbUpdates = mapMopedToDb(updates)
    
    const { error } = await supabase
      .from('mopeds')
      .update(dbUpdates)
      .eq('id', id)

    if (error) {
      console.error('Error updating moped:', error)
    }
  } catch (error) {
    console.error('Error updating moped:', error)
  }
}

export async function deleteMoped(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('mopeds')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting moped:', error)
    }
  } catch (error) {
    console.error('Error deleting moped:', error)
  }
}
