import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, useEffect, useRef } from "react";
import VoiceInputComponent from "./components/Secondpage";

function App() {
  const [Albys_text, setAlbys_text] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
useEffect(() => {
  // Cancel any ongoing speech when the component mounts (e.g. after refresh)
  window.speechSynthesis.cancel();
}, []);
  useEffect(() => {
    if (!Albys_text ) {
     // didMountRef.current = true;
      return; // Skip on first render
    }

    const utterance = new SpeechSynthesisUtterance(Albys_text);
    utterance.lang = "en-IN";

    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = [
        "Google US English",
        "Microsoft Zira Desktop - English (United States)",
        "Samantha",
      ];

      const femaleVoice =
        voices.find((voice) =>
          preferredVoices.some((name) => voice.name.includes(name))
        ) ||
        voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            (voice.lang.startsWith("en") && voice.name.toLowerCase().includes("english"))
        );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log("✅ Using voice:", femaleVoice.name);
      } else {
        console.warn("⚠️ No female voice found, using default.");
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoice;
    }
  }, [Albys_text]);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left side: 3D Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience isSpeaking={isSpeaking} />
        </Canvas>
      </div>

      {/* Right side: Voice Input */}
      <VoiceInputComponent setAlbys_text={setAlbys_text}  isSpeaking={isSpeaking} />
    </div>
  );
}

export default App;
