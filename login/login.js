document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // 로그인 폼 제출 처리 (예시: 서버로 보내기)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginForm.querySelector('input[type="text"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        // 로그인 요청 (예시)
        alert(`아이디: ${username}, 비밀번호: ${password}`);
    });
});
