import React, { useState } from "react";
import { MainHeader } from "./MainHeader";

var data = require("./test-records.json");

export const EditProject = (props) => {
    const [recordName, setRecordName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [value, setValue] = useState('Search...');
    const [theme, setTheme] = useState(props.themeState);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }

    const updateName = (e) => {
        /* api call to set the projectName in the database for now just print new name to console. */
        console.log({projectName});
    } 

    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        setRecordName(searchTerm);
        /* api check to find the record being searched for */
        props.onSwitch('EditRecord', searchTerm, theme);
    } 

    const createRecord = () => {
        props.onSwitch('EditRecord', 'new record', theme);
    }

    const editRecord = () => {
        props.onSwitch('EditRecord', recordName, theme);
    }

    const deleteRecord = () => {
        /* api call to remove record from table */
        console.log("Deleted Records");
    }

    const exportProject = () => {
        /* write this later once we agree upon information order and flow */ 
        console.log("Export Project");
    }

    const selectRecord = (s) => {
        setRecordName(s);
    }

    return(
        <div className="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table className="editproject">
                <tbody>
                    <tr>
                        <td><table><tbody><tr>
                            <td><h4 className="editproject">Project&nbsp;Name</h4></td>
                            <td><input className="editproject" value={projectName} onChange={(e) => setProjectName(e.target.value)} type="text" placeholder={props.stateVars} id="projectName" name="projectName"></input></td>
                            <td><button className="editproject" onClick={updateName}>Update</button></td>
                            <td><input className="editproject" onChange={(e) => setValue(e.target.value)} type="text" placeholder={value}></input></td>
                        </tr></tbody></table></td>

                    </tr>
                    <tr>
                            <td><table><tbody><tr>
                            <td><button className="editproject" onClick={createRecord}>Create Record</button></td>
                            <td><button className="editproject" onClick={editRecord}>Edit Selected</button></td>
                            <td><button className="editproject" onClick={deleteRecord}>Delete Selected</button></td>
                            <td><button className="editproject" onClick={exportProject}>Export CSV</button></td>
                        </tr></tbody></table></td>

                    </tr>
                    <tr>
                        <td>{data.filter(item => {
                                const searchTerm = value.toLowerCase();
                                const record_name = item.record_name.toLowerCase();
                                return searchTerm && record_name.startsWith(searchTerm) || value === '' || value === 'Search...';
                            }).map((item)=> (
                                <div className="dropdown-row" key={item.record_name}>
                                    <table><tr>
                                        <td><input className="editproject" type="checkbox" onClick={()=>selectRecord(item.record_name)}></input></td>
                                        <td>{item.record_name}</td>  
                                    </tr></table>
                                </div>
                            ))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}