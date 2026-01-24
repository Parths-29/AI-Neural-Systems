import { useState } from 'react'
import axios from 'axios'

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeEmotion = async () => {
    if (!input) return;
    setLoading(true);
    try {
      // Connects to Node Backend (Port 3000)
      const res = await axios.post('http://localhost:3000/api/analyze', { text: input });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("System Failure: Check Connection");
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>NeuroLingo v1.0</h1>
      <textarea 
        placeholder="> INPUT NEURAL DATA..." 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={analyzeEmotion}>
        {loading ? "PROCESSING..." : "ANALYZE"}
      </button>

      {result && (
        <div className="result-box">
          <p>DETECTED SIGNAL:</p>
          <div className="emotion">{result.emotion.toUpperCase()}</div>
          <p>CONFIDENCE: {Math.floor(result.confidence * 100)}%</p>
        </div>
      )}
    </div>
  )
}

export default App