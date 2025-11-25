/**
 * Примеры использования Supabase клиента
 * Это файл для справки, не импортируйте его в production коде
 */

import { supabase, supabaseAdmin } from './supabase'

// ====================================================
// ПРИМЕРЫ РАБОТЫ С КОНТАКТАМИ
// ====================================================

// Получить все контакты
export async function getAllContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
  return data
}

// Добавить новый контакт
export async function addContact(contact: {
  name: string
  phone: string
  email?: string
  iin?: string
  doc_number?: string
}) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single()

  if (error) {
    console.error('Error adding contact:', error)
    return null
  }
  return data
}

// Обновить контакт
export async function updateContact(id: string, updates: Partial<{
  name: string
  phone: string
  email: string
  iin: string
  doc_number: string
  status: string
}>) {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating contact:', error)
    return null
  }
  return data
}

// Удалить контакт
export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  return !error
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С МОПЕДАМИ
// ====================================================

// Получить все мопеды
export async function getAllMopeds() {
  const { data, error } = await supabase
    .from('mopeds')
    .select('*')
    .order('brand', { ascending: true })

  if (error) {
    console.error('Error fetching mopeds:', error)
    return []
  }
  return data
}

// Получить доступные мопеды
export async function getAvailableMopeds() {
  const { data, error } = await supabase
    .from('mopeds')
    .select('*')
    .eq('status', 'available')
    .order('brand', { ascending: true })

  if (error) {
    console.error('Error fetching available mopeds:', error)
    return []
  }
  return data
}

// Добавить мопед
export async function addMoped(moped: {
  brand: string
  model: string
  license_plate: string
  photo?: string
  status: 'available' | 'rented' | 'maintenance'
}) {
  const { data, error } = await supabase
    .from('mopeds')
    .insert([moped])
    .select()
    .single()

  if (error) {
    console.error('Error adding moped:', error)
    return null
  }
  return data
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С СДЕЛКАМИ/АРЕНДАМИ
// ====================================================

// Получить все сделки
export async function getAllDeals() {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      mopeds (*),
      kanban_stages (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching deals:', error)
    return []
  }
  return data
}

// Получить сделки по стадии
export async function getDealsByStage(stageId: string) {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('stage', stageId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching deals by stage:', error)
    return []
  }
  return data
}

// Создать новую сделку
export async function createDeal(deal: {
  client_name: string
  phone: string
  stage: string
  source?: string
  manager?: string
  moped_id?: string
}) {
  const { data, error } = await supabase
    .from('deals')
    .insert([deal])
    .select()
    .single()

  if (error) {
    console.error('Error creating deal:', error)
    return null
  }
  return data
}

// Переместить сделку в другую стадию
export async function moveDealToStage(dealId: string, stageId: string) {
  const { data, error } = await supabase
    .from('deals')
    .update({ stage: stageId })
    .eq('id', dealId)
    .select()
    .single()

  if (error) {
    console.error('Error moving deal:', error)
    return null
  }
  return data
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С КАНБАН СТАДИЯМИ
// ====================================================

// Получить все стадии
export async function getAllStages() {
  const { data, error } = await supabase
    .from('kanban_stages')
    .select('*')
    .order('order_num', { ascending: true })

  if (error) {
    console.error('Error fetching stages:', error)
    return []
  }
  return data
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С КАНБАН ПОЛЯМИ
// ====================================================

// Получить все кастомные поля
export async function getAllCustomFields() {
  const { data, error } = await supabase
    .from('kanban_custom_fields')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching custom fields:', error)
    return []
  }
  return data
}

// Получить группы полей
export async function getFieldGroups() {
  const { data, error } = await supabase
    .from('kanban_field_groups')
    .select('*')
    .order('order_num', { ascending: true })

  if (error) {
    console.error('Error fetching field groups:', error)
    return []
  }
  return data
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С ШАБЛОНАМИ ДОКУМЕНТОВ
// ====================================================

// Получить все шаблоны
export async function getAllTemplates() {
  const { data, error } = await supabase
    .from('document_templates')
    .select('id, name, file_name, variables, document_type, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }
  return data
}

// Получить шаблон с контентом
export async function getTemplateWithContent(id: string) {
  const { data, error } = await supabase
    .from('document_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching template:', error)
    return null
  }
  return data
}

// Сохранить шаблон
export async function saveTemplate(template: {
  name: string
  file_name: string
  variables: string[]
  content: Buffer
  document_type?: string
}) {
  const { data, error } = await supabase
    .from('document_templates')
    .insert([{
      ...template,
      variables: template.variables
    }])
    .select()
    .single()

  if (error) {
    console.error('Error saving template:', error)
    return null
  }
  return data
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С СКЛАДАМИ И РЕСУРСАМИ
// ====================================================

// Получить все склады
export async function getAllWarehouses() {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching warehouses:', error)
    return []
  }
  return data
}

// Получить ресурсы склада
export async function getWarehouseResources(warehouseId: string) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('warehouse_id', warehouseId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }
  return data
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С ОТДЕЛАМИ И СОТРУДНИКАМИ
// ====================================================

// Получить все отделы
export async function getAllDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching departments:', error)
    return []
  }
  return data
}

// Получить всех сотрудников отдела
export async function getDepartmentEmployees(departmentId: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('department', departmentId)
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }
  return data
}

// ====================================================
// ПРИМЕРЫ РАБОТЫ С КОНТРАГЕНТАМИ
// ====================================================

// Получить всех контрагентов
export async function getAllCounterparties() {
  const { data, error } = await supabase
    .from('counterparties')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching counterparties:', error)
    return []
  }
  return data
}

// ====================================================
// ПРИМЕРЫ REALTIME ПОДПИСОК
// ====================================================

// Подписаться на изменения в сделках
export function subscribeToDeals(
  callback: (deal: any) => void
) {
  const channel = supabase
    .channel('deals-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'deals'
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Подписаться на изменения в мопедах
export function subscribeToMopeds(
  callback: (moped: any) => void
) {
  const channel = supabase
    .channel('mopeds-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'mopeds'
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
