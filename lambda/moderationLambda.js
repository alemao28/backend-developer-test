import { S3Client, SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const s3 = new S3Client({ region: 'us-east-2' });
const sqs = new SQSClient();

export const handler = async (event) => {
    try {
        const feedContent = await getFeedFromS3();
        await moderateJobs(feedContent);
        return {
            statusCode: 200,
            body: 'Feed moderado com sucesso',
        };
    } catch (error) {
        console.error('Erro ao moderar o feed:', error);
        return {
            statusCode: 500,
            body: 'Erro ao moderar o feed de empregos.',
        };
    }
};

async function moderateJobs(feedContent) {
    const moderationPromises = feedContent.map(async (job) => {
        if (job.status === 'draft') {
            await enqueueJobForModeration(job);
        }
    });

    await Promise.all(moderationPromises);
}

async function enqueueJobForModeration(job) {
    const params = {
        MessageBody: JSON.stringify(job),
        QueueUrl: 'https://sqs.us-east-2.amazonaws.com/905418459182/plooral-fila',
    };

    await sqs.send(new SendMessageCommand(params));
}
