# ⚽ Kaweera (كويرة) · v1.0.2

> **"انت والثلاث خشبات"** — The ultimate football trivia, live scores, and prediction platform.

[![Live Web App](https://img.shields.io/badge/play%20online-doudoushehab2003--create.github.io%2Fkaweera--by--sheebo-2bff88.svg?style=for-the-badge&logo=google-chrome&logoColor=black)](https://doudoushehab2003-create.github.io/kaweera-by-sheebo/)
[![Version](https://img.shields.io/badge/version-1.0.2-brightgreen.svg)](https://github.com/doudoushehab2003-create/kaweera-by-ahmed-and-zeyad)
[![Runtime](https://img.shields.io/badge/runtime-Node.js%20%7C%20Expo%20Web-blue.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/backend-Google%20Cloud%20Firestore-orange.svg)](https://firebase.google.com/)
[![Languages](https://img.shields.io/badge/languages-English%20%7C%20العربية%20%7C%20Français-gold.svg)](#-multilingual--rtl-support)

**Kaweera by Sheebo** is a cross-platform football trivia and match prediction application available in English, Arabic, and French. Play it directly in your browser:  
👉 **[https://doudoushehab2003-create.github.io/kaweera-by-sheebo](https://doudoushehab2003-create.github.io/kaweera-by-sheebo/)**

> *Note: This repository hosts the distribution and production web deployment of the Kaweera application.*

---

## 📌 Overview

**Kaweera** (derived from the Arabic *كويرة*, meaning "little ball") is engineered with **React Native**, **Expo (TypeScript)**, and **Google Cloud Firestore**. Designed specifically for passionate football fans, Kaweera transforms casual match nights into competitive tournaments—featuring solo speed challenges, pass-and-play team showdowns, room-based online multiplayer, real-time match predictions, and a virtual token economy convertible into physical football merchandise.

Every aesthetic detail—from the stadium floodlight color palette (`#06210F`) to tactile card interactions and custom Arabic typography where the brand's letter *ة* incorporates a football—is tailored to evoke the electric atmosphere of match day.

---

## 🎮 How to Play

1. Open the [web app](https://doudoushehab2003-create.github.io/kaweera-by-sheebo/) and press **Start**.
2. Select your game mode:
   - **Solo Quiz:** Pick a difficulty level (Easy, Medium, Hard, or Mixed) and answer before the timer expires. Each round consists of 20 questions.
   - **Teams:** Share one phone with friends for pass-and-play local team competition.
   - **Online Room:** Create or join a private multiplayer room with a 5-character room code.
   - **Daily Quiz & Predictions:** Predict real-world match scorelines and answer daily football trivia.
3. You start with **3 lives**. An incorrect answer or running out of time consumes one life.
4. **Sign up / Sign in** to record your scores to the global leaderboard and accumulate **Kaweera Tokens** for real-world rewards.

---

## 💻 Tech Stack

| Category | Technology | Description & Version |
| :--- | :--- | :--- |
| **Frontend Framework** | **React Native** & **React Native Web** | Universal reactive component architecture across mobile & web |
| **Application Platform** | **Expo** (SDK 51+) / **Expo Router** | Cross-platform runtime and static production web bundler |
| **Language & Bundler** | **JavaScript (ES2023+) / TypeScript** & **Metro** | High-performance bundling and asset optimization (`_expo/static/js/web/`) |
| **Cloud Database** | **Google Cloud Firestore** (v1 REST API) | Document store for leaderboards, user wallets, multiplayer rooms, and ads |
| **Authentication** | **Google Identity Toolkit** (Firebase Auth REST) | Secure email/password authentication, unique username registry, token refresh |
| **Typography & Fonts** | `@expo-google-fonts/cairo`, `@expo-google-fonts/lalezar` | Bilingual font stack: Cairo (400–900) & Lalezar for Arabic; Bebas Neue for Latin display |
| **Live Match API** | **ESPN Soccer Scoreboard API** | Upstream real-time scores, clock status (`HT`, `FT`, live minutes), and schedules |
| **Local Persistence** | `@react-native-async-storage/async-storage` | Local session token storage, offline prediction drafts, and preferences |
| **Styling & Effects** | React Native `StyleSheet`, Custom Theme Engine | Dark stadium aesthetic (`#06210F`, `#C6FF3D`, `#FFD23F`, `#F4F8EF`) with animations |
| **Admin & Management** | **Kaweera Manager** (Vanilla HTML5/JS Dashboard) | Back-office dashboard for token payment approvals, reward fulfillment, and ad review |
| **CI/CD & Security** | **GitHub Actions** (`codeql.yml`) & **SECURITY.md** | Automated CodeQL static analysis and vulnerability disclosure framework |

---

## ✨ Key Features & Game Modes

### 1. ⚽ Solo Trivia Mode
- **Adaptive Difficulty:** Choose between **Easy** (10 pts), **Medium** (20 pts), **Hard** (30 pts), or **Mixed** (all difficulties).
- **20-Question Rounds:** Each round serves 20 questions with seamless auto-advancing answer transitions.
- **Dynamic Scoring Engine:**
  - **Base Points:** 10 (Easy), 20 (Medium), 30 (Hard).
  - **Speed Bonus:** Earn up to **+50%** of the question's base value by answering rapidly:
    $$\text{Bonus} = \text{round}\left(0.5 \times \text{Base} \times \frac{\text{Time Left}}{\text{Time Limit}}\right)$$
  - **Streak Multiplier:** Consecutive correct answers award $+5$ pts per tier (up to $+25$ pts maximum).
  - **3 Lives System:** Missing an answer or exceeding time deducts one life.
- **⚡ Flash Round:** Finish each round with an adrenaline-fueled 5-question speed trial (5 seconds per question, flat 10 pts each).

### 2. 📅 Daily Match Quiz ("Daily")
- Fresh trivia generated from recent real-world match outcomes and football events.
- Answers are verified against live match records online.
- Features dedicated daily streak tracking and a dedicated daily leaderboard.

### 3. 👥 Pass & Play Team Mode ("Teams")
- Designed for match nights with friends using a single smartphone or tablet.
- Supports unlimited custom teams.
- Configurable match duration: **5, 10, or 25 rounds**.
- Turn-based team question selection, live team scoreboard, and team flash rounds.

### 4. 🌐 Online Multiplayer Rooms ("Online")
- Create or join synchronized multiplayer rooms via 5-character alphanumeric codes (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`).
- Synchronized lobby with 10 questions per match (`ROOM_QUESTIONS = 10`).
- Real-time scoreboards, answer confirmations, and winner declaration stored in Firestore `rooms/`.

### 5. 🔮 Real-Time Predictions League & Live Scores
- **Live Match Tracking:** Ingests live schedules and scores from the ESPN Soccer Scoreboard API across 5 key competition tiers:
  - **Africa:** AFCON, CAN Qualifiers, African Nations Championship, CAF Champions League, CAF Confederation Cup.
  - **Arab & Asian Football:** Saudi Pro League, Saudi King's Cup, Arabian Gulf Cup, AFC Champions League (Elite & Two), AFC Asian Cup.
  - **World Tournaments:** FIFA World Cup, FIFA Club World Cup, continental World Cup Qualifiers, UEFA Nations League, Copa América.
  - **European Leagues:** UEFA Champions League, Europa League, Conference League, Premier League, LaLiga, Serie A, Bundesliga, Ligue 1.
  - **Latin America:** Copa Libertadores, Copa Sudamericana, Brasileirão, Argentine Liga Profesional.
- **Prediction Scoring:**
  - **Exact Scoreline:** **5 points**
  - **Correct Match Outcome (Home / Draw / Away):** **2 points**
- **Global Prediction Board:** Aggregated player rankings in `predictionScores/`.

### 6. 🪙 Kaweera Tokens & Economy
- Players earn virtual tokens on completed games (requires an account and $\ge 1$ correct answer):
  - **Easy:** 5 tokens
  - **Medium:** 10 tokens
  - **Hard:** 15 tokens
  - **Mixed / Daily Quiz:** 10 tokens
- **Valuation:** $200\text{ tokens} = 1\text{ EGP}$ (Egyptian Pound).
- **Token Purchases:** Buy packs (e.g., 200 tokens for 10 EGP) via InstaPay (`ahmedsabdelgawad@instapay`), verified via payment screenshot upload or confirmation email to `ahmedabdelgawad11803@gmail.com`.

### 7. 🎁 Physical Rewards Shop
Accumulated tokens can be swapped for real football gear via the in-app shop:
- 🎟️ **Match Ticket:** 20,000 tokens (100 EGP)
- 🪪 **Fan Card:** 44,000 tokens (220 EGP)
- ⚽ **Football:** 60,000 tokens (300 EGP)
- 👕 **Fan Jersey:** 100,000 tokens (500 EGP)
- 👟 **Football Boots:** 400,000 tokens (2,000 EGP)
- 🏆 **Official Match Kit:** 600,000 tokens (3,000 EGP)

*Redemption requests are recorded in Firestore (`rewardRequests/`) for manual verification and fulfillment.*

### 8. 📢 Self-Serve Advertising Platform
- Local businesses and football brands can submit in-app banner advertisements.
- Package tiers: **Weekly** or **Monthly** duration with dynamic pricing from Firestore `config/payments`.
- Live preview card, URL safety verification (`https://*`), and InstaPay payment reference tracking.
- Community safety: includes an in-app ad reporting workflow (`adReports/`).

### 9. 🛡️ Kaweera Manager (Admin Dashboard)
Located at `/manager/`, the admin console enables the platform owner to:
- Review incoming InstaPay token purchase requests, inspect payment screenshots, and credit player wallets with one click.
- Process pending physical reward claims and update fulfillment statuses.
- Inspect and moderate active advertisements and user reports.
- Monitor player accounts and mode leaderboards.

### 10. 🌍 Multilingual & RTL Support
- Full internationalization across **English (`en`)**, **Arabic (`ar`)**, and **French (`fr`)**.
- Native right-to-left (RTL) layout switching and localized Arabic team name mappings (`arabicTeamName`).

### 11. 📚 1,070+ Curated Question Bank
The database contains over **1,077 verified questions** categorized across 12 distinct football domains:
- 🏆 FIFA World Cup & Expanded World Cup Archives
- 🌍 Africa Cup of Nations (AFCON)
- 🇪🇬 Egyptian Premier League & National Team
- 🌴 Arab & Gulf Club Football
- 🥇 Ballon d'Or & Individual Honours
- 🏰 European Domestic Leagues & UEFA Champions League
- 📜 Football History & Iconic Matches
- 🌎 Latin American Football (Libertadores, Brasileirão, Primera División)
- 🌟 Legendary Players & Modern Icons
- ⚖️ Football Rules & Regulations
- 🤝 International Tournaments & Friendlies

---

## 🗂️ Project Structure

```
Kaweera/
├── README.md                              # Primary project documentation & architecture guide
└── kaweera v1.0.2/                        # Application distribution & web deployment root
    ├── .git/                              # Git VCS metadata (remote: kaweera-by-ahmed-and-zeyad)
    ├── .github/
    │   └── workflows/
    │       └── codeql.yml                 # Automated CodeQL security scanning workflow
    ├── .nojekyll                          # Bypass Jekyll processing for GitHub Pages hosting
    ├── SECURITY.md                        # Security vulnerability reporting policy
    ├── index.html                         # HTML5 entry point with responsive styling reset
    ├── favicon.ico                        # Application favicon
    ├── metadata.json                      # Expo Metro bundler manifest
    ├── manager/
    │   └── index.html                     # Kaweera Manager back-office admin dashboard
    ├── _expo/
    │   └── static/
    │       └── js/
    │           └── web/
    │               └── index-*.js         # Production Metro bundle (React Native Web + App Core)
    └── assets/
        ├── assets/                        # Static graphical assets
        │   ├── ball.*.png                 # 3D football emblem asset
        │   ├── wordmark-ar.*.png          # Arabic typography logo ("كويرة")
        │   └── wordmark-dots.*.png        # Wordmark diacritic styling accents
        └── node_modules/                  # Bundled Google web fonts
            └── @expo-google-fonts/
                ├── cairo/                 # Cairo font family (400, 600, 700, 800, 900)
                └── lalezar/               # Lalezar font family (400 Regular)
```

---

## 🗄️ Database Architecture (Cloud Firestore)

Kaweera communicates directly with Cloud Firestore via the REST v1 API (`https://firestore.googleapis.com/v1/projects/kora-w-bas/databases/(default)/documents`):

```mermaid
erDiagram
    USERS ||--o{ WALLETS : owns
    USERS ||--o{ PREDICTIONS : submits
    USERS ||--o{ REWARD_REQUESTS : redeems
    USERS ||--o{ TOKEN_PURCHASES : buys
    MATCHES ||--o{ PREDICTIONS : contains
    ROOMS ||--o{ ROOM_PLAYERS : includes

    USERS {
        string uid PK
        string email
        string name
        int createdAt
    }
    USERNAMES {
        string username PK
        string uid FK
    }
    WALLETS {
        string uid PK
        int tokens
        int games
        int spent
        int updatedAt
    }
    LEADERBOARD_MODES {
        string docId PK
        string name
        int score
        int correct
        int timestamp
    }
    ROOMS {
        string roomCode PK
        string hostId
        string status
        string mode
        array qids
        int qIndex
        map players
        int createdAt
    }
    MATCHES {
        string matchId PK
        string home
        string away
        int kickoff
        string status
        int homeScore
        int awayScore
        string leagueId
    }
    PREDICTIONS {
        string predictionId PK
        string matchId FK
        string playerId FK
        int home
        int away
        int points
        boolean settled
    }
    REWARD_REQUESTS {
        string requestId PK
        string uid FK
        string name
        string item
        int tokens
        string status
        int createdAt
    }
    TOKEN_PURCHASES {
        string purchaseId PK
        string uid FK
        string ref
        int egp
        int tokens
        string status
        int createdAt
    }
    ADS {
        string adId PK
        string business
        string text
        string link
        string package
        string status
        int createdAt
    }
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: `v18.x`, `v20.x`, or `v24.x` (LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Modern Web Browser**: Chrome, Edge, Safari, or Firefox

### Option 1: Running the Production Build Directly

You can instantly preview and run the standalone web export using any static web server:

```bash
# Navigate to the distribution directory
cd "kaweera v1.0.2"

# Option A: Using npx serve
npx serve -s . -l 3000

# Option B: Using http-server
npx http-server . -p 3000 -c-1

# Option C: Using Python 3 built-in server
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

### Option 2: Running from Source (React Native & Expo)

If compiling or modifying the source project with the Expo CLI:

```bash
# 1. Clone the repository
git clone https://github.com/doudoushehab2003-create/kaweera-by-ahmed-and-zeyad.git
cd kaweera-by-ahmed-and-zeyad

# 2. Install dependencies
npm install
# or: pnpm install / yarn install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the Expo development server
npx expo start --web
```

---

## ⚙️ Environment Variables

When running the project with custom backend services or developing from source, configure the following environment parameters in `.env`:

| Variable | Required | Description | Example Value |
| :--- | :---: | :--- | :--- |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | **Yes** | Google Cloud / Firebase API key for Firestore REST and Auth | `AIzaSyDXgdmAfP0lXRxt-vgZxMy1muNPqcCoucc` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | **Yes** | Firebase project identifier | `kora-w-bas` |
| `EXPO_PUBLIC_ESPN_SCOREBOARD_URL` | Optional | Upstream ESPN Soccer Scoreboard API endpoint | `https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard` |
| `EXPO_PUBLIC_INSTAPAY_ADDRESS` | Optional | InstaPay recipient handle for payments | `ahmedsabdelgawad@instapay` |
| `EXPO_PUBLIC_SUPPORT_EMAIL` | Optional | Support & payment verification contact email | `ahmedabdelgawad11803@gmail.com` |

> ⚠️ **Security Notice:** Do not commit private production credentials, master service account keys, or unauthorized secrets to version control. Public client API keys are secured with Firestore security rules.

---

## 🛠️ Available Scripts

When operating in an Expo development environment:

```bash
# Start local development server with interactive menu
npm run start
# or: npx expo start

# Run the web application in development mode
npm run web
# or: npx expo start --web

# Export static production web build
npm run export:web
# or: npx expo export --platform web

# Run linter and formatting checks
npm run lint
```

---

## 🤝 Git Workflow & Collaboration Guidelines

To maintain code hygiene and seamless deployment, follow standard branching and commit protocols:

### Branch Naming Conventions
- `feature/<description>`: New game modes, UI components, or scoring mechanics (e.g., `feature/sound-fx`, `feature/tournament-brackets`).
- `fix/<description>`: Bug fixes and patches (e.g., `fix/username-validation`, `fix/timer-sync`).
- `perf/<description>`: Performance and memory optimizations.
- `docs/<description>`: Documentation, guides, or README enhancements.
- `chore/<description>`: Maintenance, dependency updates, and build script adjustments.

### Commit Message Standard (Conventional Commits)
All commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>(<scope>): <short imperative summary>

[optional body providing technical context]

[optional footer: Co-Authored-By / References]
```
Examples:
- `feat(tokens): introduce 200 token reward pack via instapay`
- `fix(auth): prevent false duplicate username collision on signup`
- `refactor(scores): cache ESPN live match requests with 45s TTL`

### Pull Request & Review Process
1. Create a descriptive PR outlining changes, testing steps, and relevant screenshots/screen recordings for UI updates.
2. Ensure no linting errors or broken bundle imports occur.
3. Verify responsive layout rendering on both mobile viewports and desktop resolutions.

---

## 📄 Authors & Acknowledgments

- **Lead Architect & Developer:** **Ahmed Abdelgawad (Sheebo)**
- **Co-Developer:** **Zeyad El Barougy**
- **Contact / Support & Rewards Fulfillment:** `ahmedabdelgawad11803@gmail.com`
- **Design & Concept:** Designed and developed for the Egyptian and Arab football enthusiast community.
