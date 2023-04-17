import { MainHeader } from "./MainHeader";
import React, { useState } from "react";

export const EditTemplate = (props) => {

    const [theme, setTheme] = useState(props.themeState);

    const changeTheme =(newTheme) => {
        setTheme(newTheme);
    }

    return(
        <div className="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
        </div>
    )

}
