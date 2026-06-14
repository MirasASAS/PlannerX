import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { getDay } from 'date-fns'
import { useTasks } from '../../hooks/useTasks'
import { DAYS, type DayId, type Task } from '../../types'
import { DayColumn } from './DayColumn'
import { TaskCard } from './TaskCard'
import { TaskModal } from './TaskModal'

export function KanbanBoard() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, reorderTasks, getTasksByDay } = useTasks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultDay, setDefaultDay] = useState<DayId>('monday')
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const todayIndex = getDay(new Date())
  // JS getDay: 0=Sun, 1=Mon ... 6=Sat → map to our array index
  const todayDayId: DayId | null =
    todayIndex === 0 ? 'sunday' :
    todayIndex === 1 ? 'monday' :
    todayIndex === 2 ? 'tuesday' :
    todayIndex === 3 ? 'wednesday' :
    todayIndex === 4 ? 'thursday' :
    todayIndex === 5 ? 'friday' :
    'saturday'

  const handleOpenAdd = useCallback((day: DayId) => {
    setEditingTask(null)
    setDefaultDay(day)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((task: Task) => {
    setEditingTask(task)
    setDefaultDay(task.day)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
      if (editingTask) {
        updateTask(editingTask.id, data)
      } else {
        addTask(data)
      }
    },
    [editingTask, addTask, updateTask],
  )

  const handleDelete = useCallback(() => {
    if (editingTask) deleteTask(editingTask.id)
  }, [editingTask, deleteTask])

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }, [tasks])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // Check if over a column (day id)
    const isOverColumn = DAYS.some((d) => d.id === overId)
    if (isOverColumn && activeTask.day !== overId) {
      moveTask(activeId, overId as DayId)
    }

    // Check if over another task
    const overTask = tasks.find((t) => t.id === overId)
    if (overTask && overTask.day !== activeTask.day) {
      moveTask(activeId, overTask.day)
    }
  }, [tasks, moveTask])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)

    if (!activeTask) return

    if (overTask && activeTask.day === overTask.day) {
      const dayTasks = getTasksByDay(activeTask.day)
      const oldIdx = dayTasks.findIndex((t) => t.id === activeId)
      const newIdx = dayTasks.findIndex((t) => t.id === overId)
      if (oldIdx !== -1 && newIdx !== -1) {
        const reordered = arrayMove(dayTasks, oldIdx, newIdx)
        reorderTasks(activeTask.day, reordered.map((t) => t.id))
      }
    }
  }, [tasks, getTasksByDay, reorderTasks])

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm text-slate-400">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} this week
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleOpenAdd(todayDayId ?? 'monday')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{
            background: 'linear-gradient(135deg, rgba(79,159,255,0.35), rgba(139,92,246,0.35))',
            border: '1px solid rgba(79,159,255,0.4)',
            boxShadow: '0 0 20px rgba(79,159,255,0.2)',
          }}
        >
          <Plus size={16} />
          New Task
        </motion.button>
      </div>

      {/* Board */}
      <div className="flex-1 px-4 pb-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 min-w-max">
            {DAYS.map((day, idx) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.4 }}
              >
                <DayColumn
                  dayId={day.id}
                  label={day.label}
                  tasks={getTasksByDay(day.id)}
                  isToday={day.id === todayDayId}
                  onAddTask={handleOpenAdd}
                  onEditTask={handleOpenEdit}
                />
              </motion.div>
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div style={{ transform: 'rotate(3deg)', opacity: 0.9 }}>
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* FAB for mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleOpenAdd(todayDayId ?? 'monday')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg md:hidden z-40"
        style={{
          background: 'linear-gradient(135deg, #4f9fff, #8b5cf6)',
          boxShadow: '0 0 30px rgba(79,159,255,0.5)',
        }}
      >
        <Plus size={24} />
      </motion.button>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSave={handleSave}
        onDelete={editingTask ? handleDelete : undefined}
        initial={editingTask}
        defaultDay={defaultDay}
      />
    </div>
  )
}
