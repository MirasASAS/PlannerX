import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Check } from 'lucide-react'
import type { Goal, GoalType, Subtask } from '../../types'
import { GOAL_COLORS } from '../../types'
import { format } from 'date-fns'

interface GoalModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Goal, 'id' | 'createdAt'>) => void
  onDelete?: () => void
  initial?: Goal | null
  defaultType?: GoalType
}

export function GoalModal({ open, onClose, onSave, onDelete, initial, defaultType = 'weekly' }: GoalModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<GoalType>(defaultType)
  const [color, setColor] = useState(GOAL_COLORS[0])
  const [deadline, setDeadline] = useState('')
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [subtaskInput, setSubtaskInput] = useState('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description)
      setType(initial.type)
      setColor(initial.color)
      setDeadline(initial.deadline ? format(new Date(initial.deadline), 'yyyy-MM-dd') : '')
      setSubtasks(initial.subtasks)
    } else {
      setTitle('')
      setDescription('')
      setType(defaultType)
      setColor(GOAL_COLORS[0])
      setDeadline('')
      setSubtasks([])
    }
    setSubtaskInput('')
  }, [initial, defaultType, open])

  const calcProgress = () => {
    if (subtasks.length === 0) return 0
    return Math.round((subtasks.filter((s) => s.completed).length / subtasks.length) * 100)
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      type,
      color,
      deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
      subtasks,
      progress: calcProgress(),
    })
    onClose()
  }

  const addSubtask = () => {
    const t = subtaskInput.trim()
    if (!t) return
    setSubtasks((prev) => [...prev, { id: crypto.randomUUID(), title: t, completed: false }])
    setSubtaskInput('')
  }

  const toggleSubtask = (id: string) =>
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)))

  const removeSubtask = (id: string) =>
    setSubtasks((prev) => prev.filter((s) => s.id !== id))

  const typeLabels: Record<GoalType, string> = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            style={{ boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 25px 50px rgba(0,0,0,0.6)' }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
              <h2 className="text-white font-semibold">{initial ? 'Edit Goal' : 'New Goal'}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              {/* Title */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Title *</label>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Goal title..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm input-glass"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What do you want to achieve?"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm input-glass resize-none"
                />
              </div>

              {/* Type & Deadline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Type</label>
                  <div className="flex gap-1">
                    {(['weekly', 'monthly', 'yearly'] as GoalType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: type === t ? `${color}25` : 'rgba(255,255,255,0.04)',
                          border: type === t ? `1px solid ${color}60` : '1px solid rgba(255,255,255,0.06)',
                          color: type === t ? color : '#64748b',
                        }}
                      >
                        {typeLabels[t].slice(0, 1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs input-glass"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {GOAL_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-full transition-all duration-200"
                      style={{
                        background: c,
                        transform: color === c ? 'scale(1.25)' : 'scale(1)',
                        outline: color === c ? `2px solid ${c}` : 'none',
                        outlineOffset: 2,
                        boxShadow: color === c ? `0 0 12px ${c}80` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }}
                    placeholder="Add subtask..."
                    className="flex-1 px-3 py-2 rounded-xl text-sm input-glass"
                  />
                  <button
                    onClick={addSubtask}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                  {subtasks.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/3 group">
                      <button
                        onClick={() => toggleSubtask(s.id)}
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: s.completed ? color : 'transparent',
                          border: `1.5px solid ${s.completed ? color : 'rgba(100,116,139,0.5)'}`,
                        }}
                      >
                        {s.completed && <Check size={10} className="text-white" />}
                      </button>
                      <span className={`text-sm flex-1 ${s.completed ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                        {s.title}
                      </span>
                      <button
                        onClick={() => removeSubtask(s.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                {onDelete ? (
                  <button
                    onClick={() => { onDelete(); onClose() }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/15 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!title.trim()}
                    className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-40"
                    style={{
                      background: `linear-gradient(135deg, ${color}50, ${color}30)`,
                      border: `1px solid ${color}60`,
                      boxShadow: title.trim() ? `0 0 20px ${color}30` : 'none',
                    }}
                  >
                    {initial ? 'Save Changes' : 'Create Goal'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
