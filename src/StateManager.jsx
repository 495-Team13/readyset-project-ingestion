import React, { useState } from "react";
import { Login } from "./Login.jsx";
import { Projects } from "./Projects.jsx";
import { EditProject } from "./EditProject.jsx";
import { EditRecord } from "./EditRecord.jsx";
import { Category } from "./Category.jsx";
import { EditCategory } from "./EditCategory.jsx";
import { Error } from "./Error.jsx";

export const StateManager = () => {
    const [state, setState] = useState('Login');
    const [stateVars, setStateVars] = useState('');
    const [theme, setTheme] = useState('dark');

    const switchState = (stateName, stateVars, themeColor) => {
        setState(stateName);
        setStateVars(stateVars);
        setTheme(themeColor);
      }

    switch(state) {
        case 'Login':
            return <Login onSwitch={switchState} themeState={theme}/>;
        case 'Projects':
            return <Projects stateVars={stateVars} onSwitch={switchState} themeState={theme}/>;
        case 'EditProject':
            return <EditProject stateVars={stateVars} onSwitch={switchState} themeState={theme}/>; 
        case 'EditRecord':
            return <EditRecord stateVars={stateVars} onSwitch={switchState} themeState={theme}/>; 
        case 'Category':
            return <Category stateVars={stateVars} onSwitch={switchState} themeState={theme}/>;
        case 'EditCategory':
            return <EditCategory stateVars={stateVars} onSwitch={switchState} themeState={theme}/>;
        case 'Error':
            return <Error stateVars={stateVars} onSwitch={switchState} themeState={theme}/>;
    }
}