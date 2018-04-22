export default async function request(url, body) {
  const bodyText = JSON.stringify(body);

  const resp = await fetch(`/api/${url}`, {
    method: 'POST',
    body: bodyText,
    headers: new Headers({'content-type': 'application/json'})
  });
  const jsResp = await resp.json();

  return jsResp;
}
