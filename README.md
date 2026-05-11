<h1 align="center"> salesman_cms </h1>
<p align="center"> An Enterprise-Grade Sales Force Automation and Operations Management System for the Cement Industry </p>


## 📑 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)

---

## 🌟 Overview

**salesman_cms** is a comprehensive, enterprise-level management platform designed to streamline and automate the complex operations of sales forces, dealer networks, and influencer programs within the cement industry. By centralizing field data, logistics, and performance metrics, the platform empowers administrators and management teams to make data-driven decisions in real-time.

### ⚠️ The Problem
> Managing a distributed sales force in the construction materials sector involves significant challenges: tracking salesman field visits, verifying permanent journey plans (PJP), managing dealer relationships across regions, and coordinating influencer programs for masons and contractors. Traditional manual reporting often leads to data silos, delayed responses to market competition, and inaccuracies in performance tracking and rewards distribution.

### ✅ The Solution
**salesman_cms** provides a unified dashboard that integrates every facet of the sales lifecycle. From real-time geotracking of salesmen and attendance management to automated dealer verification and influencer loyalty programs (Mason/PC), the system ensures operational transparency. With integrated spreadsheet editing for financial reporting and a specialized logistics module, it transforms raw field data into actionable business intelligence.

**Architecture Overview:** The application is built using a modern **Component-based Architecture** leveraging **React 19** and **Next.js 16**. It utilizes **Drizzle ORM** for robust database interactions with **PostgreSQL**, and **Tailwind CSS** for a responsive, high-performance user interface.

---

## ✨ Key Features

### 📡 Real-Time Field Intelligence
*   **Salesman Geotracking:** Monitor the live location of field personnel via an integrated mapping interface, ensuring optimized route adherence and safety.
*   **Permanent Journey Plan (PJP) Verification:** Automated workflows for verifying and auditing scheduled field visits (PJP), including bulk verification capabilities to save administrative time.
*   **Attendance & Leave Management:** Dedicated modules for salesmen to log attendance and request leaves, with streamlined approval workflows for managers.

### 🏗️ Dealer & Influencer Ecosystem
*   **Comprehensive Dealer Management:** Tools for listing, verifying, and mapping dealers to specific brands and types. Includes location-based dealer tracking to visualize distribution networks.
*   **Mason & PC (Influencer) Program:** A specialized "MasonPC" side for managing influencers. Features include point ledgers, reward redemption tracking, bags-lift reporting, and technical meeting management.
*   **Reward & Scheme Management:** Dynamically manage rewards, schemes, and offers to drive loyalty among dealers and masons.

### 📊 Performance & Analytics
*   **Advanced Reporting Suite:** Generate detailed Daily Visit Reports (DVR), Technical Visit Reports (TVR), and competition reports to stay ahead of market trends.
*   **Performance Metrics:** Granular tracking of Technical Sales Officers (TSO) and Sales Officers (SO) performance against key KPIs.
*   **Custom Report Generator:** An interactive tool allowing users to generate tailored tables and sync location data for specific business needs.

### 🚚 Logistics & Operations
*   **Logistics IO:** Manage logistics records and user permissions specifically for dispatch and supply chain operations.
*   **Orders & Payments:** Track sales orders and payment statuses to ensure a healthy cash flow and order fulfillment cycle.
*   **Technical Site Tracking:** Maintain a detailed registry of technical sites and construction projects for targeted sales efforts.

### 🛠️ Integrated Productivity Tools
*   **Collaborative Sheets Editor:** A built-in spreadsheet engine (powered by Fortune Sheet) for managing outstanding reports, collections, and financial data directly within the CMS.
*   **AI-Powered Chatbot:** "CemtemChat" provides an interactive interface for users to query data or access system help.
*   **Data Portability:** Comprehensive utilities for reading and writing Excel files, as well as CSV exporting for external analysis.

---

## 🛠️ Tech Stack & Architecture

### Verified Core Technologies
The system is built on a high-performance stack selected for scalability, type safety, and real-time capabilities.

| Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- |
| **React 19** | UI Library | Modern hooks and concurrent rendering for a fluid user experience. |
| **Next.js 16** | Framework | Server-side rendering (SSR) and App Router for optimized performance and SEO. |
| **PostgreSQL** | Database | Relational data integrity for complex sales and dealer structures. |
| **Drizzle ORM** | Data Access | Type-safe SQL execution and migrations with minimal overhead. |
| **Tailwind CSS** | Styling | Utility-first CSS for rapid, consistent UI development. |
| **Leaflet** | Maps/GIS | Lightweight, powerful mapping for geotracking and dealer locations. |
| **Fortune Sheet** | Spreadsheet | High-performance, Excel-like functionality for financial reporting. |
| **NextAuth / JWT** | Security | Secure, industry-standard authentication and session management. |
| **Docker** | Deployment | Containerization for consistent environments across dev and production. |

---

## 📁 Project Structure

```
salesman_cms/
├── 📁 drizzle/                  # Database schema and migration management
│   ├── 📄 schema.ts            # Core database table definitions
│   ├── 📄 relations.ts         # Table relationship mappings
│   └── 📁 migrations/           # SQL migration history
├── 📁 public/                   # Static assets (images, icons)
│   └── 📄 bestcement.webp      # Main branding asset
├── 📁 src/
│   ├── 📁 actions/             # Server-side actions and caching logic
│   ├── 📁 app/                 # Next.js App Router (Pages & API Routes)
│   │   ├── 📁 api/             # Backend API endpoints
│   │   │   ├── 📁 auth/        # Login/Logout logic
│   │   │   ├── 📁 company/     # Company profile management
│   │   │   ├── 📁 dashboardPagesAPI/ # Module-specific API logic
│   │   │   └── 📁 masonpc-side/ # Influencer program endpoints
│   │   ├── 📁 dashboard/       # Core application dashboard UI
│   │   │   ├── 📁 slmAttendance/ # Attendance tracking UI
│   │   │   ├── 📁 dealerManagement/ # Dealer verification UI
│   │   │   └── 📁 reports/     # Reporting dashboard modules
│   │   ├── 📁 home/            # Landing pages and specialized tools
│   │   │   ├── 📁 sheetsEditor/ # Embedded spreadsheet tool
│   │   │   └── 📁 cemtemChat/  # Interactive chatbot UI
│   │   └── 📄 layout.tsx       # Root application layout
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 ui/              # Primitive UI components (Radix/Shadcn)
│   │   ├── 📄 app-sidebar.tsx  # Main navigation sidebar
│   │   └── 📄 data-table-reusable.tsx # Universal data display component
│   ├── 📁 lib/                 # Utility functions and shared services
│   │   ├── 📄 pointsCalcLogic.ts # Business logic for reward calculations
│   │   └── 📄 roleHierarchy.ts  # RBAC (Role-Based Access Control) logic
│   └── 📁 hooks/               # Custom React hooks (search, mobile detection)
├── 📄 docker-compose.yaml       # Multi-container orchestration config
├── 📄 drizzle.config.ts         # Database migration configuration
├── 📄 next.config.ts            # Next.js framework configuration
├── 📄 package.json              # Dependency and script manifest
└── 📄 tsconfig.json             # TypeScript compiler settings
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20 or higher (compatible with React 19)
- **Package Manager**: npm
- **Database**: A PostgreSQL instance (local or via Neon)
- **Docker**: Optional, for containerized deployment

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/salesman_cms.git
   cd salesman_cms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   Configure your database connection in `drizzle.config.ts` or via environment variables, then push the schema:
   ```bash
   npx drizzle-kit push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Deployment (Docker)
To run the application in a containerized environment:
```bash
docker-compose up --build
```

---

## 🔧 Usage

### Accessing the Dashboard
Upon successful login, users are directed to the main dashboard. Navigation is handled via the `ConditionalSidebar`, which adapts based on the user's role (Manager, TSO, Sales Officer, etc.).

### Managing Field Operations
- **Geotracking:** Navigate to `/dashboard/slmGeotracking` to view real-time salesman locations on the map.
- **PJP Verification:** Admins can visit `/dashboard/permanentJourneyPlan` to approve or reject visit logs.
- **Dealer Mapping:** Use the `dealerManagement` module to link specific dealers to brands and verify their physical locations.

### Financial & Data Analysis
- **Sheet Editor:** Go to `/home/sheetsEditor` to import Excel files, perform calculations using the `pointsCalcLogic`, and save reports directly to the database.
- **Custom Reports:** Use the `customReportGenerator` under the home directory to build bespoke data views using drag-and-drop filters.
