describe('Data-Driven Tests - Average Forex Conversion Rate', () => {
  before(() => {
    cy.fixture('datadriventestdata.json').as('testData');
  });

  it('Should perform data-driven tests', function () {
    cy.get('@testData').then((testData) => {
      cy.wrap(testData.testCases).each((testCase) => {
        const { currencyPair, recentWeeks,statusCode } = testCase;

        cy.log(`Running test for currency pair: ${currencyPair}, recent weeks: ${recentWeeks}`);

        cy.request({
          method: 'GET',
          url: `/observations/${currencyPair}?recent_weeks=${recentWeeks}`,
          failOnStatusCode: false
        }).then((response) => {
        
        // Response status is validated from Test Data
        expect(response.status).to.eq(testCase.statusCode);

        // There should be at least one observation in the response
        const observations = response.body.observations;
        expect(observations).to.have.lengthOf.at.least(1);

        // Number of values should match the number of observations
        const values = observations.map(observation => parseFloat(observation[currencyPair].v)); 
        expect(values).to.have.lengthOf(observations.length); 
        
        // There should be at least one valid value
        const validValues = values.filter(value => !isNaN(value));
        expect(validValues).to.have.lengthOf.at.least(1); 

        //Calculate average
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        const average = sum / validValues.length;
        
        // Average should be of type number
        expect(average).to.be.a('number'); 

        // Average should be greater than 0
        expect(average).to.be.greaterThan(0); 

        // Average rate shouldn't exceed 100
        expect(average).to.be.lessThan(100);

        // Response should not have 'error' property
        expect(response.body).to.not.have.property('error');

        // Response should have 'seriesDetail' property that is not empty
        expect(response.body).to.have.property('seriesDetail').that.is.not.empty;

        // Response should have 'observations' property that is not empty
        expect(response.body).to.have.property('observations').that.is.not.empty;

        // First observation should have 'd' property of type string
        expect(response.body.observations[0]).to.have.property('d').that.is.a('string');

        });
      });
    });
  });
});
