const getHost = (host: string) => {
  switch (host) {
    case 'ncls-wllt.firebaseapp.com':
      return 'https://us-central1-ncls-wllt.cloudfunctions.net';
    default:
      return 'http://localhost:5000/ncls-wllt/us-central1';
  }
};

export const HOST = getHost(window.location.hostname);

export const getErrorStatus = (error): number => {
  const { request } = error;
  const { status } = request;
  return status;
};
