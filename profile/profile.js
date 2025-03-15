// 예시로 로컬 스토리지나 세션 스토리지에 저장된 사용자 정보를 가져오는 방식으로 처리
window.onload = function() {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    // 페이지에 사용자 정보 표시
    if (username) {
        document.getElementById('username').textContent = username;
    } else {
        document.getElementById('username').textContent = '회원정보 없음';
    }
    
    if (userId) {
        document.getElementById('user-id').textContent = userId;
    } else {
        document.getElementById('user-id').textContent = '정보 없음';
    }
    
    if (userEmail) {
        document.getElementById('user-email').textContent = userEmail;
    } else {
        document.getElementById('user-email').textContent = '이메일 없음';
    }
};

// 정보 수정 버튼 클릭 시
document.getElementById('edit-btn').addEventListener('click', function() {
    alert('정보 수정 기능은 나중에 구현됩니다.');
    // 정보 수정 로직을 추가해야 함
});

// 로그아웃 버튼 클릭 시
document.getElementById('logout-btn').addEventListener('click', function() {
    // 로컬 스토리지나 세션 스토리지에서 로그인 정보를 삭제
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    // 로그아웃 후 로그인 페이지로 이동
    window.location.href = 'login.html';
});
