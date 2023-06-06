# API Automation Framework
This project is a lightweight API automation framework built using JavaScript. It is designed to automate API tests for the Valet API from the Bank of Canada(https://www.bankofcanada.ca/valet/docs). The framework utilizes the Cypress testing library and includes assertions for positive and negative scenarios to ensure the accuracy and reliability of the API response.

# Features
- Automates API tests for the Bank of Canada's Valet API.
- Retrieves Forex conversion rates for different currency pairs.
- Calculates and verifies average conversion rates.
- Validates date ranges and formats.
- Provides detailed assertions for API response validation.
- Generates HTML reports using the Mochawesome plugin.

# Prerequisites
Before running the automation framework, make sure you have the following installed:

- Node.js: https://nodejs.org
- npm: Included with Node.js installation

# Getting Started
Follow these steps to set up and run the automation framework:

1. Clone the repository:

```
git@github.com:sazed5055/api-testing-framework-cypress.git
```

2. Navigate to the project directory:

```
cd api-testing-framework-cypress
```

3. Initialize the project and install cypress:

```
npm init
npm install cypress --save-dev
```

4. Install cypress-mochawesome-reporter (to generate an HTML report)

```
npm i --save-dev cypress-mochawesome-reporter

```

5. Configure the test scenarios:

Modify the fixture file **valettesting.json** to customize the test parameters such as currency pairs, date ranges, and error messages.

Base URL has been included to the config file **cypress.config.js**

6. Run the test suite:

```
npx cypress run
```

7. This command will execute the Cypress test suite, running the API automation tests against the Bank of Canada's valet API.

# View the test results:

After the test execution completes, the test results can be viewed in the command line output. Additionally, an HTML report will be generated in the **reports/html** folder

