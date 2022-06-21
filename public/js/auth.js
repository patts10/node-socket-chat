
const url = "http://localhost:8080/api/auth/";

const myForm = document.querySelector("form");

myForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // const formData = new FormData(myForm);
  const formData = {};

  for (const field of myForm.elements) {
    if (field.name) {
      formData[field.name] = field.value;
    }
  }
  
  fetch(url + 'login', {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(resp => resp.json())
    .then(({ msg, token }) => {
      if ( msg ) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = 'chat.html';
    }
  ).catch(err => console.log(err));

});



function handleCredentialResponse(response) {
      
  //Google Token: ID_TOKEN
  // console.log('id_token', response.credential);

  const body = { id_token: response.credential };

  fetch("http://localhost:8080/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(({ token }) => {
      localStorage.setItem( 'token', token );
      window.location = 'chat.html';
    })
    .catch(console.warn);
}

const button = document.getElementById('google_signout');
button.addEventListener('click', () => {
  google.accounts.id.disableAutoSelect();
  
  google.accounts.id.revoke( localStorage.getItem('email'), done => {
    localStorage.clear();
    location.reload();
   });
  
});