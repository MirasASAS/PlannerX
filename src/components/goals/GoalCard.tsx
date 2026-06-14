import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Calendar, ChevronDown, ChevronUp, Target } from 'lucide-react'
import type { Goal } from '../../types'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { useGoals } from '../../hooks/useGoals'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  index: number
}

export function GoalCard({ goal, onEdit, index }: GoalCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { toggleSubtask } = useGoals()

  const isOverdue = goal.deadline && isPast(new Date(goal.deadline)) && goal.progress < 100
  const completed = goal.progress === 100

  const completedSubtasks = goal.subtasks.filter((s) => s.completed).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: `1px solid ${goal.color}22`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${goal.color}08`,
      }}
      onClick={() => onEdit(goal)}
    >
      {/* Top color line */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}40)` }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${goal.color}18`,
                border: `1px solid ${goal.color}35`,
              }}
            >
              <Target size={14} style={{ color: goal.color }} />
            </div>
            <div className="min-w-0">
              <h3
                className={`font-semibold text-sm leading-tight truncate ${completed ? 'line-through text-slate-500' : 'text-slate-200'}`}
              >
                {goal.title}
              </h3>
              {goal.description && (
                <p className="text-xs text-slate-500 truncate mt-0.5">{goal.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {completed && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#28c840', boxShadow: '0 0 8px rgba(40,200,64,0.5)' }}
              >
                <Check size={11} className="text-white" />
              </div>
            )}
            <div
              className="text-xl font-bold tabular-nums"
              style={{ color: goal.color }}
            >
              {goal.progress}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 1, delay: index * 0.07 + 0.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${goal.color}, ${goal.color}aa)`,
                boxShadow: `0 0 8px ${goal.color}60`,
              }}
            />
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {goal.deadline && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
              <Calendar size={11} />
              <span>
                {isOverdue
                  ? `Overdue ${formatDistanceToNow(new Date(goal.deadline))} ago`
                  : format(new Date(goal.deadline), 'MMM d, yyyy')}
              </span>
            </div>
          )}
          {goal.subtasks.length > 0 && (
            <span className="ml-auto">
              {completedSubtasks}/{goal.subtasks.length} subtasks
            </span>
          )}
        </div>

        {/* Subtasks toggle */}
        {goal.subtasks.length > 0 && (
          <div className="mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? 'Hide' : 'Show'} subtasks
            </button>

            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="mt-2 flex flex-col gap-1.5">
                {goal.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 group"
                    onClick={(e) => { e.stopPropagation(); toggleSubtask(goal.id, subtask.id) }}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer transition-all"
                      style={{
                        background: subtask.completed ? goal.color : 'transparent',
                        border: `1.5px solid ${subtask.completed ? goal.color : 'rgba(100,116,139,0.4)'}`,
                      }}
                    >
                      {subtask.completed && <Check size={9} className="text-white" />}
                    </div>
                    <span
                      className={`text-xs transition-colors ${
                        subtask.completed ? 'line-through text-slate-600' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
