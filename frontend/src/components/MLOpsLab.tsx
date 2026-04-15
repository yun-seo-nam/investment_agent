'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Rocket, Trophy, Activity, Zap, Settings, Play, Pause, RotateCcw } from 'lucide-react'

// Mock model performance data
const generateModelData = () => {
  const models = [
    {
      id: 'llama3-8b-lora-v1',
      baseModel: 'Llama-3-8B-Instruct',
      adapter: 'LoRA-QuantV2',
      alignment: 'DPO',
      winRate: 68.4,
      sharpeRatio: 2.34,
      maxDrawdown: -12.8,
      avgInferenceTime: 234,
      status: 'active',
      equityCurve: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        value: 100000 * (1 + (Math.random() - 0.3) * 0.02 * i)
      }))
    },
    {
      id: 'qwen-14b-sft-v3',
      baseModel: 'Qwen-14B-Chat',
      adapter: 'SFT-FinanceV3',
      alignment: 'SFT',
      winRate: 64.2,
      sharpeRatio: 1.98,
      maxDrawdown: -15.6,
      avgInferenceTime: 412,
      status: 'inactive',
      equityCurve: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        value: 100000 * (1 + (Math.random() - 0.35) * 0.018 * i)
      }))
    },
    {
      id: 'mixtral-8x7b-dpo-v2',
      baseModel: 'Mixtral-8x7B-Instruct',
      adapter: 'DPO-MultiAsset',
      alignment: 'DPO',
      winRate: 71.8,
      sharpeRatio: 2.67,
      maxDrawdown: -10.2,
      avgInferenceTime: 567,
      status: 'training',
      equityCurve: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        value: 100000 * (1 + (Math.random() - 0.25) * 0.025 * i)
      }))
    },
    {
      id: 'codellama-13b-lora-v1',
      baseModel: 'CodeLlama-13B-Instruct',
      adapter: 'LoRA-StrategyV1',
      alignment: 'DPO',
      winRate: 59.3,
      sharpeRatio: 1.45,
      maxDrawdown: -18.9,
      avgInferenceTime: 389,
      status: 'inactive',
      equityCurve: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        value: 100000 * (1 + (Math.random() - 0.4) * 0.015 * i)
      }))
    },
    {
      id: 'gemma-7b-sft-v2',
      baseModel: 'Gemma-7B-Instruct',
      adapter: 'SFT-QuickTrade',
      alignment: 'SFT',
      winRate: 55.7,
      sharpeRatio: 1.23,
      maxDrawdown: -22.1,
      avgInferenceTime: 156,
      status: 'inactive',
      equityCurve: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        value: 100000 * (1 + (Math.random() - 0.45) * 0.012 * i)
      }))
    }
  ]
  
  return models
}

const baseModels = [
  'Llama-3-8B-Instruct',
  'Llama-3-70B-Instruct',
  'Qwen-14B-Chat',
  'Qwen-72B-Chat',
  'Mixtral-8x7B-Instruct',
  'CodeLlama-13B-Instruct',
  'Gemma-7B-Instruct',
  'Mistral-7B-Instruct'
]

const adapters = [
  'LoRA-QuantV2',
  'LoRA-StrategyV1',
  'SFT-FinanceV3',
  'SFT-QuickTrade',
  'DPO-MultiAsset',
  'DPO-RiskV1',
  'QLoRA-Fast',
  'AdaLoRA-Dynamic'
]

