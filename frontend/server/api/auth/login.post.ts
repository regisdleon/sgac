import { createApiClient } from '../../utils/api'

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const api = createApiClient()

  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password
    })

    // Store the token in the API client
    if (response.token) {
      api.setAuthToken(response.token)
    }

    return await setUserSession(event, {
      user: response.user,
      loggedInAt: new Date(),
      token: response.token
    })
  } catch (error) {
    return createError({
      statusCode: 400,
      statusMessage: "Please check your email and password.",
    })
  }
})
