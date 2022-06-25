
const url = "http://localhost:8080/api/auth/";

let user = null;
let socket = null;

const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnOut = document.querySelector('#btnOut');

const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
      window.location =  'index.html';
      throw new Error('There is no token on server');
    }

    const resp = await fetch( url, {
      headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = `${user.name} - Chat`;
 
    await connectSocket();
}

connectSocket = async () => {

  socket = io({
    'extraHeaders': {
      'x-token': localStorage.getItem('token')
    }
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('receive-message', () => {

  });

  socket.on('active-users', printUsers );

  socket.on('private-message', () => {

  });
  
}

const printUsers = ( users = [] ) => {
  ulUsers.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `${user.name} - ${user.uid}`;
    ulUsers.appendChild(li);
  });
}
  

const main  = async () => {

  await validateJWT();

}

main();

