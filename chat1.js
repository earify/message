const firebaseConfig = {
  // Firebase 설정 정보
};

firebase.initializeApp(firebaseConfig);

// Firebase 데이터베이스의 messages 하위 경로에서 채팅 메시지를 관리
const messagesRef = firebase.database().ref('messages');

// 사용자의 고유한 식별 코드를 생성하여 쿠키에 저장하는 함수
function assignUserCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.cookie = `userCode=${code}; expires=Fri, 31 Dec 9999 23:59:59 GMT`; // 쿠키에 코드 저장
  return code;
}

// 사용자가 처음 페이지에 접속했을 때 실행되는 함수
window.onload = function() {
  const userCode = getCookie('userCode');
  if (!userCode) {
      assignUserCode();
  }
};

// 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
function getCookie(name) {
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      const cookiePair = cookieArray[i].split('=');
      const cookieName = cookiePair[0].trim();
      if (cookieName === name) {
          return cookiePair[1];
      }
  }
  return null;
}

// 메시지를 보낼 때 호출되는 함수
function sendMessage() {
  const message = document.getElementById('message').value.trim();
  const userCode = getCookie('userCode');

  // 메시지와 사용자 식별 코드가 유효한 경우에만 메시지를 전송
  if (message && userCode) {
      messagesRef.push({
          message: message,
          userCode: userCode // 사용자 식별 코드를 메시지와 함께 저장
      });
  }

  // 메시지 전송 후 입력 필드 초기화
  document.getElementById('message').value = '';
}

// Firebase에서 새로운 메시지가 추가될 때 호출되는 함수
messagesRef.on('child_added', function(snapshot) {
  const message = snapshot.val();
  const messageElement = document.createElement('div');
  messageElement.textContent = `${message.userCode}: ${message.message}`;
  document.getElementById('messages').appendChild(messageElement);
});
