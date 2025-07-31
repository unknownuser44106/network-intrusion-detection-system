import React from 'react';
import { NetworkPacket } from '../types/network';
import { Network, Clock, Database } from 'lucide-react';

interface PacketMonitorProps {
  packets: NetworkPacket[];
  isActive: boolean;
}

const PacketMonitor: React.FC<PacketMonitorProps> = ({ packets, isActive }) => {
  const recentPackets = packets.slice(-15).reverse();

  const getProtocolColor = (protocol: NetworkPacket['protocol']) => {
    switch (protocol) {
      case 'HTTP': return 'text-blue-400';
      case 'HTTPS': return 'text-green-400';
      case 'TCP': return 'text-purple-400';
      case 'UDP': return 'text-yellow-400';
      case 'SSH': return 'text-red-400';
      case 'FTP': return 'text-orange-400';
      case 'DNS': return 'text-cyan-400';
      case 'ICMP': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Network className="w-5 h-5 text-blue-400 mr-2" />
          Live Packet Monitor
        </h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-300">
            {isActive ? 'Monitoring Active' : 'Monitoring Stopped'}
          </span>
        </div>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
        {recentPackets.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No packets captured</p>
          </div>
        ) : (
          recentPackets.map((packet) => (
            <div
              key={packet.id}
              className="p-2 bg-gray-900 rounded border-l-2 border-blue-500 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-400 text-xs">
                    {packet.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`font-semibold ${getProtocolColor(packet.protocol)}`}>
                    {packet.protocol}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">{packet.size} bytes</span>
              </div>
              
              <div className="mt-1 text-gray-300">
                <span className="text-blue-300">{packet.sourceIP}</span>
                <span className="text-gray-500">:</span>
                <span className="text-blue-200">{packet.sourcePort}</span>
                <span className="text-gray-500 mx-2">→</span>
                <span className="text-green-300">{packet.destinationIP}</span>
                <span className="text-gray-500">:</span>
                <span className="text-green-200">{packet.destinationPort}</span>
              </div>
              
              <div className="mt-1 text-gray-400 text-xs truncate">
                {packet.payload}
              </div>
              
              {packet.flags && packet.flags.length > 0 && (
                <div className="mt-1">
                  {packet.flags.map((flag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-purple-900 text-purple-200 px-1 py-0.5 rounded text-xs mr-1"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PacketMonitor;