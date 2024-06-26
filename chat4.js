const firebaseConfig = {
  apiKey: "AIzaSyCW_IvizOEOiLU96ODpb_zr-AS_3BF3tQo",
  authDomain: "ysg-totoro.firebaseapp.com",
  databaseURL: "https://ysg-totoro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ysg-totoro",
  storageBucket: "ysg-totoro.appspot.com",
  messagingSenderId: "552068912089",
  appId: "1:552068912089:web:29e40221aef49bbf98ffc8",
  measurementId: "G-WZV210EN3C"
};

firebase.initializeApp(firebaseConfig);

const messagesRef4 = firebase.database().ref('messages/chatting4');

// 사용자의 닉네임과 닉네임 색상을 쿠키에 저장하는 함수
function setNicknameCookie(nickname, color) {
  document.cookie = `nickname=${encodeURIComponent(nickname)};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  document.cookie = `nicknameColor=${encodeURIComponent(color)};expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

// 사용자의 닉네임과 닉네임 색상을 쿠키에서 읽어오는 함수
function getNicknameCookie() {
  const cookies = document.cookie.split(';');
  let nickname = '';
  let color = '';
  cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'nickname') {
          nickname = decodeURIComponent(value);
      }
      if (name === 'nicknameColor') {
          color = decodeURIComponent(value);
      }
  });
  return { nickname, color };
}

// 페이지 로드 시 쿠키에서 닉네임과 닉네임 색상 읽어오기
window.addEventListener('load', function() {
  const { nickname, color } = getNicknameCookie();
  if (nickname) {
      document.getElementById('nickname').value = nickname;
  }
  if (color) {
      document.getElementById('colorPicker').value = color;
  }
});

let isMessageSending = false; // 메시지 전송 중인지 여부를 추적하는 변수

function sendMessage() {
  if (isMessageSending) return; // 메시지 전송 중일 때 클릭 이벤트 무시

  const nickname = document.getElementById('nickname').value.trim();
  const message = document.getElementById('message').value.trim();
  const color = document.getElementById('colorPicker').value; // 색상 선택 정보 가져오기
  
  // 닉네임과 색상이 입력되었을 때에만 쿠키 저장
  if (nickname && color) {
      setNicknameCookie(nickname, color);
  }
  // 닉네임 길이가 10을 초과하는지 확인
  if (nickname.length > 10) {
      alert("닉네임은 10글자 이하여야 합니다.");
      return; // 함수 종료
  }

  // 메시지 길이가 50을 초과하는지 확인
  if (nickname && message && message.length <= 50) {
      isMessageSending = true; // 메시지 전송 중으로 설정
      messagesRef4.push({ nickname, message, color }); // 색상 정보도 함께 저장
      document.getElementById('message').value = ''; // 메시지 필드 초기화

      // 메시지 전송 후 1초 후에 다시 전송 가능하도록 잠금 해제
      setTimeout(() => {
          isMessageSending = false;
      }, 1000);
  } else if (message.length > 100) {
      alert("메시지는 50글자 이하여야 합니다.");
  } else {
      alert("닉네임과 메시지를 입력하세요.");
  }
}

document.getElementById('message').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
  }
});

// 최근 메시지 50개만 로딩
const recentMessagesRef = messagesRef4.limitToLast(100);

// 최근 메시지가 아래에서부터 오름차순으로 정렬되도록 변경된 코드
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
  
  // 메시지를 최신 메시지 아래에 추가하는 대신, 최신 메시지 아래에 추가
  const messagesDiv = document.getElementById('messages');
  messagesDiv.appendChild(messageElement);
  
  // 스크롤 위치 조정
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

function goToMainPage() {
  window.location.href = 'index.html'; // 메인 페이지로 이동
}