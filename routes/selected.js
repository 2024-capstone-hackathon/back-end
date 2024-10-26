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

// GET /selected - 오늘 날짜에서 vote가 가장 높은 title과 id 반환
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // 오늘 날짜의 시작과 끝 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = new Date(today);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    // SQL 쿼리로 오늘의 가장 높은 vote를 가진 title과 id 조회
    const [rows] = await connection.execute(`
      SELECT id, title
      FROM stories
      WHERE datetime BETWEEN ? AND ?
      ORDER BY vote DESC
      LIMIT 1
    `, [todayStart, todayEnd]);
    
    await connection.end();

    // 결과가 있으면 JSON 형식으로 반환, 없으면 404
    if (rows.length > 0) {
      const result = {
        id: rows[0].id,
        title: rows[0].title
      };
      res.status(200).json(result);
    } else {
      res.status(404).send('No stories found for today');
    }
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).send('Error fetching story');
  }
});

module.exports = router;
