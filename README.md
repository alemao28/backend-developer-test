# Backend Developer Technical Assessment
### User Actions
start: node ./bin/www

http://localhost:3000

Convert the following use cases into API endpoints:

- `GET /companies`: List existing companies.
- `GET /companies/:company_id`: Fetch a specific company by ID.
- `POST /job`: Create a job posting draft.
- `PUT /job/:job_id/publish`: Publish a job posting draft.
- `PUT /job/:job_id`: Edit a job posting draft (title, location, description).
- `DELETE /job/:job_id`: Delete a job posting draft.
- `PUT /job/:job_id/archive`: Archive an active job posting.



### Bonus Questions

1. Discuss scalability solutions for the job moderation feature under high load conditions. Consider that over time the system usage grows significantly, to the point where we will have thousands of jobs published every hour. Consider the API will be able to handle the requests, but the serverless component will be overwhelmed with requests to moderate the jobs. This will affect the database connections and calls to the OpenAI API. How would you handle those issues and what solutions would you implement to mitigate the issues?

Implementar escalabilidade horizontal com AWS Lambda usadno gatihlos automaticos, dividir processos em filas SQS , limitar a conexao com o banco de dados ultilizando pool,criando indicices para reduzir a carga reduzir chamadas a api.

2. Propose a strategy for delivering the job feed globally with sub-millisecond latency. Consider now that we need to provide a low latency endpoint that can serve the job feed content worldwide. Using AWS as a cloud provider, what technologies would you need to use to implement this feature and how would you do it?

Configurar o s3 entre regiões, criar instancias Lambda e outros serviços próximas aos usuários, usar o AWS Global Accelerator para otimizar o tráfego, usar o  CloudFront para fornecer acesso rápido a locais próximos aos usuários
