'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Activity, Clock, Zap, AlertCircle, Play, Pause, RefreshCw, Loader2
} from 'lucide-react'

// --- 타입 정의 (실제 API에서 내려줄 데이터 형태에 맞춰 수정하세요) ---
interface MarketData {
  time: string
  price: number
  sma20: number
  sma60: number
  volume: number
  confidenceUpper: number
  confidenceLower: number
}

interface NewsItem {
  id: string
  title: string
  source: string
  timestamp: string
  sentiment: number
  summary: string
}

interface ReActStep {
  id: string
  type: 'thought' | 'action' | 'observation' | 'final_decision'
  content: string
  timestamp: string
  latency: number
  confidence?: number
  blocked?: boolean
}

export function LiveTradingView({ activeTicker }: { activeTicker: string }) {
  // --- 상태 관리 ---
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [reactSteps, setReactSteps] = useState<ReActStep[]>([])
  const [activeTab, setActiveTab] = useState<'news' | 'filings'>('news')
  const [isAgentRunning, setIsAgentRunning] = useState(true)
  
  // 로딩 상태 추가 (데이터가 오기 전까지 화면이 깨지지 않도록 방어)
  const [isLoading, setIsLoading] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  // --- API 데이터 연동 (Data Fetching) ---

  // 1. 주가 차트 데이터 연동
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // [백엔드 연결 포인트] 실제 API 주소로 변경하세요.
        // const response = await fetch(`/api/market?ticker=${activeTicker}`)
        // const data = await response.json()
        // setMarketData(data)
        
        // *임시 처리: 현재 서버가 없으므로 빈 배열 유지
        setMarketData([]) 
      } catch (error) {
        console.error("차트 데이터를 불러오는데 실패했습니다.", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData() // 처음 로딩 시 1회 호출
    
    // 실시간 업데이트를 원한다면 아래 주석을 풀고 사용하세요. (예: 5초마다 갱신)
    // const interval = setInterval(fetchMarketData, 5000)
    // return () => clearInterval(interval)
  }, [activeTicker])

  // 2. 뉴스 및 공시 데이터 연동
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // [백엔드 연결 포인트] 
        // const response = await fetch(`/api/news?ticker=${activeTicker}`)
        // const data = await response.json()
        // setNewsItems(data)
      } catch (error) {
        console.error("뉴스 데이터를 불러오는데 실패했습니다.", error)
      }
    }
    fetchNews()
  }, [activeTicker])

  // 3. ReAct 에이전트 로그 데이터 연동
  useEffect(() => {
    if (!isAgentRunning) return

    const fetchAgentLogs = async () => {
      try {
        // [백엔드 연결 포인트]
        // const response = await fetch(`/api/agent/logs?ticker=${activeTicker}`)
        // const data = await response.json()
        // setReactSteps(data)
      } catch (error) {
        console.error("에이전트 로그를 불러오는데 실패했습니다.", error)
      }
    }

    // 에이전트는 실시간으로 움직이므로 보통 주기적으로 폴링(Polling) 하거나 WebSocket을 씁니다.
    // const interval = setInterval(fetchAgentLogs, 2000)
    // return () => clearInterval(interval)
  }, [activeTicker, isAgentRunning])


  // --- UI 헬퍼 함수 ---
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [reactSteps])

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 50) return 'text-green-400 bg-green-400/20 border-green-400/30'
    if (sentiment < -50) return 'text-red-400 bg-red-400/20 border-red-400/30'
    return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
  }

  const getReActStepColor = (type: ReActStep['type']) => {
    switch (type) {
      case 'thought': return 'text-blue-400'
      case 'action': return 'text-yellow-400'
      case 'observation': return 'text-gray-300'
      case 'final_decision': return 'text-green-500 font-bold'
      default: return 'text-gray-300'
    }
  }

  // --- UI 렌더링 ---
  return (
    <div className="h-full grid grid-cols-2 gap-6">
      {/* Left Side - Chart and Data Ingestion */}
      <div className="space-y-6">
        
        {/* Chart Module */}
        <div className="chart-container h-96 relative">
          <div className="terminal-header">
            <h3 className="text-lg font-semibold">{activeTicker} Technical Analysis</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-terminal-gray">Live</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center text-terminal-gray">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading chart data...
            </div>
          ) : marketData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-terminal-gray/50">
              No market data available for {activeTicker}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="time" stroke="#808080" fontSize={10} />
                <YAxis yAxisId="left" stroke="#808080" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#808080" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px' }}
                  labelStyle={{ color: '#e0e0e0' }}
                />
                <Area type="monotone" dataKey="confidenceUpper" fill="#00ff88" stroke="none" fillOpacity={0.1} yAxisId="left" />
                <Area type="monotone" dataKey="confidenceLower" fill="#0a0a0a" stroke="none" fillOpacity={1} yAxisId="left" />
                <Line type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={2} dot={false} yAxisId="left" />
                <Line type="monotone" dataKey="sma20" stroke="#ff6b6b" strokeWidth={1} strokeDasharray="5 5" dot={false} yAxisId="left" />
                <Line type="monotone" dataKey="sma60" stroke="#4ecdc4" strokeWidth={1} strokeDasharray="3 3" dot={false} yAxisId="left" />
                <Bar dataKey="volume" fill="#ff6b35" opacity={0.3} yAxisId="right" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Data Ingestion Module */}
        <div className="terminal-window h-80 relative">
          <div className="terminal-header">
            <h3 className="text-lg font-semibold">Real-time Data Feed</h3>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab('news')} className={`px-3 py-1 rounded text-sm transition-colors ${activeTab === 'news' ? 'bg-accent-primary/20 text-accent-primary' : 'text-terminal-gray hover:text-terminal-text'}`}>Market News</button>
              <button onClick={() => setActiveTab('filings')} className={`px-3 py-1 rounded text-sm transition-colors ${activeTab === 'filings' ? 'bg-accent-primary/20 text-accent-primary' : 'text-terminal-gray hover:text-terminal-text'}`}>SEC Filings</button>
            </div>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-60">
            {newsItems.length === 0 ? (
              <div className="text-center py-12 text-terminal-gray/50">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Waiting for real-time feed...</p>
              </div>
            ) : (
              newsItems.map(item => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-3 border border-terminal-border/50 rounded-lg hover:border-terminal-border transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium flex-1">{item.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded border ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment > 0 ? '+' : ''}{item.sentiment}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-terminal-gray mb-1">
                    <span>{item.source}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-terminal-gray/80">{item.summary}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Side - ReAct Agent Terminal */}
      <div className="terminal-window h-full relative">
        <div className="terminal-header">
          <h3 className="text-lg font-semibold">ReAct Agent Terminal</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAgentRunning(!isAgentRunning)} className={`p-2 rounded transition-colors ${isAgentRunning ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
              {isAgentRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button className="p-2 hover:bg-terminal-border rounded transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-terminal-gray">{isAgentRunning ? 'Agent Active' : 'Agent Paused'}</span>
            </div>
          </div>
        </div>
        
        <div ref={terminalRef} className="terminal-output overflow-y-auto" style={{ maxHeight: '600px' }}>
          {reactSteps.length === 0 ? (
            <div className="text-center py-20 text-terminal-gray/50 font-mono text-sm">
              <p>{">"} Initialize Multi-Agent System...</p>
              <p className="mt-2 animate-pulse">{">"} Waiting for agent consensus logs...</p>
            </div>
          ) : (
            reactSteps.map((step, index) => (
              <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="terminal-line mb-3">
                <div className="flex items-start gap-3">
                  <span className="text-terminal-gray text-xs mt-1">{step.timestamp}</span>
                  <div className="flex-1">
                    <span className={`${getReActStepColor(step.type)}`}>&lt;{step.type.toUpperCase()}&gt;</span>
                    <span className="ml-2 text-terminal-text">{step.content}</span>
                    {step.confidence && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${step.confidence >= 80 ? 'text-green-400 bg-green-400/20 border border-green-400/30' : 'text-yellow-400 bg-yellow-400/20 border border-yellow-400/30'}`}>
                        Confidence: {step.confidence}/100
                      </span>
                    )}
                    {step.blocked && (
                      <span className="ml-2 text-xs px-2 py-1 rounded text-red-400 bg-red-400/20 border border-red-400/30">
                        [BLOCKED BY GUARDRAIL - MANUAL APPROVAL REQUIRED]
                      </span>
                    )}
                    <span className="ml-2 text-terminal-gray text-xs">[{step.latency}ms]</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}