import React, { useState, useRef } from 'react';
import { Mic, Loader2, Square, Combine } from 'lucide-react';

const VoiceInputComponent = ({ setAlbys_text, isSpeaking }) => {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null); // Reference to stop recognition
const displaySentencesWithDelayAdvanced = (reply) => {
  // STEP 1: Split using lookbehind for ., \n, or \t
  const rawSentences = reply
    .split(/(?<=[.\n])/g)
    .map(s => s.trim())
    .filter(Boolean); // remove blanks

  // STEP 2: Create array of { text, delay }
  console.log("📜 Raw Sentences:", rawSentences);;
  const sentenceQueue = rawSentences.map((sentence) => {
    let delay = 1500; // default for '.'

    if (sentence.toLowerCase().endsWith('applause!')) delay = 4000;
    else if (sentence.endsWith('\t')) delay = 2000;

    return { text: sentence, delay };
  });

  console.log("📜 Parsed Sentences:", sentenceQueue);

  // STEP 3: Display sentences with delays
  let index = 0;

  const showNext = () => {
    if (index >= sentenceQueue.length) return;

    const { text, delay } = sentenceQueue[index];
    setAlbys_text(text);
    index++;

    setTimeout(showNext, delay);
  };

  showNext();
};
const splitAndDisplayWithTimeouts = (text) => {
  const sentences = text
    .split(/(?<=[.])|\n/)         // Split by "." or "\n"
    .map(s => s.trim())
    .filter(Boolean);             // Remove blanks

  console.log("📄 Sentences:", sentences);

  let time = 0;

  for (let sentence of sentences) {
    let delay;

if (sentence.endsWith('.')||sentence.endsWith(',')) {
  delay = 1500;
} else {
  delay = 12000;
  console.log("⏱️ Long pause for:", sentence);
}
   

    setTimeout(() => {
      let finalSentence = sentence
  .replace(/\\n/g, '')  // Remove literal "\n"
  .replace(/\\t/g, ''); // Remove literal "\t"

       setAlbys_text(finalSentence);
      console.log("⏱️", sentence);
    }, time);

    time += delay;
  }
};




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
       

console.log("🧠 Local API Reply:", reply);
//console.log("🧩 Split Sentences:", replySentences);
       // setAlbys_text(reply);
      // displaySentencesWithDelayAdvanced(reply)
      // splitTextByDotsAndNewlines(reply);
      splitAndDisplayWithTimeouts(reply);
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
        Hi, I am <span style={{ color: '#2563eb' }}>A<span className='text-2xl'></span>I</span> 🧠
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
