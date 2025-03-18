window.addEventListener('DOMContentLoaded', async () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMessage = document.getElementById('welcome-message');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const recipeContainer = document.getElementById('recommended-recipes');

    // ✅ 로그인 상태 확인
    async function checkLoginStatus() {
        try {
            const response = await fetch('/checkLogin', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('서버 응답 오류');

            const result = await response.json();
            console.log('🔍 로그인 상태:', result);

            if (result.loggedIn) {
                loginBtn.style.display = 'none';
                signupBtn.style.display = 'none';
                logoutBtn.style.display = 'inline-block';
                if (welcomeMessage) {
                    welcomeMessage.innerText = `환영합니다, ${result.username}!`;
                }
            } else {
                loginBtn.style.display = 'inline-block';
                signupBtn.style.display = 'inline-block';
                logoutBtn.style.display = 'none';
                if (welcomeMessage) {
                    welcomeMessage.innerText = '';
                }
            }

            // ✅ 로그인 상태에 따라 추천 레시피 로드
            loadRecommendedRecipes();

        } catch (err) {
            console.error('로그인 상태 확인 오류:', err);
        }
    }

    // ✅ 로그아웃 기능 추가
    logoutBtn.addEventListener('click', async function () {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'include'
            });

            const result = await response.json();
            alert(result.message);

            // ✅ 로그아웃 후 추천 레시피 갱신
            checkLoginStatus();

        } catch (err) {
            console.error('❌ 로그아웃 오류:', err);
        }
    });

    async function loadRecommendedRecipes() {
        try {
            const response = await fetch('/recommendedRecipes', {
                method: 'GET',
                credentials: 'include'
            });
            let data = await response.json();
            recipeContainer.innerHTML = '';
    
            console.log('📌 추천 레시피 데이터:', data); // 🔍 API 응답 확인
    
            if (!data || data.length === 0) {
                recipeContainer.innerHTML = '<p>추천 레시피가 없습니다.</p>';
                return;
            }
    
            data.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe-item');
    
                const imageUrl = recipe.image_url || '/images/default.jpg';
                console.log(`🔍 레시피 이미지 URL: ${imageUrl}`); // 🔍 이미지 URL 확인
    
                recipeDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${recipe.name}" class="recipe-image">
                    <h3>${recipe.name}</h3>
                `;
    
                recipeDiv.addEventListener('click', () => {
                    window.location.href = `detail.html?id=${recipe.recipe_id}`;
                });
    
                recipeContainer.appendChild(recipeDiv);
            });
        } catch (err) {
            console.error('❌ 추천 레시피 로드 오류:', err);
            recipeContainer.innerHTML = '<p>추천 레시피를 불러오는 중 오류 발생</p>';
        }
    }
    
    

    // ✅ 로그인 및 회원가입 버튼 클릭 시 이동
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    signupBtn.addEventListener('click', () => {
        window.location.href = 'signup.html';
    });

    // ✅ 검색 버튼 이벤트 (검색 버튼이 존재할 경우에만 실행)
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function () {
            const keyword = searchInput.value.trim();

            if (!keyword) {
                alert('검색어를 입력하세요.');
                return;
            }

            // 검색 페이지로 이동하면서 검색어 전달
            window.location.href = `search.html?keyword=${encodeURIComponent(keyword)}`;
        });

        // 🔎 엔터 키로 검색 가능하도록 설정
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchBtn.click();
            }
        });
    }

    // ✅ 로그인 상태 확인 후 추천 레시피 로드
    checkLoginStatus();
});