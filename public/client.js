const inputForm = document.forms[0];
const nickInput = inputForm[0];
const messInput = inputForm[1];
var socket = io();

inputForm.onsubmit = function (event) {
  event.preventDefault();
  let date = new Date;
  let hour = `${date.getHours()}:${date.getMinutes()}`;
  let day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  if (messInput.value.trim().length === 0) return

  socket.emit('new message', nickInput.value, day, hour, messInput.value)

  messInput.value = ""
};

socket.on('connect', () => {
  let request = new XMLHttpRequest();
  request.addEventListener("load", handleRequest);
  request.open("GET", "/getMessages");
  request.send();
})

socket.on('new message', (nick, day, hour, mess) => {
  addMessage(nick, day, hour, mess);
})

function handleRequest() {
  let messages = this.responseText;
  messages = JSON.parse(messages);
  messages.forEach(elt => {
    addMessage(elt.nick, elt.day, elt.hour, elt.mess);
  })
}

function addMessage(nick, day, hour, mess) {
  let parrent = document.createElement('li');
  let message = document.createElement('div');
  let nickS = document.createElement('span');
  let dayS = document.createElement('span');
  let hourS = document.createElement('span');
  let messS = document.createElement('span');

  nickS.className = 'data';
  dayS.className = 'data';
  hourS.className = 'data';
  messS.className = 'message-content';

  nickS.textContent = nick + ', ';

  let date = new Date;
  let clientDayNow = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let clientDayYesterday = `${date.getFullYear()}-${date.getMonth()}-${date.getDate() - 1}`
  if (clientDayNow === day) {
    dayS.textContent = 'Dziś o ';
  } else {
    if (clientDayYesterday == day) {
      dayS.textContent = 'Wczoraj o ';
    } else {
      dayS.textContent = day + ' o ';
    }
  }

  if (hour == '0') hour = '00';

  hourS.textContent = hour;
  messS.textContent = mess;

  parrent.appendChild(nickS);
  parrent.appendChild(dayS);
  parrent.appendChild(hourS);
  parrent.appendChild(document.createElement('br'));
  parrent.appendChild(messS);

  document.getElementById('messages').appendChild(parrent);
}