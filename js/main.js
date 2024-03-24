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
