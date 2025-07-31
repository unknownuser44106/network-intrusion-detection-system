import React from 'react';
import { ThreatAlert } from '../types/network';
import { AlertTriangle, Shield, Zap, Activity } from 'lucide-react';

interface AlertPanelProps {
  alerts: ThreatAlert[];
  onClearAlerts: () => void;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onClearAlerts }) => {
  const getSeverityColor = (severity: ThreatAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-900 border-red-500 text-red-100';
      case 'HIGH': return 'bg-orange-900 border-orange-500 text-orange-100';
      case 'MEDIUM': return 'bg-yellow-900 border-yellow-500 text-yellow-100';
      case 'LOW': return 'bg-blue-900 border-blue-500 text-blue-100';
      default: return 'bg-gray-900 border-gray-500 text-gray-100';
    }
  };

  const getSeverityIcon = (severity: ThreatAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL': return <Zap className="w-4 h-4" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
      case 'MEDIUM': return <Shield className="w-4 h-4" />;
      case 'LOW': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const recentAlerts = alerts.slice(-10).reverse();

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
          Live Threat Alerts
        </h3>
        <button
          onClick={onClearAlerts}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recentAlerts.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No active threats detected</p>
          </div>
        ) : (
          recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded border-l-4 ${getSeverityColor(alert.severity)} animate-pulse`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getSeverityIcon(alert.severity)}
                  <span className="ml-2 font-semibold text-sm">{alert.severity}</span>
                  <span className="ml-2 px-2 py-1 bg-black bg-opacity-30 rounded text-xs">
                    {alert.type}
                  </span>
                </div>
                <span className="text-xs opacity-75">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm font-mono">{alert.description}</p>
              <div className="mt-2 text-xs opacity-75 font-mono">
                {alert.sourceIP} → {alert.packet.destinationIP}:{alert.packet.destinationPort} ({alert.packet.protocol})
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertPanel;