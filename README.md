# DentaPlan: Weekly Dental Appointment Planner

[cloudflarebutton]

DentaPlan is a sophisticated, visually stunning weekly appointment planner designed for dental practices. It provides a comprehensive suite of tools for managing patient schedules, profiles, and practice hours in a clean, intuitive, and highly responsive single-page application. The application features a dynamic 7-day calendar grid, allowing staff to navigate between weeks, view appointments at a glance, and book new ones by simply clicking on an available time slot.

## ✨ Key Features

-   **Dynamic Weekly Calendar:** A 7-day grid with vertical time slots and horizontal days. Navigate between weeks with ease.
-   **Customizable Schedule:** Configure working days, start/end times, and appointment slot duration (15, 30, 45, 60 mins).
-   **Patient Management:** A complete system to add, edit, and delete patient profiles with detailed information.
-   **Appointment Booking:** Click any time slot to book appointments, select patients, define procedures, and add notes.
-   **Color-Coded Procedures:** At-a-glance identification of appointment types with a clear color-coding system and legend.
-   **Real-time Search:** Instantly filter the calendar by patient name to quickly find appointments.
-   **Export Schedule:** Download the current week's schedule as a simple, formatted text file.
-   **Persistent Data:** All settings, patient data, and appointments are saved to your browser's `localStorage`.
-   **Fully Responsive:** A seamless experience on desktops, tablets, and mobile devices.

## 🛠️ Technology Stack

-   **Framework:** React
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui
-   **Icons:** Lucide React
-   **Date & Time:** date-fns
-   **Animations:** Framer Motion
-   **Deployment:** Cloudflare Workers

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/dentaplan_weekly_planner.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd dentaplan_weekly_planner
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```

## 💻 Development

To start the local development server, run the following command. This will launch the application with hot-reloading enabled.

```sh
bun run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

## ☁️ Deployment

This application is designed for easy deployment to Cloudflare Pages.

1.  **Log in to Cloudflare:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```sh
    bunx wrangler login
    ```
2.  **Deploy the application:**
    Run the deploy script, which builds the project and deploys it using Wrangler.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]

## 📁 Project Structure

-   `src/pages/`: Contains the main page components. `HomePage.tsx` is the core application file.
-   `src/components/denta-plan/`: Houses the custom components specific to the DentaPlan application (Header, Calendar, Modals).
-   `src/components/ui/`: Contains the reusable shadcn/ui components.
-   `src/hooks/`: Custom React hooks, such as `useLocalStorageState.ts`.
-   `src/lib/`: Utility functions, including `denta-plan-utils.ts` for date/time logic.
-   `src/types/`: TypeScript type definitions for the application.
-   `worker/`: Contains the Cloudflare Worker server-side logic (if any).