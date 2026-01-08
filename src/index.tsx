import { Hono } from 'hono'

const app = new Hono()

// Serve the main Webume page
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webume - Brad Powell</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  <script src="https://unpkg.com/@mui/material@5/umd/material-ui.development.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Roboto, sans-serif; background: #0d1117; color: #c9d1d9; }
    .light-mode { background: #f6f8fa; color: #24292f; }
    .light-mode .card { background: #ffffff; border-color: #d0d7de; }
    .light-mode .chat-window { background: #ffffff; border-color: #d0d7de; }
    .light-mode .messages span { background: #f3f4f6 !important; color: #24292f !important; }
    .light-mode .messages span.user-msg { background: #58a6ff !important; color: white !important; }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .card { background: #161b22; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #30363d; transition: all 0.3s ease; }
    .card:hover { border-color: #58a6ff; box-shadow: 0 4px 20px rgba(88, 166, 255, 0.1); }
    .hero { text-align: center; padding: 64px 24px; }
    .hero h1 { font-size: 3.5rem; margin-bottom: 16px; background: linear-gradient(135deg, #58a6ff, #a371f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .timeline-entry { border-left: 3px solid #58a6ff; padding-left: 24px; margin-bottom: 48px; position: relative; }
    .timeline-entry::before { content: ''; position: absolute; left: -8px; top: 0; width: 13px; height: 13px; background: #58a6ff; border-radius: 50%; }
    .chat-bubble { position: fixed; bottom: 24px; right: 24px; width: 64px; height: 64px; background: linear-gradient(135deg, #58a6ff, #a371f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.6); z-index: 1000; transition: transform 0.3s ease; }
    .chat-bubble:hover { transform: scale(1.1); }
    .chat-window { position: fixed; bottom: 96px; right: 24px; width: 380px; height: 560px; background: #161b22; border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.8); display: flex; flex-direction: column; border: 1px solid #30363d; z-index: 1000; animation: slideUp 0.3s ease; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .messages { flex: 1; padding: 20px; overflow-y: auto; }
    .input-area { display: flex; padding: 16px; border-top: 1px solid #30363d; gap: 8px; }
    .input-area input { flex: 1; padding: 12px 16px; border-radius: 24px; border: 1px solid #30363d; background: #0d1117; color: #c9d1d9; outline: none; }
    .input-area input:focus { border-color: #58a6ff; }
    .input-area button { padding: 12px 20px; border-radius: 24px; border: none; background: #58a6ff; color: white; cursor: pointer; font-weight: 500; }
    .input-area button:hover { background: #4090e0; }
    .badge { background: linear-gradient(135deg, #238636, #2ea043); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
    .metric-chip { background: linear-gradient(135deg, #238636, #2ea043); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.875rem; font-weight: 500; display: inline-block; margin: 4px; }
    .toxicity-bar { height: 8px; border-radius: 4px; background: #21262d; overflow: hidden; margin-top: 8px; }
    .toxicity-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
    .section-title { font-size: 1.75rem; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
    .section-title::before { content: ''; width: 4px; height: 28px; background: linear-gradient(180deg, #58a6ff, #a371f7); border-radius: 2px; }
    .validation-item { background: #21262d; border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
    .validation-text { flex: 1; }
    .validation-author { color: #8b949e; font-size: 0.875rem; margin-top: 8px; }
    .company-row { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #21262d; border-radius: 12px; margin-bottom: 12px; }
    .nav-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .nav-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .toggle-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid #30363d; background: transparent; color: #c9d1d9; cursor: pointer; transition: all 0.2s; }
    .toggle-btn:hover { border-color: #58a6ff; background: rgba(88, 166, 255, 0.1); }
    .toggle-btn.active { background: #58a6ff; color: white; border-color: #58a6ff; }
    .media-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 24px; }
    .media-item { border-radius: 12px; overflow: hidden; }
    .media-item iframe, .media-item img { width: 100%; display: block; }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .chat-window { width: calc(100vw - 48px); right: 24px; bottom: 96px; height: 480px; }
      .container { padding: 16px; }
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    const mockData = {
      profile: { 
        name: 'Brad Powell', 
        tagline: '30+ years driving real revenue growth — no more one-paragraph lies.', 
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BP&backgroundColor=58a6ff'
      },
      timeline: [
        { 
          id: 1, 
          title: 'Senior Ops Leader', 
          company: 'Acme Corp', 
          dates: '2015–2025', 
          narrative: 'Led complete organizational turnaround. Optimized processes across 6 departments, built real-time analytics dashboards, and grew team from 20 to 80 while maintaining culture. Implemented agile methodologies that reduced delivery times by 40%.', 
          metrics: ['Revenue +47%', 'Costs -22%', 'Team efficiency +65%', 'Customer satisfaction +35%'], 
          media: ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://via.placeholder.com/800x400/238636/ffffff?text=Revenue+Growth+Chart'] 
        },
        { 
          id: 2, 
          title: 'Operations Manager', 
          company: 'TechGiant Inc', 
          dates: '2008–2015', 
          narrative: 'Scaled operations during hyper-growth phase from Series A to IPO. Implemented automated systems that handled 10x volume increase without proportional headcount growth. Built the foundation for international expansion.', 
          metrics: ['Volume +1000%', 'Error rate -90%', 'Processing time -60%'], 
          media: [] 
        },
        { 
          id: 3, 
          title: 'Process Engineer', 
          company: 'StartupXYZ', 
          dates: '2002–2008', 
          narrative: 'Early employee who helped establish operational excellence from day one. Created SOPs that became industry standards. Mentored junior staff who went on to lead their own teams.', 
          metrics: ['Efficiency +200%', 'Quality score 99.2%'], 
          media: [] 
        },
      ],
      validations: {
        1: [
          { text: 'Brad was instrumental in the turnaround — saved my team countless hours with his process improvements.', author: 'Sarah Chen, VP Engineering', approved: true },
          { text: 'Best leader I worked under. Data-driven and fair. Always had time for 1:1s despite his schedule.', author: 'Mike Rodriguez, Senior Analyst', approved: true },
          { text: 'Transformed a failing department into a profit center. His dashboards are still used today.', author: 'Jennifer Walsh, CFO', approved: true },
        ],
        2: [
          { text: 'Brad built systems that scaled with us through IPO. His foresight saved millions.', author: 'David Park, CTO', approved: true },
          { text: 'Incredible mentor. Learned more from Brad in 2 years than my entire MBA.', author: 'Lisa Thompson, Director', approved: true },
        ],
        3: [
          { text: 'Brad set the standard for operational excellence. A true professional.', author: 'Tom Baker, Founder', approved: true },
        ]
      },
      truthVault: [
        { company: 'Acme Corp', toxicity: 7, comment: 'High pressure but fair leadership, good work-life balance initiatives' },
        { company: 'TechGiant Inc', toxicity: 8, comment: 'Great culture, transparent communication, strong benefits' },
        { company: 'BadCo Industries', toxicity: 2, comment: 'Toxic leadership, high turnover, avoid if possible' },
        { company: 'GoodPlace Solutions', toxicity: 9, comment: 'Supportive, transparent, employee-first culture' },
        { company: 'Mediocre Ltd', toxicity: 5, comment: 'Average workplace, nothing special but not terrible' },
        { company: 'StartupXYZ', toxicity: 6, comment: 'Fast-paced, demanding but rewarding if you like chaos' },
      ]
    };

    const App = () => {
      const [darkMode, setDarkMode] = useState(true);
      const [data, setData] = useState(mockData);
      const [isEditMode, setIsEditMode] = useState(false);
      const [chatOpen, setChatOpen] = useState(false);
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const [activeSection, setActiveSection] = useState('all');
      const messagesEndRef = useRef(null);

      useEffect(() => {
        const saved = localStorage.getItem('webumeData');
        if (saved) {
          try {
            setData(JSON.parse(saved));
          } catch (e) {
            console.log('Using default data');
          }
        }
      }, []);

      useEffect(() => {
        localStorage.setItem('webumeData', JSON.stringify(data));
      }, [data]);

      useEffect(() => {
        if (darkMode) {
          document.body.classList.remove('light-mode');
        } else {
          document.body.classList.add('light-mode');
        }
      }, [darkMode]);

      const getToxicityColor = (score) => {
        if (score >= 7) return '#238636';
        if (score >= 4) return '#d29922';
        return '#da3633';
      };

      const getToxicityLabel = (score) => {
        if (score >= 7) return 'Healthy';
        if (score >= 4) return 'Mixed';
        return 'Toxic';
      };

      const sendMessage = () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');

        setTimeout(() => {
          let response = "I'm Brad's AI headhunter. He drove 47% revenue growth at Acme Corp and scaled TechGiant through IPO. What would you like to know?";
          
          const lowerInput = userMsg.toLowerCase();
          
          if (lowerInput.includes('salary') || lowerInput.includes('compensation') || lowerInput.includes('pay')) {
            response = "Brad targets senior executive-level compensation. He's flexible for the right opportunity with strong equity components. What's your range?";
          } else if (lowerInput.includes('interview') || lowerInput.includes('meet') || lowerInput.includes('talk')) {
            response = "Brad would love to connect! He's available for a 30-minute intro call this week. Want me to share his calendar link?";
          } else if (lowerInput.includes('truth') || lowerInput.includes('culture') || lowerInput.includes('toxic')) {
            response = "Great question! The Truth Vault shows company culture ratings. Brad believes in transparency — check the scores above. What's your company's culture really like?";
          } else if (lowerInput.includes('experience') || lowerInput.includes('background')) {
            response = "30+ years of operational excellence: Senior Ops Leader at Acme (47% revenue growth), Operations Manager at TechGiant (scaled 10x through IPO), and early employee at StartupXYZ. All verified with colleague testimonials above!";
          } else if (lowerInput.includes('skills') || lowerInput.includes('strength')) {
            response = "Brad's superpowers: Process optimization, team scaling, data-driven decision making, turnaround leadership, and building dashboards that executives actually use. He's particularly strong at taking chaos and creating order.";
          } else if (lowerInput.includes('available') || lowerInput.includes('start')) {
            response = "Brad can start within 2-4 weeks notice period. For the right role, he's open to discussing accelerated timelines.";
          } else if (lowerInput.includes('remote') || lowerInput.includes('location')) {
            response = "Brad is flexible on location — open to remote, hybrid, or on-site depending on the role. He's based in San Francisco but willing to relocate for executive positions.";
          }
          
          setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
        }, 800 + Math.random() * 600);
      };

      const scrollToBottom = () => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      };

      useEffect(scrollToBottom, [messages]);

      return (
        <div className="container">
          {/* Navigation */}
          <div className="nav-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={data.profile.avatar} alt="Avatar" style={{ width: 48, height: 48, borderRadius: '50%' }} />
              <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>Webume</span>
            </div>
            <div className="nav-controls">
              <button 
                className={"toggle-btn" + (activeSection === 'all' ? ' active' : '')}
                onClick={() => setActiveSection('all')}
              >All</button>
              <button 
                className={"toggle-btn" + (activeSection === 'timeline' ? ' active' : '')}
                onClick={() => setActiveSection('timeline')}
              >Timeline</button>
              <button 
                className={"toggle-btn" + (activeSection === 'truth' ? ' active' : '')}
                onClick={() => setActiveSection('truth')}
              >Truth Vault</button>
              <button 
                className="toggle-btn"
                onClick={() => setDarkMode(!darkMode)}
              >{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
            </div>
          </div>

          {/* Hero */}
          {(activeSection === 'all' || activeSection === 'timeline') && (
            <div className="hero card">
              <h1>{data.profile.name}</h1>
              <p style={{ fontSize: '1.25rem', color: '#8b949e', maxWidth: 600, margin: '0 auto 32px' }}>
                {data.profile.tagline}
              </p>
              {data.profile.videoUrl && (
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                  <iframe 
                    width="100%" 
                    height="450" 
                    src={data.profile.videoUrl} 
                    frameBorder="0" 
                    allowFullScreen 
                    style={{ borderRadius: 12 }}
                  ></iframe>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {(activeSection === 'all' || activeSection === 'timeline') && (
            <div className="card">
              <h2 className="section-title">Career Timeline</h2>
              {data.timeline.map(entry => (
                <div key={entry.id} className="timeline-entry">
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>
                    {entry.title}
                    <span style={{ color: '#58a6ff' }}> — {entry.company}</span>
                  </h3>
                  <p style={{ color: '#8b949e', marginBottom: 16 }}>{entry.dates}</p>
                  <p style={{ lineHeight: 1.7, marginBottom: 16 }}>{entry.narrative}</p>
                  
                  <div style={{ marginBottom: 24 }}>
                    {entry.metrics.map((m, i) => (
                      <span key={i} className="metric-chip">{m}</span>
                    ))}
                  </div>

                  {entry.media.length > 0 && (
                    <div className="media-grid">
                      {entry.media.map((m, i) => (
                        <div key={i} className="media-item">
                          {m.includes('youtube') ? 
                            <iframe height="250" src={m} frameBorder="0" allowFullScreen></iframe> :
                            <img src={m} alt="Evidence" style={{ height: 250, objectFit: 'cover' }} />
                          }
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Validations */}
                  {data.validations[entry.id] && data.validations[entry.id].length > 0 && (
                    <div style={{ marginTop: 32 }}>
                      <h4 style={{ marginBottom: 16, color: '#8b949e' }}>
                        💬 Colleague Validations ({data.validations[entry.id].filter(c => c.approved).length})
                      </h4>
                      {data.validations[entry.id].filter(c => c.approved).map((c, i) => (
                        <div key={i} className="validation-item">
                          <div className="validation-text">
                            <p style={{ margin: 0, fontStyle: 'italic' }}>"{c.text}"</p>
                            <p className="validation-author">— {c.author}</p>
                          </div>
                          <span className="badge">✓ Verified</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Truth Vault */}
          {(activeSection === 'all' || activeSection === 'truth') && (
            <div className="card">
              <h2 className="section-title">Truth Vault — Company Transparency</h2>
              <p style={{ color: '#8b949e', marginBottom: 24 }}>
                Anonymous culture ratings from verified employees. Higher scores = healthier workplace.
              </p>
              {[...new Set(data.truthVault.map(e => e.company))].map(company => {
                const entries = data.truthVault.filter(e => e.company === company);
                const avgScore = (entries.reduce((sum, e) => sum + e.toxicity, 0) / entries.length);
                const color = getToxicityColor(avgScore);
                
                return (
                  <div key={company} className="company-row">
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px' }}>{company}</h4>
                      <p style={{ color: '#8b949e', fontSize: '0.875rem', margin: 0 }}>
                        {entries[0].comment}
                      </p>
                      <div className="toxicity-bar" style={{ width: 200, marginTop: 8 }}>
                        <div 
                          className="toxicity-fill" 
                          style={{ width: avgScore * 10 + '%', background: color }}
                        ></div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        color: color 
                      }}>{avgScore.toFixed(1)}</span>
                      <span style={{ color: '#8b949e' }}>/10</span>
                      <p style={{ 
                        color: color, 
                        fontSize: '0.75rem', 
                        margin: '4px 0 0',
                        fontWeight: 500 
                      }}>{getToxicityLabel(avgScore)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Contact CTA */}
          {(activeSection === 'all') && (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <h2 style={{ marginBottom: 16 }}>Ready to talk?</h2>
              <p style={{ color: '#8b949e', marginBottom: 24 }}>
                Click the chat bubble or reach out directly
              </p>
              <button 
                onClick={() => setChatOpen(true)}
                style={{
                  padding: '16px 32px',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #58a6ff, #a371f7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                💬 Start a Conversation
              </button>
            </div>
          )}

          {/* Chat Bubble */}
          <div className="chat-bubble" onClick={() => setChatOpen(!chatOpen)}>
            <span style={{ fontSize: 28 }}>{chatOpen ? '✕' : '💬'}</span>
          </div>

          {/* Chat Window */}
          {chatOpen && (
            <div className="chat-window">
              <div style={{ 
                padding: '20px', 
                background: 'linear-gradient(135deg, #58a6ff, #a371f7)', 
                borderRadius: '16px 16px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <img 
                  src={data.profile.avatar} 
                  alt="AI" 
                  style={{ width: 40, height: 40, borderRadius: '50%', background: 'white' }} 
                />
                <div>
                  <h3 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Brad's AI Headhunter</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>Always online • Knows everything</p>
                </div>
              </div>
              <div className="messages">
                <div style={{ 
                  background: '#21262d', 
                  padding: '12px 16px', 
                  borderRadius: '16px', 
                  marginBottom: '12px',
                  maxWidth: '85%'
                }}>
                  <p style={{ margin: 0 }}>👋 Hi! I'm here to tell you why Brad is perfect for your team. Ask me anything about his experience, skills, or availability!</p>
                </div>
                {messages.map((m, i) => (
                  <div key={i} style={{ 
                    textAlign: m.sender === 'user' ? 'right' : 'left', 
                    marginBottom: '12px' 
                  }}>
                    <span 
                      className={m.sender === 'user' ? 'user-msg' : ''}
                      style={{ 
                        background: m.sender === 'bot' ? '#21262d' : '#58a6ff', 
                        color: m.sender === 'bot' ? '#c9d1d9' : 'white', 
                        padding: '12px 16px', 
                        borderRadius: '16px', 
                        maxWidth: '85%', 
                        display: 'inline-block',
                        textAlign: 'left'
                      }}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="input-area">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about Brad..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer style={{ textAlign: 'center', padding: '32px 0', color: '#8b949e', fontSize: '0.875rem' }}>
            <p>Built with Webume — The transparent resume platform</p>
            <p style={{ marginTop: '8px' }}>© 2025 Brad Powell. All career claims verified.</p>
          </footer>
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`)
})

export default app
