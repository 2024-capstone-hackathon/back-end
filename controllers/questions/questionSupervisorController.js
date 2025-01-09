const mysql = require('mysql2/promise');
const fetch = require('node-fetch'); // 외부 API 호출을 위한 node-fetch
const dbConfig = require('../../config/dbConfig'); // 데이터베이스 설정 가져오기
const apiConfig = require('../../config/apiConfig'); // API 설정 가져오기

// POST - 외부 API 호출 및 데이터 처리
exports.processSupervisor = async (req, res) => {
    const { text } = req.body;

    // 요청 데이터 검증
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

        // 외부 API로 전송할 데이터 구성 (/supervisor)
        const requestData = {
            text: text,
            stories: stories.map(story => ({ id: story.id, title: story.title }))
        };

        console.log('Sending data to external API /supervisor:', requestData);

        // 외부 API 호출 (/supervisor)
        const supervisorResponse = await fetch(
            apiConfig.supervisorApiUrl,
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

        // 외부 API 호출 (/answer)
        const answerResponse = await fetch(
            apiConfig.answerApiUrl,
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

        // 응답 데이터 반환
        res.status(200).json({ title: title });

    } catch (error) {
        // 에러 처리
        console.error('Error processing request in question_supervisor:', error.message);
        res.status(500).json({ error: 'Error processing request in question_supervisor' });
    } finally {
        if (connection) await connection.end();
    }
};
