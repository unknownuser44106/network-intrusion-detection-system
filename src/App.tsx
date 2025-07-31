import React, { useState, useEffect, useCallback } from 'react';
import { NetworkPacket, ThreatAlert, NetworkStats } from './types/network';
import { generateRandomPacket, generatePortScanPackets } from './utils/packetGenerator';
import { threatDetector } from './utils/threatDetection';
import AlertPanel from './components/AlertPanel';
import PacketMonitor from './components/PacketMonitor';
import NetworkStatsComponent from './components/NetworkStats';
import ThreatLog from './components/ThreatLog';
import { Shield, Play, Pause, Zap, Settings } from 'lucide-react';

function App() {
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stats, setStats] = useState<NetworkStats>({
    totalPackets: 0,
    packetsPerSecond: 0,
    threatsDetected: 0,
    blockedConnections: 0,
    topSourceIPs: [],
    protocolDistribution: []
  });

  const updateStats = useCallback((newPackets: NetworkPacket[], newAlerts: ThreatAlert[]) => {
    const now = Date.now();
    const recentPackets = newPackets.filter(p => now - p.timestamp.getTime() < 1000);
    
    // Count IPs
    const ipCounts = new Map<string, number>();
    newPackets.forEach(p => {
      ipCounts.set(p.sourceIP, (ipCounts.get(p.sourceIP) || 0) + 1);
    });
    
    // Count protocols
    const protocolCounts = new Map<string, number>();
    newPackets.forEach(p => {
      protocolCounts.set(p.protocol, (protocolCounts.get(p.protocol) || 0) + 1);
    });
    
    setStats({
      totalPackets: newPackets.length,
      packetsPerSecond: recentPackets.length,
      threatsDetected: newAlerts.length,
      blockedConnections: newAlerts.filter(a => a.severity === 'CRITICAL').length,
      topSourceIPs: Array.from(ipCounts.entries())
        .map(([ip, count]) => ({ ip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      protocolDistribution: Array.from(protocolCounts.entries())
        .map(([protocol, count]) => ({ protocol, count }))
        .sort((a, b) => b.count - a.count)
    });
  }, []);

  // Simulate packet capture
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newPacket = generateRandomPacket();
      
      // Occasionally simulate port scan
      if (Math.random() < 0.05) {
        const scanPackets = generatePortScanPackets(newPacket.sourceIP, '192.168.1.100', 25);
        setPackets(prev => {
          const updated = [...prev, ...scanPackets];
          scanPackets.forEach(packet => {
            const detectedAlerts = threatDetector.analyzePacket(packet);
            if (detectedAlerts.length > 0) {
              setAlerts(prevAlerts => [...prevAlerts, ...detectedAlerts]);
            }
          });
          return updated;
        });
      } else {
        setPackets(prev => {
          const updated = [...prev, newPacket];
          if (updated.length > 1000) {
            updated.splice(0, updated.length - 1000);
          }
          return updated;
        });

        // Analyze for threats
        const detectedAlerts = threatDetector.analyzePacket(newPacket);
        if (detectedAlerts.length > 0) {
          setAlerts(prev => [...prev, ...detectedAlerts]);
        }
      }
    }, Math.random() * 500 + 100); // Random interval between 100-600ms

    return () => clearInterval(interval);
  }, [isMonitoring]);

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateStats(packets, alerts);
    }, 1000);
    return () => clearInterval(interval);
  }, [packets, alerts, updateStats]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const simulateAttack = () => {
    // Simulate various attack patterns
    const attackPackets = [
      ...generatePortScanPackets('203.0.113.666', '192.168.1.100', 50),
      generateRandomPacket(), // This might generate a suspicious payload
    ];

    setPackets(prev => [...prev, ...attackPackets]);
    
    attackPackets.forEach(packet => {
      const detectedAlerts = threatDetector.analyzePacket(packet);
      if (detectedAlerts.length > 0) {
        setAlerts(prev => [...prev, ...detectedAlerts]);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-400 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Network Intrusion Detection System</h1>
              <p className="text-gray-400 text-sm">Real-time network monitoring and threat detection</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={simulateAttack}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Simulate Attack
            </button>
            
            <button
              onClick={toggleMonitoring}
              className={`flex items-center px-4 py-2 rounded transition-colors ${
                isMonitoring 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Monitoring
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Network Statistics */}
        <NetworkStatsComponent stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Packet Monitor */}
          <PacketMonitor packets={packets} isActive={isMonitoring} />
          
          {/* Alert Panel */}
          <AlertPanel alerts={alerts} onClearAlerts={clearAlerts} />
        </div>

        {/* Threat Log */}
        <ThreatLog alerts={alerts} />
      </div>
    </div>
  );
}

export default App;