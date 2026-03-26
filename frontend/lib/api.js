import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})


let accessToken = null

export function setAccessToken(token) {
    accessToken = token
}

export function getAccessToken() {
    return accessToken
}

export function clearAccessToken() {
    accessToken = null
}

apiClient.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})


apiClient.interceptors.response.use(
    (response) => response,   

    async (error) => {
        const originalRequest = error.config

        // If 401 and we haven't already tried to refresh
        // _retry flag prevents infinite loop if refresh also fails
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                
                const { data } = await axios.post(
                    `${BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                )

                const newToken = data.data.accessToken
                setAccessToken(newToken)
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return apiClient(originalRequest)

            } catch (refreshError) {
                clearAccessToken()
                if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
                        window.location.href = '/login'
                }
                
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)


export const api = {
    // Auth
    register: (data) => apiClient.post('/api/auth/register', data),
    login: (data) => apiClient.post('/api/auth/login', data),
    logout: () => apiClient.post('/api/auth/logout'),
    refresh: () => axios.post(`${BASE_URL}/api/auth/refresh`, {}, { withCredentials: true }),
    getMe: () => apiClient.get('/api/auth/me'),

    // Jobs
    getJobs: (params) => apiClient.get('/api/jobs', { params }),
    getJob: (id) => apiClient.get(`/api/jobs/${id}`),
    getMyJobs: () => apiClient.get('/api/jobs/mine'),
    createJob: (data) => apiClient.post('/api/jobs', data),
    updateJob: (id, data) => apiClient.put(`/api/jobs/${id}`, data),
    deleteJob: (id) => apiClient.delete(`/api/jobs/${id}`),

    // Search
    search: (params) => apiClient.get('/api/search', { params }),

    // Applications
    apply: (jobId, data) => apiClient.post(`/api/applications/${jobId}`, data),
    getMyApplications: () => apiClient.get('/api/applications/mine'),
    getJobApplications: (jobId) => apiClient.get(`/api/applications/job/${jobId}`),
    getApplication: (id) => apiClient.get(`/api/applications/${id}`),
    updateStatus: (id, status) => apiClient.put(`/api/applications/${id}/status`, { status }),
    hasApplied: (jobId) => apiClient.get(`/api/applications/check/${jobId}`),

    // Payments
    createCheckout: () => apiClient.post('/api/payments/create-checkout-session'),
    getSubscription: () => apiClient.get('/api/payments/subscription'),
    cancelSubscription: () =>  apiClient.post('/api/payments/cancel'),
}

export default apiClient