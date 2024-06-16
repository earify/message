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

firebase.initializeApp(firebaseConfig);

const messagesRef1 = firebase.database().ref("messages/chatting1");

// 사용자의 닉네임과 닉네임 색상, 식별 코드를 쿠키에 저장하는 함수
function setUserDataToCookie(nickname, color, userCode) {
  document.cookie = `nickname=${encodeURIComponent(nickname)};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  document.cookie = `nicknameColor=${encodeURIComponent(color)};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  document.cookie = `userCode=${encodeURIComponent(userCode)};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

// 사용자의 닉네임과 닉네임 색상을 쿠키에서 읽어오는 함수
function getUserDataFromCookie() {
  const cookies = document.cookie.split(";");
  let nickname = "";
  let color = "";
  let userCode = "";
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name === "nickname") {
      nickname = decodeURIComponent(value);
    }
    if (name === "nicknameColor") {
      color = decodeURIComponent(value);
    }
    if (name === "userCode") {
      userCode = decodeURIComponent(value);
    }
  });
  return { nickname, color, userCode };
}

// 페이지 로드 시 쿠키에서 사용자 정보 읽어오기
window.addEventListener("load", function () {
  const { nickname, color, userCode } = getUserDataFromCookie();
  if (nickname) {
    document.getElementById("nickname").value = nickname;
  }
  if (color) {
    document.getElementById("colorPicker").value = color;
  }
  if (!userCode) {
    const newUserCode = assignUserCode();
    setUserDataToCookie("", "", newUserCode);
  }

  // 메시지 입력 필드의 이벤트 리스너 추가
  const messageInput = document.getElementById("message");
  messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.shiftKey) {
      // Shift + Enter가 입력되었을 때
      const currentMessage = messageInput.value;
      messageInput.value = currentMessage + ""; // 줄바꿈 추가
    } else if (event.key === "Enter") {
      // Enter만 입력되었을 때
      event.preventDefault();
      sendMessage();
    }
  });
});

let isMessageSending = false; // 메시지 전송 중인지 여부를 추적하는 변수

function sendMessage() {
  if (isMessageSending) return; // 메시지 전송 중일 때 클릭 이벤트 무시

  const nickname = document.getElementById("nickname").value.trim();
  let message = document.getElementById("message").value.trim(); // 메시지 가져오기
  const color = document.getElementById("colorPicker").value; // 색상 선택 정보 가져오기

  // 사용자 정보 읽어오기
  const { userCode } = getUserDataFromCookie();

  // 닉네임과 색상이 입력되었을 때에만 쿠키 저장
  if (nickname && color) {
    setUserDataToCookie(nickname, color, userCode);
  }

  // 닉네임 길이가 10을 초과하는지 확인
  if (nickname.length > 10) {
    alert("닉네임은 10글자 이하여야 합니다.");
    return; // 함수 종료
  }

  // 메시지 길이가 100을 초과하는지 확인
  if (nickname && message && message.length <= 100) {
    // 줄바꿈 처리
    message = message.replace(/\n/g, "<br>"); // 줄바꿈 문자(\n)을 HTML <br> 태그로 변환

    isMessageSending = true; // 메시지 전송 중으로 설정
    messagesRef1.push({ nickname, message, color, userCode }); // 색상 정보와 사용자 코드도 함께 저장
    document.getElementById("message").value = ""; // 메시지 필드 초기화

    // 메시지 전송 후 1초 후에 다시 전송 가능하도록 잠금 해제
    setTimeout(() => {
      isMessageSending = false;
    }, 1000);
  } else if (message.length > 100) {
    alert("메시지는 100글자 이하여야 합니다.");
  } else {
    alert("닉네임과 메시지를 입력하세요.");
  }
}

// 최근 메시지 100개만 로딩
const recentMessagesRef = messagesRef1.limitToLast(100);

// 최근 메시지가 아래에서부터 오름차순으로 정렬되도록 변경된 코드
recentMessagesRef.on("child_added", function (snapshot) {
  // 메시지 표시 로직
  const message = snapshot.val();
  const messageElement = document.createElement("div");

  // 닉네임에 사용자가 선택한 색상과 볼드체 적용
  const nicknameElement = document.createElement("span");
  nicknameElement.textContent = `${message.nickname} (${message.userCode})`;
  nicknameElement.style.color = message.color; // 색상 적용
  nicknameElement.classList.add("nickname"); // 볼드체 적용을 위한 클래스 추가

  messageElement.appendChild(nicknameElement);

  // 메시지 내용에 줄바꿈 적용
  messageElement.innerHTML += `: ${message.message}`;

  // 메시지를 최신 메시지 아래에 추가하는 대신, 최신 메시지 아래에 추가
  const messagesDiv = document.getElementById("messages");
  messagesDiv.appendChild(messageElement);

  // 스크롤 위치 조정
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// 사용자에게 랜덤 코드를 생성하고 쿠키로 저장하는 함수
function assignUserCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.cookie = `userCode=${code}; expires=Fri, 31 Dec 9999 23:59:59 GMT`; // 쿠키에 코드 저장
  return code;
}

// Load More 버튼 클릭 시 최근 50개의 메시지 추가 로딩
document.getElementById("loadMoreButton").addEventListener("click", function () {
  const currentMessages = document.getElementById("messages").childElementCount;
  const offset = Math.max(currentMessages - 50, 0);

  messagesRef1.off("child_added"); // 기존 child_added 이벤트 제거

  messagesRef1.limitToLast(offset).on("child_added", function (snapshot) {
    const message = snapshot.val();
    const messageElement = document.createElement("div");

    const nicknameElement = document.createElement("span");
    nicknameElement.textContent = `${message.nickname} (${message.userCode})`;
    nicknameElement.style.color = message.color;
    nicknameElement.classList.add("nickname");

    messageElement.appendChild(nicknameElement);
    messageElement.innerHTML += `: ${message.message}`;

    const messagesDiv = document.getElementById("messages");
    messagesDiv.insertBefore(messageElement, messagesDiv.firstChild);
  });
});

// 메시지 삭제 함수
function deleteMessage(messageId) {
  messagesRef1.child(messageId).remove()
    .then(() => {
      console.log("Message deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting message:", error);
    });
}

function goToMainPage() {
  window.location.href = 'index.html';
}