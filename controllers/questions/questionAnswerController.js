const mysql = require('mysql2/promise');
const fetch = require('node-fetch'); // 외부 API 호출을 위한 node-fetch
const dbConfig = require('../../config/dbConfig'); // 데이터베이스 설정 가져오기

// POST - 외부 API 호출 및 응답 처리
exports.processQuestionAnswer = async (req, res) => {
    const supervisorId = req.body.supervisorId;

    // supervisorId가 없는 경우 에러 반환
    if (!supervisorId) {
        return res.status(400).json({ error: 'Supervisor ID is required' });
    }

    let connection;
    try {
        console.log("Received supervisor ID:", supervisorId);

        // MySQL 연결
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to MySQL.");

        // counsels 테이블에서 story_id가 supervisorId인 모든 content 조회
        const [counsels] = await connection.execute(
            "SELECT content FROM counsels WHERE story_id = ?",
            [supervisorId]
        );
        console.log("Fetched counsels:", counsels);

        // counsels의 content 리스트 추출
        const contents = counsels.map(counsel => counsel.content);

        // 외부 API로 전송할 데이터 구성
        const requestData = {
            id: supervisorId,
            contents: contents
        };

        console.log('Sending data to external API /answer:', requestData);

        // 외부 API에 데이터 전송
        const answerResponse = await fetch(
            'https://sample/answer',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
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
        // 에러 처리
        console.error('Error processing request in question_answer:', error.message);
        res.status(500).json({ error: 'Error processing request in question_answer' });
    } finally {
        if (connection) await connection.end();
    }
};
