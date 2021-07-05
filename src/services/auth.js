import jwt from 'jsonwebtoken'

const URL = process.env.COUNTRY_API_URL || 'http://localhost:8080';

export const checkIsAuthenticated = async () => {
    const token = localStorage.getItem('token')
    const now = new Date()
    return !(token && new Date(new Date().setUTCMilliseconds(jwt.decode(token).exp)) <= now);
}

export const authSignUp = async (credentials) => {
    try {
        const response = await fetch(`${URL}/user`, {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        return response.json();
    } catch (e) {
        console.log(e)
    }

}

export const authLogin = async (credentials) => {
    try {
        const response = await fetch(`${URL}/login`, {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        if (response.status !== 200)
            throw new Error('Either password or email are wrong')

        const responseJson = await response.json();
        localStorage.setItem('token', responseJson.token)
    } catch (e) {
        console.log(e)
        throw e;
    }
}
export const authLogout = async () => {
    localStorage.setItem('token', undefined)
}
