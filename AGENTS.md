# Repository Guidelines

## Project Structure & Module Organization
`App.js` is the Expo entry point and should stay lean—delegate UI to `src/`. Inside `src/`, keep view layers in `screens/`, shareable atoms/molecules in `components/`, routing logic in `navigation/`, and cross-cutting state in `context/` plus `hooks/`. Service helpers (`src/services/`) wrap weather, cache, and location APIs, while `utils/` keeps pure helpers. Visual assets reside in root `assets/`; mock data and story-specific fixtures can live beside them. Jest specs mirror folders in `__tests__/` (root) or component-level `__tests__` directories to keep context nearby.

## Build, Test, and Development Commands
- `npm run start` — launch the Expo bundler with QR code output for devices/simulators.
- `npm run android` / `npm run ios` / `npm run web` — same bundler, preconfigured for the respective platform shells.
- `npm run test` — execute the Jest suite via `jest-expo`; add `CI=1` when you need deterministic runs in pipelines.
- `expo start --clear` (manual) — useful for cache resets when Metro shows stale bundles.

## Coding Style & Naming Conventions
Follow the existing React Native style: 2-space indentation, single quotes, semicolons, and functional components wherever possible. Keep files focused; co-locate styles via `StyleSheet.create` within each component file. Use PascalCase for React components (`WeatherCard.js`), camelCase for functions and hooks (`useForecast`), and SCREAMING_SNAKE_CASE for exported constants in `src/constants/`. Prefer default exports only for entry modules; otherwise, named exports simplify tree-shaking. Run code through your editor’s Prettier or Expo’s formatting defaults before pushing.

## Testing Guidelines
Tests use Jest with the `jest-expo` preset. Place unit specs in `__tests__/FeatureName.test.js`, mirroring the feature path, and keep render tests close to the component to simplify snapshot updates. Mock network/services through the modules in `src/services/` so hooks stay deterministic. Aim for coverage of new branches and side effects; at minimum, each new hook or screen should have one behavior test plus a loading/error path. Execute `npm run test -- --coverage` locally before proposing changes that touch shared logic.

## Commit & Pull Request Guidelines
Commits in this repo use short, imperative subjects (`add files`, `fix weather card spacing`). Start with a verb, keep them under 70 chars, and stage logically related changes together. For pull requests, include: a concise summary, screenshots or GIFs for UI deltas, reproduction or test steps, and references to GitHub issues (e.g., `Closes #42`). Ensure CI commands above pass before requesting review.

## Security & Configuration Tips
Review `SECURITY.md` before touching dependencies. Do not hardcode API keys—load secrets from your local environment via `expo-constants` and keep placeholders (such as `src/constants/apiConfig.js`) free of real credentials. Rotate tokens promptly and document any new configuration flags in the README.
