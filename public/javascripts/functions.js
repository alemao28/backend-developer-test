const { S3Client, SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: 'us-east-2' });

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(uuid);
}

async function enqueueJobForModeration(job) {
    try {
        const params = {
            MessageBody: JSON.stringify(job),
            QueueUrl: 'https://sqs.us-east-2.amazonaws.com/905418459182/plooral-fila',
        };

        await sqs.send(new SendMessageCommand(params));
        return true;
    } catch (error) {
        console.error('Erro ao enfileirar o trabalho para moderação:', error);
        return false;
    }
}

module.exports = {
    isValidUUID,
    enqueueJobForModeration
};