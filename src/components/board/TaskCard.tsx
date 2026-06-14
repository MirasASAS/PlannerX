import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Clock } from 'lucide-react'
import type { Task } from '../../types'
import { CATEGORIES } from '../../types'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [hovered, setHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const cat = CATEGORIES.find((c) => c.id === task.category)

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: sortableDragging ? 0.4 : 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative rounded-xl cursor-pointer overflow-hidden"
        style={{
          background: hovered
            ? 'rgba(25, 38, 75, 0.9)'
            : 'rgba(20, 30, 60, 0.75)',
          border: `1px solid ${hovered ? 'rgba(79,159,255,0.3)' : 'rgba(79,159,255,0.1)'}`,
          backdropFilter: 'blur(12px)',
          boxShadow: hovered
            ? `0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(79,159,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
        onClick={onClick}
      >
        {/* Top color accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${cat?.color}, transparent)`,
            opacity: hovered ? 1 : 0.5,
          }}
        />

        <div className="p-3">
          {/* Header row: dots + drag handle */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              {CATEGORIES.slice(0, 3).map((c) => {
                const isActive = c.id === task.category
                return (
                  <div
                    key={c.id}
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      background: c.color,
                      boxShadow: isActive ? `0 0 6px ${c.glow}` : 'none',
                      opacity: isActive ? 1 : 0.35,
                    }}
                  />
                )
              })}
              {/* Show extra category dots if purple/blue */}
              {(task.category === 'blue' || task.category === 'purple') && (
                <div
                  className="w-2.5 h-2.5 rounded-full ml-0.5 transition-all duration-300"
                  style={{
                    background: cat?.color,
                    boxShadow: `0 0 6px ${cat?.glow}`,
                  }}
                />
              )}
            </div>
            <div
              {...listeners}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 rounded text-slate-500 hover:text-slate-300"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={13} />
            </div>
          </div>

          {/* Title */}
          <p className="text-sm text-slate-200 font-medium leading-snug line-clamp-2 mb-2">
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded text-xs"
                  style={{
                    background: 'rgba(79,159,255,0.1)',
                    color: 'rgba(147,197,253,0.8)',
                    border: '1px solid rgba(79,159,255,0.15)',
                  }}
                >
                  #{tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-xs text-slate-600">+{task.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-1 mt-1">
            <Clock size={10} className="text-slate-600" />
            <span className="text-xs text-slate-600">
              {format(new Date(task.createdAt), 'MMM d')}
            </span>
            <div
              className="ml-auto px-1.5 py-0.5 rounded text-xs"
              style={{
                background: `${cat?.color}18`,
                color: cat?.color,
                border: `1px solid ${cat?.color}30`,
              }}
            >
              {cat?.label}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
