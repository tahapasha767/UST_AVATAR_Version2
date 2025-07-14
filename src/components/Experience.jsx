import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";
export const Experience = ({ isSpeaking }) => {
  console.log("Experience component rendered with isSpeaking:", isSpeaking);

  return (
    <>
      <OrbitControls />
      <Avatar position={[0,-3,5]} scale={2}  isSpeaking={isSpeaking} />
      <ambientLight intensity={2} />
      
    </>
  );
};
