# Convex Auth Solid

Build authenticated SolidJS apps with Convex, without turning setup into a side quest.

- **Drop-in template** - get auth running in minutes.
- **Battle-tested flows** - login, signup, session management, and more.
- **Fully typed** - TypeScript end-to-end for confidence in your code.
- **Your UI, your rules** - use the hooks or bring your own components.

Quick link

- code - https://github.com/david1gp/convex-auth-solid

## Features

- **User Management**
  - User registration with username and password
  - Email/password authentication with secure session handling
  - Login via email address
  - OAuth integration: Google, GitHub, and Microsoft
  - Change email address
  - Change password
  - Delete user account

- **Development Tools**
  - Single-button login for rapid development iterations
  - Bash deployment scripts for self hosted convex 

- **Multi-Tenant Architecture**
  - Workspaces for organizing projects and resources
  - Organizations with team collaboration support

- **Storage & Data**
  - Infinitely scaling R2 object storage for files
  - Direct file uploads from browser
  - Persistent UI state: draft resources/workspaces survive navigation
  - Intelligent browser caching: instant client-side loading with background refresh

- **Technical Foundation**
  - JWT-based tokens with automatic refresh
  - Ready-to-use Solid.js UI components
  - Convex backend functions for user management
  - Email integration with transactional templates
  - Full TypeScript end-to-end type safety
  - Real-Time updates with Convex Backend

## Getting Started

1. **Clone the template:**

   ```bash
   git clone https://github.com/david1gp/convex-auth-solid.git
   cd convex-auth-solid
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Download the UI components locally:**

   ```bash
   bunx degit https://github.com/david1gp/solid-ui/ui ui
   ```

   Keeping the UI code local is the recommended setup here:

   - Some bundlers can accidentally bundle more than one `solid-js` instance when UI components are imported from `node_modules`, which can lead to confusing runtime behavior.
   - Local components are also much nicer to customize. You can restyle, adjust, or replace them freely, similar to the `shadcn/ui` approach.

4. **Set up absolute import aliases in `package.json`:**

   It is recommended to define your app aliases in `package.json` `imports`, so local modules and copied UI components can be imported consistently across the project.

   ```json
   {
     "imports": {
       "#convex/*": "./convex/*",
       "#src/*.js": "./src/*.ts",
       "#src/*.jsx": "./src/*.tsx",
       "#src/*": "./src/*",
       "#ui/*.js": "./ui/*.ts",
       "#ui/*.jsx": "./ui/*.tsx",
       "#ui/*": "./ui/*",
       "#utils/*": "@adaptive-ds/utils/*",
       "#result": "@adaptive-ds/result",
       "#result/*": "@adaptive-ds/result/*"
     }
   }
   ```

5. **Set up Convex:**

   ```bash
   bun run convex:dev
   ```

6. **Start the dev server:**

   ```bash
   bun run dev
   ```

## Optional OIDC sign-in

OIDC is an optional, server-configured sign-in method. The template keeps the
button hidden unless the frontend setting below is enabled. Add these values to
the environment used by the frontend and Convex actions (the root
`.env.development` is ignored by git):

```dotenv
# frontend visibility and button label
PUBLIC_OIDC_ENABLED="true"
PUBLIC_OIDC_LABEL="Sign in with SSO"

# server-only OIDC configuration
OIDC_ISSUER="https://id.example.com"
OIDC_CLIENT_ID="replace-with-client-id"
OIDC_CLIENT_SECRET="replace-with-client-secret"
# Optional; defaults to: openid profile email
OIDC_SCOPES="openid profile email"
```

`OIDC_ISSUER` must be an HTTPS issuer without a query string or fragment.
`OIDC_CLIENT_ID` is required. Omit `OIDC_CLIENT_SECRET` only for a provider
registered as a public client that supports token-endpoint authentication
`none`; with a secret, the integration uses confidential-client authentication
(`client_secret_basic`, or `client_secret_post` when that is the provider's
supported option). Keep the secret server-side. `OIDC_SCOPES` is
space-separated and must include `openid`.

Register this exact HTTPS callback URL with the provider:

```text
${PUBLIC_BASE_URL_API}/api/auth/oidc/callback
```

The sign-in link uses the Convex HTTP API origin, not the frontend origin:

```text
${PUBLIC_BASE_URL_API}/api/auth/oidc/start?returnTo=%2F
```

The server performs authorization-code flow with PKCE (`S256`), a nonce, and
ID-token signature/claim verification. `AUTH_SECRET` is also required: it
signs the short-lived `__Host-oidc-transaction` cookie with HMAC-SHA-256. The
cookie is `Secure`, `HttpOnly`, `SameSite=Lax`, and valid for ten minutes, so
use HTTPS for the API callback in browser deployments. `returnTo` must be a
relative, same-origin path; the callback falls back to the signed-in default
page for unsafe values.

After successful authentication, the callback redirects to
`PUBLIC_BASE_URL_APP` with a `userSession` query parameter. Existing
`signInLogic` validates that payload with the Valibot `UserSession` schema and
calls `signInSessionNew`; no OIDC token or PKCE work belongs in the browser.
Accounts are separated by the provider issuer plus the OIDC subject (`iss` +
`sub`), so the same subject at two issuers is not merged.

### Zitadel example

For Zitadel, create a dedicated project and OIDC Web application for this
template. Enable authorization-code flow with PKCE, register the exact callback
above, and choose either a public client (no secret) or a confidential client
with Basic authentication. Use the standard scopes `openid profile email`.

Example values (placeholders only):

```text
Issuer:       https://<zitadel-domain>
Callback:     https://api.example.com/api/auth/oidc/callback
Client ID:    <zitadel-client-id>
Secret:       <zitadel-client-secret>  # confidential clients only
Scopes:       openid profile email
```

The issuer must be the same value advertised by Zitadel discovery. Keep client
credentials in the Convex/server environment and configure Zitadel's access
policies separately from this generic OIDC integration.

### Convex integration notes

`convex/http.ts` creates one Hono dispatcher, registers the auth routes, and
wraps it as a Convex HTTP action. `addHttpRoutesAuth` registers
`GET /api/auth/oidc/start` and `GET /api/auth/oidc/callback`; the handlers own
the transaction cookie, provider exchange, identity lookup, and session
completion. The existing `src/utils/convex/valibotToConvex.ts` adapter converts
Valibot field schemas to Convex validators for schema tables, while runtime
request and session data continues to be validated with Valibot.

## Tech Stack

- **Solid.js** – Reactive UI framework
- **Convex** – Backend-as-a-service with real-time sync
- **Tailwind CSS** – Styling
- **TypeScript** – Type safety

## License

MIT - see the [LICENSE](LICENSE) file for details.
