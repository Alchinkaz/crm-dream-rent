-- =====================================================
-- SQL команды для исправления foreign key constraint
-- для kanban_stages в таблице deals
-- =====================================================
-- Скопируйте и вставьте в SQL Editor в Supabase
-- =====================================================

-- Удаляем существующий foreign key constraint
ALTER TABLE deals 
DROP CONSTRAINT IF EXISTS deals_stage_fkey;

-- Добавляем новый foreign key с ON DELETE CASCADE
-- Это позволит удалять стадии, а сделки с этими стадиями
-- будут автоматически обновлены на первую доступную стадию
-- или мы обработаем это в коде

-- Сначала изменим колонку stage на nullable временно
-- (Но stage NOT NULL, так что лучше использовать другой подход)

-- Вместо этого используем ON DELETE SET NULL и делаем stage nullable
-- ИЛИ используем триггер для обработки удаления

-- Лучший вариант: используем ON DELETE RESTRICT и обрабатываем в коде
-- ИЛИ обновляем deals перед удалением стадии (что мы уже делаем в коде)

-- Добавляем новый foreign key с ON DELETE RESTRICT (по умолчанию)
-- Это предотвратит удаление стадии, если она используется в deals
-- Но мы обрабатываем это в коде, обновляя deals перед удалением
ALTER TABLE deals 
ADD CONSTRAINT deals_stage_fkey 
FOREIGN KEY (stage) 
REFERENCES kanban_stages(id) 
ON DELETE RESTRICT;

-- =====================================================
-- Альтернативный вариант (если хотите автоматическое удаление):
-- =====================================================
-- Если хотите, чтобы при удалении стадии сделки автоматически
-- перемещались на другую стадию, используйте триггер:

-- Создаем функцию для обработки удаления стадии
CREATE OR REPLACE FUNCTION handle_stage_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем все сделки с удаленной стадией на первую доступную
  UPDATE deals 
  SET stage = (
    SELECT id FROM kanban_stages 
    WHERE id != OLD.id 
    ORDER BY order_num ASC 
    LIMIT 1
  )
  WHERE stage = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер перед удалением стадии
DROP TRIGGER IF EXISTS before_stage_delete ON kanban_stages;
CREATE TRIGGER before_stage_delete
BEFORE DELETE ON kanban_stages
FOR EACH ROW
EXECUTE FUNCTION handle_stage_deletion();

-- Теперь можно удалять стадии, и сделки автоматически переместятся
-- на первую доступную стадию

-- =====================================================
-- Примечание:
-- =====================================================
-- Триггер автоматически обработает удаление стадий.
-- Если хотите использовать подход в коде (без триггера),
-- оставьте только ADD CONSTRAINT команду выше.
