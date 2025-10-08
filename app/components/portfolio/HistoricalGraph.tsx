"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';

type TimeRange = '1D' | '7D' | '30D' | 'ALL';

interface DataPoint {
  timestamp: number;
  totalValue: number;
}

interface GraphData {
  dataPoints: DataPoint[];
  minValue: number;
  maxValue: number;
  deltaValue: number;
  deltaPercentage: number;
}

export default function HistoricalGraph() {
  const { totalPortfolioValue, isConnected, address } = usePortfolio();
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // Load historical data from localStorage
  useEffect(() => {
    if (!isConnected || !address) {
      setDataPoints([]);
      return;
    }

    const storageKey = `portfolio_history_${address}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDataPoints(parsed);
      } catch (error) {
        console.error('Error parsing portfolio history:', error);
        setDataPoints([]);
      }
    }
  }, [isConnected, address]);

  // Save current snapshot to localStorage
  useEffect(() => {
    if (!isConnected || !address || totalPortfolioValue === 0) return;

    const storageKey = `portfolio_history_${address}`;
    const now = Date.now();
    
    // Add current snapshot (max one per hour)
    const newPoint: DataPoint = {
      timestamp: now,
      totalValue: totalPortfolioValue,
    };

    setDataPoints(prev => {
      // Remove points older than 30 days
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
      const filtered = prev.filter(p => p.timestamp > thirtyDaysAgo);
      
      // Only add if last point is >1 hour old or value changed significantly
      const lastPoint = filtered[filtered.length - 1];
      const oneHourAgo = now - (60 * 60 * 1000);
      
      if (!lastPoint || 
          lastPoint.timestamp < oneHourAgo || 
          Math.abs(lastPoint.totalValue - totalPortfolioValue) / totalPortfolioValue > 0.01) {
        const updated = [...filtered, newPoint];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      }
      
      return filtered;
    });
  }, [totalPortfolioValue, isConnected, address]);

  // Filter data points based on time range
  const graphData = useMemo((): GraphData => {
    if (dataPoints.length === 0) {
      return {
        dataPoints: [],
        minValue: 0,
        maxValue: 0,
        deltaValue: 0,
        deltaPercentage: 0,
      };
    }

    const now = Date.now();
    let cutoff = 0;

    switch (timeRange) {
      case '1D':
        cutoff = now - (24 * 60 * 60 * 1000);
        break;
      case '7D':
        cutoff = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case '30D':
        cutoff = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case 'ALL':
        cutoff = 0;
        break;
    }

    const filtered = dataPoints.filter(p => p.timestamp >= cutoff);
    
    if (filtered.length === 0) {
      return {
        dataPoints: [],
        minValue: 0,
        maxValue: 0,
        deltaValue: 0,
        deltaPercentage: 0,
      };
    }

    const values = filtered.map(p => p.totalValue);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    const firstValue = filtered[0].totalValue;
    const lastValue = filtered[filtered.length - 1].totalValue;
    const deltaValue = lastValue - firstValue;
    const deltaPercentage = firstValue > 0 ? (deltaValue / firstValue) * 100 : 0;

    return {
      dataPoints: filtered,
      minValue,
      maxValue,
      deltaValue,
      deltaPercentage,
    };
  }, [dataPoints, timeRange]);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const formatDate = useCallback((timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: timeRange === '1D' ? '2-digit' : undefined,
      minute: timeRange === '1D' ? '2-digit' : undefined,
    });
  }, [timeRange]);

  const timeRanges: TimeRange[] = ['1D', '7D', '30D', 'ALL'];

  // Render mini SVG graph
  const renderGraph = () => {
    if (graphData.dataPoints.length === 0) {
      return (
        <div style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '0.875rem',
        }}>
          No historical data yet. Check back after using the app for a while.
        </div>
      );
    }

    const width = 600;
    const height = 200;
    const padding = 20;

    const xScale = (timestamp: number) => {
      const minTime = graphData.dataPoints[0].timestamp;
      const maxTime = graphData.dataPoints[graphData.dataPoints.length - 1].timestamp;
      const range = maxTime - minTime || 1;
      return ((timestamp - minTime) / range) * (width - 2 * padding) + padding;
    };

    const yScale = (value: number) => {
      const range = graphData.maxValue - graphData.minValue || 1;
      return height - padding - ((value - graphData.minValue) / range) * (height - 2 * padding);
    };

    // Build SVG path
    const pathData = graphData.dataPoints
      .map((point, i) => {
        const x = xScale(point.timestamp);
        const y = yScale(point.totalValue);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    const isPositive = graphData.deltaValue >= 0;
    const lineColor = isPositive ? '#10b981' : '#ef4444';

    return (
      <div style={{ position: 'relative' }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block' }}
        >
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeWidth="1" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {graphData.dataPoints.map((point, i) => (
            <circle
              key={i}
              cx={xScale(point.timestamp)}
              cy={yScale(point.totalValue)}
              r="4"
              fill={lineColor}
              stroke="#ffffff"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>
        
        {/* Hover tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}>
            <div>{formatDate(hoveredPoint.timestamp)}</div>
            <div style={{ fontWeight: '600' }}>{formatCurrency(hoveredPoint.totalValue)}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    }}>
      {/* Header with time range selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b',
            marginBottom: '0.25rem',
          }}>
            Portfolio Value
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
          }}>
            {formatCurrency(totalPortfolioValue)}
          </div>
          {graphData.dataPoints.length > 0 && (
            <div style={{
              fontSize: '0.875rem',
              color: graphData.deltaValue >= 0 ? '#10b981' : '#ef4444',
              marginTop: '0.25rem',
            }}>
              {graphData.deltaValue >= 0 ? '+' : ''}{formatCurrency(graphData.deltaValue)} 
              ({graphData.deltaPercentage >= 0 ? '+' : ''}{graphData.deltaPercentage.toFixed(2)}%)
            </div>
          )}
        </div>
        
        {/* Time range buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: '#f8fafc',
          padding: '0.25rem',
          borderRadius: '8px',
        }}>
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: timeRange === range ? '#ffffff' : 'transparent',
                color: timeRange === range ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: timeRange === range ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Graph */}
      {renderGraph()}
    </div>
  );
}

