import esClient from '../config/elasticsearch.js'
import { JOBS_INDEX } from '../config/elasticsearch.js'


export async function searchJobs({
    query,
    location,
    jobType,
    salaryMin,
    salaryMax,
    page = 1,
    limit = 10,
    } = {}) {


    const must = []
    const filter = []

    filter.push({ term: { status: 'active' } })

    if (query && query.trim()) {
        
        must.push({
            multi_match: {
                query: query.trim(),
                fields: ['title^3', 'company_name^2', 'description'],
                type: 'best_fields',
                fuzziness: 'AUTO',
                
            }
        })
    } else {
        must.push({ match_all: {} })
    }

    if (location && location.trim()) {
        filter.push({
            match: { location: location.trim() }
        })
    }

    if (jobType) {
        filter.push({ term: { job_type: jobType } })
    }

    if (salaryMin || salaryMax) {
        
        const rangeQuery = {}
        if (salaryMin) rangeQuery.gte = parseInt(salaryMin)
        if (salaryMax) rangeQuery.lte = parseInt(salaryMax)

        filter.push({
            range: { salary_min: rangeQuery }
        })
    }

    const from = (page - 1) * limit
    
    const response = await esClient.search({
        index: JOBS_INDEX,
        body: {
            query: {
                bool: {
                must,
                filter,
                }
            },

            sort: query
                ? [{ _score: 'desc' }, { created_at: 'desc' }]
                : [{ created_at: 'desc' }],

            from,
            size: limit,

            highlight: {
                fields: {
                title: {},
                description: {
                    fragment_size: 150,    
                    number_of_fragments: 2,
                    }
                },
                pre_tags: ['<em>'],
                post_tags: ['</em>'],
            },
        }
    })

    const hits = response.hits.hits
    const total = response.hits.total.value

    const jobs = hits.map(hit => ({
        ...hit._source,           
        id: hit._id,              
        score: hit._score,        
        highlights: hit.highlight || {},  
    }))

    return {
        jobs,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
    }
}