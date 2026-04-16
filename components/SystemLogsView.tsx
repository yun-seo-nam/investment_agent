'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  Trash2,
  Terminal
} from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  module: string
  message: string
  details?: string
  metadata?: Record<string, any>
}

export function SystemLogsView() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    // Simulate real-time log updates
    const interval = setInterval(() => {
      const agentLog = generateMultiAgentLogMessage()
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        level: agentLog.level,
        module: agentLog.module,
        message: agentLog.message,
        details: agentLog.details,
        metadata: { generated: true, agentType: agentLog.module }
      }

      setLogs(prev => {
        const updated = [newLog, ...prev].slice(0, 100)
        return updated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = logs

    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter(log => log.level === selectedLevel)
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [logs, selectedLevel, searchTerm])

  useEffect(() => {
    if (isAutoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0
    }
  }, [filteredLogs, isAutoScroll])

  const generateMultiAgentLogMessage = () => {
    const agentMessages = [
      {
        module: 'News Agent',
        level: 'INFO' as const,
        message: '[News Agent] Sentiment analysis completed for AAPL',
        details: 'Bullish sentiment +72 detected from earnings beat and institutional buying'
      },
      {
        module: 'Quant Agent', 
        level: 'WARNING' as const,
        message: '[Quant Agent] Technical divergence detected',
        details: 'RSI at 85 (overbought) conflicts with bullish sentiment'
      },
      {
        module: 'Risk Manager Agent',
        level: 'INFO' as const,
        message: '[Risk Manager Agent] Consensus algorithm running',
        details: 'Processing conflicting signals from News and Quant agents'
      },
      {
        module: 'Risk Manager Agent',
        level: 'SUCCESS' as const,
        message: '[Risk Manager Agent] Consensus reached - position size adjusted',
        details: 'Reduced to 0.5% due to signal conflict, confidence score: 65/100'
      },
      {
        module: 'News Agent',
        level: 'INFO' as const,
        message: '[News Agent] Processing institutional flow data',
        details: 'Vanguard increases stake by 2.3M shares, sentiment impact calculated'
      },
      {
        module: 'Quant Agent',
        level: 'INFO' as const,
        message: '[Quant Agent] Technical indicators updated',
        details: 'SMA20 crossover detected, volume analysis complete'
      }
    ]
    
    return agentMessages[Math.floor(Math.random() * agentMessages.length)]
  }

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return 'text-blue-400 bg-blue-400/20 border-blue-400/30'
      case 'SUCCESS': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'WARNING': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'ERROR': return 'text-red-400 bg-red-400/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return <Info className="w-4 h-4" />
      case 'SUCCESS': return <CheckCircle className="w-4 h-4" />
      case 'WARNING': return <AlertCircle className="w-4 h-4" />
      case 'ERROR': return <XCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const clearLogs = () => {
    setLogs([])
    setFilteredLogs([])
  }

  const exportLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${log.timestamp}] ${log.level} ${log.module}: ${log.message}${log.details ? ' - ' + log.details : ''}`
    ).join('\n')
    
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trading-terminal-logs-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full terminal-window">
      <div className="terminal-header">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          System Logs
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`p-2 rounded transition-colors ${
              isAutoScroll 
                ? 'bg-accent-primary/20 text-accent-primary' 
                : 'text-terminal-gray hover:text-terminal-text'
            }`}
            title="Auto-scroll"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={exportLogs}
            className="p-2 hover:bg-terminal-border rounded transition-colors"
            title="Export logs"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearLogs}
            className="p-2 hover:bg-terminal-border rounded transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-terminal-border rounded transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 border-b border-terminal-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-terminal-gray" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-terminal-border text-terminal-text px-3 py-1 rounded text-sm border border-terminal-border/50 focus:border-accent-primary outline-none"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-terminal-gray" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-terminal-border text-terminal-text px-3 py-1 rounded text-sm border border-terminal-border/50 focus:border-accent-primary outline-none"
          />
        </div>

        <div className="text-sm text-terminal-gray">
          {filteredLogs.length} entries
        </div>
      </div>

      {/* Log Entries */}
      <div className="flex h-full">
        <div 
          ref={logContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2"
          style={{ maxHeight: '600px' }}
        >
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-terminal-border ${
                selectedLog?.id === log.id ? 'border-accent-primary bg-accent-primary/5' : 'border-terminal-border/50'
              }`}
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded border ${getLevelColor(log.level)}`}>
                  {getLevelIcon(log.level)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-terminal-gray font-mono">
                      {log.timestamp}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-xs text-terminal-gray">
                      {log.module}
                    </span>
                  </div>
                  
                  <div className="text-sm text-terminal-text mb-1">
                    {log.message}
                  </div>
                  
                  {log.details && (
                    <div className="text-xs text-terminal-gray/80">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-terminal-gray">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No logs found</p>
            </div>
          )}
        </div>

        {/* Log Details Panel */}
        {selectedLog && (
          <div className="w-96 border-l border-terminal-border p-4">
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Log Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-terminal-gray">Timestamp:</span>
                  <span className="ml-2 font-mono">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-terminal-gray">Level:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded border text-xs ${getLevelColor(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <span className="text-terminal-gray">Module:</span>
                  <span className="ml-2">{selectedLog.module}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-terminal-gray mb-2">Message</h5>
              <p className="text-sm text-terminal-text">{selectedLog.message}</p>
            </div>

            {selectedLog.details && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-terminal-gray mb-2">Details</h5>
                <p className="text-sm text-terminal-text">{selectedLog.details}</p>
              </div>
            )}

            {selectedLog.metadata && (
              <div>
                <h5 className="text-sm font-medium text-terminal-gray mb-2">Metadata</h5>
                <div className="bg-terminal-border/50 rounded p-3">
                  <pre className="text-xs text-terminal-text overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
