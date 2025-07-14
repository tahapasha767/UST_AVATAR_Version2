import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState } from "react";
import { useEffect } from "react";
import {  } from "lucide-react";
import VoiceInputComponent from "./components/Secondpage";
function App() {
  const [Albys_text,setAlbys_text] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    /// 🗣️ Trigger text-to-speech once when component mounts
    useEffect(() => {
    if (!Albys_text) return; // Don't run if text is empty

    const utterance = new SpeechSynthesisUtterance(Albys_text);
    utterance.lang = "en-IN"; // Indian accent

    // Pick a female voice if possible
    const loadVoice = () => {
  const voices = window.speechSynthesis.getVoices();

  // Prioritize female voices explicitly
  const preferredVoices = [
    // Most common in Chrome
    "Google US English",
    "Microsoft Zira Desktop - English (United States)", // Windows
    "Samantha", // macOS
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


    // If voices already available, speak immediately
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoice();
    } else {
      // Wait until voices are loaded
      window.speechSynthesis.onvoiceschanged = loadVoice;
    }
  }, [Albys_text]);
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Left side: 3D Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 30 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience isSpeaking={isSpeaking} />  // ✅ Correct

        </Canvas>
      </div>
      <VoiceInputComponent setAlbys_text={setAlbys_text}/>
      

      {/* Right side: 2D UI */}
      {/* <div
        style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Hello, I'm your Avatar!</h2>
        <button className="w-16 h-16 bg-blue-500 text-white rounded-md p-2"
          onClick={() => {
    const utterance = new SpeechSynthesisUtterance(
    "Hi, my name is alby ,i am here to entertain you guys , Lets party shall we??."
  );
  utterance.lang = "en-US";

  // Set speaking state
  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);

  const loadVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    // Try to find a female-sounding voice
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("google us english") ||
        (voice.lang === "en-US" && voice.name.toLowerCase().includes("google"))
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      console.warn("⚠️ Female voice not found, using default.");
    }

    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    loadVoice();
  } else {
    // Wait for voices to be loaded
    window.speechSynthesis.onvoiceschanged = loadVoice;
  }
  }}
        >
          Talk
        </button>
      </div> */}
      
    </div>
  );
}

export default App;
