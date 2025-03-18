document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include' // ✅ 세션 쿠키를 포함하여 요청 (CORS 대응)
      });

      const data = await response.json();
      if (response.ok) {
          alert('로그인 성공! 메인 페이지로 이동합니다.');
          window.location.href = 'index.html'; // ✅ 로그인 성공 시 index.html로 이동
      } else {
          document.getElementById('message').innerText = data.message;
      }
  } catch (err) {
      console.error('❌ 로그인 중 오류 발생:', err);
      document.getElementById('message').innerText = '로그인 중 오류 발생';
  }
});
