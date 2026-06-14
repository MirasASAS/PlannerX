import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Layers,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
  Clock,
  Zap,
} from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'
import { useGoals } from '../../hooks/useGoals'
import { CATEGORIES, DAYS } from '../../types'
import { format, getDay } from 'date-fns'

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  subtitle,
  index,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  color: string
  subtitle?: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
      style={{ border: `1px solid ${color}18` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}28` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.07 + 0.2, type: 'spring' }}
          className="text-3xl font-bold text-white tabular-nums"
        >
          {value}
        </motion.div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-300">{label}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  )
}

function MiniProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
      />
    </div>
  )
}

export function DashboardPage() {
  const { tasks, getStats } = useTasks()
  const { goals, getGoalStats } = useGoals()

  const taskStats = getStats()
  const goalStats = getGoalStats()

  const todayIndex = getDay(new Date())
  const todayDayId =
    todayIndex === 0 ? 'sunday' :
    todayIndex === 1 ? 'monday' :
    todayIndex === 2 ? 'tuesday' :
    todayIndex === 3 ? 'wednesday' :
    todayIndex === 4 ? 'thursday' :
    todayIndex === 5 ? 'friday' : 'saturday'

  const todayTasks = tasks.filter((t) => t.day === todayDayId)
  const doneTasks = tasks.filter((t) => t.category === 'green').length
  const urgentTasks = tasks.filter((t) => t.category === 'red').length

  const maxDayCount = Math.max(...DAYS.map((d) => taskStats.byDay[d.id] || 0), 1)

  return (
    <div className="flex flex-col gap-6 px-6 py-4 overflow-y-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 80% 50%, rgba(79,159,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Welcome back! 👋
            </h2>
            <p className="text-slate-400 text-sm">
              {format(new Date(), "EEEE, MMMM d, yyyy")} · You have{' '}
              <span className="text-blue-400 font-medium">{todayTasks.length}</span> tasks today
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            {urgentTasks > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
                style={{ background: 'rgba(255,95,87,0.12)', border: '1px solid rgba(255,95,87,0.25)', color: '#ff5f57' }}
              >
                <AlertCircle size={14} />
                {urgentTasks} urgent
              </div>
            )}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
              style={{ background: 'rgba(40,200,64,0.1)', border: '1px solid rgba(40,200,64,0.2)', color: '#28c840' }}
            >
              <CheckCircle2 size={14} />
              {doneTasks} done
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Tasks" value={taskStats.total} icon={Layers} color="#4f9fff" subtitle="This week" index={0} />
        <StatCard label="Completed" value={doneTasks} icon={CheckCircle2} color="#28c840" subtitle={`${taskStats.total > 0 ? Math.round((doneTasks / taskStats.total) * 100) : 0}% done`} index={1} />
        <StatCard label="Total Goals" value={goalStats.total} icon={Target} color="#8b5cf6" subtitle={`${goalStats.completed} completed`} index={2} />
        <StatCard label="Avg Progress" value={`${goalStats.avgProgress}%`} icon={TrendingUp} color="#06b6d4" subtitle="Goals progress" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tasks by day bar chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-200">Tasks by Day</h3>
          </div>
          <div className="flex items-end gap-2 h-32">
            {DAYS.map((day, i) => {
              const count = taskStats.byDay[day.id] || 0
              const height = maxDayCount > 0 ? (count / maxDayCount) * 100 : 0
              const isToday = day.id === todayDayId
              return (
                <div key={day.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500 tabular-nums">{count}</span>
                  <div className="w-full flex items-end" style={{ height: 80 }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, count > 0 ? 8 : 0)}%` }}
                      transition={{ delay: i * 0.05 + 0.4, duration: 0.5, ease: 'easeOut' }}
                      className="w-full rounded-t-md"
                      style={{
                        background: isToday
                          ? 'linear-gradient(180deg, #4f9fff, #4f9fff80)'
                          : 'linear-gradient(180deg, rgba(79,159,255,0.4), rgba(79,159,255,0.1))',
                        boxShadow: isToday ? '0 0 10px rgba(79,159,255,0.4)' : 'none',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: isToday ? '#93c5fd' : '#475569' }}
                  >
                    {day.label.slice(0, 2)}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Tasks by category */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">Tasks by Category</h3>
          </div>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat, i) => {
              const count = taskStats.byCategory[cat.id] || 0
              const pct = taskStats.total > 0 ? (count / taskStats.total) * 100 : 0
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: cat.color, boxShadow: `0 0 6px ${cat.glow}` }}
                  />
                  <span className="text-xs text-slate-400 w-20 flex-shrink-0">{cat.label}</span>
                  <div className="flex-1">
                    <MiniProgressBar value={pct} color={cat.color} />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right tabular-nums">{count}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Today's tasks + Goals overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
        {/* Today's tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">Today's Tasks</h3>
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(79,159,255,0.12)', color: '#93c5fd', border: '1px solid rgba(79,159,255,0.2)' }}
            >
              {todayTasks.length}
            </span>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-6">No tasks for today</p>
          ) : (
            <div className="flex flex-col gap-2">
              {todayTasks.slice(0, 5).map((task, i) => {
                const cat = CATEGORIES.find((c) => c.id === task.category)
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.5 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: cat?.color, boxShadow: `0 0 6px ${cat?.glow}` }}
                    />
                    <span className="text-sm text-slate-300 truncate flex-1">{task.title}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: `${cat?.color}15`, color: cat?.color }}
                    >
                      {cat?.label}
                    </span>
                  </motion.div>
                )
              })}
              {todayTasks.length > 5 && (
                <p className="text-xs text-slate-600 text-center">+{todayTasks.length - 5} more</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Goals overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">Goals Overview</h3>
          </div>
          {goals.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-6">No goals set yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {goals.slice(0, 5).map((goal, i) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.55 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300 truncate flex-1">{goal.title}</span>
                    <span className="text-xs font-bold ml-2 tabular-nums" style={{ color: goal.color }}>
                      {goal.progress}%
                    </span>
                  </div>
                  <MiniProgressBar value={goal.progress} color={goal.color} />
                </motion.div>
              ))}
              {goals.length > 5 && (
                <p className="text-xs text-slate-600 text-center">+{goals.length - 5} more goals</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
