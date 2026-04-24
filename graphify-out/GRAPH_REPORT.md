# Graph Report - D:\WebDev\TravelMemories (2026-04-25)

## Corpus Check

- 51 files · ~313,375 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 198 nodes · 187 edges · 22 communities detected
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Telemetry & Core Components|Telemetry & Core Components]]
- [[_COMMUNITY_Server State & Query Layer|Server State & Query Layer]]
- [[_COMMUNITY_Map View with Trip Data|Map View with Trip Data]]
- [[_COMMUNITY_Landing Page & Navigation|Landing Page & Navigation]]
- [[_COMMUNITY_Collection View & Trips|Collection View & Trips]]
- [[_COMMUNITY_Core Component Composition|Core Component Composition]]
- [[_COMMUNITY_App Bootstrap & Layout|App Bootstrap & Layout]]
- [[_COMMUNITY_Auth & Chatbot System|Auth & Chatbot System]]
- [[_COMMUNITY_Login & Verification Flow|Login & Verification Flow]]
- [[_COMMUNITY_Pricing Page|Pricing Page]]
- [[_COMMUNITY_Router & Home View|Router & Home View]]
- [[_COMMUNITY_User Profile Assets|User Profile Assets]]
- [[_COMMUNITY_World Map Illustration|World Map Illustration]]
- [[_COMMUNITY_Test Fixture Assets|Test Fixture Assets]]
- [[_COMMUNITY_Brand Identity & Logo|Brand Identity & Logo]]
- [[_COMMUNITY_API Documentation|API Documentation]]
- [[_COMMUNITY_Chat History|Chat History]]
- [[_COMMUNITY_Chat Rendering|Chat Rendering]]
- [[_COMMUNITY_Code Quality Tools|Code Quality Tools]]
- [[_COMMUNITY_Empty State UI|Empty State UI]]
- [[_COMMUNITY_CICD Pipeline|CI/CD Pipeline]]
- [[_COMMUNITY_Centralized Types|Centralized Types]]

## God Nodes (most connected - your core abstractions)

1. `Vue 3 SPA` - 8 edges
2. `Travel Diary Main UI Screenshot` - 7 edges
3. `Travel Memories Backend Repo` - 6 edges
4. `HomeView Landing Page` - 6 edges
5. `Map Container with Trip Markers` - 6 edges
6. `Trip List Sidebar (Right Panel)` - 6 edges
7. `Trip List Sidebar` - 6 edges
8. `useImages()` - 5 edges
9. `Navigation Bar` - 5 edges
10. `DiaryContainer View` - 5 edges

## Surprising Connections (you probably didn't know these)

- `main.js (Vue App Bootstrap)` --implements--> `Vue 3 SPA` [INFERRED]
  src/main.js → CLAUDE.md
- `Cookie-Based Authentication` --semantically_similar_to--> `JWT Token Auth (Backend)` [INFERRED] [semantically similar]
  CLAUDE.md → README.md
- `Queries.ts (Server State Definitions)` --references--> `.NET Backend API` [INFERRED]
  src/components/Queries.ts → CLAUDE.md
- `setup()` --calls--> `useImages()` [INFERRED]
  D:\WebDev\TravelMemories\src\components\DiaryContainer.vue → D:\WebDev\TravelMemories\src\components\Queries.ts
- `setup()` --calls--> `useSubscriptionDetails()` [INFERRED]
  D:\WebDev\TravelMemories\src\components\PricingPage\PricingCard.vue → D:\WebDev\TravelMemories\src\components\Queries.ts

## Hyperedges (group relationships)

- **Authentication Flow: checkLogin + userDetails store + cookie-based auth** — claudemd_check_login, claudemd_store_userdetails, claudemd_cookie_auth [EXTRACTED 0.95]
- **Server State Pipeline: TanStack Vue Query + Queries.ts + .NET Backend** — claudemd_tanstack_vue_query, claudemd_queries_ts, claudemd_dotnet_backend [EXTRACTED 0.92]
- **Code Quality Enforcement: Husky + ESLint + Prettier** — claudemd_husky_precommit, claudemd_eslint_config, claudemd_prettier_config [EXTRACTED 0.95]

## Communities

### Community 0 - "Telemetry & Core Components"

Cohesion: 0.11
Nodes (20): appInsights.js (Telemetry Setup), Azure Application Insights, .NET Backend API, Mapbox GL + Deck.gl, Queries.ts (Server State Definitions), Router (index.js), TanStack Vue Query, Travel Memories Project (+12 more)

### Community 1 - "Server State & Query Layer"

Cohesion: 0.27
Nodes (12): deleteConversationId(), getConversationMessages(), getSideConversationsList(), getSubscriptionDetails(), imageDataQueryFunc(), renameConversation(), updateSubscription(), uploadImageQueryFunc() (+4 more)

### Community 2 - "Map View with Trip Data"

Cohesion: 0.25
Nodes (14): Latitude/Longitude Coordinate Display, Dark/Light Mode Toggle Button, GitHub Link in Navbar, Trip: Holi Festival 2025, Trip: IGDC 2022, India/South Asia Map Region, Trip: Kedarkantha Summit 2023, Trip: Lonavala 31st Dec 2024 (+6 more)

### Community 3 - "Landing Page & Navigation"

Cohesion: 0.27
Nodes (11): GitHub Link Icon, HomeView Landing Page, Location Pin Marker on Map, Logout Navigation Link, Map-Based Photo Viewing Feature, Navigation Bar, Start Creating Call-To-Action Button, Light/Dark Theme Toggle Button (+3 more)

### Community 4 - "Collection View & Trips"

