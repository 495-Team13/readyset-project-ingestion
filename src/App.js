import React, { useState } from "react";
import { StateManager } from './StateManager';
import { CustomGLTF } from './CustomGLTF'
function App() {
  return (
    <div className="App">
      { <CustomGLTF/> }
    </div>
  );
}
export default App;
