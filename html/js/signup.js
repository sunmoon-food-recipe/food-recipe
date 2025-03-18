document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const response = await fetch('http://61.103.70.127:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const text = await response.text();
      document.getElementById('message').innerText = text;
    } catch (err) {
      document.getElementById('message').innerText = '회원가입 중 오류 발생';
    }
  });
  