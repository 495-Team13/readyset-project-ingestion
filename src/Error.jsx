import { useState } from "react";
import { MainHeader} from "./MainHeader";

export const Error = (props) => {
    const [theme, setTheme] = useState(props.themeState);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }

    return ( 
        <div className="background">
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <p>Error: {props.stateVars}</p>
        </div>
    )

}
