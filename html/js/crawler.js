const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 정적 파일 제공 (예: html 폴더)
app.use(express.static(path.join(__dirname, 'html')));
app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '06170828mm@',
    database: 'food_recipe_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

/**
 * 10000recipe.com 사이트에서 레시피 정보를 크롤링하여 배열로 반환하는 함수
 */
async function crawlRecipes() {
    try {
        // 크롤링할 대상 URL (검색 결과 페이지 URL)
        const url = 'https://www.10000recipe.com/?srsltid=AfmBOor2r79KVinp-fzqRNUr_rzJAfPupN_dSvVVtTYHJhVnslT0ED9w';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const recipes = [];

        // 사이트의 HTML 구조에 맞게 선택자를 수정하세요.
        $('a.common_sp_link').each((i, elem) => {
            const relativeUrl = $(elem).attr('href');
            const recipeUrl = relativeUrl ? 'https://www.10000recipe.com' + relativeUrl : null;
            const title = $(elem).find('.common_sp_caption .common_sp_title').text().trim();
            const image = $(elem).find('.common_sp_thumb img').attr('src');

            if (title) {
                recipes.push({ title, recipeUrl, image });
            }
        });
        return recipes;
    } catch (error) {
        console.error("크롤링 오류:", error);
        throw error;
    }
}

/**
 * /recipes 엔드포인트:
 * 검색 요청 시, 기존 데이터베이스의 recipes 테이블을 삭제한 후 새로 크롤링하고,
 * 검색어에 맞게 필터링한 결과를 JSON으로 반환합니다.
 * 예: http://localhost:3000/recipes?search=김치
 */
app.get('/recipes', async (req, res) => {
    const searchQuery = req.query.search || '';
    try {
        // 1. 기존 레시피 데이터 삭제
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM recipes', (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // 2. 새로 크롤링
        const recipes = await crawlRecipes();

        // 3. 크롤링한 데이터를 데이터베이스에 삽입
        await Promise.all(recipes.map(recipe => {
            return new Promise((resolve, reject) => {
                const sql = "INSERT INTO recipes (title, recipeUrl, image) VALUES (?, ?, ?)";
                db.query(sql, [recipe.title, recipe.recipeUrl, recipe.image], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }));

        // 4. 데이터베이스에서 검색어에 맞는 레시피 조회
        const filteredRecipes = await new Promise((resolve, reject) => {
            let sql = "SELECT * FROM recipes";
            let params = [];
            if (searchQuery) {
                sql += " WHERE title LIKE ?";
                params.push(`%${searchQuery}%`);
            }
            db.query(sql, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        res.json(filteredRecipes);
    } catch (error) {
        console.error("검색 및 크롤링 오류:", error);
        res.status(500).send("검색 및 크롤링 오류 발생");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버 실행됨: http://61.103.70.127:${PORT}`);
});
