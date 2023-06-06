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

# Test Scenarios
The framework currently includes the following test scenarios (Available in cypress/cypress/e2e/valetAPITesting/valetapi.cy.js):

- Find the average Forex conversion rate for a specified currency pair and recent weeks.
- Validate the uniqueness of dates in the API response.
- Test error handling for invalid currency codes.
- Test error handling for an invalid date range.
- Verify observations starting from a valid start date.
- Verify observations ending at a valid end date.
- Verify observations within a valid date range.
- Test error handling for an invalid date format.
- Test retrieving the most recent X observations per series.

## Data-Driven Tests

The repository now includes an example of a data-driven test, **data-driven-average-forex-conversion-rate.cy.js**, to showcase code reusability. The test uses the fixture file **datadriventestdata.json** to define multiple test cases with different currency pairs, recent weeks, and expected status codes.

To run the data-driven test, make sure the **datadriventestdata.json** file is available in the fixtures directory. Then, execute the Cypress test suite as mentioned earlier.
