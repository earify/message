let nickname = "나";

function displayMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  // 채팅이 추가될 때마다 스크롤을 아래로 이동
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message.trim() !== "") {
    displayMessage(nickname + ": " + message);
    messageInput.value = "";
  }
}

// 엔터 키를 눌러 메시지 전송
document
  .getElementById("message-input")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

// 닉네임 설정
document
  .getElementById("nickname-input")
  .addEventListener("change", function (event) {
    nickname = event.target.value;
  });
// 메시지 저장
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
database.ref("messages").on("child_added", function (snapshot) {
  const message = snapshot.val();
  displayMessage(message.nickname + ": " + message.message);
});
