'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, Activity, Zap, Brain, Eye } from 'lucide-react'

// Mock stock data
const generateStockData = () => {
  const data = []
  let basePrice = 150
  const now = new Date()
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const volatility = 0.02
    const trend = i > 15 ? 0.001 : -0.0005
    const change = (Math.random() - 0.5) * volatility + trend
    basePrice = basePrice * (1 + change)
    
    const volume = Math.floor(Math.random() * 10000000) + 5000000
    const sma20 = i < 20 ? null : data.slice(i - 20, i).reduce((sum, d) => sum + d.price, 0) / 20
    const sma60 = i < 60 ? null : data.slice(Math.max(0, i - 60), i).reduce((sum, d) => sum + d.price, 0) / Math.min(i, 60)
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(basePrice.toFixed(2)),
      volume: volume,
      sma20: sma20 ? parseFloat(sma20.toFixed(2)) : null,
      sma60: sma60 ? parseFloat(sma60.toFixed(2)) : null,
      high: parseFloat((basePrice * 1.02).toFixed(2)),
      low: parseFloat((basePrice * 0.98).toFixed(2)),
    })
  }
  
  return data
}

// Mock ReAct logs
const generateReActLogs = () => {
  const logs = [
    {
      type: 'thought',
      content: 'Analyzing current market conditions for AAPL. RSI indicates oversold conditions, MACD showing bullish divergence.',
      timestamp: new Date(Date.now() - 5000),
      latency: 234
    },
    {
      type: 'action',
      content: 'Calling fetch_yfinance(ticker="AAPL", period="1d", interval="1h")',
      timestamp: new Date(Date.now() - 4000),
      latency: 156
    },
    {
      type: 'observation',
      content: 'Received 378 data points. Current price: $178.42, Volume: 45.2M, Beta: 1.25',
      timestamp: new Date(Date.now() - 3000),
      latency: 89
    },
    {
      type: 'thought',
      content: 'Volume analysis shows accumulation pattern. Price action suggests breakout above resistance at $180.',
      timestamp: new Date(Date.now() - 2000),
      latency: 178
    },
    {
      type: 'action',
      content: 'Executing calculate_position_size(risk=0.02, stop_loss=175.50, entry_price=178.42)',
      timestamp: new Date(Date.now() - 1000),
      latency: 45
    },
    {
      type: 'final_decision',
      content: 'BUY 500 shares at $178.42. Stop Loss: $175.50. Take Profit: $185.00. Risk/Reward: 1.8',
      timestamp: new Date(),
      latency: 67
    }
  ]
  
  return logs
}

// Mock news data
const mockNews = [
  {
    id: 1,
    title: 'Apple Announces Record Q4 Earnings, Beats Expectations',
    source: 'Reuters',
    time: '2 min ago',
    sentiment: 85,
    summary: 'Apple reported Q4 revenue of $89.5B, exceeding analyst expectations of $87.2B. iPhone sales surged 12% YoY...'
  },
  {
    id: 2,
    title: 'SEC Files: Apple Increases Share Repurchase Program by $90B',
    source: 'SEC EDGAR',
    time: '15 min ago',
    sentiment: 72,
    summary: 'In Form 8-K filing, Apple announced board approval to increase share repurchase authorization by $90B...'
  },
  {
    id: 3,
    title: 'Analyst Downgrade: Morgan Stanley Cuts Apple PT to $190',
    source: 'Bloomberg',
    time: '1 hour ago',
    sentiment: -45,
    summary: 'Morgan Stanley analysts cited supply chain concerns and slowing growth in China as primary reasons...'
  }
]

