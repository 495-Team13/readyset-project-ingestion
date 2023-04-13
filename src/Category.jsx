import { MainHeader } from "./MainHeader";
import React, { useEffect, useState } from "react";

export const Category = (props) => {

    const [theme, setTheme] = useState(props.themeState);
    const [data, setData] = useState([]);
    const [value, setValue] = useState('');
    
    const render = () => {
        var mounted = true;
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        
        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"   
        };
                
        fetch("https://ingestion-sandbox.dev.readysetvr.com/api/categories/all", requestOptions)
                .then(response => response.json())
                .then(fetchData => {
                    if(mounted) {
                        setData(fetchData);   
                    }
                });
        return () => mounted = false;
    }
    
    useEffect(() => {
        render();
    }, [])

    const changeTheme =(newTheme) => {
        setTheme(newTheme);
    }

    const deleteCategory = (categoryName) => {
        // DELETE TEMPLATE SAME AS DELETE PRODUCT? 
        // ALSO DO WE EVEN DELETE TEMPLATES? 
        // AND WHAT OF THE PRODUCTS ASSOC WITH THAT TEMPLATE IF SO? 
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
        <div className="background" id={theme}>
            <table className="projects" id={theme}> 
                <tbody>
                    <tr>
                        <td><table><tbody><tr>
                            <td><h2 className="projects">Projects</h2></td>
                            <td><button className="projects" id="add-project" onClick={() => props.onSwitch('EditProject', 'Untitled', theme)}>+</button></td>
                            <td><input className="projects" value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Search..."></input></td>
                        </tr></tbody></table></td>
                    </tr>
                    <tr>
                        <td>
                        <div className="search-container"> 
                            <div className="dropdown">
                                    {data.filter(item => {
                                        const searchTerm = value.toLowerCase();
                                        const name = item.name.toLowerCase();

                                        return (searchTerm && name.startsWith(searchTerm)) || value === '';
                                    }).map((item) => (
                                        <div className="dropdown-row"  key={item.name}>
                                            <table><tbody><tr>
                                                <td><p>{item.name}</p></td>
                                                <td><button className="projects" id="green" onClick={()=>onSearch(item.name)}>Edit</button></td>
                                                <td><button className="projects" id="red" onClick={()=>deleteButton(item)}>Delete</button></td>
                                            </tr></tbody></table>
                                        </div>
                                    ))} 
                            </div> 
                         </div>
                         </td>
                    </tr>
                </tbody>
            </table>
                </tr>
                <tr>
                    <td> {/* What goes here? */}</td>
                </tr>
            </table>
        </div>

    )

}
