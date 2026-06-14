import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Tag, Trash2 } from 'lucide-react'
import type { Task, DayId, CategoryColor } from '../../types'
import { DAYS, CATEGORIES } from '../../types'

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'order'>) => void
  onDelete?: () => void
  initial?: Task | null
  defaultDay?: DayId
}

export function TaskModal({ open, onClose, onSave, onDelete, initial, defaultDay }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CategoryColor>('blue')
  const [day, setDay] = useState<DayId>(defaultDay ?? 'monday')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description)
      setCategory(initial.category)
      setDay(initial.day)
      setTags(initial.tags)
    } else {
      setTitle('')
      setDescription('')
      setCategory('blue')
      setDay(defaultDay ?? 'monday')
      setTags([])
    }
    setTagInput('')
  }, [initial, defaultDay, open])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim(), category, day, tags })
    onClose()
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 0 60px rgba(79,159,255,0.15), 0 25px 50px rgba(0,0,0,0.6)' }}
          >
            {/* Glow top border */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-white font-semibold">{initial ? 'Edit Task' : 'New Task'}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Title */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Title *</label>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Task title..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm input-glass"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm input-glass resize-none"
                />
              </div>

              {/* Day & Category row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Day</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayId)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm input-glass appearance-none cursor-pointer"
                  >
                    {DAYS.map((d) => (
                      <option key={d.id} value={d.id} style={{ background: '#0a1020' }}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Category</label>
                  <div className="flex gap-2 flex-wrap pt-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        title={cat.label}
                        className="w-6 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                        style={{
                          background: cat.color,
                          boxShadow: category === cat.id ? `0 0 10px ${cat.glow}, 0 0 20px ${cat.glow}` : 'none',
                          transform: category === cat.id ? 'scale(1.25)' : 'scale(1)',
                          outline: category === cat.id ? `2px solid ${cat.color}` : 'none',
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Tags</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl input-glass">
                    <Tag size={13} className="text-slate-500" />
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                      placeholder="Add tag..."
                      className="flex-1 bg-transparent text-sm text-slate-200 outline-none"
                    />
                  </div>
                  <button
                    onClick={addTag}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-blue-300"
                        style={{ background: 'rgba(79,159,255,0.12)', border: '1px solid rgba(79,159,255,0.2)' }}
                      >
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="opacity-60 hover:opacity-100">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                    className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, rgba(79,159,255,0.4), rgba(139,92,246,0.4))',
                      border: '1px solid rgba(79,159,255,0.4)',
                      boxShadow: title.trim() ? '0 0 20px rgba(79,159,255,0.2)' : 'none',
                    }}
                  >
                    {initial ? 'Save Changes' : 'Create Task'}
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
