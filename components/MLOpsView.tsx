'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { 
  Brain, 
  Activity,
  Settings,
  Play, 
  RefreshCw, 
  BarChart3,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { EfficiencyMonitor } from './EfficiencyMonitor'

// --- 타입 정의 (실제 API 응답 구조에 맞게 확장) ---
interface ModelPerformance {
  id: string
  baseModel: string
  adapter: string
  alignment: 'SFT' | 'DPO'
  winRate: number
  sharpeRatio: number
  maxDrawdown: number
  avgInferenceTime: number
  equityCurve: { day: number; value: number }[]
  status: 'active' | 'training' | 'idle' | 'failed'
  lastUpdated: string
  // 상세 데이터용 필드 추가
  totalTrades?: number
  profitFactor?: number
  avgDailyReturn?: number
  vramUsage?: string
}

interface DeploymentConfig {
  baseModel: string
  adapter: string
  quantization: string
  temperature: number
  maxTokens: number
}

export function MLOpsView() {
  // --- 상태 관리 ---
  const [models, setModels] = useState<ModelPerformance[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    baseModel: 'Llama-3-8B-Instruct',
    adapter: 'trading-agent-lora-v3',
    quantization: '4bit',
    temperature: 0.7,
    maxTokens: 2048
  })
  
  // 비동기 작업 로딩 상태
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [isDeploying, setIsDeploying] = useState(false)

  // (선택지 목록은 프론트엔드에 유지하거나 API로 뺄 수 있습니다)
  const baseModels = ['Llama-3-8B-Instruct', 'Llama-3-70B-Instruct', 'Qwen-2-7B-Chat', 'Qwen-2-72B-Chat', 'Mistral-7B-Instruct', 'Mixtral-8x7B-Instruct']
  const adapters = ['trading-agent-lora-v3', 'trading-agent-lora-v2', 'sentiment-analysis-dpo', 'risk-management-sft', 'portfolio-optimization-dpo', 'market-prediction-lora']

  // --- API 데이터 연동 (Data Fetching) ---

  // 1. 모델 리더보드 데이터 연동
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true)
      try {
        // [백엔드 연결 포인트] 실제 MLOps DB 또는 MLflow API 등과 연결하세요.
        // const response = await fetch('/api/mlops/models')
        // const data = await response.json()
        // setModels(data)
        // if (data.length > 0) setSelectedModel(data[0].id)
        
        // *임시 처리: 빈 배열
        setModels([])
      } catch (error) {
        console.error("모델 리스트를 불러오는데 실패했습니다.", error)
      } finally {
        setIsLoadingModels(false)
      }
    }

    fetchModels()
  }, [])

  // 2. 모델 배포 (Deploy) API 연동
  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      // [백엔드 연결 포인트] 선택한 설정값(deploymentConfig)을 서버로 전송하여 쿠버네티스/서버리스 배포 트리거
      // const response = await fetch('/api/mlops/deploy', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(deploymentConfig)
      // })
      // if (!response.ok) throw new Error("배포 실패")
      
      // 배포 성공 후 모델 리스트 재호출 (fetchModels 로직 재실행)
      alert("백엔드 API가 연결되지 않았습니다. (배포 요청 시뮬레이션 종료)")
    } catch (error) {
      console.error("모델 배포 중 에러가 발생했습니다.", error)
    } finally {
      setIsDeploying(false)
    }
  }

  // --- UI 헬퍼 함수 ---
  const getStatusColor = (status: ModelPerformance['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20 border-green-400/30'
      case 'training': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30'
      case 'idle': return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
      case 'failed': return 'text-red-400 bg-red-400/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30'
    }
  }

  const getPerformanceColor = (value: number, isHigherBetter: boolean = true) => {
    if (isHigherBetter) {
      if (value > 70) return 'text-green-400'
      if (value > 50) return 'text-yellow-400'
      return 'text-red-400'
    } else {
      if (value < -10) return 'text-red-400'
      if (value < -5) return 'text-yellow-400'
      return 'text-green-400'
    }
  }

  // --- UI 렌더링 ---
  return (
    <div className="h-full space-y-6">
      {/* A.Q.U.A Efficiency Monitor */}
      <EfficiencyMonitor />
      
      {/* Deployment Control Panel */}
      <div className="terminal-window">
        <div className="terminal-header">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Model Deployment Control
          </h3>
          <div className="flex items-center gap-2">
            <div className="status-indicator status-online">
              <Activity className="w-2 h-2" />
              MLOps Online
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-terminal-gray mb-2">Base Model</label>
              <select
                value={deploymentConfig.baseModel}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, baseModel: e.target.value }))}
                className="w-full bg-terminal-border text-terminal-text px-3 py-2 rounded border border-terminal-border/50 focus:border-accent-primary outline-none"
              >
                {baseModels.map(model => <option key={model} value={model}>{model}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-gray mb-2">Adapter (LoRA weights)</label>
              <select
                value={deploymentConfig.adapter}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, adapter: e.target.value }))}
                className="w-full bg-terminal-border text-terminal-text px-3 py-2 rounded border border-terminal-border/50 focus:border-accent-primary outline-none"
              >
                {adapters.map(adapter => <option key={adapter} value={adapter}>{adapter}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-gray mb-2">Quantization</label>
              <div className="flex gap-2">
                {['4bit', '8bit', '16bit', '32bit'].map(quant => (
                  <button
                    key={quant}
                    onClick={() => setDeploymentConfig(prev => ({ ...prev, quantization: quant }))}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      deploymentConfig.quantization === quant
                        ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                        : 'bg-terminal-border text-terminal-gray hover:text-terminal-text'
                    }`}
                  >
                    {quant}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-terminal-gray mb-2">Temperature: {deploymentConfig.temperature}</label>
              <input
                type="range" min="0" max="2" step="0.1"
                value={deploymentConfig.temperature}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-terminal-gray mb-2">Max Tokens: {deploymentConfig.maxTokens}</label>
              <input
                type="range" min="512" max="4096" step="512"
                value={deploymentConfig.maxTokens}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="accent-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeploying ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Deploying...</>
                ) : (
                  <><Play className="w-4 h-4" /> Deploy to Agent</>
                )}
              </button>
              <button className="secondary-button flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Leaderboard */}
      <div className="terminal-window">
        <div className="terminal-header">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Leaderboard
          </h3>
          <button className="p-2 hover:bg-terminal-border rounded transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto min-h-[200px] relative">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Model ID</th>
                <th>Base Model</th>
                <th>Adapter</th>
                <th>Alignment</th>
                <th>Win Rate %</th>
                <th>Sharpe Ratio</th>
                <th>Max Drawdown</th>
                <th>Inference Time</th>
                <th>Equity Curve</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingModels ? (
                <tr>
                  <td colSpan={11} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-terminal-gray" />
                  </td>
                </tr>
              ) : models.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-terminal-gray">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    No models deployed yet. Deploy a model above to see performance metrics.
                  </td>
                </tr>
              ) : (
                models.map((model) => (
                  <tr 
                    key={model.id} 
                    onClick={() => setSelectedModel(model.id)}
                    className={`hover:bg-terminal-border/30 transition-colors cursor-pointer ${selectedModel === model.id ? 'bg-terminal-border/20' : ''}`}
                  >
                    <td className="font-mono text-xs">{model.id}</td>
                    <td className="text-sm">{model.baseModel}</td>
                    <td className="text-sm">{model.adapter}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${model.alignment === 'DPO' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                        {model.alignment}
                      </span>
                    </td>
                    <td className={`font-semibold ${getPerformanceColor(model.winRate)}`}>{model.winRate}%</td>
                    <td className={`font-semibold ${getPerformanceColor(model.sharpeRatio)}`}>{model.sharpeRatio}</td>
                    <td className={`font-semibold ${getPerformanceColor(model.maxDrawdown, false)}`}>{model.maxDrawdown}%</td>
                    <td className="text-sm">{model.avgInferenceTime}ms</td>
                    <td className="w-32">
                      <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={model.equityCurve || []}>
                          <Line type="monotone" dataKey="value" stroke={model.winRate > 70 ? "#00ff88" : model.winRate > 50 ? "#ffd700" : "#ff4444"} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </td>
                    <td>
                      <span className={`status-indicator ${getStatusColor(model.status)}`}>{model.status}</span>
                    </td>
                    <td className="text-sm text-terminal-gray">{model.lastUpdated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Details */}
      {selectedModel && models.length > 0 && (
        <div className="terminal-window">
          <div className="terminal-header">
            <h3 className="text-lg font-semibold">Model Details ({selectedModel})</h3>
          </div>
          
          {(() => {
            const model = models.find(m => m.id === selectedModel)
            if (!model) return null
            
            return (
              <div className="grid grid-cols-4 gap-4">
                <div className="metric-card">
                  <div className="metric-label">Total Trades</div>
                  <div className="metric-value">{model.totalTrades?.toLocaleString() || 'N/A'}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Profit Factor</div>
                  <div className={`metric-value ${model.profitFactor && model.profitFactor > 1.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {model.profitFactor || 'N/A'}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Avg Daily Return</div>
                  <div className={`metric-value ${model.avgDailyReturn && model.avgDailyReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {model.avgDailyReturn ? `${model.avgDailyReturn > 0 ? '+' : ''}${model.avgDailyReturn}%` : 'N/A'}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">VRAM Usage</div>
                  <div className="metric-value text-yellow-400">{model.vramUsage || 'N/A'}</div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}