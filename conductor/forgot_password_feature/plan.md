# Plan: Forgot Password Feature

## Objective
Implement the "Forgot Password" and "Reset Password" user flows, connecting them to the existing Next.js proxy and Java backend.

## Key Files & Context
- `src/lib/api.ts`: Add new API wrapper functions.
- `src/app/login/page.tsx`: Update existing "Esqueceu a senha?" link.
- `src/app/forgot-password/page.tsx` (New): Form to request a password reset email.
- `src/app/reset-password/page.tsx` (New): Form to input the new password, using a token from the URL.

## Implementation Steps

1. **Update API Client:**
   - In `src/lib/api.ts`, add `forgotPassword(data: { email: string }): Promise<void>`.
     - Endpoint: `POST /api/auth/forgot-password`
   - In `src/lib/api.ts`, add `resetPassword(data: { token: string; password: string }): Promise<void>`.
     - Endpoint: `POST /api/auth/reset-password`

2. **Update Login Page:**
   - In `src/app/login/page.tsx`, change the "Esqueceu a senha?" anchor tag to a Next.js `<Link>` pointing to `/forgot-password`.

3. **Create Forgot Password Page (`/forgot-password`):**
   - Use a layout similar to `/login` (split screen with hero image).
   - Form with a single `email` input and a submit button.
   - Use `react-hook-form` and `zod` for validation.
   - On successful submission, hide the form and show a success message: "Se o e-mail estiver cadastrado, você receberá um link de recuperação em breve." with a button to return to login.

4. **Create Reset Password Page (`/reset-password`):**
   - Read the `token` from the URL using `useSearchParams()`. If missing, show an error.
   - Form with `password` and `confirmPassword` inputs.
   - Use `react-hook-form` and `zod` to ensure passwords match and meet length requirements.
   - Call `resetPassword` on submit.
   - On success, show a success message and a button to proceed to the Login page.

## Verification & Testing
- Start the development server (`npm run dev`).
- Navigate to `/login` and verify the "Esqueceu a senha?" link works.
- Submit the `/forgot-password` form and verify the API call is made correctly via the Next.js proxy to `/api/auth/forgot-password`.
- Manually navigate to `/reset-password?token=test-token`.
- Submit the reset password form and verify the `POST /api/auth/reset-password` call includes both the token and the new password.