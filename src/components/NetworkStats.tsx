import React from 'react';
import { NetworkStats } from '../types/network';
import { Activity, Shield, Zap, TrendingUp } from 'lucide-react';

interface NetworkStatsProps {
  stats: NetworkStats;
}

const NetworkStatsComponent: React.FC<NetworkStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Packets</p>
            <p className="text-2xl font-bold text-white">{stats.totalPackets.toLocaleString()}</p>
          </div>
          <Activity className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Packets/Second</p>
            <p className="text-2xl font-bold text-white">{stats.packetsPerSecond}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Threats Detected</p>
            <p className="text-2xl font-bold text-red-400">{stats.threatsDetected}</p>
          </div>
          <Shield className="w-8 h-8 text-red-400" />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Blocked</p>
            <p className="text-2xl font-bold text-orange-400">{stats.blockedConnections}</p>
          </div>
          <Zap className="w-8 h-8 text-orange-400" />
        </div>
      </div>
    </div>
  );
};

export default NetworkStatsComponent;