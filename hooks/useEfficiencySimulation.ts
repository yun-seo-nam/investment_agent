'use client'

import { useState, useEffect, useCallback } from 'react'

interface EfficiencyMetrics {
  edgeFilterRate: number
  cloudApiCalls: number
  accumulatedSavings: number
  edgeLatency: number
  cloudLatency: number
  totalRequests: number
  filteredRequests: number
}

export const useEfficiencySimulation = () => {
  const [metrics, setMetrics] = useState<EfficiencyMetrics>({
    edgeFilterRate: 85.3,
    cloudApiCalls: 1247,
    accumulatedSavings: 1240.50,
    edgeLatency: 48,
    cloudLatency: 1234,
    totalRequests: 8429,
    filteredRequests: 7182
  })

  const [isEdgeActive, setIsEdgeActive] = useState(true)
  const [isSimulationRunning, setIsSimulationRunning] = useState(true)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  const updateMetrics = useCallback(() => {
    setMetrics(prev => {
      const newCloudCalls = prev.cloudApiCalls + Math.floor(Math.random() * 3)
      const newTotalRequests = prev.totalRequests + Math.floor(Math.random() * 10)
      const newFilteredRequests = newTotalRequests - newCloudCalls
      const newEdgeFilterRate = (newFilteredRequests / newTotalRequests) * 100
      const newSavings = prev.accumulatedSavings + (Math.floor(Math.random() * 3) * 0.02) // $0.02 per filtered request
      
      return {
        ...prev,
        cloudApiCalls: newCloudCalls,
        totalRequests: newTotalRequests,
        filteredRequests: newFilteredRequests,
        edgeFilterRate: newEdgeFilterRate,
        accumulatedSavings: newSavings,
        edgeLatency: 45 + Math.floor(Math.random() * 10),
        cloudLatency: 1200 + Math.floor(Math.random() * 100)
      }
    })
  }, [])

  const toggleEdge = useCallback(() => {
    setIsEdgeActive(prev => !prev)
  }, [])

  const toggleTechnicalDetails = useCallback(() => {
    setShowTechnicalDetails(prev => !prev)
  }, [])

  const resetMetrics = useCallback(() => {
    setMetrics({
      edgeFilterRate: 85.3,
      cloudApiCalls: 1247,
      accumulatedSavings: 1240.50,
      edgeLatency: 48,
      cloudLatency: 1234,
      totalRequests: 8429,
      filteredRequests: 7182
    })
  }, [])

  useEffect(() => {
    if (!isSimulationRunning) return

    const interval = setInterval(updateMetrics, 3000)
    return () => clearInterval(interval)
  }, [isSimulationRunning, updateMetrics])

  return {
    metrics,
    isEdgeActive,
    isSimulationRunning,
    showTechnicalDetails,
    toggleEdge,
    toggleTechnicalDetails,
    resetMetrics,
    setSimulationRunning: setIsSimulationRunning
  }
}
