// 레시피 목록 예시 (검색할 대상 데이터)
const recipes = [
    { name: "초코 케이크", type: "디저트" },
    { name: "불고기", type: "한식" },
    { name: "파스타", type: "양식" },
    { name: "김치찌개", type: "한식" },
    { name: "과일 샐러드", type: "디저트" },
];

// 검색 기능
function searchRecipes() {
    const searchInput = document.getElementById('search-input').value.toLowerCase(); // 소문자로 변환
    const results = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchInput) || // 이름에 검색어가 포함된 경우
        recipe.type.toLowerCase().includes(searchInput)   // 종류에 검색어가 포함된 경우
    );

    displayResults(results);
}

// 검색 결과 출력
function displayResults(results) {
    const mainContent = document.getElementById('main-content');
    const resultsContainer = document.getElementById('recipe-results');

    // 메인 화면 숨기기
    mainContent.classList.add('hidden');

    // 검색 결과를 업데이트
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = ''; // 이전 결과 초기화

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
    } else {
        results.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe-item');
            recipeElement.innerHTML = `<h3>${recipe.name}</h3><p>종류: ${recipe.type}</p>`;
            resultsContainer.appendChild(recipeElement);
        });
    }
}
