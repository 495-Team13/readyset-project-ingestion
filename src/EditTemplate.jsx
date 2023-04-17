import { MainHeader } from "./MainHeader";
import React, { useEffect, useState } from "react";

export const EditTemplate = (props) => {

    const [theme, setTheme] = useState(props.themeState);
        
    const [donor_shape, set_donor_shape] = useState('');
    const [form_desc, set_form_desc] = useState('');
    const [gltf, set_gltf] = useState('');
    const [name, set_name] = useState('');
    const [notes, set_notes] = useState('');
    const [product_upc, set_product_upc] = useState('');
    const [type, set_type] = useState('');
    const [workflow, set_workflow] = useState('');

    const changeTheme =(newTheme) => {
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
    
    const render = () => {
        var mounted = true;
        
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        var requestOptions = {
            method: "GET",
            headers: {
                "Authorization":token,
            },
            redirect: "follow"
        };
        if(props.stateVars === "new record") {
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
    }, []);

    return(
        <div className="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table>
                <tbody>
                    <tr>
                        <td><h3>Category Name</h3></td>
                    </tr>
                    <tr>
                        <td><h4>{props.stateVars}</h4></td>
                        <td><button>Return</button></td>
                        <td><button>Save</button></td>
                        <td><button>Clear</button></td>
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
                </tbody>
            </table>
        </div>
    )

}
