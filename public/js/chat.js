
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

  socket.on('receive-message', printMessages);
  socket.on('active-users', printUsers );

  socket.on('private-message', (payload) => {
    console.log("private: ", payload);
  });
  
}

const printUsers = ( users = [] ) => {
  ulUsers.innerHTML = '';
  users.forEach(({ name, uid }) => {
    const li = document.createElement('li');
    li.innerHTML = `${name} - ${uid}`;
    ulUsers.appendChild(li);
  });
}

const printMessages = ( messages = [] ) => {

  let messagesHTML = "";
  messages.forEach( ({ name, message }) => {
    messagesHTML += `
    <li>
      <p>
        <span class="text-primary">${name}: </span>
        <span>${message}</span>
      </p>
    </li>
   `;
  });
  ulMessages.innerHTML = messagesHTML;
}
  
txtMessage.addEventListener('keyup', ({ keyCode }) => {

  const message = txtMessage.value;
  const uid = txtUid.value;
  
  if (keyCode !== 13) return;
  if (message.trim().length === 0) return;

  socket.emit('send-message', { message, uid });

  txtMessage.value = '';

  
});

const main  = async () => {

  await validateJWT();

}

main();