Cohesion: 0.25
Nodes (11): DiaryContainer View, Holi Festival 2025 Trip, IGDC 2022 Trip, Kedarkantha Summit 2023 Trip, Lonavala 31st Dec 2024 Trip, Navigation Bar (Travel Diary / Upload / Logout), Photo Pagination Strip, Photo Viewer Modal (+3 more)

### Community 5 - "Core Component Composition"

Cohesion: 0.22
Nodes (2): setup(), setup()

### Community 6 - "App Bootstrap & Layout"

Cohesion: 0.29
Nodes (2): setup(), setup()

### Community 7 - "Auth & Chatbot System"

Cohesion: 0.25
Nodes (8): ChatComponent (AI Chatbot), checkLogin() Auth Initializer, Cookie-Based Authentication, MCP Server (Chatbot Backend), Pinia State Management, Pinia Store: chatbot.ts (Conversation State), Pinia Store: UIMode.ts (Theme), Pinia Store: userDetails.js (Auth)

### Community 8 - "Login & Verification Flow"

Cohesion: 0.6
Nodes (4): onClickResendOtp(), onClickVerifyOtp(), onSendVerficationCode(), setup()

### Community 9 - "Pricing Page"

Cohesion: 0.4
Nodes (2): setup(), setup()

### Community 10 - "Router & Home View"

Cohesion: 0.4
Nodes (1): setup()

### Community 11 - "User Profile Assets"

Cohesion: 0.5
Nodes (5): Demo User Avatar Image, Generic User Placeholder Icon, Placeholder Profile Picture, User Entity (Demo/Anonymous), User Details Store

### Community 12 - "World Map Illustration"

Cohesion: 0.5
Nodes (5): Airplane Icon, Global Geographic Coverage, World Map Image, Location Pin Marker, Travel Route Visualization

### Community 13 - "Test Fixture Assets"

Cohesion: 0.67
Nodes (4): Cypress Test Fixture Image, Group Photo - Indian Festive Occasion, Indoor Venue - Office or Community Space, Traditional Indian Ethnic Wear (Kurta/Salwar)

### Community 14 - "Brand Identity & Logo"

Cohesion: 0.67
Nodes (3): Geographic Location Pin, Travel Memories Brand Identity, App Logo SVG (Location Pin Icon)

### Community 15 - "API Documentation"

Cohesion: 0.67
Nodes (1): setup()

### Community 16 - "Chat History"

Cohesion: 0.67
Nodes (1): setup()

### Community 17 - "Chat Rendering"

Cohesion: 0.67
Nodes (1): setup()

### Community 18 - "Code Quality Tools"

Cohesion: 0.67
Nodes (3): ESLint Config, Husky Pre-commit Hook, Prettier Code Style Config

### Community 19 - "Empty State UI"

Cohesion: 1.33
Nodes (3): No Image Fallback UI State, No Image Placeholder Asset, Photo Collection Empty State

### Community 22 - "CI/CD Pipeline"

Cohesion: 1.0
Nodes (2): Azure Static Web Apps (Deployment), GitHub Actions CI/CD

### Community 65 - "Centralized Types"

Cohesion: 1.0
Nodes (1): types.ts (Centralized TypeScript Types)

## Knowledge Gaps

- **25 isolated node(s):** `Vuetify 3`, `vue3-google-login (Google OAuth)`, `Pinia Store: UIMode.ts (Theme)`, `types.ts (Centralized TypeScript Types)`, `appInsights.js (Telemetry Setup)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Core Component Composition`** (10 nodes): `ChatContainer.vue`, `DiaryContainer.vue`, `MapContainer.vue`, `TimeLine.vue`, `setup()`, `ChatContainer.vue`, `DiaryContainer.vue`, `MapContainer.vue`, `TimeLine.vue`, `setup()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Bootstrap & Layout`** (8 nodes): `setup()`, `App.vue`, `TopNavigation.vue`, `main.js`, `App.vue`, `TopNavigation.vue`, `main.js`, `setup()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pricing Page`** (6 nodes): `PricingCard.vue`, `PricingPageContainer.vue`, `setup()`, `setup()`, `PricingCard.vue`, `PricingPageContainer.vue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Router & Home View`** (5 nodes): `index.js`, `HomeView.vue`, `setup()`, `index.js`, `HomeView.vue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `API Documentation`** (3 nodes): `setup()`, `ApiPage.vue`, `ApiPage.vue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat History`** (3 nodes): `RecentConversations.vue`, `setup()`, `RecentConversations.vue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat Rendering`** (3 nodes): `RenderChat.vue`, `setup()`, `RenderChat.vue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CI/CD Pipeline`** (2 nodes): `Azure Static Web Apps (Deployment)`, `GitHub Actions CI/CD`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Centralized Types`** (1 nodes): `types.ts (Centralized TypeScript Types)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `Vue 3 SPA` connect `Telemetry & Core Components` to `Auth & Chatbot System`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `useImages()` connect `Server State & Query Layer` to `Core Component Composition`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Pinia State Management` connect `Auth & Chatbot System` to `Telemetry & Core Components`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Travel Diary Main UI Screenshot` (e.g. with `India/South Asia Map Region` and `Dark/Light Mode Toggle Button`) actually correct?**
  _`Travel Diary Main UI Screenshot` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `HomeView Landing Page` (e.g. with `World Map Illustration` and `Light/Dark Theme Toggle Button`) actually correct?**
  _`HomeView Landing Page` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Map Container with Trip Markers` (e.g. with `Trip List Sidebar (Right Panel)` and `Show Location Cards Toggle`) actually correct?**
  _`Map Container with Trip Markers` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Vuetify 3`, `vue3-google-login (Google OAuth)`, `Pinia Store: UIMode.ts (Theme)` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
