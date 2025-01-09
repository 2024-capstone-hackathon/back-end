const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig'); // dbConfig 설정 가져오기

// POST - counsels 테이블에 데이터 추가
exports.addCounsel = async (req, res) => {
    const { story_id, content, age } = req.body;

    // 필수 필드가 누락된 경우 클라이언트에 에러 반환
    if (!story_id || !content || age === undefined) {
        return res.status(400).send('Invalid request: Missing required fields.');
    }

    try {
        // 데이터베이스 연결 생성 및 데이터 삽입
        const connection = await mysql.createConnection(dbConfig);
        const query = 'INSERT INTO counsels (story_id, content, datetime, age) VALUES (?, ?, NOW(), ?)';
        await connection.execute(query, [story_id, content, age]);
        await connection.end();

        // 성공적으로 데이터가 삽입되었음을 반환
        res.status(201).send('Counsel added successfully.');
    } catch (error) {
        // 데이터 삽입 중 에러가 발생한 경우 서버 에러 반환
        console.error('Error inserting counsel:', error);
        res.status(500).send('Error adding counsel.');
    }
};

// GET - 오늘 날짜의 counsels 목록 가져오기
exports.getCounsels = async (req, res) => {
    try {
        // 데이터베이스 연결 생성 및 데이터 조회
        const connection = await mysql.createConnection(dbConfig);

        // 오늘 날짜의 데이터만 조회
        const [rows] = await connection.execute(`
      SELECT content AS text, age
      FROM counsels
      WHERE DATE(datetime) = CURDATE()
    `);
        await connection.end();

        // 조회된 데이터를 포맷팅하여 응답 데이터 구성
        const result = rows.map(row => ({
            text: row.text,
            age: Math.floor(row.age / 10) * 10, // 나이를 10단위로 변환
        }));

        // 데이터 조회 성공 시 반환
        res.status(200).json(result);
    } catch (error) {
        // 데이터 조회 중 에러 발생 시 서버 에러 반환
        console.error('Error fetching counsels:', error);
        res.status(500).send('Error fetching counsels.');
    }
};
