const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ OpenAPI 인증 키
const API_KEY = process.env.API_KEY || 'd5fb304f275647cc8c7e';

// ✅ 현재 서버의 IP 주소 가져오는 함수
function getIPAddress() {   
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (let dev in interfaces) {
        for (let details of interfaces[dev]) {
            if (details.family === 'IPv4' && !details.internal) {
                return details.address;
            }
        }
    }
    return 'localhost';
}

// ✅ MySQL 연결 함수
async function connectDB() {
    return await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '06170828mm@',  
        database: process.env.DB_NAME || 'food_recipe_db',
    });
}

// ✅ 세션 설정
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,  
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

app.use(cors({
    origin: 'http://61.103.70.127:3000',
    credentials: true
}));

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'html')));

// ✅ OpenAPI 기반 레시피 검색 API
app.get('/searchRecipe', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ message: '검색어를 입력하세요.' });
    }

    const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json/1/10/RCP_NM=${encodeURIComponent(keyword)}`;

    try {
        console.log(`🔍 OpenAPI에서 "${keyword}" 검색 중...`);
        const response = await axios.get(API_URL);
        const data = response.data;

        if (!data.COOKRCP01 || !data.COOKRCP01.row) {
            return res.json([]);
        }

        const recipes = data.COOKRCP01.row.map(recipe => ({
            recipe_id: recipe.RCP_SEQ,
            name: recipe.RCP_NM,
            ingredients: recipe.RCP_PARTS_DTLS,
            instructions: recipe.MANUAL01 || "조리법 정보 없음",
            image_url: recipe.ATT_FILE_NO_MAIN || "/images/default.jpg"
        }));

        const userId = req.session.userId;
        if (userId) {
            const db = await connectDB();
            await db.query('INSERT INTO search_history (user_id, keyword) VALUES (?, ?)', [userId, keyword]);
            db.end();
        }

        res.json(recipes);
    } catch (err) {
        console.error('❌ OpenAPI 검색 오류:', err);
        res.status(500).json({ message: '검색 실패' });
    }
});

// 회원가입 API
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: '아이디와 비밀번호를 입력하세요.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    const db = await connectDB();

    try {
        const [results] = await db.query('SELECT COUNT(*) AS count FROM account WHERE username = ?', [username]);
        if (results[0].count > 0) {
            return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO account (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.json({ message: '회원가입 성공' });
    } catch (err) {
        console.error('회원가입 오류:', err);
        res.status(500).json({ message: '회원가입 중 오류 발생' });
    } finally {
        db.end();
    }
});

// ✅ 로그인 API
app.post('/login', async (req, res) => {
    try {
        console.log('📩 로그인 요청 수신:', req.body);

        if (!req.body || !req.body.username || !req.body.password) {
            return res.status(400).json({ message: '잘못된 요청 형식입니다.' });
        }

        const { username, password } = req.body;
        const db = await connectDB();

        const [results] = await db.query('SELECT * FROM account WHERE username = ?', [username]);
        if (results.length === 0) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
        }

        // ✅ 세션에 로그인 정보 저장
        req.session.userId = user.id;
        req.session.username = user.username;
        console.log(`✅ 로그인 성공! 세션 정보 저장됨: userId=${req.session.userId}, username=${req.session.username}`);

        res.json({ message: '로그인 성공', username: user.username });

    } catch (err) {
        console.error('❌ 로그인 오류:', err);
        res.status(500).json({ message: '로그인 중 오류 발생' });
    }
});


// ✅ OpenAPI를 이용한 개별 레시피 조회
app.get('/proxyRecipe', async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: '레시피 ID가 필요합니다.' });
    }

    // 여러 범위를 순차적으로 조회합니다.
    const ranges = [
        { start: 1, end: 1000 },
        { start: 1001, end: 2000 },
        { start: 2001, end: 3000 }
        // 필요에 따라 범위를 추가할 수 있습니다.
    ];

    let recipeFound = null;
    let currentRange;

    for (currentRange of ranges) {
        const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json/${currentRange.start}/${currentRange.end}`;
        try {
            console.log(`🔍 OpenAPI에서 범위 ${currentRange.start}~${currentRange.end} 내 레시피 ID "${id}" 조회 중...`);
            const response = await axios.get(API_URL);

            if (response.data && response.data.COOKRCP01 && response.data.COOKRCP01.row) {
                recipeFound = response.data.COOKRCP01.row.find(r => r.RCP_SEQ == id);
                if (recipeFound) {
                    break;
                }
            }
        } catch (err) {
            console.error(`❌ OpenAPI 요청 오류 (범위 ${currentRange.start}~${currentRange.end}):`, err);
            // 특정 범위 호출에 실패해도 다음 범위를 시도합니다.
        }
    }

    if (!recipeFound) {
        return res.status(404).json({ error: '해당 ID의 레시피를 찾을 수 없습니다.' });
    }

    res.json(recipeFound);
});

