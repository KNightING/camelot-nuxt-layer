class TestApi extends BaseApi {
  constructor() {
    super({
      baseURL: 'https://api.example.com',
      contentType: ContentType.Json,
      cachePolicy: 'cache',
      onRequests: [
        useBasicTokenRequest('account', 'password'),
        useBearerTokenRequest('token'),
      ],
      onResponses: [
        ({ response }) => {
          console.log(response)
        },
      ],
    })
  }

  public postData() {
    return this.api.get<{ a: string }>(() => '/data').fetch()
  }

  public getUser(id: string) {
    return this.api.get(`/user/${id}`, {
      onRequests: [
        ({ options }) => {
          options.headers.set('X-Custom-Header', 'value')
        },
      ],
    })
  }
}

export const useTestApi = () => new TestApi()
