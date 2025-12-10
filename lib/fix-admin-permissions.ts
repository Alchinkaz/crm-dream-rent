/**
 * Утилита для принудительного обновления прав дефолтного администратора
 * 
 * Использование в консоли браузера:
 * await fixAdminPermissions()
 */

import { supabase } from './supabase'

const ALL_PERMISSIONS = [
  "dashboard",
  "finances",
  "motorcycles",
  "mopeds",
  "cars",
  "apartments",
  "clients",
  "projects",
  "settings",
  "help",
  "users",
]

const ALL_TAB_PERMISSIONS = {
  mopeds: [
    { tab: "rentals", access: "edit" },
    { tab: "inventory", access: "edit" },
    { tab: "contacts", access: "edit" },
  ],
  cars: [
    { tab: "rentals", access: "edit" },
    { tab: "inventory", access: "edit" },
    { tab: "contacts", access: "edit" },
  ],
  motorcycles: [
    { tab: "rentals", access: "edit" },
    { tab: "inventory", access: "edit" },
    { tab: "contacts", access: "edit" },
  ],
  apartments: [
    { tab: "rentals", access: "edit" },
    { tab: "inventory", access: "edit" },
    { tab: "contacts", access: "edit" },
  ],
}

export async function fixAdminPermissions(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        permissions: ALL_PERMISSIONS,
        tab_permissions: ALL_TAB_PERMISSIONS,
      })
      .eq('email', 'info@dreamrent.kz')
      .select()

    if (error) {
      return {
        success: false,
        message: `Ошибка: ${error.message}`,
      }
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'Пользователь info@dreamrent.kz не найден в базе данных',
      }
    }

    // Очищаем кэш
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crm_users_cache')
      localStorage.removeItem('crm_users_cache_timestamp')
      window.dispatchEvent(new Event('users-updated'))
    }

    return {
      success: true,
      message: 'Права дефолтного администратора успешно обновлены! Обновите страницу.',
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Ошибка: ${error.message || String(error)}`,
    }
  }
}

// Экспортируем функцию для использования в консоли браузера
if (typeof window !== 'undefined') {
  ;(window as any).fixAdminPermissions = fixAdminPermissions
}

