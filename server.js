const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio'); // 문자열로 감싸기
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express(); // app 인스턴스 선언 후 사용
const PORT = 3000;

// 정적 파일 제공 (예: public 폴더)
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

// 현재 서버의 IP 주소 가져오는 함수
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

// 회원가입 API
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 입력값 검증
        if (!username || !password) {
            return res.status(400).send('아이디와 비밀번호를 입력하세요.');
        }
        if (password.length < 6) {
            return res.status(400).send('비밀번호는 최소 6자 이상이어야 합니다.');
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL 실행 (Prepared Statement 사용)
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('회원가입 실패: 이미 존재하는 아이디일 수 있습니다.');
            }
            res.send('회원가입 성공');
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

// 로그인 API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).send('로그인 오류');
        if (results.length === 0) {
            return res.status(401).send('아이디 또는 비밀번호가 틀렸습니다.');
        }
        const user = results[0];
        // bcrypt를 통해 해시된 비밀번호와 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('아이디 또는 비밀번호가 틀렸습니다.');
        }
        res.send('로그인 성공');
    });
});

// 레시피 검색 API
app.get('/recipes', (req, res) => {
    const category = req.query.category;
    let sql = 'SELECT * FROM recipes';
    let params = [];
    if (category && category !== 'all') {
        sql += ' WHERE category = ?';
        params.push(category);
    }
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).send('데이터 조회 실패');
        res.json(results);
    });
});

// 서버 실행 (외부 접속 가능하도록 0.0.0.0으로 설정)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 외부 접속 가능: http://61.103.70.127:${PORT}`);
});
