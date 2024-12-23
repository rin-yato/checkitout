export type ApiResponse<T> = ApiResponseError | ApiResponseSuccess<T>;

export interface ApiResponseSuccess<T> {
  data: T;
  error: null;
  response?: Response;
}

export interface ApiResponseError {
  error: { status: number; message: string; details?: unknown };
  data: null;
  response?: Response;
}

export type Api = ReturnType<typeof createApiCall>;

export function createApiCall() {
  return async <TSuccess>(
    url: string | URL,
    requestInit: RequestInit = {},
  ): Promise<ApiResponse<TSuccess>> => {
    return fetch(url, requestInit)
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) return { data: json as TSuccess, error: null, response: res };
        return { error: json, data: null, response: res } as ApiResponseError;
      })
      .catch((e) => {
        console.error("CHECKITOUT_ERROR", e);

        if (e instanceof Error) {
          return {
            error: { status: 500, message: "Something went wrong.", details: e.message },
            data: null,
          };
        }

        return {
          error: { status: 500, message: "Something went wrong." },
          data: null,
        };
      });
  };
}
