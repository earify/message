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

const messagesRef1 = firebase.database().ref('messages/chatting1');

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
  // 닉네임 길이가 20을 초과하는지 확인
  if (nickname.length > 20) {
      alert("닉네임은 20글자 이하여야 합니다.");
      return; // 함수 종료
  }

  // 메시지 길이가 50을 초과하는지 확인
  if (nickname && message && message.length <= 50) {
      isMessageSending = true; // 메시지 전송 중으로 설정
      messagesRef1.push({ nickname, message, color }); // 색상 정보도 함께 저장
      document.getElementById('message').value = ''; // 메시지 필드 초기화

      // 메시지 전송 후 1초 후에 다시 전송 가능하도록 잠금 해제
      setTimeout(() => {
          isMessageSending = false;
      }, 1000);
  } else if (message.length > 50) {
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
const recentMessagesRef = messagesRef1.limitToLast(100);

// 최근 메시지가 도착할 때 개인 식별 코드를 포함하여 채팅 내용을 표시하는 코드
recentMessagesRef.on('child_added', function(snapshot) {
  const message = snapshot.val();
  const messageElement = document.createElement('div');
  
  // 각 메시지에 해당하는 사용자의 식별 코드 가져오기
  const userCode = message.userCode;

  // 닉네임과 개인 식별 코드를 조합하여 표시
  const nickname = `${message.nickname}(${userCode})`; // 닉네임과 개인 식별 코드 조합

  // 닉네임에 사용자가 선택한 색상과 볼드체 적용
  const nicknameElement = document.createElement('span');
  nicknameElement.textContent = nickname;
  nicknameElement.style.color = message.color; // 색상 적용
  nicknameElement.classList.add('nickname'); // 볼드체 적용을 위한 클래스 추가
  
  messageElement.appendChild(nicknameElement);
  messageElement.appendChild(document.createTextNode(`: ${message.message}`));
  
  // 메시지를 최신 메시지 아래에 추가하는 대신, 최신 메시지 위에 추가
  const messagesDiv = document.getElementById('messages');
  messagesDiv.insertBefore(messageElement, messagesDiv.firstChild);

  // 스크롤 위치 조정
  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

// 최근 메시지가 도착할 때 알림을 생성하고 사용자에게 보내는 코드
recentMessagesRef.on('child_added', function(snapshot) {
  const message = snapshot.val();
  const notificationTitle = '새로운 메시지 도착';
  const notificationOptions = {
      body: `${message.nickname}: ${message.message}`,
      icon: 'icon.png' // 알림에 표시될 아이콘
  };

  // 알림 권한 요청
  Notification.requestPermission().then(function(permission) {
    if (permission === 'granted') {
        console.log('알림 권한이 허용되었습니다.');
    }
  });

  // 알림 생성 및 전송
  if (Notification.permission === 'granted') {
      new Notification(notificationTitle, notificationOptions);
  }
});

// 사용자에게 랜덤 코드를 생성하고 쿠키로 저장하는 함수
function assignUserCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.cookie = `userCode=${code}; expires=Fri, 31 Dec 9999 23:59:59 GMT`; // 쿠키에 코드 저장
  return code;
}

// 사용자 코드가 이미 생성되어 있는지 확인하고, 없으면 생성하는 함수
function getUserCode() {
  let userCode = getCookie('userCode');
  if (!userCode) {
      userCode = assignUserCode();
  }
  return userCode;
}

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

// 사용자 코드를 이용하여 닉네임 생성하는 함수
function generateNickname() {
  const userCode = getUserCode(); // 사용자 코드 가져오기
  const nickname = userCode + '-' + prompt('닉네임을 입력하세요:'); // 사용자로부터 닉네임 입력 받음
  return nickname;
}

// 최초로 페이지를 방문했을 때 사용자 코드 생성
window.onload = function() {
  getUserCode();
};
