document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const messageElement = document.getElementById('message');
  const loginButton = document.getElementById('loginButton'); // 로그인 버튼 가져오기

  if (!username || !password) {
      messageElement.innerText = '아이디와 비밀번호를 입력하세요.';
      messageElement.style.color = 'red';
      return;
  }
  if (password.length < 6) {
      messageElement.innerText = '비밀번호는 최소 6자 이상이어야 합니다.';
      messageElement.style.color = 'red';
      return;
  }

  try {
      console.log('API 요청:', username, password);
      const response = await fetch('http://61.103.70.127:3000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
      });

      console.log('응답 상태:', response.status);

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
      }

      const responseText = await response.text();
      messageElement.innerText = responseText;
      messageElement.style.color = 'green';

      // 회원가입 성공 시 로그인 버튼 표시
      loginButton.style.display = 'block';

  } catch (err) {
      console.error('회원가입 오류:', err);
      messageElement.innerText = '회원가입 중 오류 발생: ' + err.message;
      messageElement.style.color = 'red';
  }
});
