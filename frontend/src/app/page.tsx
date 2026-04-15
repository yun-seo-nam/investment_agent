'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import AgentLiveTrading from '@/components/AgentLiveTrading'
import MLOpsLab from '@/components/MLOpsLab'
import SystemLogs from '@/components/SystemLogs'

export default function Home() {
  const [activeView, setActiveView] = useState<'trading' | 'mlops' | 'logs'>('trading')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-black text-gray-100 flex">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col">
        <Header sidebarCollapsed={sidebarCollapsed} />
        
        <motion.div 
          className="flex-1 overflow-hidden"
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'trading' && <AgentLiveTrading />}
          {activeView === 'mlops' && <MLOpsLab />}
          {activeView === 'logs' && <SystemLogs />}
        </motion.div>
      </div>
    </div>
  )
}
