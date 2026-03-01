# Troubleshooting - Problems & Solutions

## 1. Google OAuth - "origin not allowed" error

**Problem**: When clicking the Google login button, got an error saying the origin is not allowed.

**Cause**: In Google Cloud Console, the authorized JavaScript origin was set to `https://localhost:5173` instead of `http://localhost:5173` (HTTPS vs HTTP).

**Solution**: Changed the authorized origin to `http://localhost:5173` (without the 's') in Google Cloud Console -> APIs & Services -> Credentials -> OAuth 2.0 Client IDs.

---

## 2. CORS - "Access-Control-Allow-Origin" error

**Problem**: Client on `localhost:5173` couldn't make API calls to server on `localhost:3000`. Browser blocked the requests with CORS error.

**Cause**: Server didn't have CORS middleware configured. When client and server are on different ports, the browser blocks cross-origin requests by default.

**Solution**: Installed `cors` package and added it to `app.ts`:
```bash
npm install cors
npm install -D @types/cors
```
```ts
import cors from "cors";
app.use(cors());
```

---

## 3. MUI font not applying

**Problem**: Set font-family in CSS but MUI components (Typography, TextField, etc.) ignored it.

**Cause**: MUI components use their own styling system. CSS `font-family` doesn't override MUI's default font.

**Solution**: Created a MUI theme with `createTheme` and wrapped the app with `ThemeProvider`:
```ts
// theme.ts
const theme = createTheme({
  typography: { fontFamily: "'Inter', sans-serif" },
});

// main.tsx
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 4. Google OAuth token verification - expired tokens in tests

**Problem**: Server tests for Google sign-in used a real Google token that expired after 1 hour. Tests started failing.

**Cause**: Google ID tokens have a short expiration (`exp` claim). The `verifyIdToken()` function from `google-auth-library` checks expiration and rejects expired tokens.

**Solution**: Mocked the `google-auth-library` in tests so it never actually calls Google:
```ts
jest.mock("google-auth-library", () => ({
    OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn().mockResolvedValue({
            getPayload: () => ({
                email: "google.user@gmail.com",
                name: "Google User",
                picture: "https://example.com/photo.jpg",
            }),
        }),
    })),
}));
```

For the "invalid token" test, we override the mock for one call:
```ts
const { OAuth2Client } = require("google-auth-library");
const mockClient = OAuth2Client.mock.results[0].value;
mockClient.verifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));
```

---

## 5. Google token verification - fetch vs google-auth-library

**Problem**: Original code used `fetch` to `googleapis.com/tokeninfo` endpoint to verify Google tokens. This is not secure for production.

**Cause**: The `tokeninfo` endpoint is meant for debugging, not production. It doesn't properly verify the JWT signature.

**Solution**: Switched to `google-auth-library` with `verifyIdToken()`:
```bash
npm install google-auth-library
```
```ts
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client();

const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
});
const googleUser = ticket.getPayload();
```
This properly verifies: JWT signature, audience (our app's Client ID), expiration, and issuer.

---

## 6. TypeScript - "ReactNode is a type" error

**Problem**: `import { ReactNode } from "react"` caused error: `'ReactNode' is a type and must be imported using a type-only import`.

**Cause**: TypeScript `verbatimModuleSyntax` is enabled in tsconfig. It requires type imports to be explicit.

**Solution**: Use `import type`:
```ts
import type { ReactNode } from "react";
```

---

## 7. Logo and tabs jumping between Login/Register forms

**Problem**: When switching between Login and Register, the logo and tabs would shift position because they were inside each form component.

**Cause**: LoginForm and RegisterForm had different heights, and the logo/tabs were rendered inside each form.

**Solution**: Moved logo and tabs to `AuthPage` (parent), so they're shared and don't re-render when switching forms. Only the form content below changes.

---

## 8. "Password field is not contained in a form" warning

**Problem**: Browser console showed warning about password field not being in a form element.

**Cause**: MUI's `Box` component renders a `<div>` by default, not a `<form>`.

**Solution**: Changed `AuthForm` to use `<Box component="form">`:
```tsx
<Box component="form" onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }}>
```
This also enables submitting with Enter key.

---

## 9. "Input elements should have autocomplete attributes" warning

**Problem**: Browser warning about missing autocomplete attributes on input fields.

**Solution**: Added `autoComplete` prop to TextFields:
- Login email: `autoComplete="email"`
- Login password: `autoComplete="current-password"`
- Register email: `autoComplete="email"`
- Register password: `autoComplete="new-password"`
- Register username: `autoComplete="username"`
- Register phone: `autoComplete="tel"`

---

## 10. Server tests failing after branch merge

**Problem**: Tests failed with "DATABASE_URL is not defined" after switching to a new branch.

**Cause**: The `.env.test` file was missing from the new branch (it existed only on main because env files are not always tracked in git).

**Solution**: Merged main into the working branch to get the env files:
```bash
git merge main
```

---

## 11. Environment variable inconsistency

**Problem**: Server auth tests failed with 400/401 errors even though the code looked correct.

**Cause**: `.env.dev` used `JWT_REFRESH_SECRET` but the code expected `REFRESH_TOKEN_SECRET` (as defined in `.env.test` and `.env.example`).

**Solution**: Unified all env files to use the same variable name: `REFRESH_TOKEN_SECRET`.

---

## 12. `locale` prop red underline on GoogleLogin

**Problem**: `locale="en"` prop on `<GoogleLogin>` component showed TypeScript error (red underline).

**Cause**: The installed version of `@react-oauth/google` (0.13.4) doesn't support the `locale` prop.

**Solution**: Removed the `locale` prop. The button language follows the browser's language setting.
