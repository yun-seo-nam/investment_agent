'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, 
  Activity,
  Shield,
  ChevronDown,
  ChevronUp,
  Zap,
  Cloud,
  Server
} from 'lucide-react'
import { useEfficiencySimulation } from '../hooks/useEfficiencySimulation'

export function EfficiencyMonitor() {
  const { 
    metrics, 
    isEdgeActive, 
    showTechnicalDetails,
    toggleEdge, 
    toggleTechnicalDetails 
  } = useEfficiencySimulation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-terminal-bg border border-terminal-border rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-accent-primary" />
          <h3 className="text-lg font-semibold">A.Q.U.A Efficiency Monitor</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm text-terminal-gray">Hybrid Active</span>
          </div>
          {/* Edge AI Toggle */}
          <button
            onClick={toggleEdge}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              isEdgeActive 
                ? 'bg-green-500/20 text-green-400 border border-green-400/30 hover:bg-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-400/30 hover:bg-gray-500/30'
            }`}
          >
            <Zap className="w-3 h-3" />
            Edge AI: {isEdgeActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Primary View - Key Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Accumulated Savings */}
        <div className="text-center p-6 bg-terminal-border/20 rounded-lg border border-terminal-border/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-accent-primary" />
            <span className="text-sm font-medium text-terminal-gray">Accumulated Savings</span>
          </div>
          <div className="text-3xl font-bold text-accent-primary">
            ${metrics.accumulatedSavings.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
          <div className="text-xs text-terminal-gray mt-1">
            @ $0.02 per filtered request
          </div>
        </div>

        {/* Edge Filter Rate */}
        <div className="text-center p-6 bg-terminal-border/20 rounded-lg border border-terminal-border/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-6 h-6 text-green-400" />
            <span className="text-sm font-medium text-terminal-gray">Edge Filter Rate</span>
          </div>
          <div className="text-3xl font-bold text-green-400">
            {metrics.edgeFilterRate.toFixed(1)}%
          </div>
          <div className="mt-3">
            <div className="w-full bg-terminal-border rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.edgeFilterRate}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs text-terminal-gray mt-2">
            {metrics.filteredRequests.toLocaleString()} / {metrics.totalRequests.toLocaleString()} requests
          </div>
        </div>
      </div>

      {/* Technical Details Dropdown */}
      <div className="border-t border-terminal-border/50 pt-4">
        <button
          onClick={toggleTechnicalDetails}
          className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-terminal-border/30 transition-colors"
        >
          <span className="text-sm font-medium text-terminal-gray">
            {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
          </span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-4 h-4 text-terminal-gray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-terminal-gray" />
          )}
        </button>

        <AnimatePresence>
          {showTechnicalDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-terminal-border/10 rounded-lg">
                {/* Cloud API Calls */}
                <div className="text-center p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Cloud className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-terminal-gray">Cloud API Calls</span>
                  </div>
                  <div className="text-xl font-semibold text-blue-400">
                    {metrics.cloudApiCalls.toLocaleString()}
                  </div>
                  <div className="text-xs text-terminal-gray mt-1">
                    GPT-4o requests today
                  </div>
                </div>

                {/* Latency Comparison */}
                <div className="text-center p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-medium text-terminal-gray">Latency Comparison</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 font-mono">{metrics.edgeLatency}ms</span>
                    </div>
                    <span className="text-terminal-gray">vs</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-400 font-mono">{metrics.cloudLatency}ms</span>
                    </div>
                  </div>
                  <div className="text-xs text-terminal-gray mt-1">
                    {(metrics.cloudLatency / metrics.edgeLatency).toFixed(1)}x faster
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="text-center p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-terminal-gray">Cost Breakdown</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-terminal-gray">Edge Processing:</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-terminal-gray">Cloud Processing:</span>
                      <span className="text-blue-400">${(metrics.cloudApiCalls * 0.05).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-terminal-gray mt-2">
                    Total Efficiency: {((metrics.filteredRequests / metrics.totalRequests) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
