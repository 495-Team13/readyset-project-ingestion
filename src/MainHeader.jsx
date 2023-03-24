export const MainHeader = (props) => {
    const toggleTheme = () => {
        props.current_theme === "light" ? props.switchTheme('dark') : props.switchTheme('light');
    }


    return(
        <div className="main-header" id={props.current_theme}>
            <table>
                <tbody>
                    <tr>
                        <td><h1>ReadySet</h1></td>
                        <td><button id="header-button" onClick={() => props.onSwitch('Projects', '', props.current_theme)}>Projects</button></td>
                        <td><button id="header-button" onClick={() => props.onSwitch('Category', '', props.current_theme)}>Templates</button></td>
                        <td><button id="header-button" onClick={toggleTheme}>{props.current_theme}</button></td>
                        <td><button id="header-button" onClick={() => props.onSwitch('Login','',props.current_theme)}>Log out</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}