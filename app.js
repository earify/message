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
  const color = document.getElementById('colorPicker').value; // 색상 선택 정보 가져오기

  if (nickname && message) {
      messagesRef.push({ nickname, message, color }); // 색상 정보도 함께 저장
      document.getElementById('message').value = ''; // 메시지 필드 초기화
  }
}


document.getElementById('message').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
  }
});

// 최근 메시지 50개만 로딩
const recentMessagesRef = messagesRef.limitToLast(50);

recentMessagesRef.on('child_added', function(snapshot) {
  // 메시지 표시 로직
  const message = snapshot.val();
  const messageElement = document.createElement('div');
  
  // 닉네임에 사용자가 선택한 색상과 볼드체 적용
  const nicknameElement = document.createElement('span');
  nicknameElement.textContent = message.nickname;
  nicknameElement.style.color = message.color; // 색상 적용
  nicknameElement.classList.add('nickname'); // 볼드체 적용을 위한 클래스 추가
  
  messageElement.appendChild(nicknameElement);
  messageElement.appendChild(document.createTextNode(`: ${message.message}`));
  
  document.getElementById('messages').appendChild(messageElement);
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

// 쿠키 설정

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

document.getElementById("saveButton").addEventListener("click", function(){
  let nickname = document.getElementById("nickname").value;
  setCookie("userNickname", nickname, 30); // 닉네임을 7일 동안 저장
});
