# EstateHub

EstateHub is a bilingual, responsive real estate discovery experience built as a front-end portfolio project. It includes a locally stored sample property collection for browsing homes across Egypt.

## Features

- English and Arabic interface with persistent language selection and complete LTR/RTL layout support.
- Home, properties, property details, favorites, add-property, about, contact and custom not-found pages.
- Search across titles, descriptions and locations in either language; combine location, type, purpose, price and bedroom filters.
- Sort by recommendation, price or newest listing. Filters are reflected in the URL and can be shared.
- Local favorites with a live header count.
- Bilingual sample listing creation, image URL preview, field validation and local persistence.
- Accessible inquiry and contact forms that show a local confirmation without sending data.
- Keyboard-operable property photo gallery, responsive property cards and broken-image fallbacks.
- Vercel rewrite configuration for direct access to nested React Router routes.

## Technology

- React 18 and JavaScript ES modules
- Vite 6
- Tailwind CSS 3
- React Router DOM 6
- Lucide React icons

## Run locally

Requires Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL after it starts.

## Build and preview

```bash
npm run build
npm run preview
```

The production bundle is written to `dist/`.

## Checks

Run the focused data, translation, filter, format and accessibility-token checks with Node's built-in test runner:

```bash
npm test
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Home and property search |
| `/properties` | Searchable and filterable listings |
| `/properties/:id` | Property details and photo gallery |
| `/favorites` | Browser-local saved homes |
| `/add-property` | Bilingual sample listing form |
| `/about` | Project concept and features |
| `/contact` | Demo contact form |
| Any other path | Custom 404 page |

## Language and local data

Use the language control in the header to switch between English and Arabic. The selected language is saved in `localStorage`; the page updates its `lang` and `dir` attributes and preserves the current route and query string. Property content, filters and form-created listings support both languages. Prices use EGP, rent prices are identified as monthly, and areas are shown in square metres.

Favorites, the selected language and user-created sample listings are stored only in the current browser's `localStorage`. They do not sync across devices or users and may be cleared with browser data. Contact and property inquiry forms validate input and show an in-page demo confirmation; no message is sent or retained. The included properties and agent/contact details are illustrative. Property photos are loaded from Unsplash image URLs and require an internet connection to display.

## Deploy to Vercel

Import the repository into Vercel and use the detected Vite defaults, or set the following explicitly:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

`vercel.json` rewrites app paths to the Vite entry point so refreshing a nested route opens the application.

