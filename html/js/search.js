document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const keyword = urlParams.get('keyword');

  if (!keyword) {
      document.getElementById('recipe-results').innerHTML = '<p>검색어가 제공되지 않았습니다.</p>';
      return;
  }

  const API_KEY = 'd5fb304f275647cc8c7e'; // ✅ API 키 확인
  const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json/1/10/RCP_NM=${encodeURIComponent(keyword)}`;

  try {
      console.log(`🔍 OpenAPI에서 "${keyword}" 검색 중...`);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
          throw new Error(`API 응답 오류: ${response.status}`);
      }

      const data = await response.json();

      const resultsDiv = document.getElementById('recipe-results');
      resultsDiv.innerHTML = '';

      if (!data.COOKRCP01 || !data.COOKRCP01.row || data.COOKRCP01.row.length === 0) {
          resultsDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
          return;
      }

      const recipes = data.COOKRCP01.row;

      recipes.forEach(recipe => {
          const recipeDiv = document.createElement('div');
          recipeDiv.classList.add('recipe-item');

          recipeDiv.innerHTML = `
              <img src="${recipe.ATT_FILE_NO_MAIN || 'default.jpg'}" alt="${recipe.RCP_NM}" class="recipe-image">
              <h3>${recipe.RCP_NM}</h3>
          `;

          recipeDiv.addEventListener('click', () => {
              window.location.href = `detail.html?id=${recipe.RCP_SEQ}`;
          });

          resultsDiv.appendChild(recipeDiv);
      });

  } catch (err) {
      console.error('❌ 검색 오류:', err);
      document.getElementById('recipe-results').innerHTML = `<p>검색 중 오류 발생: ${err.message}</p>`;
  }
});

