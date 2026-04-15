'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, AlertTriangle, CheckCircle, XCircle, Info, Filter, Download, RotateCcw } from 'lucide-react'

// Mock log data
const generateLogs = () => {
  const logTypes = ['info', 'warning', 'error', 'success']
  const sources = ['trading-engine', 'ml-pipeline', 'data-ingestion', 'risk-manager', 'api-gateway']
  const messages = [
    'Position opened: AAPL 500 shares @ $178.42',
    'Model inference completed in 234ms',
    'Risk check passed: Position size within limits',
    'Data sync completed: 15,234 records processed',
    'GPU memory usage: 6.8GB / 8GB (85%)',
    'Connection established to market data feed',
    'Backtest completed: Win rate 68.4%, Sharpe 2.34',
    'Model deployment initiated: llama3-8b-lora-v1',
    'Order execution confirmed: ID #12345',
    'Portfolio rebalancing triggered',
    'Anomaly detected: Unusual volume pattern in NVDA',
    'System health check: All services operational',
    'Cache cleared: 1.2GB memory freed',
    'API rate limit approaching: 4500/5000 requests',
    'Stop loss triggered: TSLA position closed'
  ]

  const logs = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - i * 60000)
    const type = logTypes[Math.floor(Math.random() * logTypes.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    const message = messages[Math.floor(Math.random() * messages.length)]

    logs.push({
      id: `log-${i}`,
      timestamp,
      type,
      source,
      message,
      details: Math.random() > 0.7 ? {
        executionTime: Math.floor(Math.random() * 500) + 50,
        memoryUsage: Math.floor(Math.random() * 8192) + 1024,
        requestId: Math.random().toString(36).substring(7)
      } : null
    })
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export default function SystemLogs() {
  const [logs, setLogs] = useState(generateLogs())
  const [filteredLogs, setFilteredLogs] = useState(logs)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const logContainerRef = useRef<HTMLDivElement>(null)

  const sources = ['all', ...Array.from(new Set(logs.map(log => log.source)))]
  const types = ['all', 'info', 'warning', 'error', 'success']

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        type: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)],
        source: ['trading-engine', 'ml-pipeline', 'data-ingestion'][Math.floor(Math.random() * 3)],
        message: `Real-time system update... ${Math.random().toString(36).substring(7)}`,
        details: Math.random() > 0.7 ? {
          executionTime: Math.floor(Math.random() * 500) + 50,
          memoryUsage: Math.floor(Math.random() * 8192) + 1024,
          requestId: Math.random().toString(36).substring(7)
        } : null
      }

      setLogs(prev => [newLog, ...prev].slice(0, 100))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = logs

    if (selectedType !== 'all') {
      filtered = filtered.filter(log => log.type === selectedType)
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(log => log.source === selectedSource)
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [logs, selectedType, selectedSource, searchTerm])

  useEffect(() => {
    if (isAutoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0
    }
  }, [filteredLogs, isAutoScroll])

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />
      default: return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400 border-red-900/20'
      case 'warning': return 'text-yellow-400 border-yellow-900/20'
      case 'success': return 'text-green-400 border-green-900/20'
      default: return 'text-blue-400 border-blue-900/20'
    }
  }

  const clearLogs = () => {
    setLogs([])
    setFilteredLogs([])
  }

  const exportLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.type.toUpperCase()}] [${log.source}] ${log.message}`
    ).join('\n')

    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLogStats = () => {
    const stats = {
      total: filteredLogs.length,
      errors: filteredLogs.filter(log => log.type === 'error').length,
      warnings: filteredLogs.filter(log => log.type === 'warning').length,
      success: filteredLogs.filter(log => log.type === 'success').length,
      info: filteredLogs.filter(log => log.type === 'info').length
    }
    return stats
  }

  const stats = getLogStats()

  return (
    <div className="h-full p-4 bg-black">
      <div className="h-full bg-gray-900 rounded-lg border border-gray-800 flex flex-col">
        {/* Header */}
        <motion.div 
          className="p-4 border-b border-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Terminal className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">System Logs</h2>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAutoScroll(!isAutoScroll)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  isAutoScroll 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Auto-scroll: {isAutoScroll ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={exportLogs}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
              <button
                onClick={clearLogs}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Stats and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-medium">{stats.total}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-red-400">{stats.errors}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400">{stats.warnings}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">{stats.success}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400">{stats.info}</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-blue-500 w-48"
                />
                <Filter className="absolute right-2 top-1.5 w-3 h-3 text-gray-400" />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                {types.map(type => (
                  <option key={type} value={type} className="bg-gray-800">
                    {type === 'all' ? 'All Types' : type.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                {sources.map(source => (
                  <option key={source} value={source} className="bg-gray-800">
                    {source === 'all' ? 'All Sources' : source}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Logs Container */}
        <div 
          ref={logContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <AnimatePresence>
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-lg border ${getLogColor(log.type)} hover:bg-gray-800/50 transition-colors`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-xs text-gray-400">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">
                        {log.source}
                      </span>
                      {log.details && (
                        <span className="text-xs text-gray-400">
                          {log.details.executionTime}ms
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-100 break-all">
                      {log.message}
                    </div>
                    {log.details && (
                      <div className="mt-2 text-xs text-gray-400 space-x-3">
                        <span>Memory: {(log.details.memoryUsage / 1024).toFixed(1)}MB</span>
                        <span>Request: {log.details.requestId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Terminal className="w-12 h-12 mb-3 opacity-50" />
              <div className="text-sm">No logs found</div>
              <div className="text-xs mt-1">Try adjusting your filters</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
