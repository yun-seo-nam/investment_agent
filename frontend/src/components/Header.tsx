'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Cpu, DollarSign } from 'lucide-react'

interface HeaderProps {
  sidebarCollapsed: boolean
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const [portfolioValue, setPortfolioValue] = useState(1247532.89)
  const [selectedTicker, setSelectedTicker] = useState('AAPL')
  const [vramUsage, setVramUsage] = useState(6.8)

  const tickers = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN']

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() - 0.5) * 1000)
      setVramUsage(prev => Math.min(8, Math.max(0.5, prev + (Math.random() - 0.5) * 0.2)))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.header 
      className="bg-gray-900 border-b border-gray-800 px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Portfolio Value */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-2 bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Portfolio Value</div>
              <motion.div 
                className="text-xl font-bold text-white"
                key={portfolioValue}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.div>
            </div>
          </motion.div>

          {/* Active Ticker Selector */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Active Ticker</div>
              <select 
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
                className="bg-transparent text-white font-semibold border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                {tickers.map(ticker => (
                  <option key={ticker} value={ticker} className="bg-gray-800">
                    {ticker}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          {/* GPU VRAM Usage */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">GPU VRAM</div>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-semibold text-white">
                  {vramUsage.toFixed(1)}GB / 8GB
                </div>
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(vramUsage / 8) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
