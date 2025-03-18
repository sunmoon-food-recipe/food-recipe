const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL 연결 설정
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

// OpenAPI URL 설정
const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${process.env.API_KEY}/COOKRCP01/json/1/10`;

// API에서 레시피 데이터 가져와서 MySQL에 저장
async function fetchAndStoreRecipes() {
    try {
        console.log('📡 API 데이터 가져오는 중...');
        const response = await fetch(API_URL); // ✅ fetch 사용
        const data = await response.json();

        if (!data.COOKRCP01 || !data.COOKRCP01.row) {
            console.error('❌ API 응답에 데이터가 없습니다.');
            return;
        }

        const recipes = data.COOKRCP01.row;
        const db = await mysql.createConnection(dbConfig);

        for (const recipe of recipes) {
            const { RCP_NM, RCP_PARTS_DTLS, MANUAL01 } = recipe;

            const sql = `INSERT INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?)`;
            await db.execute(sql, [RCP_NM, RCP_PARTS_DTLS, MANUAL01]);

            console.log(`✅ 레시피 저장 완료: ${RCP_NM}`);
        }

        await db.end();
        console.log('🎉 모든 레시피 저장 완료!');
    } catch (err) {
        console.error('❌ 데이터 가져오기 오류:', err);
    }
}

// 함수 실행
fetchAndStoreRecipes();
