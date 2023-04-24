import React, {useRef, useState} from 'react'
import Canvas from '@react-three/fiber'
import {OrbitControls, useGLTF} from '@react-three/drei'

export const CustomGLTF = (props) => {
  const ref = useRef();
  return( 
    <div>
      <Canvas>
        <mesh ref={ref}>
          <boxGeometry attach='geometry' args={[2,2,2]} />
        </mesh>
      </Canvas>
    </div>
  );
  
}
