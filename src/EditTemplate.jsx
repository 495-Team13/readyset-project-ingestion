import { MainHeader } from "./MainHeader";
import React, { useEffect, useState } from "react";

export const EditTemplate = (props) => {

    const [theme, setTheme] = useState(props.themeState);
    const [data, setData] = useState([]);
        
    const [donor_shape, set_donor_shape] = useState('');
    const [form_desc, set_form_desc] = useState('');
    const [gltf, set_gltf] = useState('');
    const [name, set_name] = useState('');
    const [notes, set_notes] = useState('');
    const [product_upc, set_product_upc] = useState('');
    const [type, set_type] = useState('');
    const [workflow, set_workflow] = useState('');

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }
    
    const clearRecord = () => {
        set_donor_shape('');
        set_form_desc('');
        set_gltf('');
        set_name('');
        set_notes('');
        set_product_upc('');
        set_type('');
        set_workflow('');
    }
        
    const updateCategory = () => {
        const cat = JSON.parse(localStorage.getItem("current_category"));
        
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        
        var updated_data = [];
        updated_data = data;
        updated_data.push(name);
        var requestOptions = {
            method: "PUT",
            headers: {
                "Authorization":token,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name:cat.current_category,
                templates:updated_data
            }),
            redirect: "follow"
            }
        fetch("https//ingestion-sandbox.dev.readysetvr.com/api/categories/edit/" + cat.current_category, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        
        // edit category api call to add this template to the template, gonna have to call, append, edit
    }
    
    const addTemplate = () => {
     /* add new template */
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
             var requestOptions = {
                method: "POST",
                headers: {
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    "donor_shape":donor_shape,
                    "form_desc":form_desc,
                    "gltf":gltf,
                    "name":name,
                    "notes":notes,
                    "product_upc":product_upc,
                    "type":type,
                    "workflow":workflow
                }),
                redirect: "follow"
             }
            fetch("https://ingestion-sandbox.dev.readysetvr.com/api/templates/add", requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("finished adding");
                    Promise.all(
                        updateCategory();    
                    ).then(response => response.json)
                    .then(data => console.log(data)
                    render();
                })
    }
    
    const editTemplate = () => {
                /* edit template */
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
              var requestOptions = {
                method: "PUT",
                headers: {
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    "donor_shape":donor_shape,
                    "form_desc":form_desc,
                    "gltf":gltf,
                    "name":name,
                    "notes":notes,
                    "product_upc":product_upc,
                    "type":type,
                    "workflow":workflow
                }),
                redirect: "follow"
              }
            fetch("https//ingestion-sandbox.dev.readysetvr.com/api/templates/edit/" + props.stateVars, requestOptions)
                .then(response => {response.json()})
                .then(data => {console.log(data)})
    }
    
    const saveRecord = () => {
        /* save button */
        if(props.stateVars === "Untitled") {
            addTemplate();
        } else {
            editTemplate();
        }
        props.onSwitch("Category", '', theme);
    }
    
    const render = () => {
        var mounted = true;
        console.log("rendering")
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        var requestOptions = {
            method: "GET",
            headers: {
                "Authorization":token,
            },
            redirect: "follow"
        };
        if(props.stateVars === "Untitled") {
            clearRecord(); 
        } else {
            const str = 'https://ingestion-sandbox.dev.readysetvr.com/api/templates/get/' + props.stateVars;
            fetch(str, requestOptions)
              .then(response => response.json())
              .then(fetchData => {
                    console.log(fetchData)
                    if(mounted) {
                        set_donor_shape(fetchData.donor_shape);
                        set_form_desc(fetchData.form_desc);
                        set_gltf(fetchData.gltf);
                        set_name(fetchData.name);
                        set_notes(fetchData.notes);
                        set_product_upc(fetchData.product_upc);
                        set_type(fetchData.type);
                        set_workflow(fetchData.workflow);
                    }
              });
        }
        return () => mounted = false;
    }
    
    useEffect(() => {
        render();
        const cat = JSON.parse(localStorage.getItem("current_category"));
        
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        
        var requestOptions = {
            method: "GET",
            headers: {
                "Authorization":token,
            },
            redirect: "follow"  
        }
        
        fetch("https://ingestion-sandbox.dev.readysetvr.com/api/categories/get/" + cat.current_category, requestOptions)
                .then(response => response.json())
                .then(fetchData => {
                    setData(fetchData.templates);
                    return;
                });
        console.log("out");
    }, []);

    return(
        <div className="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table>
                <tbody>
                    <tr>
                        <td><h3>Template</h3></td>
                    </tr>
                    <tr>
                        <td><button onClick={() => props.onSwitch("Category", '', theme)}>Return</button></td>
                        <td><button onClick={() => saveRecord()}>Save</button></td>
                        <td><button onClick={() => clearRecord()}>Clear</button></td>
                    </tr>
                    <tr>
                        <td><h5>Template Name</h5></td>
                        <td><h5>Template Type</h5></td>
                    </tr>
                    <tr>
                        <td><input className="editrecord" type="text" placeHolder={name} onChange={(e) => set_name(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeHolder={type} onChange={(e) => set_type(e.target.value)}></input></td>
                        <td><button>Add New</button></td>
                        <td>{/*gltf goes here */}</td>
                   </tr>
                   <tr>
                        <td><h5>Workflow</h5></td>
                        <td><h5>Donor Shape</h5></td>
                   </tr>
                   <tr>
                        <td><input className="editrecord" type="text" placeHolder={workflow} onChange={(e) => set_workflow(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeHolder={donor_shape} onChange={(e) => set_donor_shape(e.target.value)}></input></td>
                   </tr>
                   <tr>
                        <td><h5>Scan Product UPC</h5></td>
                   </tr>
                   <tr>
                        <td><input className="editrecord" type="text" placeHolder={product_upc} onChange={(e) => set_product_upc(e.target.value)}></input></td>
                   </tr>
                   <tr>
                        <td><h5>Notes</h5></td>
                   </tr>
                   <tr>
                        <td><input className="editrecord" type="text" placeHolder={notes} onChange={(e) => set_notes(e.target.value)}></input></td>
                   </tr>
                   <tr>
                        <td><h5>Form Description</h5></td>
                   </tr>
                   <tr>
                        <td><input className="editrecord" type="text" placeHolder={form_desc} onChange={(e) => set_form_desc(e.target.value)}></input></td>
                   </tr>
                </tbody>
            </table>
        </div>
    )

}
