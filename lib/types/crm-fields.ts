export type FieldType = "text" | "number" | "flag" | "list" | "multilist" | "date"

export type CustomField = {
  id: string
  name: string
  type: FieldType
  required: boolean
  options?: string[] // For list and multilist types
  groupId?: string
}

export type FieldGroup = {
  id: string
  name: string
  order: number
}

export type FieldValue = {
  fieldId: string
  value: string | number | boolean | string[] | Date
}

export type DealWithFields = {
  id: string
  clientName: string
  phone: string
  stage: string
  source?: string
  manager?: string
  dates?: string
  dateStart?: string
  dateEnd?: string
  moped?: string
  mopedId?: string
  amount?: string
  paymentType?: string
  pricePerDay?: string
  depositAmount?: string
  contactName?: string
  contactIIN?: string
  contactDocNumber?: string
  contactPhone?: string
  contactStatus?: string
  emergencyContactName?: string
  emergencyContactIIN?: string
  emergencyContactDocNumber?: string
  emergencyContactPhone?: string
  emergencyContactStatus?: string
  createdAt: string
  status?: "not-started" | "in-research" | "on-track" | "complete"
  priority?: "low" | "medium" | "high"
  assignees?: string[]
  comments?: number
  links?: number
  tasks?: { completed: number; total: number }
  customFields?: FieldValue[]
  comment?: string
}

export type KanbanStage = {
  id: string
  name: string
  color: string
  order: number
}
