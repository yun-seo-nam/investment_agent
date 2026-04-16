'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Brain, 
  FileText, 
  Menu, 
  X, 
  Cpu, 
  DollarSign, 
  Activity,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Settings,
  AlertCircle
} from 'lucide-react'
import { LiveTradingView } from '@/components/LiveTradingView'
import { MLOpsView } from '@/components/MLOpsView'
import { SystemLogsView } from '@/components/SystemLogsView'

type View = 'trading' | 'mlops' | 'logs'

interface SidebarItem {
  id: View
  label: string
  icon: React.ReactNode
  badge?: string | number
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>('trading')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [portfolioValue, setPortfolioValue] = useState(1247356.89)
  const [vramUsage, setVramUsage] = useState(6.8)
  const [activeTicker, setActiveTicker] = useState('AAPL')

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() - 0.5) * 1000)
      setVramUsage(prev => Math.min(8, Math.max(4, prev + (Math.random() - 0.5) * 0.2)))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const sidebarItems: SidebarItem[] = [
    {
      id: 'trading',
      label: 'Live Trading',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: 'ACTIVE'
    },
    {
      id: 'mlops',
      label: 'MLOps Registry',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'logs',
      label: 'System Logs',
      icon: <FileText className="w-4 h-4" />,
      badge: 3
    }
  ]

  const tickers = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'BTC']

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 240 }}
        className="bg-terminal-bg border-r border-terminal-border transition-all duration-300 ease-in-out"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`font-bold text-lg ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              AI Terminal
            </h1>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-terminal-border rounded transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                    : 'hover:bg-terminal-border text-terminal-gray'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span className="text-xs px-2 py-1 bg-accent-primary/20 text-accent-primary rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-terminal-bg border-b border-terminal-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Portfolio Value */}
              <div className="metric-card">
                <div className="metric-label">Portfolio Value</div>
                <div className="metric-value text-accent-primary">
                  ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Active Ticker */}
              <div className="flex items-center gap-3">
                <label className="text-terminal-gray text-sm">Active Ticker:</label>
                <select
                  value={activeTicker}
                  onChange={(e) => setActiveTicker(e.target.value)}
                  className="bg-terminal-border text-terminal-text px-3 py-1 rounded border border-terminal-border/50 focus:border-accent-primary outline-none"
                >
                  {tickers.map(ticker => (
                    <option key={ticker} value={ticker}>{ticker}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* VRAM Usage */}
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-terminal-gray" />
                <span className="text-sm text-terminal-gray">VRAM:</span>
                <span className={`text-sm font-medium ${
                  vramUsage > 7 ? 'text-accent-danger' : vramUsage > 5 ? 'text-accent-warning' : 'text-accent-primary'
                }`}>
                  {vramUsage.toFixed(1)}GB / 8GB
                </span>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-2">
                <div className="status-indicator status-online">
                  <Activity className="w-2 h-2" />
                  Agent Online
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeView === 'trading' && <LiveTradingView activeTicker={activeTicker} />}
              {activeView === 'mlops' && <MLOpsView />}
              {activeView === 'logs' && <SystemLogsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
