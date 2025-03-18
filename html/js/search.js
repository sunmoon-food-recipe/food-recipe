// js/search.js

window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultsDiv = document.getElementById('results');

  // 새로운 검색 결과를 가져오는 함수
  async function fetchResults(query) {
    try {
      // 타임스탬프를 붙여 캐시를 우회합니다.
      const response = await fetch(`/recipes?search=${encodeURIComponent(query)}&_=${Date.now()}`, { cache: 'no-cache' });
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      resultsDiv.innerHTML = '<p>검색 중 오류가 발생했습니다.</p>';
    }
  }

  // 검색 결과를 페이지에 출력하는 함수
  function displayResults(recipes) {
    resultsDiv.innerHTML = '';
    if (!recipes || recipes.length === 0) {
      resultsDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
      return;
    }
    const ul = document.createElement('ul');
    recipes.forEach(recipe => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${recipe.title}</strong><br>
                      <a href="${recipe.recipeUrl}" target="_blank">자세히 보기</a><br>
                      <img src="${recipe.image}" alt="${recipe.title}" style="max-width:150px;">`;
      ul.appendChild(li);
    });
    resultsDiv.appendChild(ul);
  }

  // 검색 버튼 클릭 시 새로운 결과를 가져옵니다.
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    fetchResults(query);
    // URL 업데이트 (선택 사항)
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('query', query);
    window.history.pushState({}, '', newUrl);
  });

  // 페이지 로드시 URL 쿼리 파라미터가 있다면 자동 검색
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('query');
  if (queryParam) {
    searchInput.value = queryParam;
    fetchResults(queryParam);
  }
});

