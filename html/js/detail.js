document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        document.getElementById('recipe-detail').innerHTML = '<p>레시피 ID가 제공되지 않았습니다.</p>';
        return;
    }

    console.log(`✅ 현재 레시피 ID: ${recipeId}`);

    // 1. 레시피 조회 기록 남기기
    try {
        await fetch('/recordRecipeView', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipeId })
        });
        console.log('레시피 조회 기록 완료');
    } catch (err) {
        console.error('레시피 조회 기록 실패:', err);
    }

    // 2. OpenAPI에서 레시피 상세 정보 가져오기
    const API_URL = `/proxyRecipe?id=${encodeURIComponent(recipeId)}`;

    try {
        console.log(`🔍 OpenAPI에서 레시피 ID "${recipeId}" 조회 중...`);
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API 응답 오류: ${response.status}`);
        }

        const recipe = await response.json();

        document.getElementById('recipe-detail').innerHTML = `
            <h2>${recipe.RCP_NM || '제목 없음'}</h2>
            <img src="${recipe.ATT_FILE_NO_MAIN || '/images/default.jpg'}" alt="${recipe.RCP_NM}" class="recipe-main-image">
            <h3>재료</h3>
            <p>${recipe.RCP_PARTS_DTLS || '재료 정보 없음'}</p>
            <h3>조리법</h3>
            <div class="recipe-instructions">
                ${generateInstructions(recipe)}
            </div>
        `;
    } catch (err) {
        console.error('❌ 레시피 조회 오류:', err);
        document.getElementById('recipe-detail').innerHTML = `<p>레시피 정보를 불러오는 중 오류 발생: ${err.message}</p>`;
    }
});

// ✅ 조리법을 동적으로 생성하는 함수
function generateInstructions(recipe) {
    let instructionsHTML = '';
    for (let i = 1; i <= 20; i++) {
        const stepText = recipe[`MANUAL${i.toString().padStart(2, '0')}`]; 
        const stepImage = recipe[`MANUAL_IMG${i.toString().padStart(2, '0')}`];

        if (stepText && stepText.trim() !== '') {
            instructionsHTML += `
                <div class="recipe-step">
                    ${stepImage ? `<img src="${stepImage}" alt="Step ${i}" class="step-image">` : ''}
                    <p><strong>Step ${i}:</strong> ${stepText}</p>
                </div>
            `;
        }
    }
    return instructionsHTML || '<p>조리법 정보 없음</p>';
}