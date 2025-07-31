import React, { useState } from 'react';
import { ThreatAlert } from '../types/network';
import { Download, Filter, Search, Calendar } from 'lucide-react';

interface ThreatLogProps {
  alerts: ThreatAlert[];
}

const ThreatLog: React.FC<ThreatLogProps> = ({ alerts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.sourceIP.includes(searchTerm);
    const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchesType = typeFilter === 'ALL' || alert.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesType;
  }).reverse();

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Severity', 'Type', 'Source IP', 'Description'],
      ...filteredAlerts.map(alert => [
        alert.timestamp.toISOString(),
        alert.severity,
        alert.type,
        alert.sourceIP,
        alert.description.replace(/[🚨⚠️]/g, '').trim()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Calendar className="w-5 h-5 text-purple-400 mr-2" />
          Threat Analysis Log
        </h3>
        <button
          onClick={exportLogs}
          className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="BLACKLIST">Blacklist</option>
          <option value="PORT_SCAN">Port Scan</option>
          <option value="MALFORMED_PAYLOAD">Malformed Payload</option>
          <option value="UNAUTHORIZED_PROTOCOL">Unauthorized Protocol</option>
          <option value="DDOS">DDoS</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-3 text-gray-300">Time</th>
              <th className="text-left p-3 text-gray-300">Severity</th>
              <th className="text-left p-3 text-gray-300">Type</th>
              <th className="text-left p-3 text-gray-300">Source IP</th>
              <th className="text-left p-3 text-gray-300">Description</th>
            </tr>
          </thead>
          <tbody className="max-h-96 overflow-y-auto">
            {filteredAlerts.slice(0, 100).map((alert) => (
              <tr key={alert.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-3 text-gray-300 font-mono text-xs">
                  {alert.timestamp.toLocaleString()}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    alert.severity === 'CRITICAL' ? 'bg-red-900 text-red-200' :
                    alert.severity === 'HIGH' ? 'bg-orange-900 text-orange-200' :
                    alert.severity === 'MEDIUM' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-blue-900 text-blue-200'
                  }`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                    {alert.type}
                  </span>
                </td>
                <td className="p-3 text-blue-400 font-mono">{alert.sourceIP}</td>
                <td className="p-3 text-gray-300 max-w-xs truncate">{alert.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No alerts match your filters</p>
        </div>
      )}
    </div>
  );
};

export default ThreatLog;