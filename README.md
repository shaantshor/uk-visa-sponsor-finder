# SponsorWatch UK

> Search 250+ UK companies licensed to sponsor Skilled Worker visas. Built for international students and professionals navigating the UK job market.

## Why I Built This

As an international MSc student in the UK, I spent hours scrolling through the GOV.UK sponsor register spreadsheet. This app makes that search instant — with fuzzy matching, filters, company profiles, and a clean interface.

## Features

- **Fuzzy Search** — typo-tolerant search powered by PostgreSQL trigram matching
- **250+ Real Companies** — tech, finance, pharma, consulting, and more
- **Company Profiles** — detailed pages with tech stack, ratings, career links
- **Similar Companies** — discover related sponsors
- **Dark Mode** — system-preference aware with manual toggle
- **PWA** — installable on mobile, works offline
- **Shareable URLs** — share any search as a link
- **Analytics** — see sponsor distribution by city, industry, and size
- **Fully Dockerised** — one command to run everything

## Tech Stack

Node.js · Express · PostgreSQL · React · Tailwind CSS · Docker · Vite

## Quick Start

### With Docker (recommended)

```bash
git clone https://github.com/shaantshor/uk-visa-sponsor-finder.git
cd uk-visa-sponsor-finder
docker compose up
```

The app will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3001/api

### Without Docker

Prerequisites: Node.js 20+, PostgreSQL 16 with pg_trgm extension

```bash
# Start PostgreSQL and create the database
createdb sponsor_finder
psql -d sponsor_finder -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

# Server
cd server
npm install
npm run setup    # runs migrations + seeds data
npm run dev      # starts on :3001

# Client (in another terminal)
cd client
npm install
npm run dev      # starts on :5173
```

## API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sponsors` | Search + filter sponsors |
| GET | `/api/sponsors/:id` | Get company details |
| GET | `/api/sponsors/:id/similar` | Get similar companies |
| GET | `/api/sponsors/cities` | List cities with counts |
| GET | `/api/sponsors/industries` | List industries with counts |
| GET | `/api/sponsors/trending` | Top 10 most searched |
| GET | `/api/stats` | Aggregate statistics |

### Search & Filter Parameters

```
GET /api/sponsors?search=google&city=London&industry=Technology&is_tech=true&company_size=enterprise&page=1&limit=20&sort=organisation_name&order=asc
```

### Examples

```bash
# Search for fintech companies
curl "http://localhost:3001/api/sponsors?search=fintech"

# Filter tech companies in London
curl "http://localhost:3001/api/sponsors?city=London&is_tech=true"

# Fuzzy search (typo-tolerant)
curl "http://localhost:3001/api/sponsors?search=gogle"

# Get company details
curl "http://localhost:3001/api/sponsors/1"

# Get statistics
curl "http://localhost:3001/api/stats"
```

## Architecture

- **Fuzzy Search**: pg_trgm extension with GIN indexes for typo-tolerant matching
- **URL Sync**: Bidirectional state-URL synchronization for shareable searches
- **Similar Companies**: Scored by industry match + city match + size proximity
- **Dark Mode**: Tailwind `dark:` variants + `localStorage` persistence + system preference detection
- **PWA**: Service worker with cache-first static / network-first API strategy
- **Raw SQL**: No ORM — direct PostgreSQL with parameterized queries

## Database Schema

```
sponsors
├── id (SERIAL PK)
├── organisation_name (VARCHAR 500)
├── city / county (VARCHAR 255)
├── type_rating / route (VARCHAR 100)
├── industry / sub_industry (VARCHAR 255)
├── company_size (VARCHAR 50)
├── founded_year (INTEGER)
├── website / careers_page (TEXT)
├── glassdoor_rating (DECIMAL 2,1)
├── tech_stack (TEXT[])
├── description (TEXT)
├── is_tech (BOOLEAN)
├── hq_city (VARCHAR 255)
└── created_at (TIMESTAMP)

search_logs
├── id (SERIAL PK)
├── query (TEXT)
├── filters (JSONB)
├── result_count (INTEGER)
└── searched_at (TIMESTAMP)
```

Indexes: GIN trigram on `organisation_name`, B-tree on `city`, `industry`, `is_tech`, `route`.

## Testing

```bash
cd server
npm test
```

Tests cover: pagination, exact search, fuzzy search, all filters, combined filters, single sponsor retrieval, similar companies, city/industry lists, stats, trending, and 404 handling.

## Data Source

Based on the UK Government's [Register of Licensed Sponsors](https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers) (GOV.UK). Company metadata enriched from public sources.

## Future Improvements

- Live sync with GOV.UK register updates
- Job listing integration (LinkedIn/Indeed APIs)
- Salary threshold calculator for Skilled Worker visa
- User accounts with saved/bookmarked companies
- Email alerts when new sponsors are added
- Chrome extension to check sponsor status while browsing

## License

MIT
