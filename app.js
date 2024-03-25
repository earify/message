document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('message');
  const nicknameInput = document.getElementById('nickname');
  const messagesContainer = document.getElementById('messages');

  // 메시지 보내기 함수
  function sendMessage() {
      const nickname = nicknameInput.value.trim();
      const message = messageInput.value.trim();

      if (message) { // 메시지 입력 확인
          const messageElement = document.createElement('div'); // 메시지 요소 생성
          messageElement.classList.add('message-element'); // 스타일을 위한 클래스 추가
          messageElement.innerHTML = `<strong class="message-nickname">${nickname || '익명'}:</strong> ${message}`;
          messagesContainer.appendChild(messageElement); // 메시지를 메시지 컨테이너에 추가
          messageInput.value = ''; // 입력 필드 초기화
          messagesContainer.scrollTop = messagesContainer.scrollHeight; // 가장 최근 메시지 보이도록 스크롤
      }
  }

  // '보내기' 버튼을 클릭하면 메시지 보내기
  document.querySelector('button').addEventListener('click', sendMessage);

  // 엔터 키를 누르면 메시지 보내기
  messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          sendMessage();
          e.preventDefault(); // 폼 제출 방지
      }
  });
});
