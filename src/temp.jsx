// used to store category/template code as i change it into three states instead of two 

<table id={theme}>
  <tbody>
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
</tbody>
</table>
