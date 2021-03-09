const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = $messageFormInput.value;

  $messageFormButton.setAttribute('disabled', 'disabled');

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) return console.log(error);
    console.log('Message got delivered');
  });
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation)
    return alert('Geolocation is not supported by your browser');

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    socket.emit(
      'sendLocation',
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      () => {
        console.log('Location shared!');
        $sendLocationButton.removeAttribute('disabled');
      }
    );
  });
});

socket.on('message', (message) => {
  console.log(message);
});