app.get('/recommendedRecipes', async (req, res) => {
    const userId = req.session.userId;
    let results = [];

    try {
        if (userId) {
            console.log(`🔍 로그인된 사용자 (ID: ${userId})의 검색 기록 기반 추천`);
            const db = await connectDB();
            const [searchHistory] = await db.query(
                `SELECT keyword FROM search_history WHERE account_id = ? ORDER BY timestamp DESC LIMIT 5`, 
                [userId]
            );
            db.end();

            if (searchHistory.length > 0) {
                const keyword = searchHistory[0].keyword; // 가장 최근 검색어 사용
                console.log(`🔍 최근 검색어: ${keyword}`);

                // OpenAPI에서 레시피 검색
                const API_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json/1/10/RCP_NM=${encodeURIComponent(keyword)}`;
                console.log(`🔗 OpenAPI 요청 URL: ${API_URL}`);

                const response = await axios.get(API_URL);
                const data = response.data;

                if (data.COOKRCP01 && data.COOKRCP01.row) {
                    results = data.COOKRCP01.row.map(recipe => ({
                        recipe_id: recipe.RCP_SEQ,
                        name: recipe.RCP_NM,
                        image_url: recipe.ATT_FILE_NO_MAIN || '/images/default.jpg'
                    }));
                }
            }
        }

        if (results.length === 0) {
            console.log('🔍 검색 기록이 없거나 비로그인 - 랜덤 추천 레시피 제공');

            // OpenAPI에서 랜덤 레시피 가져오기
            const randomAPI_URL = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/COOKRCP01/json/1/10`;
            console.log(`🔗 OpenAPI 랜덤 레시피 URL: ${randomAPI_URL}`);

            const response = await axios.get(randomAPI_URL);
            const data = response.data;

            if (data.COOKRCP01 && data.COOKRCP01.row) {
                results = data.COOKRCP01.row.map(recipe => ({
                    recipe_id: recipe.RCP_SEQ,
                    name: recipe.RCP_NM,
                    image_url: recipe.ATT_FILE_NO_MAIN || '/images/default.jpg'
                }));
            }
        }

        console.log('📌 추천 레시피 API 응답:', results);
        res.json(results);
    } catch (err) {
        console.error('❌ 추천 레시피 조회 오류:', err);
        res.status(500).json({ message: '추천 레시피 조회 실패' });
    }
});

// 레시피 상세 조회 기록 엔드포인트
app.post('/recordRecipeView', async (req, res) => {
    const { recipeId } = req.body;
    const userId = req.session.userId;
    
    if (!recipeId) {
        return res.status(400).json({ message: '레시피 ID가 필요합니다.' });
    }
    
    try {
        if (userId) {
            const db = await connectDB();
            await db.query(
                'INSERT INTO recipe_view_history (user_id, recipe_id) VALUES (?, ?)', 
                [userId, recipeId]
            );
            db.end();
        }
        res.json({ message: '레시피 조회 기록 완료' });
    } catch (err) {
        console.error('레시피 조회 기록 오류:', err);
        res.status(500).json({ message: '레시피 조회 기록 중 오류 발생' });
    }
});

// ✅ 로그인 상태 확인 API
app.get('/checkLogin', (req, res) => {
    console.log(`🔍 로그인 확인 요청 - 세션 정보:`, req.session);

    if (req.session.userId) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});


// ✅ 로그아웃 API
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: '로그아웃 실패' });
        }
        res.clearCookie('connect.sid');  // ✅ 세션 쿠키 삭제
        res.json({ message: '로그아웃 성공' });
    });
});


// ✅ 서버 실행
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 서버 실행 중: http://${getIPAddress()}:${PORT}`);
    console.log(`📡 외부 접속 주소: http://${getIPAddress()}:${PORT}`);
});