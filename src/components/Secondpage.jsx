import React, { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyAUt653G8LVW7I1h_c5D5m3SuFdgtu6tUY");

const VoiceInputComponent = ({setAlbys_text}) => {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Optional: Indian accent
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      console.log("🎙️ You said:", spokenText);

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(spokenText);
        const response = await result.response;
        const reply = response.text();
        setAlbys_text(reply);

        console.log("🧠 Gemini:", reply);
      } catch (error) {
        console.error("❌ Gemini API error:", error);
      }
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ fontSize: '3rem', marginBottom: '10rem', color: '#333' }}>
        Hi, I am <span style={{ color: '#2563eb' }}>Alby</span> 🧠
      </h2>

      <button
        onClick={handleVoiceInput}
        style={{
          backgroundColor: listening ? '#dc2626' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '9999px',
          padding: '1rem',
          cursor: 'pointer',
          width: '60px',
          height: '60px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s ease',
        }}
        title="Click to speak"
      >
        {listening ? <Loader2 className="animate-spin" /> : <Mic size={24} />}
      </button>

      <p style={{ marginTop: '2rem', fontSize: '1.1rem', maxWidth: '400px', textAlign: 'center' }}>
        <strong>Transcript:</strong><br /> {text || 'Click the mic and speak...'}
      </p>
    </div>
  );
};

export default VoiceInputComponent;
