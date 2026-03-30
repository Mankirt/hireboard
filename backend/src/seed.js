import dotenv from 'dotenv'
dotenv.config()

import pool from './config/db.js'
import { initDB } from './config/db.js'
import { hashPassword } from './services/authService.js'
import { publishJobEvent } from './config/kafka.js'
import { connectProducer } from './config/kafka.js'
import { initElasticsearch } from './config/elasticsearch.js'

// ── DUMMY DATA ─────────────────────────────────────────────

const employers = [
    {
        email: 'hiring@google.com',
        password: 'password123',
        fullName: 'Google Recruiting',
        companyName: 'Google',
        website: 'https://google.com',
        description: 'Google is a global technology company specializing in search, cloud computing, and AI.',
    },
    {
        email: 'jobs@stripe.com',
        password: 'password123',
        fullName: 'Stripe Talent',
        companyName: 'Stripe',
        website: 'https://stripe.com',
        description: 'Stripe builds economic infrastructure for the internet.',
    },
    {
        email: 'careers@airbnb.com',
        password: 'password123',
        fullName: 'Airbnb Careers',
        companyName: 'Airbnb',
        website: 'https://airbnb.com',
        description: 'Airbnb is a global platform for unique accommodations and experiences.',
    },
    {
        email: 'talent@vercel.com',
        password: 'password123',
        fullName: 'Vercel Team',
        companyName: 'Vercel',
        website: 'https://vercel.com',
        description: 'Vercel is the platform for frontend developers, providing speed and reliability.',
    },
]

const seekers = [
    {
        email: 'john@example.com',
        password: 'password123',
        fullName: 'John Smith',
    },
    {
        email: 'sarah@example.com',
        password: 'password123',
        fullName: 'Sarah Johnson',
    },
    {
        email: 'mike@example.com',
        password: 'password123',
        fullName: 'Mike Chen',
    },
]

