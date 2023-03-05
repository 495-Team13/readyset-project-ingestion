export const LoginHeader = (props) => {
    const toggleTheme = () => {
        props.theme === "light" ? props.switchTheme('dark') : props.switchTheme('light');
    }
    return(
        <div class="login-header" id={props.theme}>
            <table>
                <tr>
                    <td><h1>ReadySet</h1></td>
                    <td><button id="header-button" onClick={toggleTheme}>{props.theme}</button></td>
                </tr>
            </table>
        </div>
    )
}