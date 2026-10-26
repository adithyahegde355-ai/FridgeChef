# Fridge Chef

A responsive Indian recipe discovery and cooking-mode prototype built with React + Vite.

## Included
- TheMealDB V1 API integration (free test key `1` for development)
- Search recipes by name
- Search by up to six ingredients, combine single-ingredient results, and rank by match count
- Indian-focused starter recipe catalogue with editable curated records
- Large food photos with fallback UI
- Vegetarian/non-vegetarian and region filters
- English, Kannada and Hindi interface labels
- Recipe details, ingredient checklists, servings control, step-by-step cooking mode
- Local favourites and shopping list using `localStorage`
- Responsive phone and laptop layout

## Run locally
Install Node.js 20+ (or a current supported LTS version).

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (normally `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## TheMealDB notes
This project uses TheMealDB's V1 API and test key `1`, intended for development/educational testing. Check TheMealDB's current API terms and obtain the appropriate supporter/production access before publicly releasing an app-store build. The free V1 API filters by one ingredient at a time; this project requests each ingredient separately, combines results and ranks them locally. Requests are deliberately sequential to be gentler on the public endpoint.

API guide: https://www.themealdb.com/docs_api_guide.php

## About the catalogue target
The app architecture supports expansion to 1,000+ Indian recipes, but this ZIP does **not** falsely claim to contain 1,000 fully verified recipes. It contains a small editable starter set and dynamically loads available TheMealDB data. Add reviewed recipe records to `src/curatedRecipes.js` or move the catalogue to a database as it grows.

Each curated starter recipe is labelled as a curated starter recipe. TheMealDB entries are labelled as imported from TheMealDB. If AI generation is added later, store it as a separate status such as `ai-generated`, and do not present it as verified.

## Food photos and attribution
The starter records use image URLs for demonstration. Before commercial/public release, review image-provider licensing and replace any image whose usage rights cannot be confirmed. TheMealDB photos are supplied by TheMealDB; respect its current terms and attribution requirements. Remote photos and Google Fonts require an internet connection.

## Suggested next steps
1. Add more reviewed regional recipes and provenance fields (`sourceName`, `sourceUrl`, `reviewedBy`, `reviewedAt`).
2. Add a secure backend for production API access and AI calls.
3. Add a real database (e.g. PostgreSQL) once the curated catalogue grows.
4. Add proper Kannada and Hindi recipe translations; current language selector translates the main interface labels, not every recipe's instructions.
5. Test ingredient matching carefully; common names and spelling variants need a richer ingredient synonym dictionary.
6. Add accessibility, food allergy warnings, food safety guidance, automated tests and production error handling before release.
