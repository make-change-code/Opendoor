import React, { useState, useEffect } from 'react';

interface HealthStatus {
  status: string;
  uptime: number;
  memory: any;
  services: any;
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/health');
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch health status:', err);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const sseConfig = {
    sse_servers: ["http://localhost:50063/sse"],
    stdio_servers: []
  };

  const stdioConfig = {
    sse_servers: [],
    stdio_servers: [{
      name: "opendoor",
      command: "docker",
      args: [
        "run", "-i", "--rm", "-p", "50063:50063",
        "ghcr.io/make-change-code/opendoor-opendoor-mcp:latest"
      ]
    }]
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      margin: 0,
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0 0 10px 0',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚪 Opendoor MCP Server
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            OpenHands Configuration Interface
          </p>
          {healthStatus && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: healthStatus.status === 'healthy' ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,0,0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${healthStatus.status === 'healthy' ? '#00ff00' : '#ffff00'}`,
              marginTop: '10px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: healthStatus.status === 'healthy' ? '#00ff00' : '#ffff00',
                marginRight: '8px'
              }}></div>
              <span>Status: {healthStatus.status.toUpperCase()}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ color: '#4ade80', marginTop: 0 }}>🌐 SSE Configuration (Recommended)</h2>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Server-Sent Events for real-time streaming. Best for production OpenHands deployments.
            </p>
            <pre style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '20px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {JSON.stringify(sseConfig, null, 2)}
            </pre>
            <button
              onClick={() => copyToClipboard(JSON.stringify(sseConfig, null, 2), 'sse')}
              style={{
                background: copied === 'sse' ? '#22c55e' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '15px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              {copied === 'sse' ? '✅ Copied!' : '📋 Copy SSE Config'}
            </button>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ color: '#f59e0b', marginTop: 0 }}>⚡ STDIO Configuration</h2>
            <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Standard I/O transport via Docker. Good for local development and testing.
            </p>
            <pre style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '20px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {JSON.stringify(stdioConfig, null, 2)}
            </pre>
            <button
              onClick={() => copyToClipboard(JSON.stringify(stdioConfig, null, 2), 'stdio')}
              style={{
                background: copied === 'stdio' ? '#22c55e' : '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '15px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              {copied === 'stdio' ? '✅ Copied!' : '📋 Copy STDIO Config'}
            </button>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.2)',
          marginTop: '30px'
        }}>
          <h2 style={{ color: '#8b5cf6', marginTop: 0 }}>📊 Server Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#60a5fa', fontSize: '1.1rem' }}>🛠️ Available Tools</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>• execute_code - Multi-language execution</li>
                <li>• create_vscode_session - VS Code environments</li>
                <li>• create_playwright_session - Browser automation</li>
                <li>• manage_sessions - Session management</li>
                <li>• system_health - Health monitoring</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#34d399', fontSize: '1.1rem' }}>🌐 Endpoints</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>• Main: http://localhost:50063</li>
                <li>• Health: /health</li>
                <li>• SSE: /sse</li>
                <li>• Config: /config/stdio</li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#fbbf24', fontSize: '1.1rem' }}>📋 Languages (15)</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>• Python, JavaScript, TypeScript</li>
                <li>• Java, C, C++, C#, Rust, Go</li>
                <li>• PHP, Ruby, Perl, Lua</li>
                <li>• Swift, Objective-C</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.2)',
          marginTop: '30px'
        }}>
          <h2 style={{ color: '#f43f5e', marginTop: 0 }}>🚀 Usage Instructions</h2>
          <ol style={{ lineHeight: 1.8 }}>
            <li><strong>Copy</strong> one of the configurations above</li>
            <li><strong>Add</strong> it to your OpenHands configuration</li>
            <li><strong>Ensure</strong> both sse_servers and stdio_servers arrays are present</li>
            <li><strong>Test</strong> the connection in OpenHands</li>
          </ol>
          <div style={{
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            marginTop: '20px'
          }}>
            <strong>💡 Important:</strong> OpenHands requires both sse_servers and stdio_servers arrays in the configuration, even if one is empty.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
