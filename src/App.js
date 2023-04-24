import React, { useState } from "react";
import { StateManager } from './StateManager';
import { CustomGLTF } from './CustromGLTF'
function App() {
  return (
    <div className="App">
      { <CustomGLTF/> }
    </div>
  );
}
export default App;
