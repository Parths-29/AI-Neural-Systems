import { useState, useEffect } from 'react'
import axios from 'axios'
import { Home, BookOpen, Activity, Sparkles, Trash2 } from 'lucide-react'

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('main') // 'main', 'diary', 'insights'
  const [accentColor, setAccentColor] = useState('#3b82f6') // Default blue

  // WELCOME QUOTES
  const quotes = [
    "How are you feeling right now?",
    "Take a deep breath. We are listening.",
    "Your emotions matter. Tell us everything.",
    "It's okay to feel whatever you're feeling.",
    "Let it all out. No judgment here.",
    "Writing it down is the first step to healing."
  ];

  useEffect(() => {
    // Loading screen for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Pick a random quote on load
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setWelcomeMessage(randomQuote);
    fetchHistory();

    return () => clearTimeout(timer);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/history');
      setHistory(res.data);
    } catch (err) {
      console.warn("Backend offline");
    }
  };

  const analyzeEmotion = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/analyze', { text: input });
      setResult(res.data);
      setInput('');
      fetchHistory();
      // Set accent color based on emotion
      setAccentColor(getEmotionColor(res.data.emotion));
    } catch (err) {
      alert("System Offline");
    }
    setLoading(false);
  }

  const getEmotionColor = (emotion) => {
    const colors = {
      'Anger': '#ef4444', // Soft Red
      'Fear': '#f59e0b', // Orange
      'Joy': '#eab308', // Yellow/Gold
      'Love': '#ec4899', // Pink
      'Sadness': '#3b82f6', // Ocean Blue
      'Surprise': '#8b5cf6' // Purple
    };
    return colors[emotion] || '#3b82f6'; // Default blue
  }

  const getCopingInsight = (emotion) => {
    const insights = {
      'Anger': 'Try 4-7-8 breathing exercises: Inhale for 4 seconds, hold for 7, exhale for 8.',
      'Fear': 'Ground yourself: Name 5 things you can see, 4 you can touch, 3 you can hear.',
      'Joy': 'Capture this moment! What made it happen? Write it down to revisit later.',
      'Love': 'Share the love: Reach out to someone you care about and express your feelings.',
      'Sadness': 'Consider a warm walk or listening to acoustic music to lift your spirits.',
      'Surprise': 'Embrace the unexpected! Reflect on how this surprise makes you feel.'
    };
    return insights[emotion] || 'Take a moment to breathe and reflect on your emotions.';
  }

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      try {
        // Assuming there's an endpoint to clear history, or we can just clear local state
        setHistory([]);
        // If backend has a clear endpoint, uncomment below:
        // await axios.delete('http://localhost:3000/api/history');
      } catch (err) {
        console.warn("Could not clear history");
      }
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }

  // Show loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h1 className="loading-title">EmotionAI</h1>
          <p className="loading-subtitle">Preparing your emotional journey...</p>
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      
      {/* SIDEBAR */}
      <div className="history-panel">
        <div className="nav-buttons">
          <button
            className={`nav-btn ${currentView === 'main' ? 'active' : ''}`}
            onClick={() => setCurrentView('main')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          <button
            className={`nav-btn ${currentView === 'diary' ? 'active' : ''}`}
            onClick={() => setCurrentView('diary')}
          >
            <BookOpen size={18} />
            <span>Diary</span>
          </button>
          <button
            className={`nav-btn ${currentView === 'insights' ? 'active' : ''}`}
            onClick={() => setCurrentView('insights')}
          >
            <Sparkles size={18} />
            <span>Insights</span>
          </button>
        </div>

        <h3>Your Journal</h3>
        <div className="history-list">
          {history.length === 0 && <p style={{opacity:0.5, fontSize:'0.8rem'}}>No entries yet...</p>}
          {history.map((item) => (
            <div key={item._id} className="history-item">
              <span className={`tag tag-${item.detectedEmotion}`}>{item.detectedEmotion}</span>
              <p>"{item.inputText.length > 40 ? item.inputText.substring(0, 40) + "..." : item.inputText}"</p>
              <small className="history-timestamp">{formatTimestamp(item.timestamp)}</small>
            </div>
          ))}
        </div>

        {history.length > 0 && (
          <button className="clear-history-btn" onClick={clearHistory}>
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {/* MAIN AREA */}
      <div className="main-panel">
        {currentView === 'main' && (
          <>
            <div className="greeting-section">
              <div className="avatar"><Home size={32} /></div>
              <h1>Hello, Friend.</h1>
              <p className="subtitle">{welcomeMessage}</p>
            </div>

            <textarea
              placeholder="Type your thoughts here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && analyzeEmotion()}
            />

            <button className="analyze-btn" onClick={analyzeEmotion} disabled={loading}>
              {loading ? "Listening..." : "Analyze Feelings"}
            </button>

            {result && (
              <div className="result-display">
                <div className="result-content">
                  <p className="label">It sounds like you are feeling:</p>
                  <h2 className="emotion-title">{result.emotion}</h2>
                </div>

                <div className="confidence-wrapper">
                  <span>Certainty: {Math.floor(result.confidence * 100)}%</span>
                  <div className="meter-container">
                    <div
                      className="meter-fill"
                      style={{width: `${result.confidence * 100}%`}}
                    ></div>
                  </div>
                </div>

                <div className="coping-insight">
                  <h3>Recommended Action</h3>
                  <p>{getCopingInsight(result.emotion)}</p>
                </div>
              </div>
            )}
          </>
        )}

        {currentView === 'diary' && (
          <div className="diary-view">
            <div className="greeting-section">
              <div className="avatar"><BookOpen size={32} /></div>
              <h1>Your Emotional Diary</h1>
              <p className="subtitle">Reflect on your journey</p>
            </div>

            <div className="diary-entries">
              {history.length === 0 ? (
                <div className="empty-diary">
                  <p>Your diary is empty. Start writing to see your emotional journey!</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item._id} className="diary-entry">
                    <div className="entry-header">
                      <span className={`emotion-badge emotion-${item.detectedEmotion.toLowerCase()}`}>
                        {item.detectedEmotion}
                      </span>
                      <span className="entry-date">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="entry-text">"{item.inputText}"</p>
                    <div className="entry-confidence">
                      Confidence: {Math.floor(item.confidenceScore * 100)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentView === 'insights' && (
          <div className="insights-view">
            <div className="greeting-section">
              <div className="avatar"><Sparkles size={32} /></div>
              <h1>Your Emotional Insights</h1>
              <p className="subtitle">Understanding your patterns</p>
            </div>

            {history.length === 0 ? (
              <div className="empty-insights">
                <p>Share your feelings to see emotional insights!</p>
              </div>
            ) : (
              <div className="insights-content">
                <div className="emotion-stats">
                  <h3>Emotion Distribution</h3>
                  {(() => {
                    const emotionCounts = history.reduce((acc, item) => {
                      acc[item.detectedEmotion] = (acc[item.detectedEmotion] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.entries(emotionCounts).map(([emotion, count]) => (
                      <div key={emotion} className="emotion-stat">
                        <span className={`emotion-label emotion-${emotion.toLowerCase()}`}>{emotion}</span>
                        <div className="stat-bar">
                          <div
                            className="stat-fill"
                            style={{width: `${(count / history.length) * 100}%`}}
                          ></div>
                        </div>
                        <span className="stat-count">{count}</span>
                      </div>
                    ));
                  })()}
                </div>

                <div className="recent-mood">
                  <h3>Recent Mood</h3>
                  {history.length > 0 && (
                    <div className="current-mood">
                      <span className={`mood-indicator mood-${history[0].detectedEmotion.toLowerCase()}`}>
                        {history[0].detectedEmotion}
                      </span>
                      <p>Your latest entry shows you're feeling {history[0].detectedEmotion.toLowerCase()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App