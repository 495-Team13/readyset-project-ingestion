import { MainHeader } from "./MainHeader";
import React, { useState } from "react";

export const Category = (props) => {

    const [theme, setTheme] = useState(props.themeState);

    const changeTheme =(newTheme) => {
        setTheme(newTheme);
    }

    const deleteCategory = (categoryName) => {
        /* api call */ 
    }

    const exportCSV = () => {
        /* write after we agree on information order and work flow */ 
    }

    const deleteRecord = () => {
        /* api call to drop record from table */ 
    }

    return(
        <div id={theme} class="background">
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table id={theme}>
                <tr>
                    <td><h4>Category Name</h4></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                    <td><button className="editrecord" onClick={deleteCategory('')}>Delete Category</button></td>
                    <td><button className="editrecord" onClick={()=> {props.onSwitch('EditCategory','',theme)}}>New Category</button></td>
                    <td><button className="editrecord" onClick={exportCSV}>Export CSV</button></td>
                </tr>
                <tr>
                    <td><h5 className="editrecord">Category Shape Definition</h5></td>
                    <td><img></img></td>
                </tr>
                <tr>
                    <td><input className="editrecord" type="text"></input></td>
                </tr>
                <tr>
                    <td><button className="editrecord" onClick={() => {props.onSwitch('EditRecord','new record', theme)}}>Create Record</button></td>
                    <td><button className="editrecord" onClick={() => {props.onSwitch('EditRecord', 'needs json to populate', theme)}}>Edit Selected</button></td>
                    <td><button className="editrecord" onClick={deleteRecord}>Delete Selected</button></td>
                </tr>
                <tr>
                    <td> {/*Insert search here*/} </td>
                </tr>
                <tr>
                    <td> {/* What goes here? */}</td>
                </tr>
            </table>
        </div>

    )

}