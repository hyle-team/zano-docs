# JWT Authentication Guide

## What is JWT?

JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It is widely used for authentication and authorization in web applications.

A JWT typically consists of three parts:

1. **Header** – contains the type of the token (`JWT`) and the signing algorithm (`HS256`, etc.).
2. **Payload** – contains the claims, i.e., data such as `user`, `exp` (expiration), etc.
3. **Signature** – a hash of the header and payload, signed using a secret key.

The final token is encoded as:
```
header.payload.signature
```

## Use Case in Our Project

We use JWT authentication to secure HTTP requests to our local JSON-RPC API betweedn Zano desktop App and Zano Extension (Zano Companion). Each request includes a signed JWT in the `Zano-Access-Token` header, which is verified by the server.
You can enable JWT authentification in simplewallet as well by adding `--jwt-secret=hsjejkcdskndspo230XASIijksk123i9x5` when simplewallet run in server mode (with --rpc-bind-port=PORT_NUM option).

---

## Code example on nodejs

Here is a review of [example](https://github.com/hyle-team/zano/blob/master/utils/JS/JWT/example.js) of using JWT auth to call getbalance function from wallet.


### Dependencies

- [`axios`](https://www.npmjs.com/package/axios) – for sending HTTP requests.
- [`node-forge`](https://www.npmjs.com/package/node-forge) – for cryptographic operations (HMAC, SHA-256, etc.).

Install them:
```bash
npm install axios node-forge
```

---

## JWT Generation Flow

### 1. Shared Secret

Define your shared JWT secret (must match the server's configuration):
```js
const JWT_SECRET = 'hiwejkcddkndspo230XASIijksk123i9x5';
```

### 2. Create JWT Token

```js
function createJWSToken(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');

  const signature = forge.hmac.create();
  signature.start('sha256', secret);
  signature.update(`${encodedHeader}.${encodedPayload}`);
  const encodedSignature = forge.util.encode64(signature.digest().getBytes()).replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}
```

### 3. Generate Body Hash

Before creating the token, we hash the request body:
```js
const md = forge.md.sha256.create();
md.update(httpBody);
const bodyHash = md.digest().toHex();
```

### 4. Build Payload

The payload contains:
- `body_hash`: hash of the request body.
- `user`: fixed identifier.
- `salt`: random 64-character string to avoid replay attacks.
- `exp`: expiration timestamp (e.g., 60 seconds from now).

```js
const payload = {
  body_hash: bodyHash,
  user: 'zano_extension',
  salt: generateRandomString(64),
  exp: Math.floor(Date.now() / 1000) + 60,
};
```

### 5. Generate Final JWT

```js
const token = createJWSToken(payload, JWT_SECRET);
```

---

## Sending the Authenticated Request

```js
axios.post('http://127.0.0.1:11111/json_rpc', requestData, {
  headers: {
    'Content-Type': 'application/json',
    'Zano-Access-Token': token,
  },
})
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  if (error.response) {
    console.error('Error Response:', error.response.status, error.response.data);
  } else {
    console.error('Request Error:', error.message);
  }
});
```

---

## Notes

- Ensure your server validates:
  - JWT signature using the same secret (`HS256`).
  - `exp` is not expired.
  - `body_hash` matches actual request body content.
- JWT tokens should be short-lived (e.g., 60 seconds) to reduce replay attack risks.

---

## Example JSON-RPC Request

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "getbalance",
  "params": {}
}
```

---

## Summary

JWT provides a secure and compact mechanism for authenticating API requests. In this project, we:
- Hash the request body.
- Create a signed JWT with a time-limited payload.
- Send it in the `Zano-Access-Token` HTTP header.

This ensures authenticity, integrity, and freshness of every client request.
