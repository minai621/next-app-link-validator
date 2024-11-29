# Next.js Link Validation in GitHub Actions

This repository provides a GitHub Actions workflow to automate building your Next.js application and validating all URLs.

## Project Overview
This GitHub Action scans all the links used in your Next.js application, checks each one to determine whether it returns a valid response, and reports which links are functioning correctly and which are not. By integrating this action into your CI/CD pipeline, you can automatically detect and address broken links, ensuring the reliability and quality of your application.

## How to Use

### **Add Workflow File:**

   Create a file at `.github/workflows/ci.yml` in your repository with the following content:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-validate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run CI/CD and URL Validation
        uses: minai621/next-app-link-validator@v1
        with:
          base_url: 'http://localhost:3000'
          start_command: 'pnpm start'
          working_dir: '.'
```

Configure Inputs
base_url: The URL where your Next.js app runs (e.g., http://localhost:3000).
start_command: Command to start your Next.js server (e.g., pnpm start).
working_dir: Directory to run the commands (e.g., . for root).

