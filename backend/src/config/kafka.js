import { Kafka, Partitioners } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'hireboard',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 8,
    },
})


const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
})

export async function connectProducer() {
    await producer.connect()
    console.log('Kafka producer connected')
}


export async function publishJobEvent(eventType, job) {
    try {
        await producer.send({
        topic: 'job-events',
        messages: [
            {
                key: job.id.toString(),
                value: JSON.stringify({
                    eventType,
                    job,
                    timestamp: new Date().toISOString(),
                }),
            },
            ],
        })
    } catch (err) {
        console.error('❌ Kafka publish failed (non-critical):', err.message)
    }
}


const consumer = kafka.consumer({ groupId: 'elasticsearch-indexer' })


export async function startIndexerConsumer(esClient) {
    await consumer.connect()

    await consumer.subscribe({
      topic: 'job-events',
      fromBeginning: false,
    })

    console.log('Kafka consumer listening on: job-events')

    await consumer.run({
      eachMessage: async ({ message }) => {
        const { eventType, job } = JSON.parse(message.value.toString())

        try {
          if (eventType === 'job.created') {
            await esClient.index({
              index: 'jobs',
              id: job.id.toString(),
              document: {
                title: job.title,
                description: job.description,
                location: job.location,
                job_type: job.job_type,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                status: job.status,
                slug: job.slug,
                company_name: job.company_name,
                employer_id: job.employer_id,
                created_at: job.created_at,
              },
            })

            console.log(`Indexed job ${job.id}: ${job.title}`)

          } else if (eventType === 'job.deleted') {
            
            await esClient.delete({
              index: 'jobs',
              id: job.id.toString(),
            })

            console.log(`Removed job ${job.id} from index`)
          }

        } catch (err) {
          
          console.error(`Failed to process event ${eventType} for job ${job.id}:`, err.message)
        }
      },
    })
}

export default kafka