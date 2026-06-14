import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Kanban, Target, ChevronRight } from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/board', icon: Kanban, label: 'Kanban Board' },
  { path: '/goals', icon: Target, label: 'Goals' },
]

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-full w-16 lg:w-56 z-30 flex flex-col py-6 px-3 glass border-r border-white/5"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(79,159,255,0.3), rgba(139,92,246,0.3))',
            border: '1px solid rgba(79,159,255,0.4)',
            boxShadow: '0 0 20px rgba(79,159,255,0.2)',
          }}
        >
          <Kanban size={18} className="text-blue-300" />
        </div>
        <span className="hidden lg:block text-gradient font-bold text-lg tracking-tight">PlannerX</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} end={path === '/'}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(79,159,255,0.12), rgba(139,92,246,0.08))',
                      boxShadow: '0 0 20px rgba(79,159,255,0.1)',
                    }}
                  />
                )}
                <Icon size={18} className="relative z-10 flex-shrink-0" />
                <span className="hidden lg:block relative z-10 text-sm font-medium">{label}</span>
                {isActive && (
                  <ChevronRight size={14} className="hidden lg:block ml-auto relative z-10 opacity-60" />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom avatar */}
      <div className="flex items-center gap-3 px-1 mt-4">
        <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
          style={{ border: '1px solid rgba(79,159,255,0.3)', boxShadow: '0 0 12px rgba(79,159,255,0.2)' }}
        >
          <div className="w-full h-full flex items-center justify-center text-blue-300 font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #1e2d55, #0f1a35)' }}
          >
            U
          </div>
        </div>
        <div className="hidden lg:block">
          <p className="text-xs font-medium text-slate-200">User</p>
          <p className="text-xs text-slate-500">Personal</p>
        </div>
      </div>
    </motion.aside>
  )
}
