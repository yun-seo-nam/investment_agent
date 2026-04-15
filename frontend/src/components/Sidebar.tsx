'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Cpu, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

interface SidebarProps {
  activeView: 'trading' | 'mlops' | 'logs'
  setActiveView: (view: 'trading' | 'mlops' | 'logs') => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }: SidebarProps) {
  const menuItems = [
    { id: 'trading', label: 'Live Trading', icon: TrendingUp },
    { id: 'mlops', label: 'MLOps Registry', icon: Cpu },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ]

  return (
    <motion.div
      className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300`}
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
    >
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.h1 
              className="text-xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              AI Terminal
            </motion.h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setActiveView(item.id as 'trading' | 'mlops' | 'logs')}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {!collapsed && (
            <span className="text-xs text-gray-400">System Online</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
