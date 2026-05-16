export const API_BASE_URL = 'http://localhost/api'

export async function apiGet(path) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            Accept: 'application/json',
        },
    })

    return response.json()
}