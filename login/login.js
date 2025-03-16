// 로그인 폼 제출 처리
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 기본 동작을 막습니다.

    // 아이디와 비밀번호 입력값 가져오기
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 로그인 처리 (예: 서버로 보내기)
    if (username && password) {
        // 로그인 성공적으로 처리하는 로직을 추가할 수 있습니다.
        alert('로그인 성공');
        // 로그인 후 페이지 이동 (예: 메인 페이지로)
        window.location.href = 'main.html';
    } else {
        alert('아이디와 비밀번호를 입력해주세요.');
    }
});

// 뒤로 가기 버튼 클릭 시 이전 페이지로 돌아가기
document.getElementById('back-btn').addEventListener('click', function() {
    window.history.back();
});

// DOMContentLoaded 이벤트 핸들러
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
