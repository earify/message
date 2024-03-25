var firebaseConfig = {
  // 복사한 Firebase 설정을 여기에 붙여넣습니다.
  apiKey: "AIzaSyA98iMqdjl_2gD_TPPTU5kUkqTkGQLypus",
  authDomain: "msgify-fa5b6.firebaseapp.com",
  databaseURL: "https://msgify-fa5b6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "msgify-fa5b6",
  storageBucket: "msgify-fa5b6.appspot.com",
  messagingSenderId: "88430514111",
  appId: "1:88430514111:web:1432b05b11eec790061b0a",
  measurementId: "G-8QDM93Y88C"
};
firebase.initializeApp(firebaseConfig);

const messagesRef = firebase.database().ref('messages');

function sendMessage() {
  const nickname = document.getElementById('nickname').value.trim();
  const message = document.getElementById('message').value.trim();

  if (nickname && message) {
      messagesRef.push({ nickname, message });
      document.getElementById('message').value = ''; // 메시지 필드 초기화
  }
}

document.getElementById('message').addEventListener('keydown', function(event) {
  if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      this.value += "\n";
  } else if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
  }
});

messagesRef.on('child_added', function(snapshot) {
  const message = snapshot.val();
  const messageElement = document.createElement('div');
  messageElement.textContent = `${message.nickname}: ${message.message}`;
  document.getElementById('messages').appendChild(messageElement);

  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});