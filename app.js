// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA98iMqdjl_2gD_TPPTU5kUkqTkGQLypus",
  authDomain: "msgify-fa5b6.firebaseapp.com",
  databaseURL: "https://msgify-fa5b6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "msgify-fa5b6",
  storageBucket: "msgify-fa5b6.appspot.com",
  messagingSenderId: "88430514111",
  appId: "1:88430514111:web:1432b05b11eec790061b0a",
  measurementId: "G-8QDM93Y88C"
};
// Firebase 초기화
firebase.initializeApp(firebaseConfig);


document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('message');
  const nicknameInput = document.getElementById('nickname');
  const messagesContainer = document.getElementById('messages');

// Firebase Database에서 메시지를 읽어오는 함수
firebase.database().ref('messages').on('child_added', function(snapshot) {
  const messageData = snapshot.val();
  displayMessage(messageData.nickname, messageData.message, messageData.timestamp);
});


  window.sendMessage = function() {
      const nickname = nicknameInput.value.trim();
      const message = messageInput.value.trim();

      if (message) {
          // Firebase Database에 메시지 보내기
          firebase.database().ref('messages').push({
              nickname: nickname || '익명',
              message: message
          });
          messageInput.value = ''; // 입력 필드 초기화
      }
  };

  function displayMessage(nickname, message, timestamp) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-element');

    // 시간을 "YYYY/MM/DD HH:mm" 형태로 포맷
    const timeFormatted = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date(timestamp));
    
    // 시간 포맷을 "YYYY/MM/DD HH:mm" 형식으로 변환
    const timeString = timeFormatted.replace(/\./g, '/').replace(' ', ' ').replace(/\:/g, ':');

    messageElement.innerHTML = `<strong>[${timeString}] ${nickname}:</strong> ${message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}});
