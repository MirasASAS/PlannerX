import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Calendar } from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'
import type { Task } from '../../types'
import { CATEGORIES } from '../../types'
import { format } from 'date-fns'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { searchTasks } = useTasks()

  const results: Task[] = query.length >= 2 ? searchTasks(query) : []
  const showDropdown = focused && query.length >= 2

  const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 glass sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative w-72">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl input-glass"
          style={{ minHeight: 38 }}
        >
          <Search size={15} className="text-slate-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            className="flex-1 bg-transparent text-sm text-slate-200 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden glass-card z-50"
              style={{ maxHeight: 320, overflowY: 'auto' }}
            >
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">No tasks found</div>
              ) : (
                <div className="p-2 flex flex-col gap-1">
                  {results.slice(0, 8).map((task) => {
                    const cat = catMap[task.category]
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: cat?.color, boxShadow: `0 0 6px ${cat?.glow}` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 truncate">{task.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Calendar size={10} className="text-slate-500" />
                            <span className="text-xs text-slate-500 capitalize">{task.day}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {results.length > 8 && (
                    <p className="text-center text-xs text-slate-500 py-2">
                      +{results.length - 8} more results
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
        <Calendar size={13} />
        <span>{format(new Date(), 'EEEE, d MMMM yyyy')}</span>
      </div>
    </header>
  )
}
