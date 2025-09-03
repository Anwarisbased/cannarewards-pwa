---

#### **File 2: `cannarewards-pwa/README.md` (Updated File)**

**ACTION:** Replace the entire contents of your existing `README.md` file in the **root** directory of your `cannarewards-pwa` project.

**CONTENTS:**

````markdown
# CannaRewards PWA

## 🚀 Overview

This is the Next.js Progressive Web App (PWA) frontend for the CannaRewards D2C Intelligence Platform. It is a fully decoupled, client-side application that communicates with the CannaRewards Engine backend via a REST API.

## 📋 Prerequisites

- Node.js >= 18
- `npm` or `yarn`
- A running instance of the `cannarewards-engine` backend.

## ⚙️ Local Development Setup

1.  **Clone the repository:**

    ```bash
    git clone [your-repo-url] cannarewards-pwa
    ```

2.  **Install dependencies:**
    Navigate into the project directory.

    ```bash
    cd cannarewards-pwa
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy the example environment file to create your local configuration.

    ```bash
    cp .env.local.example .env.local
    ```

    Now, open `.env.local` and fill in the required values, particularly `NEXT_PUBLIC_API_URL`, which should point to your local WordPress backend (e.g., `http://cannarewards-api.local`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture

This project follows a component-driven architecture, designed for rapid iteration and a high-quality user experience.

- **`/app`**: The main routing structure, following the Next.js App Router convention.
- **`/components`**: The UI library, organized by type:
  - `/ui`: Raw, primitive components from shadcn/ui.
  - `/`: Core, reusable components (`PageContainer`, `AnimatedCounter`).
  - `/[feature]`: Complex feature components (`dashboard/StatusCard`).
- **`/context`**: Global state management using React Context (`AuthContext`, `ConfigContext`).
- **`/services`**: The data layer. All API calls to the backend are isolated in these files.
- **Storybook:** A workbench for developing and testing UI components in isolation. Run with `npm run storybook`.

## 🧪 Running Tests & Linters

This project uses ESLint and Prettier to enforce code quality and style. This is run automatically on every commit via a Husky pre-commit hook.

- To run tests: `npm test`
- To run the linter: `npm run lint`
````
