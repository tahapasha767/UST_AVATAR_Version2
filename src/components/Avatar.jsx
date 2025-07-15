import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
//import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

export function Avatar({ isSpeaking, ...props }) {
  

  const { scene } = useGLTF('/models/686fc4da551f5301dc374d2b.glb');
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(cloned);
console.log(isSpeaking);
  const headRef = useRef();
  //const [isSpeaking, setIsSpeaking] = useState(false);

  // 🗣️ Trigger text-to-speech once when component mounts
  

  // 🎯 Real-time jaw movement synced with speech
  useEffect(() => {
  const head = headRef.current;
  if (head?.morphTargetDictionary) {
    console.log("🤖 Available Morph Targets:", Object.keys(head.morphTargetDictionary));
  }
}, []);
useEffect(() => {
  const head = headRef.current;
  if (head?.morphTargetDictionary) {
    console.log("Morph Targets:", Object.keys(head.morphTargetDictionary));
  }
}, []);




  useFrame(() => {
  const head = headRef.current;
  if (!head) return;

  const dict = head.morphTargetDictionary;
  const infl = head.morphTargetInfluences;
  if (!dict || !infl) return;

  const index = dict['viseme_aa'];
  if (index === undefined) return;

  if (isSpeaking) {
    // 👄 Animate jaw movement when speaking
    const time = Date.now() * 0.014;
    const noise = Math.random() * 0.1;
    infl[index] = 0.6 + 0.3 * Math.sin(time) + noise;
    infl[index] = Math.min(Math.max(infl[index], 0), 1); // Clamp between 0 and 1
  } else {
    // 🛑 Close the mouth when not speaking
    infl[index] = 0;
  }
});


  return (
    
    <group {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Glasses.geometry} material={materials.Wolf3D_Glasses} skeleton={nodes.Wolf3D_Glasses.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />

      {/* 🦷 This is where the mouth animation happens */}
      <skinnedMesh
        ref={headRef}
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />

      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  
  );
}

useGLTF.preload('/models/686fc4da551f5301dc374d2b.glb');
