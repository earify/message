const firebaseConfig = {
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
// Firebase 초기화
firebase.initializeApp(firebaseConfig);


// Firebase Realtime Database 참조
const database = firebase.database();

// 메시지 저장 및 표시 관련 함수
function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message.trim() !== "") {
    database.ref("messages").push({
      nickname: nickname,
      message: message,
    });
    messageInput.value = "";
  }
}

// 메시지 표시
database.ref("messages").on("child_added", function(snapshot) {
  const message = snapshot.val();
  displayMessage(message.nickname + ": " + message.message);
});

// 보낸 메시지를 실시간으로 화면에 표시하는 함수
function displayMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  // 채팅이 추가될 때마다 스크롤을 아래로 이동
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;