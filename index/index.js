document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const mainContent = document.getElementById('main-content');
    const authButtons = document.getElementById('auth-buttons');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const searchContainer = document.getElementById('search-container');
    const categoryContainer = document.getElementById('category-container');
    
    // 로그인 버튼 클릭 시
    loginBtn.addEventListener('click', () => {
        authButtons.style.display = 'none'; 
        mainContent.style.display = 'none';
        searchContainer.style.display = 'none'; 
        loginForm.style.display = 'block';
    });

    // 회원가입 버튼 클릭 시
    signupBtn.addEventListener('click', () => {
        authButtons.style.display = 'none'; 
        mainContent.style.display = 'none';
        searchContainer.style.display = 'none';
        signupForm.style.display = 'block';
    });

    // 뒤로가기 버튼 클릭 시
    const backBtn = document.querySelectorAll('#back-btn');
    backBtn.forEach(button => {
        button.addEventListener('click', () => {
            loginForm.style.display = 'none'; 
            signupForm.style.display = 'none'; 
            authButtons.style.display = 'flex';
            mainContent.style.display = 'block';
            searchContainer.style.display = 'block'; 
        });
    });

    // 카테고리 상태 저장
    const saveCategoryLayout = () => {
        localStorage.setItem('categoryLayout', 'horizontal');
    };

    // 카테고리 설정
    if (localStorage.getItem('categoryLayout') === 'horizontal') {
        categoryContainer.classList.add('horizontal');
    }

    // 카테고리 레이아웃 변경 시 저장
    categoryContainer.addEventListener('click', saveCategoryLayout);
});
