import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  // 1. Fetch History on Load
  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch system logs");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. Analyze Function
  const analyzeEmotion = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/analyze', { text: input });
      setResult(res.data);
      setInput(''); // Clear input
      fetchHistory(); // Refresh sidebar
    } catch (err) {
      alert("CONNECTION ERROR: AI OFFLINE");
    }
    setLoading(false);
  }

  return (
    <div className="dashboard">
      
      {/* LEFT PANEL: HISTORY LOGS */}
      <div className="panel history-panel">
        <h3>>> SYSTEM_LOGS</h3>
        <div className="history-list">
          {history.length === 0 && <p style={{opacity:0.5}}>NO DATA FOUND...</p>}
          {history.map((item) => (
            <div key={item._id} className="history-item">
              <span className="tag">[{item.detectedEmotion.toUpperCase()}]</span> 
              <br/>
              <span style={{fontSize:'0.8rem', opacity:0.8}}>
                "{item.inputText.substring(0, 30)}..."
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: MAIN INTERFACE */}
      <div className="panel main-panel">
        <h1>// NEURO_LINGO_V2</h1>
        
        <textarea 
          placeholder="ENTER NEURAL DATA FOR ANALYSIS..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button className="analyze-btn" onClick={analyzeEmotion} disabled={loading}>
          {loading ? "PROCESSING..." : "INITIATE SCAN"}
        </button>

        {/* RESULTS AREA */}
        {result && (
          <div className="result-display">
            <p>DETECTED EMOTION:</p>
            <div className="emotion-title">{result.emotion}</div>
            
            <div style={{marginTop: '15px', textAlign:'left'}}>
              <span>CONFIDENCE: {Math.floor(result.confidence * 100)}%</span>
              <div className="meter-container">
                <div 
                  className="meter-fill" 
                  style={{width: `${result.confidence * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App