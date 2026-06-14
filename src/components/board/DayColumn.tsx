import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { Task, DayId } from '../../types'
import { TaskCard } from './TaskCard'

interface DayColumnProps {
  dayId: DayId
  label: string
  tasks: Task[]
  isToday: boolean
  onAddTask: (day: DayId) => void
  onEditTask: (task: Task) => void
}

export function DayColumn({ dayId, label, tasks, isToday, onAddTask, onEditTask }: DayColumnProps) {
  const [hovered, setHovered] = useState(false)

  const { setNodeRef, isOver } = useDroppable({ id: dayId })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: 168,
        minHeight: 400,
        background: isOver
          ? 'rgba(79,159,255,0.08)'
          : 'rgba(10, 16, 32, 0.72)',
        backdropFilter: 'blur(20px)',
        border: isOver
          ? '1px solid rgba(79,159,255,0.4)'
          : isToday
          ? '1px solid rgba(79,159,255,0.25)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isToday
          ? '0 0 30px rgba(79,159,255,0.08), inset 0 1px 0 rgba(79,159,255,0.08)'
          : '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Column header */}
      <div
        className="px-3 py-3 border-b flex items-center justify-between"
        style={{
          borderColor: isToday ? 'rgba(79,159,255,0.15)' : 'rgba(255,255,255,0.04)',
          background: isToday ? 'rgba(79,159,255,0.06)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-2">
          <h3
            className="text-sm font-semibold"
            style={{ color: isToday ? '#93c5fd' : 'rgba(203,213,225,0.85)' }}
          >
            {label}
          </h3>
          {isToday && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{
                background: 'rgba(79,159,255,0.2)',
                color: '#93c5fd',
                border: '1px solid rgba(79,159,255,0.3)',
              }}
            >
              Today
            </span>
          )}
        </div>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: tasks.length > 0 ? 'rgba(79,159,255,0.15)' : 'rgba(255,255,255,0.05)',
            color: tasks.length > 0 ? '#93c5fd' : '#64748b',
          }}
        >
          {tasks.length}
        </div>
      </div>

      {/* Tasks list */}
      <div
        ref={setNodeRef}
        className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto"
        style={{ minHeight: 80 }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onEditTask(task)}
              />
            ))}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
            style={{ minHeight: 80 }}
          >
            <p className="text-xs text-slate-700 text-center">No tasks</p>
          </motion.div>
        )}
      </div>

      {/* Add task button */}
      <div className="p-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddTask(dayId)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
          style={{
            color: hovered ? '#93c5fd' : '#4a5568',
            background: hovered ? 'rgba(79,159,255,0.08)' : 'transparent',
            border: `1px dashed ${hovered ? 'rgba(79,159,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <Plus size={13} />
          Add task
        </motion.button>
      </div>
    </motion.div>
  )
}
