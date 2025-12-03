"use client"

import { supabase } from './supabase'

export type Contact = {
  id: string
  name: string
  phone: string
  email?: string | null
  iin?: string | null
  docNumber?: string | null
  status?: string
  photo?: string | null
  emergencyContactId?: string | null
  createdAt: string
}

// Map database column names to our type
function mapDbToContact(dbContact: any): Contact {
  return {
    id: dbContact.id,
    name: dbContact.name,
    phone: dbContact.phone,
    email: dbContact.email,
    iin: dbContact.iin,
    docNumber: dbContact.doc_number,
    status: dbContact.status,
    photo: dbContact.photo,
    emergencyContactId: dbContact.emergency_contact_id,
    createdAt: dbContact.created_at,
  }
}

// Map our type to database column names
function mapContactToDb(contact: Partial<Contact>): any {
  const dbContact: any = {}
  if (contact.name !== undefined) dbContact.name = contact.name
  if (contact.phone !== undefined) dbContact.phone = contact.phone
  if (contact.email !== undefined) dbContact.email = normalizeOptionalText(contact.email)
  if (contact.iin !== undefined) dbContact.iin = normalizeOptionalText(contact.iin)
  if (contact.docNumber !== undefined) dbContact.doc_number = normalizeOptionalText(contact.docNumber)
  if (contact.status !== undefined) dbContact.status = contact.status
  if (contact.photo !== undefined) dbContact.photo = normalizeOptionalText(contact.photo)
  if (contact.emergencyContactId !== undefined) {
    const value =
      contact.emergencyContactId && contact.emergencyContactId.trim() !== "" ? contact.emergencyContactId : null
    dbContact.emergency_contact_id = value
  }
  return dbContact
}

function normalizeOptionalText(value?: string | null) {
  if (value === undefined) return undefined
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function getContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts:', error)
      return []
    }

    return data.map(mapDbToContact)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
}

export async function addContact(contact: Omit<Contact, "id" | "createdAt">): Promise<Contact | null> {
  try {
    const dbContact = mapContactToDb(contact)
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([dbContact])
      .select()
      .single()

    if (error) {
      console.error('Error adding contact:', error)
      return null
    }

    return mapDbToContact(data)
  } catch (error) {
    console.error('Error adding contact:', error)
    return null
  }
}

export async function updateContact(id: string, updates: Partial<Omit<Contact, "id" | "createdAt">>): Promise<Contact | null> {
  try {
    const dbUpdates = mapContactToDb(updates)
    
    const { data, error } = await supabase
      .from('contacts')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      return null
    }

    return mapDbToContact(data)
  } catch (error) {
    console.error('Error updating contact:', error)
    return null
  }
}

export async function deleteContact(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting contact:', error)
    return false
  }
}

export async function findContactByNameOrPhone(name?: string, phone?: string): Promise<Contact | null> {
  try {
    if (!name && !phone) return null

    let query = supabase.from('contacts').select('*')

    if (name && phone) {
      query = query.or(`name.ilike.%${name}%,phone.eq.${phone}`)
    } else if (name) {
      query = query.ilike('name', `%${name}%`)
    } else if (phone) {
      query = query.eq('phone', phone)
    }

    const { data, error } = await query.single()

    if (error) {
      // No rows returned
      return null
    }

    return mapDbToContact(data)
  } catch (error) {
    console.error('Error finding contact:', error)
    return null
  }
}
