export const LoginHeader = (props) => {
    const toggleTheme = () => {
        props.theme === "light" ? props.switchTheme('dark') : props.switchTheme('light');
    }
    return(
        <div className="login-header" id={props.theme}>
            <table>
                <tbody><tr>
                    <td><h1>ReadySet</h1></td>
                    <td><button id="header-button" onClick={toggleTheme}>{props.theme}</button></td>
                </tr></tbody>
            </table>
        </div>
    )
}