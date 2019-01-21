const getHost = (host: string) => {
  switch (host) {
    case 'nucleus-wallet.firebaseapp.com':
      return 'https://us-central1-nucleus-wallet.cloudfunctions.net';
    default:
      return 'http://localhost:5000/nucleus-wallet/us-central1';
  }
};

export const HOST = getHost(window.location.hostname);

export const getErrorStatus = (error): number => {
  const { request } = error;
  const { status } = request;
  return status;
};
