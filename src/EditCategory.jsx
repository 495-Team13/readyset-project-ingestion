import { MainHeader } from "./MainHeader";
import React, { useState } from "react";

export const EditCategory = (props) => {

    const [theme, setTheme] = useState(props.themeState);

    const changeTheme =(newTheme) => {
        setTheme(newTheme);
    }

    return(
        <div className="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table className="editrecord" id={theme}>
                <tr>
                    <td><h4>Category Name</h4></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text" placeholder="...."></input></td>
                    <td><button className="editrecord" onClick={() => {props.onSwitch('Category','',theme)}}>Return</button></td>
                    <td><button className="editrecord">Save</button></td>
                    <td><button className="editrecord">Clear</button></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Template Name</h5></td>
                    <td><h5 className="editrecord">Template Type</h5></td>
                    {/* Add gltf*/}
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                    <td><input className="editrecord" type="text"></input></td>
                    <td><button className="editrecord">Add New</button></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Workflow</h5></td>
                    <td><h5 className="editrecord"> Donor Shape</h5></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                    <td><input className="editrecord" type="text"></input></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Product Name (Brand Name Flavor)</h5></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Width</h5></td>
                    <td><h5 className="editrecord">Height</h5></td>
                    <td><h5 className="editrecord">Depth</h5></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                    <td><input className="editrecord" type="text"></input></td>
                    <td><input className="editrecord" type="text"></input></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Scan Product UPC</h5></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Notes</h5></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Form Description</h5></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                </tr>
            </table>
        </div>
    )

}