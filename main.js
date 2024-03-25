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

const messagesRef = firebase.database().ref('messages');

function sendMessage() {
    const nickname = document.getElementById('nickname').value.trim();
    const message = document.getElementById('message').value.trim();

    if (nickname && message) {
        messagesRef.push({ nickname, message });
        document.getElementById('message').value = ''; // 메시지 필드 초기화
    }
}

// 메시지 입력 필드에 키 이벤트 리스너 추가
document.getElementById('message').addEventListener('keydown', function(event) {
    // Shift + Enter가 눌렸을 때는 줄바꿈 처리
    if (event.shiftKey && event.key === 'Enter') {
        // 기본 이벤트를 방지하여 줄바꿈 처리
        event.preventDefault();
        this.value = this.value + "\n";
    }
    // Enter만 눌렸을 때는 메시지 전송
    else if (event.key === 'Enter') {
        event.preventDefault(); // Enter 키의 기본 이벤트(폼 제출 등) 방지
        sendMessage();
    }
});

// 실시간으로 메시지 가져오기
messagesRef.on('child_added', function(snapshot) {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.nickname}: ${message.message}`;
    document.getElementById('messages').appendChild(messageElement);
});

// 메시지 추가 로직 후...
document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