export default function AgentLiveTrading() {
  const [stockData, setStockData] = useState(generateStockData())
  const [reactLogs, setReactLogs] = useState(generateReActLogs())
  const [activeTab, setActiveTab] = useState<'news' | 'filings'>('news')
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      // Update stock data with new price
      setStockData(prev => {
        const newData = [...prev]
        const lastPrice = newData[newData.length - 1].price
        const change = (Math.random() - 0.5) * 0.005
        const newPrice = lastPrice * (1 + change)
        
        newData[newData.length - 1] = {
          ...newData[newData.length - 1],
          price: parseFloat(newPrice.toFixed(2)),
          high: parseFloat((newPrice * 1.01).toFixed(2)),
          low: parseFloat((newPrice * 0.99).toFixed(2)),
        }
        
        return newData
      })

      // Add new ReAct log
      setReactLogs(prev => {
        const newLog = {
          type: ['thought', 'action', 'observation'][Math.floor(Math.random() * 3)] as 'thought' | 'action' | 'observation',
          content: `Real-time market analysis update... ${Math.random().toString(36).substring(7)}`,
          timestamp: new Date(),
          latency: Math.floor(Math.random() * 300) + 50
        }
        
        const updatedLogs = [...prev, newLog].slice(-10)
        return updatedLogs
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isAutoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [reactLogs, isAutoScroll])

  const currentPrice = stockData[stockData.length - 1]?.price || 0
  const priceChange = stockData.length > 1 ? currentPrice - stockData[stockData.length - 2].price : 0
  const priceChangePercent = stockData.length > 1 ? (priceChange / stockData[stockData.length - 2].price) * 100 : 0

  const getLogColor = (type: string) => {
    switch (type) {
      case 'thought': return 'text-blue-400'
      case 'action': return 'text-yellow-400'
      case 'observation': return 'text-gray-300'
      case 'final_decision': return 'text-green-500 font-bold'
      default: return 'text-gray-400'
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 50) return 'bg-green-500'
    if (sentiment > 0) return 'bg-green-400'
    if (sentiment > -50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="flex h-full gap-4 p-4 bg-black">
      {/* Left Column - Chart and Data Ingestion */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Chart Module */}
        <motion.div 
          className="bg-gray-900 rounded-lg p-4 border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-white">AAPL Technical Analysis</h2>
              <div className="flex items-center space-x-2">
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-lg font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${currentPrice.toFixed(2)}
                </span>
                <span className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-gray-400">SMA 20</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">SMA 60</span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  fontSize={10}
                  tickFormatter={(value) => value.split(' ')[0]}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={10}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#6B7280" 
                  opacity={0.3}
                  yAxisId="right"
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="sma20" 
                  stroke="#F59E0B" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="sma60" 
                  stroke="#EF4444" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Data Ingestion Module */}
        <motion.div 
          className="bg-gray-900 rounded-lg p-4 border border-gray-800 flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Real-time Data Feed</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === 'news' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Market News
              </button>
              <button
                onClick={() => setActiveTab('filings')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === 'filings' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                SEC Filings
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {mockNews.map((item) => (
              <motion.div
                key={item.id}
                className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-white flex-1">{item.title}</h3>
                  <div className={`px-2 py-1 rounded text-xs text-white ${getSentimentColor(item.sentiment)}`}>
                    {item.sentiment > 0 ? '+' : ''}{item.sentiment}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                  <Activity className="w-3 h-3 text-blue-400" />
                </div>
                <p className="text-xs text-gray-300 mt-2 line-clamp-2">{item.summary}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Column - ReAct Agent Terminal */}
      <motion.div 
        className="w-1/2 bg-gray-900 rounded-lg border border-gray-800 flex flex-col"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">ReAct Agent Terminal</h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Active</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                isAutoScroll 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Auto-scroll: {isAutoScroll ? 'ON' : 'OFF'}
            </button>
            <Zap className="w-4 h-4 text-yellow-400" />
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        <div 
          ref={terminalRef}
          className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar bg-black"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <AnimatePresence>
            {reactLogs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-3"
              >
                <div className="flex items-start space-x-2">
                  <span className="text-gray-500 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={getLogColor(log.type)}>
                    &lt;{log.type.toUpperCase()}&gt;
                  </span>
                  <span className="text-gray-400 text-xs">
                    [{log.latency}ms]
                  </span>
                </div>
                <div className={`ml-4 ${getLogColor(log.type)} break-all`}>
                  {log.content}
                </div>
                {log.type === 'final_decision' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-4 mt-2 p-2 bg-green-900/20 border border-green-800 rounded"
                  >
                    <div className="text-green-400 text-xs">EXECUTING TRADE...</div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-gray-500">$</span>
            <span className="text-green-400 terminal-cursor">_</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
