// 예시 데이터 (실제 API를 사용해서 데이터를 받아올 경우 여기에 처리)
const recipes = [
    { name: '레시피 1', image: 'recipe-image1.jpg' },
    { name: '레시피 2', image: 'recipe-image2.jpg' },
    { name: '레시피 3', image: 'recipe-image3.jpg' },
];

// 검색 결과를 담을 DOM 요소
const resultsContainer = document.getElementById('search-results');

// 레시피 항목을 동적으로 생성하여 표시
recipes.forEach(recipe => {
    const recipeItem = document.createElement('div');
    recipeItem.classList.add('recipe-item');
    
    // 레시피 이미지 추가
    const img = document.createElement('img');
    img.src = recipe.image;
    img.alt = recipe.name;
    img.classList.add('recipe-image');
    recipeItem.appendChild(img);

    // 레시피 이름 추가
    const name = document.createElement('h3');
    name.classList.add('recipe-name');
    name.textContent = recipe.name;
    recipeItem.appendChild(name);

    // 결과 컨테이너에 레시피 항목 추가
    resultsContainer.appendChild(recipeItem);
});
