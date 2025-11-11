# Angular Frontend

## Quick Start

```bash
npm install
npm start
```

Runs on `http://localhost:4200`. Requires backend at `http://localhost:8000/graphql`.

## Scripts

- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

## Testing

Run unit tests:
```bash
npm test
```

Tests run in watch mode by default. To run once:
```bash
npm test -- --watch=false
```

Test coverage includes:
- Reducers (state management)
- Effects (side effects)
- Services (API layer)
- Components (UI logic)

