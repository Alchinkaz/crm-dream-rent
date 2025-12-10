/**
 * Скрипт для миграции пользователей из localStorage в Supabase
 * 
 * Использование:
 * 1. Откройте консоль браузера на странице приложения
 * 2. Выполните: await migrateUsersToSupabase()
 * 
 * Или добавьте кнопку в интерфейс для запуска миграции
 */

import { supabase } from './supabase'
import type { AppUser } from './users-store'

export async function migrateUsersToSupabase(): Promise<{ success: boolean; migrated: number; errors: string[] }> {
  if (typeof window === 'undefined') {
    return { success: false, migrated: 0, errors: ['Миграция доступна только в браузере'] }
  }

  const errors: string[] = []
  let migrated = 0

  try {
    // Читаем пользователей из localStorage
    const stored = localStorage.getItem('crm_users')
    if (!stored) {
      return { success: false, migrated: 0, errors: ['Нет данных пользователей в localStorage'] }
    }

    const users = JSON.parse(stored) as AppUser[]

    if (!Array.isArray(users) || users.length === 0) {
      return { success: false, migrated: 0, errors: ['Нет пользователей для миграции'] }
    }

    console.log(`Найдено ${users.length} пользователей для миграции`)

    // Мигрируем каждого пользователя
    for (const user of users) {
      try {
        // Проверяем, существует ли пользователь с таким email
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email.trim().toLowerCase())
          .single()

        if (existing) {
          console.log(`Пользователь ${user.email} уже существует в Supabase, пропускаем`)
          continue
        }

        // Добавляем пользователя в Supabase
        const { error } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              name: user.name,
              email: user.email.trim().toLowerCase(),
              password: user.password,
              role: user.role,
              permissions: user.permissions || [],
              tab_permissions: user.tabPermissions || {},
              created_at: user.createdAt || new Date().toISOString(),
            },
          ])

        if (error) {
          const errorMsg = `Ошибка при миграции ${user.email}: ${error.message}`
          console.error(errorMsg)
          errors.push(errorMsg)
        } else {
          console.log(`Пользователь ${user.email} успешно мигрирован`)
          migrated++
        }
      } catch (error: any) {
        const errorMsg = `Ошибка при миграции ${user.email}: ${error.message || String(error)}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    // Очищаем кэш после миграции
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crm_users_cache')
      localStorage.removeItem('crm_users_cache_timestamp')
      window.dispatchEvent(new Event('users-updated'))
    }

    return {
      success: errors.length === 0,
      migrated,
      errors,
    }
  } catch (error: any) {
    return {
      success: false,
      migrated,
      errors: [`Критическая ошибка: ${error.message || String(error)}`],
    }
  }
}

// Экспортируем функцию для использования в консоли браузера
if (typeof window !== 'undefined') {
  ;(window as any).migrateUsersToSupabase = migrateUsersToSupabase
}

