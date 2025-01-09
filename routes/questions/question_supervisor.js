const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fetch = require('node-fetch'); // node-fetch 버전 2 사용

// MySQL 데이터베이스 연결 설정
const dbConfig = {
  host: 'sample',
  user: 'sample',
  password: 'sample',
  database: 'sample'
};

// POST 요청 처리
router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  let connection;
  try {
    console.log("Received text:", text);

    // MySQL 연결
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL.");

    // stories 테이블에서 데이터 가져오기
    const [stories] = await connection.execute("SELECT id, title FROM stories");
    console.log("Fetched stories:", stories);

    // 외부 API로 전송할 데이터 구성
    const requestData = {
      text: text,
      stories: stories.map(story => ({ id: story.id, title: story.title }))
    };

    console.log('Sending data to external API /supervisor:', requestData);

    // 외부 API에 데이터 전송 (/supervisor)
    const supervisorResponse = await fetch(
      'https://sample/supervisor',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      }
    );

    if (!supervisorResponse.ok) {
      throw new Error(`External API error: ${supervisorResponse.status}`);
    }

    const supervisorApiResponse = await supervisorResponse.json();
    console.log('Received from external API /supervisor:', supervisorApiResponse);

    const supervisorId = supervisorApiResponse.id;

    // counsels 테이블에서 story_id가 supervisorId인 모든 content 조회
    const [counsels] = await connection.execute(
      "SELECT content FROM counsels WHERE story_id = ?",
      [supervisorId]
    );
    console.log("Fetched counsels:", counsels);

    // counsels의 content 리스트 추출
    const contents = counsels.map(counsel => counsel.content);

    // 외부 API로 전송할 데이터 구성 (/answer)
    const answerRequestData = {
      id: supervisorId,
      contents: contents
    };

    console.log('Sending data to external API /answer:', answerRequestData);

    // 외부 API에 데이터 전송 (/answer)
    const answerResponse = await fetch(
      'https://a4c5a47e-1228-463d-9889-297c8b34259e.mock.pstmn.io/answer',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answerRequestData)
      }
    );

    if (!answerResponse.ok) {
      throw new Error(`External API error: ${answerResponse.status}`);
    }

    const answerApiResponse = await answerResponse.json();
    console.log('Received from external API /answer:', answerApiResponse);

    const title = answerApiResponse.title;

    // 프론트엔드로 응답 전송
    res.status(200).json({ title: title });

  } catch (error) {
    console.error('Error processing request in question_supervisor:', error.message);
    res.status(500).json({ error: 'Error processing request in question_supervisor' });
  } finally {
    if (connection) await connection.end();
  }
});

module.exports = router;
