import React, { useState, useRef } from 'react';
import { Mic, Loader2, Square } from 'lucide-react';

const VoiceInputComponent = ({ setAlbys_text, isSpeaking }) => {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null); // Reference to stop recognition

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      if(spokenText==="hi I'll be"|| spokenText==="hi I will be"||spokenText==="ilb") {
         setText("Hi Alby");

      }else{
      setText(spokenText);}
      console.log("🎙️ You said:", spokenText);

      try {
        console.log(spokenText)
        const response = await fetch("http://localhost:3000/detectIntent", {

          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({  userInput: spokenText }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🧠 AI response:", data);
        const reply = data[0]["text"]["text"][0] || "AI could not generate a response.";
        setAlbys_text(reply);
        console.log("🧠 Local API:", reply);
      } catch (error) {
        const fallback = [
          "Oops! Something went wrong. Try again?",
          "Hmm, I didn't catch that. Please repeat.",
          "Sorry, something broke. Try again?",
        ];
        setAlbys_text(fallback[Math.floor(Math.random() * fallback.length)]);
        console.error("❌ Local API error:", error);
      }
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
      console.log("🛑 Speech recognition manually stopped");
    }
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

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleVoiceInput}
          disabled={isSpeaking || listening}
          style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '1rem',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          }}
          title="Start speaking"
        >
          {listening ? <Loader2 className="animate-spin" /> : <Mic size={24} />}
        </button>

        <button
          onClick={stopListening}
          disabled={!listening}
          style={{
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '1rem',
            width: '60px',
            height: '60px',
            cursor: listening ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          }}
          title="Stop listening"
        >
          <Square size={24} />
        </button>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '1.1rem', maxWidth: '400px', textAlign: 'center' }}>
        <strong>Transcript:</strong><br /> {text || 'Click the mic and speak...'}
      </p>
    </div>
  );
};

export default VoiceInputComponent;
