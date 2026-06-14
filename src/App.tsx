import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { KanbanBoard } from './components/board/KanbanBoard'
import { GoalsPage } from './components/goals/GoalsPage'
import { DashboardPage } from './components/dashboard/DashboardPage'

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 4,
  }))

  return (
    <div className="stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Your productivity overview' },
  '/board': { title: 'Kanban Board', subtitle: 'Mon – Sun task planner' },
  '/goals': { title: 'Goals', subtitle: 'Weekly, Monthly & Yearly goals' },
}

function AppLayout() {
  const location = useLocation()
  const meta = PAGE_META[location.pathname] ?? PAGE_META['/']

  return (
    <div className="flex h-screen overflow-hidden space-bg">
      <StarField />
      <Sidebar />

      <div className="flex-1 flex flex-col ml-16 lg:ml-56 relative z-10 overflow-hidden">
        <Header title={meta.title} subtitle={meta.subtitle} />

        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="h-full overflow-auto"
            >
              <Routes location={location}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/board" element={<KanbanBoard />} />
                <Route path="/goals" element={<GoalsPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
