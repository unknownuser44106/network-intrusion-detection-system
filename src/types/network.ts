export interface NetworkPacket {
  id: string;
  timestamp: Date;
  sourceIP: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'FTP' | 'SSH' | 'DNS';
  payload: string;
  size: number;
  flags?: string[];
}

export interface ThreatAlert {
  id: string;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'BLACKLIST' | 'PORT_SCAN' | 'MALFORMED_PAYLOAD' | 'UNAUTHORIZED_PROTOCOL' | 'DDOS' | 'SUSPICIOUS_ACTIVITY';
  sourceIP: string;
  description: string;
  packet: NetworkPacket;
}

export interface NetworkStats {
  totalPackets: number;
  packetsPerSecond: number;
  threatsDetected: number;
  blockedConnections: number;
  topSourceIPs: { ip: string; count: number }[];
  protocolDistribution: { protocol: string; count: number }[];
}

export interface DetectionRule {
  id: string;
  name: string;
  enabled: boolean;
  threshold?: number;
  pattern?: string;
  action: 'ALERT' | 'BLOCK' | 'LOG';
}