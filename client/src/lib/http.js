export default async function request(url, body) {
  const bodyText = JSON.stringify(body);
  let resp = null;

  try {
    resp = await fetch(`/api/${url}`, {
      method: 'POST',
      body: bodyText,
      headers: new Headers({'content-type': 'application/json'})
    });
  } catch (e) {
    throw new HTTPError({
      display: 'Request could not be completed',
      status: 0,
      message: 'request failed'
    });
  }

  const jsResp = await resp.json();

  if (!resp.ok) {
    throw new HTTPError({
      status: resp.status,
      message: jsResp.error,
      display: jsResp.display || jsResp.error || 'Internal error'
    });
  } else {
    return jsResp;
  }
}

class HTTPError extends Error {
  constructor({status, message, display}) {
    super(message);
    this.status = status;
    this.display = display;
  }
}
