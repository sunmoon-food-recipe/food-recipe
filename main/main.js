function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
    
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
}

function addRecipe() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    
    if (title && description) {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('card');
        recipeDiv.innerHTML = `<h2>${title}</h2><p>${description}</p>`;
        document.getElementById('recipes').appendChild(recipeDiv);
        
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
    }
}
