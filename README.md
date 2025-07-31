# Network Intrusion Detection System

A real-time network intrusion detection system built with React, TypeScript, and Tailwind CSS. This application simulates network packet monitoring and provides comprehensive threat detection capabilities with an intuitive dashboard interface.

![Network IDS Dashboard](https://via.placeholder.com/800x400/1f2937/ffffff?text=Network+IDS+Dashboard)

## 🚀 Features

### Real-time Monitoring
- **Live Packet Capture**: Monitor network packets in real-time with detailed protocol information
- **Dynamic Statistics**: Track packets per second, total packets, and network activity
- **Protocol Analysis**: Support for TCP, UDP, HTTP, HTTPS, FTP, SSH, DNS, and ICMP protocols

### Threat Detection
- **Blacklist Monitoring**: Automatic detection of packets from known malicious IP addresses
- **Port Scan Detection**: Identifies potential port scanning activities
- **Payload Analysis**: Scans for malicious payloads and injection attempts
- **DDoS Detection**: Monitors for distributed denial-of-service attack patterns
- **Unauthorized Protocol Detection**: Flags suspicious protocol usage

### Security Alerts
- **Multi-level Severity**: Critical, High, Medium, and Low severity classifications
- **Real-time Notifications**: Instant alerts for detected threats
- **Detailed Logging**: Comprehensive threat analysis with timestamps and descriptions
- **Export Functionality**: CSV export for security audit trails

### User Interface
- **Dark Theme**: Professional cybersecurity-focused design
- **Responsive Layout**: Optimized for desktop and mobile viewing
- **Interactive Dashboard**: Real-time charts and statistics
- **Advanced Filtering**: Search and filter threats by severity, type, and IP address

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Code Quality**: ESLint with TypeScript support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/network-intrusion-detection-system.git
   cd network-intrusion-detection-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🎯 Usage

### Starting Monitoring
1. Click the "Start Monitoring" button to begin packet capture simulation
2. Watch real-time packets appear in the Live Packet Monitor
3. Observe network statistics updating in real-time

### Threat Detection
- The system automatically analyzes packets for threats
- Alerts appear in the Live Threat Alerts panel
- View detailed threat information in the Threat Analysis Log

### Simulating Attacks
- Use the "Simulate Attack" button to generate test security events
- This creates various attack patterns including port scans and malicious payloads
- Perfect for testing and demonstration purposes

### Exporting Data
- Click "Export CSV" in the Threat Analysis Log to download security reports
- Filter data by severity, type, or search terms before exporting

## 🔧 Configuration

The system includes several configurable components:

### Threat Detection Rules
- **Blacklisted IPs**: Modify the blacklist in `src/utils/threatDetection.ts`
- **Suspicious Patterns**: Add new payload patterns for detection
- **Port Scanning Thresholds**: Adjust sensitivity in the threat detector

### Packet Generation
- **IP Ranges**: Customize network ranges in `src/utils/packetGenerator.ts`
- **Protocol Distribution**: Modify protocol probabilities
- **Payload Types**: Add new normal and suspicious payload examples

## 📊 Architecture

```
src/
├── components/          # React components
│   ├── AlertPanel.tsx   # Live threat alerts display
│   ├── NetworkStats.tsx # Network statistics dashboard
│   ├── PacketMonitor.tsx# Real-time packet monitoring
│   └── ThreatLog.tsx    # Comprehensive threat logging
├── types/               # TypeScript type definitions
│   └── network.ts       # Network packet and alert types
├── utils/               # Utility functions
│   ├── packetGenerator.ts # Network packet simulation
│   └── threatDetection.ts # Threat analysis engine
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🚨 Security Features

### Detection Capabilities
- **SQL Injection**: Detects common SQL injection patterns
- **XSS Attacks**: Identifies cross-site scripting attempts
- **Command Injection**: Monitors for system command execution attempts
- **Path Traversal**: Detects directory traversal attacks
- **Malicious IPs**: Blocks known threat actor IP addresses

### Alert Types
- `BLACKLIST`: Traffic from known malicious sources
- `PORT_SCAN`: Systematic port scanning activities
- `MALFORMED_PAYLOAD`: Suspicious or malicious packet content
- `UNAUTHORIZED_PROTOCOL`: Unexpected protocol usage
- `DDOS`: Distributed denial-of-service patterns
- `SUSPICIOUS_ACTIVITY`: General anomalous behavior

## 🎨 Screenshots

### Main Dashboard
The main dashboard provides a comprehensive view of network activity with real-time statistics and monitoring capabilities.

### Threat Alerts
Live threat detection with detailed information about security events and their severity levels.

### Packet Analysis
Detailed packet inspection showing protocol information, source/destination details, and payload analysis.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React and TypeScript best practices
- Inspired by professional network security monitoring tools
- Uses Tailwind CSS for responsive, professional styling
- Icons provided by Lucide React

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub.

---

**Note**: This is a simulation tool for educational and demonstration purposes. For production network security monitoring, please use professional-grade security tools and consult with cybersecurity experts.