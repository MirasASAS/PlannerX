import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, TrendingUp, CheckCircle2, Calendar } from 'lucide-react'
import { useGoals } from '../../hooks/useGoals'
import type { Goal, GoalType } from '../../types'
import { GoalCard } from './GoalCard'
import { GoalModal } from './GoalModal'

const TABS: { id: GoalType; label: string; emoji: string; color: string }[] = [
  { id: 'weekly', label: 'Weekly Goals', emoji: '📅', color: '#4f9fff' },
  { id: 'monthly', label: 'Monthly Goals', emoji: '🗓️', color: '#8b5cf6' },
  { id: 'yearly', label: 'Yearly Goals', emoji: '🚀', color: '#06b6d4' },
]

export function GoalsPage() {
  const { getGoalsByType, getGoalStats, addGoal, updateGoal, deleteGoal } = useGoals()
  const [activeTab, setActiveTab] = useState<GoalType>('weekly')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const stats = getGoalStats()
  const currentGoals = getGoalsByType(activeTab)
  const activeTabMeta = TABS.find((t) => t.id === activeTab)!

  const handleSave = (data: Omit<Goal, 'id' | 'createdAt'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data)
    } else {
      addGoal(data)
    }
  }

  const handleDelete = () => {
    if (editingGoal) deleteGoal(editingGoal.id)
  }

  return (
    <div className="flex flex-col h-full px-6 py-4 overflow-y-auto">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Goals', value: stats.total, icon: Target, color: '#4f9fff' },
          { label: 'Avg Progress', value: `${stats.avgProgress}%`, icon: TrendingUp, color: '#8b5cf6' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: '#28c840' },
          { label: 'This Week', value: stats.byType.weekly, icon: Calendar, color: '#06b6d4' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-4 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs + Add button */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(10,16,32,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: activeTab === tab.id ? tab.color : '#64748b',
              }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeGoalTab"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `${tab.color}18`,
                    border: `1px solid ${tab.color}35`,
                  }}
                />
              )}
              <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              <span className="relative z-10 sm:hidden">{tab.emoji}</span>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => { setEditingGoal(null); setModalOpen(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, ${activeTabMeta.color}35, ${activeTabMeta.color}20)`,
            border: `1px solid ${activeTabMeta.color}50`,
            boxShadow: `0 0 20px ${activeTabMeta.color}20`,
          }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Goal</span>
        </motion.button>
      </div>

      {/* Goals grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {currentGoals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${activeTabMeta.color}15`, border: `1px solid ${activeTabMeta.color}25` }}
              >
                <Target size={28} style={{ color: activeTabMeta.color }} />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">No {activeTabMeta.label}</h3>
              <p className="text-sm text-slate-500 mb-6">Set your first goal and start tracking progress</p>
              <button
                onClick={() => { setEditingGoal(null); setModalOpen(true) }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{
                  background: `${activeTabMeta.color}25`,
                  border: `1px solid ${activeTabMeta.color}45`,
                }}
              >
                <Plus size={16} />
                Create Goal
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
              {currentGoals.map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={i}
                  onEdit={(g) => { setEditingGoal(g); setModalOpen(true) }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <GoalModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingGoal(null) }}
        onSave={handleSave}
        onDelete={editingGoal ? handleDelete : undefined}
        initial={editingGoal}
        defaultType={activeTab}
      />
    </div>
  )
}