const jobsData = [
    {
        companyIndex: 0, // Google
        title: 'Senior Software Engineer — Search Infrastructure',
        description: `We are looking for a Senior Software Engineer to join our Search Infrastructure team.

    You will work on systems that serve billions of queries per day, optimizing for latency, relevance, and reliability.

    Responsibilities:
    - Design and implement scalable distributed systems
    - Collaborate with ML teams to integrate ranking models
    - Lead technical design reviews and mentor junior engineers
    - Drive reliability improvements across the search stack

    Requirements:
    - 5+ years of software engineering experience
    - Strong systems design skills
    - Experience with distributed systems and large-scale infrastructure
    - Proficiency in Go, C++, or Java
    - Experience with search technologies (Elasticsearch, Solr) is a plus`,
        location: 'Mountain View, CA',
        jobType: 'full-time',
        salaryMin: 180000,
        salaryMax: 280000,
    },
    {
        companyIndex: 0, // Google
        title: 'Staff Machine Learning Engineer',
        description: `Join Google Brain to work on cutting-edge machine learning research and production systems.

    You will develop novel ML architectures and deploy them at massive scale across Google products.

    Responsibilities:
    - Research and develop state-of-the-art ML models
    - Scale models to production serving billions of users
    - Publish research and contribute to the ML community
    - Collaborate with product teams across Google

    Requirements:
    - PhD or equivalent in Machine Learning or related field
    - Strong publication record preferred
    - Deep expertise in deep learning frameworks (TensorFlow, PyTorch)
    - Experience deploying ML systems at scale`,
        location: 'New York, NY',
        jobType: 'full-time',
        salaryMin: 220000,
        salaryMax: 350000,
    },
    {
        companyIndex: 1, // Stripe
        title: 'Backend Engineer — Payments Platform',
        description: `Help us build the financial infrastructure that powers millions of businesses worldwide.

    As a Backend Engineer on the Payments Platform team, you'll work on the core systems that process billions of dollars in transactions.

    Responsibilities:
    - Build and maintain reliable payment processing systems
    - Design APIs used by millions of developers
    - Improve system reliability and reduce latency
    - Work closely with compliance and security teams

    Requirements:
    - 3+ years of backend engineering experience
    - Experience building high-availability distributed systems
    - Strong understanding of databases and data consistency
    - Familiarity with financial systems or payment processing is a plus`,
        location: 'Remote',
        jobType: 'remote',
        salaryMin: 160000,
        salaryMax: 220000,
    },
    {
        companyIndex: 1, // Stripe
        title: 'Developer Advocate',
        description: `We are looking for a Developer Advocate to help developers build great products with Stripe.

    You will create content, build demos, and engage with the developer community to make Stripe easier to use.

    Responsibilities:
    - Create technical content (blog posts, tutorials, videos)
    - Build sample applications demonstrating Stripe features
    - Speak at conferences and developer events
    - Gather developer feedback and share with product teams

    Requirements:
    - Strong technical background (comfortable writing code)
    - Excellent communication skills
    - Experience creating technical content
    - Passion for developer experience`,
        location: 'San Francisco, CA',
        jobType: 'full-time',
        salaryMin: 140000,
        salaryMax: 180000,
    },
    {
        companyIndex: 2, // Airbnb
        title: 'Senior Frontend Engineer — Guest Experience',
        description: `Join the Guest Experience team to build beautiful, fast, and accessible interfaces used by millions of travelers.

    You will own significant parts of the booking and discovery experience, working with React and modern web technologies.

    Responsibilities:
    - Build performant React applications at scale
    - Drive accessibility and internationalisation improvements
    - Collaborate with designers to implement pixel-perfect UIs
    - Mentor junior engineers and drive best practices

    Requirements:
    - 5+ years of frontend engineering experience
    - Expert knowledge of React and modern JavaScript
    - Strong understanding of web performance
    - Experience with large-scale frontend codebases`,
        location: 'San Francisco, CA',
        jobType: 'full-time',
        salaryMin: 170000,
        salaryMax: 240000,
    },
    {
        companyIndex: 2, // Airbnb
        title: 'Data Scientist — Trust & Safety',
        description: `Help keep Airbnb safe for hosts and guests by building models that detect fraud and policy violations.

    You will work on some of the most impactful ML problems in the company, directly protecting our community.

    Responsibilities:
    - Build fraud detection and risk scoring models
    - Design experiments and measure policy impact
    - Collaborate with engineers to deploy models in production
    - Analyze large datasets to find patterns and insights

    Requirements:
    - MS or PhD in Statistics, CS, or related field
    - Strong Python and SQL skills
    - Experience with ML model development and deployment
    - Background in trust & safety or fraud detection preferred`,
        location: 'Seattle, WA',
        jobType: 'full-time',
        salaryMin: 150000,
        salaryMax: 200000,
    },
    {
        companyIndex: 3, // Vercel
        title: 'Senior Infrastructure Engineer',
        description: `Help us build the infrastructure that powers the modern web. Vercel serves millions of deployments and billions of requests per day.

    You will work on the edge network, build tooling, and ensure our platform is reliable and fast for developers worldwide.

    Responsibilities:
    - Design and operate global edge infrastructure
    - Build internal tools for deployment and monitoring
    - Improve build performance and reliability
    - Collaborate with the DX team on developer-facing features

    Requirements:
    - 4+ years of infrastructure or platform engineering
    - Experience with Kubernetes, edge computing, or CDNs
    - Strong understanding of networking and distributed systems
    - Experience with Go or Rust preferred`,
        location: 'Remote',
        jobType: 'remote',
        salaryMin: 160000,
        salaryMax: 220000,
    },
    {
        companyIndex: 3, // Vercel
        title: 'Product Designer — Developer Experience',
        description: `Design the tools and interfaces that millions of developers use every day to build and deploy their applications.

    You will work closely with engineers and PMs to define and ship product features that delight developers.

    Responsibilities:
    - Design end-to-end product experiences for developers
    - Run user research and usability testing
    - Build and maintain the design system
    - Collaborate with engineering from concept to launch

    Requirements:
    - 4+ years of product design experience
    - Strong portfolio showing complex product work
    - Experience designing developer tools or technical products
    - Proficiency in Figma`,
        location: 'Remote',
        jobType: 'remote',
        salaryMin: 130000,
        salaryMax: 180000,
    },
]

// ── SEED FUNCTION ──────────────────────────────────────────

