# Safarnama — Travel Explorer

A mobile-first travel discovery app for India, built with React Native + Expo. This starter is designed to be understandable by a beginner and covers the GDGC VNRVJIET assignment's core flows, with a couple of optional extensions.

## What is included

- **Destination discovery:** 9 destinations across Beaches, Mountains, Heritage, Adventure, Nature and Culture.
- **Destination details:** descriptions, best time to visit, suggested trip length, 3 attraction cards, estimated budget, travel note, and Google Maps search link.
- **Search and category filters:** search by destination or region and filter by category.
- **Wishlist:** add/remove destinations; saved IDs persist on the device using AsyncStorage.
- **Smart Destination Matcher:** matches preferences for travel vibe, rough daily budget and trip duration against local destination data.
- **Trip planner:** add destinations to an ordered list and remove them; list persists on the device.
- **Custom visual identity:** warm paper background, deep forest green, terracotta, editorial headings and travel-journal styling.

## Run it locally

### 1. Install prerequisites

Install a current Node.js LTS release and VS Code. On your Android phone, install **Expo Go** from the Play Store. Check the current Expo Go / SDK compatibility if the app store currently offers a different SDK version.

### 2. Install dependencies

Open this folder in a terminal and run:

```bash
npm install
```

### 3. Start the app

```bash
npx expo start
```

Scan the QR code with Expo Go. Your phone and computer should be on the same Wi-Fi network. If the network blocks local connections, try:

```bash
npx expo start --tunnel
```

If Expo reports that a dependency version does not match the installed SDK, use:

```bash
npx expo install --fix
```

### Optional: run in a browser

```bash
npx expo install react-native-web react-dom
npx expo start --web
```

## Project structure

- `App.js` — screen layout, navigation state, destination data and app interactions.
- `app.json` — app name and Expo configuration.
- `package.json` — scripts and dependencies.

This starter intentionally uses straightforward component state rather than adding a navigation framework, so the main flows are easier to read and explain.

## How the smart matcher works

Each destination has tags such as `beach`, `mountain`, `culture`, `adventure` and `nature`, plus an estimated daily cost and suggested trip length. Choosing a preference adds points to destinations that match it. The top three results are shown. This is a transparent rules-based recommendation system, not an external AI service.

## Data and limitations

- Destination information and recommendations are static sample data in `App.js`.
- Images are remotely hosted Unsplash image URLs. An internet connection is needed for them to load, and remote URLs can change; replace them with downloaded, appropriately licensed local images before a final offline build.
- Budget numbers are **rough illustrative planning estimates**, not live quotes. Confirm actual costs before travel.
- Weather and live availability are not implemented. The assignment's core requirements do not require them.
- The itinerary is an ordered list of saved destinations, not a route optimiser or booking tool.
