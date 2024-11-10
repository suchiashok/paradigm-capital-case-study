# Paradigm Capital Case Study

This project showcases a dashboard with various pages, including a **home page**, **client dashboard**, **trade dashboard**, and **each client's individual trade details**. Below are the instructions for setting up the project locally, and instructions to view the deployed app.

## Pages Overview

- **Home (`/`)**: The main landing page that gives a brief overview of the application and provides navigation to other pages.
- **Clients (`/clients`)**: The client dashboard that displays details for the clients, including relevant data visualization. The client page also allows navigation to individual client trade details through the path `/clients/{client_id}`, providing an overview of each client's trade activity.

- **Trade (`/trade`)**: The trade dashboard for viewing trade-related data.

## Setup

To run the project locally, follow these steps:

```bash
git clone https://github.com/suchiashok/paradigm-capital-case-study.git
cd paradigm-capital-case-study
```

### Install Dependencies

Make sure to install the necessary dependencies to get the app running.

#### For npm:

```bash
npm install
```

    Nuxt: The framework for the app
    Nuxt UI: A library for building UI components
    Chart.js: For rendering interactive charts in the trade dashboard

```bash
npm install nuxt nuxt-ui chart.js
```

### Development Server

Once you’ve installed the dependencies, you can start the development server to preview the app locally.

To run the app on http://localhost:3000, use the following commands:

#### For npm:

```bash
npm run dev
```

## Deployed App

To view the deployed app, visit:
(link goes here)

For more details on deployment and production configurations, refer to the deployment documentation.

## Process Optimization Proposal

View the [Process Optimization Proposal](docs/Process%20Optimization%20Proposal.pdf) here.


