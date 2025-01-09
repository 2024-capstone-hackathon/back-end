const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig'); // 데이터베이스 설정 가져오기

// POST - stories 테이블에 데이터 추가
exports.addStory = async (req, res) => {
    const { title, datetime, age } = req.body;

    // 요청에 필요한 필드가 있는지 확인
    if (!title || !datetime || age === undefined) {
        return res.status(400).send('Invalid request: Missing required fields.');
    }

    try {
        // 데이터베이스 연결 및 데이터 삽입
        const connection = await mysql.createConnection(dbConfig);
        const query = 'INSERT INTO stories (title, datetime, age) VALUES (?, ?, ?)';
        await connection.execute(query, [title, datetime, age]);
        await connection.end();

        res.status(201).send('Story added successfully');
    } catch (error) {
        // 데이터 삽입 중 에러가 발생하면 서버 에러 반환
        console.error('Error inserting story:', error);
        res.status(500).send('Error adding story');
    }
};

// GET - stories 테이블의 모든 데이터 가져오기
exports.getStories = async (req, res) => {
    try {
        // 데이터베이스 연결 및 데이터 조회
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
      SELECT id, title AS text, vote AS count, age, is_liked
      FROM stories
      WHERE vote >= 0
    `);
        await connection.end();

        // 조회된 데이터를 포맷팅하여 응답 구성
        const result = rows.map(row => ({
            id: row.id,
            title: row.text,
            count: row.count,
            age: row.age,
            isLiked: row.is_liked,
        }));

        res.status(200).json(result); // 전체 stories 목록 반환
    } catch (error) {
        // 데이터 조회 중 에러 발생 시 서버 에러 반환
        console.error('Error fetching stories:', error);
        res.status(500).send('Error fetching stories');
    }
};
