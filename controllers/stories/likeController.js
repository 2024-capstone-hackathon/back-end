const mysql = require('mysql2/promise');
const dbConfig = require('../../config/dbConfig'); // 데이터베이스 설정 가져오기

// POST - 특정 id의 vote 증가 및 isLiked 업데이트
exports.incrementVoteAndSetLike = async (req, res) => {
    const { id } = req.body;

    // 요청에 ID 필드가 없는 경우 에러 반환
    if (!id) {
        return res.status(400).send('Invalid request: ID is required');
    }

    try {
        console.log("Connecting to the database...");
        const connection = await mysql.createConnection(dbConfig);
        console.log("Database connection established.");

        // vote 증가 및 is_liked 업데이트
        console.log(`Updating vote and isLiked for story with id: ${id}`);
        const [result] = await connection.execute(
            'UPDATE stories SET vote = vote + 1, is_liked = 1 WHERE id = ?',
            [id]
        );

        await connection.end();

        if (result.affectedRows > 0) {
            console.log("Vote incremented and isLiked set to 1 successfully.");
            res.status(200).send('Vote incremented and isLiked updated successfully');
        } else {
            console.log("Story not found.");
            res.status(404).send('Story not found');
        }
    } catch (error) {
        // 데이터 업데이트 중 에러 발생 시 에러 반환
        console.error('Error updating vote and isLiked:', error);
        res.status(500).send('Error updating vote and isLiked');
    }
};
