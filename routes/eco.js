const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// MySQL 데이터베이스 연결 설정
const dbConfig = {
  host: 'sample',
  user: 'sample',
  password: 'sample',
  database: 'sample'
};

// POST /eco - counsels 테이블에 데이터 추가
router.post('/', async (req, res) => {
  const { story_id, content, age } = req.body;

  if (!story_id || !content || age === undefined) {
    return res.status(400).send('Invalid request: Missing required fields');
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO counsels (story_id, content, datetime, age) VALUES (?, ?, NOW(), ?)';
    await connection.execute(query, [story_id, content, age]);
    await connection.end();

    res.status(201).send('Counsel added successfully');
  } catch (error) {
    console.error('Error inserting counsel:', error);
    res.status(500).send('Error adding counsel');
  }
});

// GET /counsels - 오늘 날짜의 counsels 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // 오늘 날짜의 데이터만 조회하는 쿼리
    const [rows] = await connection.execute(`
      SELECT content AS text, age
      FROM counsels
      WHERE DATE(datetime) = CURDATE()
    `);
    await connection.end();

    // JSON 형식으로 응답 데이터 구성
    const result = rows.map(row => ({
      text: row.text,
      age: Math.floor(row.age / 10) * 10 // 나이를 10의 자리로 변환
    }));

    res.status(200).json(result); // 오늘 날짜의 counsels 목록을 반환
  } catch (error) {
    console.error('Error fetching counsels:', error);
    res.status(500).send('Error fetching counsels');
  }
});

module.exports = router;
