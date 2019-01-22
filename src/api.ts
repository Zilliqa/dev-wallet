const getHost = (host: string) => {
  switch (host) {
    // case 'nucleus-wallet.firebaseapp.com':
    //   return 'https://us-central1-nucleus-wallet.cloudfunctions.net';
    default:
      return 'https://us-central1-nucleus-wallet.cloudfunctions.net';
  }
};

export const HOST = getHost(window.location.hostname);

export const getErrorStatus = (error): number => {
  const { request } = error;
  const { status } = request;
  return status;
};
