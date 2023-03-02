# API Documentation

Some of the request body sections don't have the correct methods or some bugs, but just wanted to provide a general structure for each call so it would be easier to know how to provide the correct parameter / json data when calling the api.

### Login API Endpoint Call
```
  fetch('/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'password'
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Invalid username or password');
    }
    return response.json();
  })
  .then(data => {
    const { access_token } = data;
    // Store the access token in local storage or cookie
    localStorage.setItem('access_token', access_token);
  })
  .catch(error => {
    console.error(error);
  });
```
### How to pass in data as a JSON object with less work
```
// Define the data to send in the request body
  const projectData = {
    name: "My New Project",
    products: ["123456", "789012"]
  };

  // Make an HTTP POST request to the create_project endpoint using fetch
  fetch('/projects/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(projectData)
  })
  .then(response => response.text())
  .then(data => {
    console.log('Created project with ID:', data);
  })
  .catch(error => {
    console.error('Error creating project:', error);
  });
```
## Project API Endpoints
### How to call the list all projects api endpoint:
```
  fetch('/api/projects/all', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + jwtAccessToken
    }
  })
  .then(response => {
    // handle the response
  })
  .catch(error => {
    // handle the error
  });
```

### How to call the *get_data (get project)* api endpoint:
```
  fetch('/api/projects/get/' + project_name, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + jwtAccessToken
    }
  })
  .then(response => {
    // handle the response
  })
  .catch(error => {
    // handle the error
  });
```

### How to call the *create* project api endpoint:
```
#Format of JSON
{
  name: str
  products : [str, str, str, ...]
}
```
```
fetch('/api/projects/add/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + jwtAccessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: name,
    products: products
  })
})
.then(response => {
  // handle the response
})
.catch(error => {
  // handle the error
});
```
### How to call the *edit* project api endpoint:
```
#Format of JSON
{
  name: str
  products : [str, str, str, ...]
}
```
```
fetch('/api/projects/edit/', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + jwtAccessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: name,
    products: products
  })
})
.then(response => {
  // handle the response
})
.catch(error => {
  // handle the error
});
```

### How to call the *delete* project api endpoint:
```
#Format of JSON (You can pass a json with more data but aslong as it has a name attribute for the project it should delete it will work)
{
  name: str
}
```
```
fetch('/api/projects/delete/', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer ' + jwtAccessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: name,
    products: products
  })
})
.then(response => {
  // handle the response
})
.catch(error => {
  // handle the error
});
```
## Product API Endpoints
### How to call the *Get Product* API Endpoint (Get Product by UPC)
```
  fetch('/api/products/get/' + product_ups, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + jwtAccessToken
    }
  })
  .then(response => {
    // handle the response
  })
  .catch(error => {
    // handle the error
  });
```
## How to call the *Create Product* API Endpoint
```
Format of the Product Data
{
  "upc": "string (unique)",
  "drc_upc": "optional string",
  "name": "string (unique)",
  "count": {
    "num": "int",
    "unit": "string"
  },
  "amount": {
    "measurement": "int",
    "unit": "string"
  },
  "template_name": "string",
  "width": "float",
  "height": "float",
  "depth": "float",
  "add_height": "optional float",
  "add_info": "string"
}
```
### Format of the JSON to be passed into the function
(the values for the amount, and count attributes can be subdictionaries and it will work fine)
```
{
  "upc": upc,
  "drc_upc": drc_upc,
  "name": name,
  "count": count,
  "amount": amount,
  "template_name": template_name,
  "width": width,
  "height": height,
  "depth": depth,
  "add_height": add_height,
  "add_info": add_info,
}
```
Body of Request:
```
const product = {
  "upc": "upc",
  "drc_upc": "drc_upc",
  "name": "name",
  "count": count,
  "amount": amount,
  "template_name": "template_name",
  "width": width,
  "height": height,
  "depth": depth,
  "add_height": add_height,
  "add_info": "add_info",
}

const project_name = example_project

fetch('/api/products/add/' + project_name, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + jwtAccessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(product)
})
.then(response => {
  // handle the response
})
.catch(error => {
  // handle the error
});
```

## How to call the *Edit Product* API Endpoint
It is basically the exact same as the create product, but it requires input of a json with each field needing to be updated, and the value to be updated with.

It doesn't need to contain every field just what needs to be updated.
```
Input JSON Structure:
product = {
  "upc": upc,
  "drc_upc": drc_upc,
  "name": name,
  "count": count,
  "amount": amount,
  "template_name": template_name,
  "width": width,
  "height": height,
  "depth": depth,
  "add_height": add_height,
  "add_info": add_info,
}
```
Body of Request:
```
fetch('/api/products/edit/' + product_upc, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + jwtAccessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(product)
})
.then(response => {
  // handle the response
})
.catch(error => {
  // handle the error
});
```