export default function MLOpsLab() {
  const [models, setModels] = useState(generateModelData())
  const [selectedBaseModel, setSelectedBaseModel] = useState('Llama-3-8B-Instruct')
  const [selectedAdapter, setSelectedAdapter] = useState('LoRA-QuantV2')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setModels(prev => prev.map(model => ({
        ...model,
        avgInferenceTime: model.avgInferenceTime + (Math.random() - 0.5) * 10,
        winRate: Math.max(0, Math.min(100, model.winRate + (Math.random() - 0.5) * 0.5))
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDeploy = () => {
    setIsDeploying(true)
    setDeploymentProgress(0)
    
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDeploying(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20'
      case 'training': return 'text-yellow-400 bg-yellow-900/20'
      case 'inactive': return 'text-gray-400 bg-gray-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-400'
    if (winRate >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSharpeColor = (sharpe: number) => {
    if (sharpe >= 2.5) return 'text-green-400'
    if (sharpe >= 1.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getDrawdownColor = (drawdown: number) => {
    if (drawdown >= -10) return 'text-green-400'
    if (drawdown >= -15) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="flex h-full gap-4 p-4 bg-black">
      {/* Left Column - Deployment Control */}
      <motion.div 
        className="w-96 bg-gray-900 rounded-lg border border-gray-800 p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Rocket className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Model Deployment Control</h2>
        </div>

        <div className="space-y-6">
          {/* Base Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Base Model
            </label>
            <select
              value={selectedBaseModel}
              onChange={(e) => setSelectedBaseModel(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              {baseModels.map(model => (
                <option key={model} value={model} className="bg-gray-800">
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Adapter Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adapter (LoRA/DPO weights)
            </label>
            <select
              value={selectedAdapter}
              onChange={(e) => setSelectedAdapter(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              {adapters.map(adapter => (
                <option key={adapter} value={adapter} className="bg-gray-800">
                  {adapter}
                </option>
              ))}
            </select>
          </div>

          {/* Deployment Status */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Current Active Model</span>
              <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded">
                ACTIVE
              </span>
            </div>
            <div className="text-white font-medium">llama3-8b-lora-v1</div>
            <div className="text-xs text-gray-400 mt-1">Deployed 2 hours ago</div>
          </div>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isDeploying ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Deploying... {Math.round(deploymentProgress)}%</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Deploy to Agent</span>
              </>
            )}
          </button>

          {/* Progress Bar */}
          {isDeploying && (
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${deploymentProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1">
              <Pause className="w-3 h-3" />
              <span>Pause</span>
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1">
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Resource Usage */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Resource Usage</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">GPU Memory</span>
                <span className="text-white">6.8GB / 8GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-white">42%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '42%' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column - Performance Leaderboard */}
      <motion.div 
        className="flex-1 bg-gray-900 rounded-lg border border-gray-800 p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Performance Leaderboard</h2>
          <div className="flex items-center space-x-1 ml-auto">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Live Rankings</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Model ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Base Model</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Alignment</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Win Rate</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Sharpe Ratio</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Max DD</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Inference</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Equity Curve</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, index) => (
                <motion.tr
                  key={model.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <td className="py-3 px-4">
                    <div className="text-white font-medium">{model.id}</div>
                    <div className="text-xs text-gray-400">{model.adapter}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-xs">
                    {model.baseModel}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      model.alignment === 'DPO' 
                        ? 'bg-purple-900/20 text-purple-400' 
                        : 'bg-blue-900/20 text-blue-400'
                    }`}>
                      {model.alignment}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-center font-medium ${getWinRateColor(model.winRate)}`}>
                    {model.winRate.toFixed(1)}%
                  </td>
                  <td className={`py-3 px-4 text-center font-medium ${getSharpeColor(model.sharpeRatio)}`}>
                    {model.sharpeRatio.toFixed(2)}
                  </td>
                  <td className={`py-3 px-4 text-center font-medium ${getDrawdownColor(model.maxDrawdown)}`}>
                    {model.maxDrawdown.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center text-gray-300">
                    {model.avgInferenceTime.toFixed(0)}ms
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-24 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={model.equityCurve}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={model.winRate >= 65 ? '#10b981' : '#ef4444'}
                            strokeWidth={1}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(model.status)}`}>
                      {model.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Top Performer</div>
            <div className="text-white font-bold">mixtral-8x7b-dpo-v2</div>
            <div className="text-xs text-green-400">71.8% Win Rate</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Best Risk Adj</div>
            <div className="text-white font-bold">mixtral-8x7b-dpo-v2</div>
            <div className="text-xs text-green-400">2.67 Sharpe</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Fastest Inference</div>
            <div className="text-white font-bold">gemma-7b-sft-v2</div>
            <div className="text-xs text-green-400">156ms avg</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Total Models</div>
            <div className="text-white font-bold">5</div>
            <div className="text-xs text-gray-400">2 training</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
