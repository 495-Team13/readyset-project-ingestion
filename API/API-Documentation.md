##Unit Tests work, but I just can't figure out how to run them when in the unit_tests directory because of python imports.
If you want to run a test case just move it into the API folder and it should run fine.

##General Structure for how to call the login API endpoint and store the access_token for future calls to protected endpoints:
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
*How to call a protected endpoint in the frontend:*
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
*How to make a call passing in the JSON data.*
For example, the create project api request
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