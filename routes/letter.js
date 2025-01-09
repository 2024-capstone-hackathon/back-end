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

/* POST letter listing */
router.post('/', async (req, res) => {
  console.log("letter listing.");
  const { title, datetime, age } = req.body;

  try {
    console.log(",,,");
    const connection = await mysql.createConnection(dbConfig);

    const query = 'INSERT INTO stories (title, datetime, age) VALUES (?, ?, ?)';
    await connection.execute(query, [title, datetime, age]);
    await connection.end();

    res.status(201).send('Story added successfully');
  } catch (error) {
    console.error('Error inserting story:', error);
    res.status(500).send('Error adding story');
  }
});

// GET /letter - 전체 stories 목록 가져오기
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT id, title AS text, vote AS count, age, is_liked
      FROM stories
      WHERE vote >= 0
    `);
    await connection.end();

    console.log("Fetched stories with is_liked field:", rows);

    // JSON 형식으로 응답 데이터 구성
    const result = rows.map(row => ({
      id: row.id,
      title: row.text,
      count: row.count,
      age: row.age,
      isLiked: row.is_liked // 그대로 반환
    }));

    res.status(200).json(result); // 전체 stories 목록을 반환
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).send('Error fetching stories');
  }
});

module.exports = router;
