import { Client } from '@elastic/elasticsearch'

const client = new Client({
    node: process.envES_HOST || 'http://localhost:9200',
    tls: {
        rejectUnauthorized: false
    }
})

export const JOBS_INDEX = 'jobs'

const jobsMapping = {
    mappings: {
        properties: {
            title: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    keyword: {type: 'keyword'}
                }
            },
            description: {
                type: 'text',
                analyzer: 'standard'
            },
            company_name: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    keyword: { type: 'keyword'}
                }
            },
            job_type: {
                type: 'keyword',
            },
            status: {
                type: 'keyword'
            },
            slug: {
                type: 'keyword'
            },
            location: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    keyword: { type: 'keyword' }
                }
            },
            salary_min: { type: 'integer' },
            salary_max: { type: 'integer' },
            employer_id: { type: 'integer'},
            created_at: {type: 'date'}

        }
    },
    settings: {
        number_of_shards: 1,
        number_of_replicas: 0
    }
}

export async function initElasticsearch() {
    try {
        await client.ping()
        console.log('Elasticsearch connected')

        const indexExists = await client.indices.exists({
        index: JOBS_INDEX
        })

        if (!indexExists) {
        await client.indices.create({
            index: JOBS_INDEX,
            ...jobsMapping
        })
        console.log(`Elasticsearch index '${JOBS_INDEX}' created`)
        } else {
        console.log(`Elasticsearch index '${JOBS_INDEX}' already exists`)
        }

    } catch (err) {
        console.error('Elasticsearch initialization failed:', err.message)
        throw err
    }
}

export default client