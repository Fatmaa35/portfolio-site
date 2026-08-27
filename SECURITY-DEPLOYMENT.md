# Security deployment checklist

The repository contains restrictive Firestore rules, Firebase App Check initialization, and Netlify security headers. Complete these deployment-side steps for all controls to take effect.

## Firestore rules

Deploy `firestore.rules` to the `portfoy-site-4886b` Firebase project:

```powershell
firebase deploy --only firestore:rules --project portfoy-site-4886b
```

The rules allow anonymous clients to create only a `contacts` document with the exact expected fields, types, and length limits. Client reads, updates, and deletes are denied.

## Firebase App Check

Firestore Security Rules cannot implement dependable per-IP rate limiting. The web client initializes App Check with the reCAPTCHA Enterprise site key before Firestore.

1. Register the web app under App Check with the same reCAPTCHA Enterprise key used in the HTML meta tags.
2. Deploy the updated site.
3. Monitor App Check request metrics to confirm legitimate traffic is verified.
4. Enable App Check enforcement for Cloud Firestore.

Do not enable enforcement before the web client sends valid App Check tokens, or the contact form will stop working.

## Netlify

Deploy from the repository root so Netlify reads `netlify.toml`. After deployment, verify the response headers on the production domain and check the browser console for Content Security Policy violations.
