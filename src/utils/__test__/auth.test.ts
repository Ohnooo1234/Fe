import { beforeEach, describe, expect, it } from 'vitest'
import { getAccessTokenFromLS, setAccessTokenToLS } from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzRhNjExNWZkYzVmMDM3ZTZmNjk0YiIsImVtYWlsIjoiZDdAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0xNVQwOTo1MDo0Ny4xODhaIiwiaWF0IjoxNjcxMDk3ODQ3LCJleHAiOjE2NzExODQyNDd9.aRuh6TdD8sMlJuAA-YYg_b0xNwOK4gQzoHsqLczs9Gw'

beforeEach(() => {
  localStorage.clear()
})

describe('access_token', () => {
  it('access_token được set vào localStorage', () => {
    setAccessTokenToLS(access_token)
    expect(getAccessTokenFromLS()).toBe(access_token)
  })
})
