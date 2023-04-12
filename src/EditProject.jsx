import React, { useEffect, useState } from "react";
import { MainHeader } from "./MainHeader";

export const EditProject = (props) => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        var mounted = true;
        
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"
        };
        if(props.stateVars === "Untitled") {
            localStorage.setItem("current_project", JSON.Stringify({"current_project":"new project"}));
            console.log("Creating new project");
        } else {
            const str = 'http://ingestion-sandbox.dev.readysetvr.com/api/projects/get/' + props.stateVars;
            const temp = "{\"current_project\":\"" + props.stateVars + "\"}";
            console.log(temp);
            localStorage.setItem("current_project", temp);
            fetch(str, requestOptions)
              .then(response => response.json())
              .then(fetchData => {
                    console.log(fetchData)
                    if(mounted) {
                        setProducts(fetchData.products);   
                    }
              });
        }
        return () => mounted = false;
    }, [])

    const [recordName, setRecordName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [value, setValue] = useState('Search...');
    const [theme, setTheme] = useState(props.themeState);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }

    const updateName = (e) => {
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
  
        fetch('http://ingestion-sandbox.dev.readysetvr.com/api/projects/add', {
          method: 'POST',
          headers: {
            'Authorization':token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: projectName,
            products: products
          })
        })
        .then(response => {
           response.json()
        })
        .then(data => {
          console.log(data)  
        })
        props.onSwitch('Projects', '', theme);
    } 

    const createRecord = () => {
        props.onSwitch('EditRecord', 'new record', theme);
    }

    const editRecord = () => {
        props.onSwitch('EditRecord', recordName, theme);
    }

    // see if we can change product upc to recordName (?)
    // otherwise need to come up with a way to set selected record upc from select during selectRecord() 
    const deleteRecord = () => {
        fetch('http://ingestion-sandbox.dev.readysetvr.com/api/products/delete/' + recordName, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // handle successful response
            console.log("Deleted Record");
          })
          .catch(error => {
            // handle error
            console.log(error);
          });
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
                            <td><button className="editproject" onClick={updateName}>Save</button></td>
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
                        <td>
                            {products.filter(record => {
                                const searchTerm = value.toLowerCase();
                                const record_name = record.toLowerCase();
                                return (searchTerm && record_name.startsWith(searchTerm)) || (value === '' || value === 'Search...');
                            }).map((item)=> (
                                <div className="dropdown-row" key={item}>
                                    <table><tbody><tr>
                                        <td><input className="editproject" type="checkbox" onClick={()=>selectRecord(item)}></input></td>
                                        <td>{item}</td>  
                                    </tr></tbody></table>
                                </div>
                            ))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
