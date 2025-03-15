// recipe.js

document.addEventListener("DOMContentLoaded", function () {
    // URL에서 레시피 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    // 예제 레시피 데이터 (실제 구현에서는 DB에서 가져와야 함)
    const recipes = {
        1: { name: "김치찌개", description: "김치와 돼지고기를 넣어 끓이는 얼큰한 찌개입니다." },
        2: { name: "비빔밥", description: "여러 가지 나물과 고기를 넣고 비벼 먹는 건강한 음식입니다." },
        3: { name: "떡볶이", description: "쫄깃한 떡과 매콤한 양념이 조화를 이루는 길거리 음식입니다." }
    };

    // 해당 레시피가 존재하면 표시
    if (recipes[recipeId]) {
        document.getElementById("recipe-title").textContent = recipes[recipeId].name;
        document.getElementById("recipe-description").textContent = recipes[recipeId].description;
    } else {
        document.getElementById("recipe-title").textContent = "레시피를 찾을 수 없습니다.";
        document.getElementById("recipe-description").textContent = "";
    }
});
