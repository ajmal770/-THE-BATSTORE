# Project Details

## Tech Stack
This project is built using modern web development technologies:
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & PostCSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Backend / BaaS**: Firebase (Auth, Database, Storage)
- **Animations**: Framer Motion
- **Forms & Validation**: React Hook Form with Zod
- **Data Fetching**: React Query (@tanstack/react-query)
- **Icons**: Lucide React

## Theme & Color Palette
The project uses a custom color palette defined in the Tailwind configuration. Below are the colors and their primary usage:

- <span style="color:#D6E6F3; font-size:1.2em;">███</span> **Ice Blue** (`#D6E6F3`)
  *Usage*: Light backgrounds, hover effects, and subtle highlights.
- <span style="color:#A6C5D7; font-size:1.2em;">███</span> **Powder Blue** (`#A6C5D7`)
  *Usage*: Secondary elements, borders, inactive states, and muted accents.
- <span style="color:#0F52BA; font-size:1.2em;">███</span> **Sapphire** (`#0F52BA`)
  *Usage*: Primary brand color. Used for main call-to-action buttons, active navigation links, and important icons.
- <span style="color:#000926; font-size:1.2em;">███</span> **Deep Navy** (`#000926`)
  *Usage*: Main typography, dark mode backgrounds, headers, and high-contrast UI elements.

## Project A to Z Details
Here is a comprehensive A to Z breakdown of the project's features and components:

- **A**dmin Dashboard: Comprehensive management of the platform (products, orders, users).
- **B**illing & Checkout: Secure payment processing and checkout flow.
- **C**art Management: Persistent cart state using Zustand.
- **D**atabase Structure: Scalable structure using Firebase Firestore.
- **E**-commerce Functionality: End-to-end shopping experience.
- **F**irebase Integration: Complete setup for Auth, Database, and Storage.
- **G**lobal State: Zustand used for lightweight state management across the app.
- **H**igh Performance: Vite-optimized builds and React Query caching.
- **I**nventory Management: Real-time stock tracking and updates.
- **J**WT & Sessions: Secure session handling via Firebase Auth.
- **K**ey Metrics: Analytics tracking and dashboard statistics.
- **L**ocal Storage: Fallback state persistence for cart and user preferences.
- **M**obile Responsive: Tailwind-based responsive design for all screen sizes.
- **N**avigation: Seamless client-side routing with React Router DOM.
- **O**rder Tracking: Real-time status updates and order history for users.
- **P**roduct Catalog: Advanced filtering, sorting, and search capabilities.
- **Q**ueries & Data Fetching: Efficiently handled via React Query.
- **R**eviews & Ratings: User-generated content and feedback system.
- **S**ecurity: Robust Firebase security rules for data protection.
- **T**heme & UI: Custom tailored color palette (Ice Blue to Deep Navy).
- **U**ser Profiles: Personalized settings, addresses, and order history.
- **V**alidation: Strict form validation using Zod and React Hook Form.
- **W**ishlist: Ability for users to save favorite products for later.
- **X**-Platform Compatibility: Works seamlessly across modern browsers.
- **Y**ield Optimization: Performance enhancements and asset optimizations.
- **Z**ero-Downtime: Prepared for automated CI/CD deployments.

## Database Structure (Models)
The application handles the following core data models (managed via Zustand stores and potentially synced with Firebase):

### Product
- `id`: string
- `name`: string
- `slug`: string (optional)
- `category`: string
- `subcategory`: string (optional)
- `brand`: string (optional)
- `price`: number
- `oldPrice`: number (optional)
- `salePrice`: number (optional)
- `discount`: number (optional)
- `stock`: number
- `rating`: number
- `reviews`: number
- `reviewCount`: number (optional)
- `reviewsList`: Array of Review objects (optional)
- `image`: string
- `images`: Array of strings (optional)
- `colors`: Array of strings (optional)
- `sizes`: Array of strings (optional)
- `tags`: Array of strings (optional)
- `description`: string (optional)
- `isFlashSale`, `isFeatured`, `isTrending`, `isNew`, `isBestSeller`: boolean (optional)
- `createdAt`: string (optional)

### Review
- `id`: string
- `userId`: string
- `userName`: string
- `rating`: number
- `title`: string
- `body`: string
- `date`: string
- `recommended`: boolean

### Category
- `id`: string
- `name`: string
- `slug`: string
- `parent`: string (Uses `-` if no parent)

## Key Features
- **Authentication**: Powered by Firebase Auth.
- **Form Handling**: Efficient forms with built-in validation using React Hook Form and Zod schemas.
- **State Management**: Zustand is used for lightweight global state (e.g., `productStore.ts`, `categoryStore.ts`).
- **Smooth Animations**: Transitions and micro-animations handled by Framer Motion.
- **Export Capabilities**: Features HTML to Image (`html-to-image`) and PDF generation (`jspdf`).

## Project Structure
- `src/components/`: Reusable React components (e.g., Navbar).
- `src/pages/`: Main page views (e.g., Profile, ProductList).
- `src/store/`: Zustand global state management files.
- `src/types/`: Shared TypeScript types and interfaces.
- `package.json`: Manages scripts and project dependencies.
- `tailwind.config.js`: Custom styling configuration.

## How to Run
1. Ensure you have Node.js installed.
2. In your terminal, verify your execution policy allows running scripts (if on Windows PowerShell):
   `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
3. Install dependencies:
   `npm install`
4. Start the development server:
   `npm run dev`
5. Open your browser and navigate to the local URL (usually `http://localhost:5173`).
