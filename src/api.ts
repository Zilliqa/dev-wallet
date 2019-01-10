const getHost = (host: string) => {
  switch (host) {
    default:
      return 'https://api.abc.com/v0';
  }
};

const HOST = getHost(window.location.hostname);

export const handleFetch = async ({ fetch, method, url, accessToken, data }) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const result = await fetch({
    method,
    url,
    headers: handleHeaders(headers, accessToken),
    data: JSON.stringify(data)
  });
  return result.data;
};

const handleHeaders = (headers, accessToken?: string) => {
  if (accessToken !== undefined) {
    return {
      ...headers,
      'X-Access-Token': accessToken
    };
  }
  return headers;
};

export const getErrorStatus = (error): number => {
  const { request } = error;
  const { status } = request;
  return status;
};
