# SplinePreloader

A drop-in Next.js preloader component powered by your Spline 3D scene.  
The Spline animation plays fullscreen on entry, then fades out to reveal your page content.

## Files
| File | Purpose |
|---|---|
| `SplinePreloader.jsx` | React component (Next.js App Router compatible) |
| `Preloader.css` | Overlay + fade transition styles |

## Setup

### 1. Install the dependency
```bash
npm install @splinetool/react-spline
```

### 2. Copy the `SplinePreloader` folder into your project
```
your-nextjs-app/
  src/
    components/
      SplinePreloader/       ← paste here
        SplinePreloader.jsx
        Preloader.css
```

### 3. Wrap your layout
In `app/layout.js` (or any page), import and wrap your content:

```jsx
import SplinePreloader from '@/components/SplinePreloader/SplinePreloader';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SplinePreloader>
          {children}
        </SplinePreloader>
      </body>
    </html>
  );
}
```

That's it. The Spline scene plays as a fullscreen intro, fades out, and your page appears.

## How it works
- Uses `next/dynamic` with `ssr: false` to load Spline client-side only (avoids the async Server Component error).
- When Spline fires `onLoad`, a 0.9s CSS opacity fade removes the overlay.
- Your main content fades in underneath as the preloader exits.
