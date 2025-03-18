// index.js

// DOMContentLoaded 이벤트를 사용하면 HTML 문서가 완전히 로드된 후 실행됩니다.
window.addEventListener('DOMContentLoaded', () => {
    // 로그인 상태 확인
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('signup-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline-block';
    } else {
        document.getElementById('login-btn').style.display = 'inline-block';
        document.getElementById('signup-btn').style.display = 'inline-block';
        document.getElementById('logout-btn').style.display = 'none';
    }

    // 로그인 버튼 클릭 시 login.html로 이동
    document.getElementById('login-btn').addEventListener('click', function() {
        window.location.href = 'login.html'; // 로그인 페이지로 이동
    });

    // 회원가입 버튼 클릭 시 create_account.html로 이동
    document.getElementById('signup-btn').addEventListener('click', function() {
        window.location.href = 'signup.html'; // 회원가입 페이지로 이동
    });

    // 로그아웃 버튼 클릭 시
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        window.location.reload(); // 페이지 새로고침
    });

    // 검색 버튼 클릭 시
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchQuery = document.getElementById('search-input').value;
        if (searchQuery) {
            // 검색 페이지로 검색어를 파라미터로 전달하며 이동
            window.location.href = 'search.html?query=' + encodeURIComponent(searchQuery);
        }
    });
});

