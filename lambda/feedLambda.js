const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: 'us-east-2' });

exports.handler = async (event) => {
    try {
        const feedContent = await getFeedFromS3();
        return {
            statusCode: 200,
            body: JSON.stringify(feedContent),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Erro ao buscar o feed:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao obter o feed de empregos.' }),
        };
    }
};

async function getFeedFromS3() {
    const getCommand = new GetObjectCommand({
        Bucket: 'plooral-teste-guh',
        Key: 'feed.json',
    });

    try {
        const response = await s3.send(getCommand);
        return response.result;

    } catch (error) {
        throw new Error('Erro ao analisar o feed JSON do S3: ' + error.message);
    }
}

module.exports = {
    getFeedFromS3
};

