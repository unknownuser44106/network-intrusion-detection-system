import { NetworkPacket, ThreatAlert } from '../types/network';

const BLACKLISTED_IPS = new Set([
  '203.0.113.666', '198.51.100.999', '192.0.2.999', '10.0.0.666',
  '172.16.1.999', '185.220.101.42', '91.189.89.199', '185.234.218.7'
]);

const SUSPICIOUS_PATTERNS = [
  /SELECT.*FROM.*WHERE/i,
  /\.\.\/.*\/etc\/passwd/i,
  /<script.*>.*<\/script>/i,
  /UNION.*SELECT/i,
  /cmd\.exe/i,
  /powershell\.exe/i,
  /wget.*http/i,
  /nc\s+-e/i,
  /\/bin\/sh/i,
  /eval\(/i
];

const UNAUTHORIZED_PROTOCOLS = new Map<number, string>([
  [21, 'FTP'],
  [23, 'Telnet'],
  [135, 'RPC'],
  [139, 'NetBIOS'],
  [445, 'SMB'],
  [1433, 'MSSQL'],
  [3389, 'RDP']
]);

class ThreatDetector {
  private packetHistory: Map<string, NetworkPacket[]> = new Map();
  private portScanTracker: Map<string, Set<number>> = new Map();
  private requestFrequency: Map<string, number> = new Map();
  
  analyzePacket(packet: NetworkPacket): ThreatAlert[] {
    const alerts: ThreatAlert[] = [];
    
    // Check blacklisted IPs
    if (BLACKLISTED_IPS.has(packet.sourceIP)) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        severity: 'HIGH',
        type: 'BLACKLIST',
        sourceIP: packet.sourceIP,
        description: `⚠️ Unauthorized packet detected from blacklisted IP: ${packet.sourceIP} on Port: ${packet.destinationPort} using Protocol: ${packet.protocol}`,
        packet
      });
    }
    
    // Check for suspicious payloads
    const suspiciousPattern = SUSPICIOUS_PATTERNS.find(pattern => pattern.test(packet.payload));
    if (suspiciousPattern) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        severity: 'CRITICAL',
        type: 'MALFORMED_PAYLOAD',
        sourceIP: packet.sourceIP,
        description: `🚨 Malicious payload detected from IP: ${packet.sourceIP} - Potential injection attack`,
        packet
      });
    }
    
    // Check for unauthorized protocols
    if (UNAUTHORIZED_PROTOCOLS.has(packet.destinationPort)) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        severity: 'MEDIUM',
        type: 'UNAUTHORIZED_PROTOCOL',
        sourceIP: packet.sourceIP,
        description: `⚠️ Unauthorized ${UNAUTHORIZED_PROTOCOLS.get(packet.destinationPort)} connection attempt from IP: ${packet.sourceIP}`,
        packet
      });
    }
    
    // Track packet history for this IP
    if (!this.packetHistory.has(packet.sourceIP)) {
      this.packetHistory.set(packet.sourceIP, []);
    }
    const history = this.packetHistory.get(packet.sourceIP)!;
    history.push(packet);
    
    // Keep only last 100 packets per IP
    if (history.length > 100) {
      history.shift();
    }
    
    // Check for port scanning
    this.checkPortScanning(packet, alerts);
    
    // Check for DDoS patterns
    this.checkDDoSPatterns(packet, alerts);
    
    return alerts;
  }
  
  private checkPortScanning(packet: NetworkPacket, alerts: ThreatAlert[]) {
    if (!this.portScanTracker.has(packet.sourceIP)) {
      this.portScanTracker.set(packet.sourceIP, new Set());
    }
    
    const ports = this.portScanTracker.get(packet.sourceIP)!;
    ports.add(packet.destinationPort);
    
    // If more than 20 different ports accessed in short time, flag as port scan
    if (ports.size > 20) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        severity: 'HIGH',
        type: 'PORT_SCAN',
        sourceIP: packet.sourceIP,
        description: `🚨 Possible port scan detected from IP: ${packet.sourceIP} (${ports.size} ports accessed)`,
        packet
      });
      
      // Reset counter after detection
      ports.clear();
    }
  }
  
  private checkDDoSPatterns(packet: NetworkPacket, alerts: ThreatAlert[]) {
    const currentTime = Date.now();
    const key = `${packet.sourceIP}_${Math.floor(currentTime / 1000)}`; // Per second
    
    this.requestFrequency.set(key, (this.requestFrequency.get(key) || 0) + 1);
    
    // Clean old entries
    for (const [k, _] of this.requestFrequency) {
      if (parseInt(k.split('_')[1]) < Math.floor(currentTime / 1000) - 10) {
        this.requestFrequency.delete(k);
      }
    }
    
    // If more than 100 requests per second from same IP
    if (this.requestFrequency.get(key)! > 100) {
      alerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        severity: 'CRITICAL',
        type: 'DDOS',
        sourceIP: packet.sourceIP,
        description: `🚨 Possible DDoS attack detected from IP: ${packet.sourceIP} (${this.requestFrequency.get(key)} req/sec)`,
        packet
      });
    }
  }
}

export const threatDetector = new ThreatDetector();