async function seed() {
    const client = await pool.connect()

    try {
        console.log('🌱 Starting seed...\n')

        // Clear existing data in correct order
        console.log('🗑️  Clearing existing data...')
        await client.query('DELETE FROM applications')
        await client.query('DELETE FROM jobs')
        await client.query('DELETE FROM subscriptions')
        await client.query('DELETE FROM employer_profiles')
        await client.query('DELETE FROM refresh_tokens')
        await client.query('DELETE FROM users')
        console.log('✅ Cleared\n')

        // ── CREATE EMPLOYERS ──────────────────────────────────
        console.log('👔 Creating employers...')
        const createdEmployers = []

        for (const employer of employers) {
        const passwordHash = await hashPassword(employer.password)

        const userResult = await client.query(
            `INSERT INTO users (email, password_hash, full_name, role)
            VALUES ($1, $2, $3, 'employer')
            RETURNING id`,
            [employer.email, passwordHash, employer.fullName]
        )

        const userId = userResult.rows[0].id

        await client.query(
            `INSERT INTO employer_profiles (user_id, company_name, website, description)
            VALUES ($1, $2, $3, $4)`,
            [userId, employer.companyName, employer.website, employer.description]
        )

        await client.query(
            `INSERT INTO subscriptions (user_id, plan, status)
            VALUES ($1, 'pro', 'active')`,
            [userId]
        )

        createdEmployers.push({ userId, ...employer })
        console.log(`  ✅ ${employer.companyName} (${employer.email})`)
        }

        // ── CREATE SEEKERS ────────────────────────────────────
        console.log('\n👤 Creating job seekers...')
        const createdSeekers = []

        for (const seeker of seekers) {
        const passwordHash = await hashPassword(seeker.password)

        const userResult = await client.query(
            `INSERT INTO users (email, password_hash, full_name, role)
            VALUES ($1, $2, $3, 'seeker')
            RETURNING id`,
            [seeker.email, passwordHash, seeker.fullName]
        )

        createdSeekers.push({ userId: userResult.rows[0].id, ...seeker })
        console.log(`  ✅ ${seeker.fullName} (${seeker.email})`)
        }

        // ── CREATE JOBS ───────────────────────────────────────
        console.log('\n💼 Creating job listings...')
        const createdJobs = []

        for (const jobData of jobsData) {
        const employer = createdEmployers[jobData.companyIndex]

        // Generate slug
        const slug = jobData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            + '-' + Math.random().toString(36).slice(2, 6)

        const result = await client.query(
            `INSERT INTO jobs
            (employer_id, title, slug, description, location, job_type, salary_min, salary_max)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
            employer.userId,
            jobData.title,
            slug,
            jobData.description,
            jobData.location,
            jobData.jobType,
            jobData.salaryMin,
            jobData.salaryMax,
            ]
        )

        const job = {
            ...result.rows[0],
            company_name: employer.companyName,
        }

        createdJobs.push(job)
        console.log(`  ✅ ${jobData.title} @ ${employer.companyName}`)
        }

        // ── CREATE APPLICATIONS ───────────────────────────────
        console.log('\n📝 Creating sample applications...')

        const applicationData = [
        { seekerIndex: 0, jobIndex: 0, status: 'reviewing',
            coverLetter: 'I have 6 years of experience building large-scale distributed systems and would love to bring that expertise to Google Search.' },
        { seekerIndex: 0, jobIndex: 2, status: 'pending',
            coverLetter: 'As a backend engineer with deep knowledge of payment systems, I am excited about the opportunity to work on Stripe\'s core platform.' },
        { seekerIndex: 1, jobIndex: 4, status: 'accepted',
            coverLetter: 'I am a senior frontend engineer with 7 years of React experience and a passion for building accessible, performant user interfaces.' },
        { seekerIndex: 1, jobIndex: 6, status: 'pending',
            coverLetter: 'I have spent 5 years building and operating large-scale Kubernetes clusters and edge infrastructure.' },
        { seekerIndex: 2, jobIndex: 1, status: 'rejected',
            coverLetter: 'I completed my PhD in Machine Learning at Stanford and have published 8 papers on transformer architectures.' },
        { seekerIndex: 2, jobIndex: 3, status: 'reviewing',
            coverLetter: 'I have been creating developer content for 4 years, with a YouTube channel of 50k subscribers focused on web development.' },
        ]

        for (const app of applicationData) {
        const seeker = createdSeekers[app.seekerIndex]
        const job = createdJobs[app.jobIndex]

        await client.query(
            `INSERT INTO applications (job_id, seeker_id, cover_letter, status)
            VALUES ($1, $2, $3, $4)`,
            [job.id, seeker.userId, app.coverLetter, app.status]
        )

        

        console.log(`  ✅ ${seeker.fullName} → ${job.title.slice(0, 40)}... [${app.status}]`)
        }

        console.log('\n✅ Database seeded successfully!\n')

        // ── INDEX IN ELASTICSEARCH ────────────────────────────
        console.log('🔍 Indexing jobs in Elasticsearch...')

        try {
        await connectProducer()

        for (const job of createdJobs) {
            publishJobEvent('job.created', job)
        }

        // Give Kafka consumer time to process
        await new Promise(resolve => setTimeout(resolve, 3000))
        console.log('✅ Jobs published to Kafka for indexing\n')
        } catch (err) {
        console.log('⚠️  Kafka indexing skipped:', err.message)
        console.log('   Start the server to index jobs in Elasticsearch\n')
        }

        // ── SUMMARY ───────────────────────────────────────────
        console.log('─'.repeat(50))
        console.log('📊 Seed Summary:')
        console.log(`   ${employers.length} employers created`)
        console.log(`   ${seekers.length} job seekers created`)
        console.log(`   ${jobsData.length} job listings created`)
        console.log(`   ${applicationData.length} applications created`)
        console.log('─'.repeat(50))
        console.log('\n🔑 Test Credentials:')
        console.log('\n  Employers (all password: password123):')
        employers.forEach(e => console.log(`    ${e.email}`))
        console.log('\n  Job Seekers (all password: password123):')
        seekers.forEach(s => console.log(`    ${s.email}`))
        console.log('\n🚀 Ready to demo!\n')

    } catch (err) {
        console.error('❌ Seed failed:', err)
        throw err
    } finally {
        client.release()
        await pool.end()
        process.exit(0)
    }
    }

    // Run
    initDB()
    .then(() => initElasticsearch())
    .then(() => seed())
    .catch(err => {
        console.error(err)
        process.exit(1)
})