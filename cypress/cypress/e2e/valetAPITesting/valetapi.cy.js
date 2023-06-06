describe("Valet API Tests", () => {
  
let currencyPair;
let recentWeeks;
let startDate;
let endDate;
let invalidDateRangeErrorMessage;
let invalidDateFormat;
let invalidDateFormatErrorMessage

before( ()=>{
  cy.fixture("valettestingdata").then((data)=>{
    currencyPair = data.currencyPair,
    recentWeeks = data.recentWeeks,
    startDate = data.startDate,
    endDate = data.endDate
    invalidDateRangeErrorMessage = data.invalidDateRangeErrorMessage
    invalidDateFormat = data.invalidDateFormat
    invalidDateFormatErrorMessage = data.invalidDateFormatErrorMessage
  })

})

  it('Should find the average Forex conversion rate, ${currencyPair}, for the recent ${recentWeeks} weeks', () => {
    cy.request({
      method: 'GET',
      url: `/observations/${currencyPair}?recent_weeks=${recentWeeks}`,
      failOnStatusCode: false
    }).then((response) =>  {

        // Response status should be 200 (OK)
        expect(response.status).to.eq(200);

        // Response body should have 'observations' property of type array
        expect(response.body).to.have.property('observations').and.to.be.an('array');

        // There should be at least one observation in the response
        const observations = response.body.observations;
        expect(observations).to.have.lengthOf.at.least(1);

        // Number of values should match the number of observations
        const values = observations.map(observation => parseFloat(observation.FXCADAUD.v)); 
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

  it('should have unique dates in the response', () => {
    cy.request({
      method: 'GET',
      url: `/observations/${currencyPair}?recent_weeks=${recentWeeks}`
    }).then((response) => {

        // Extracts the "d" property from each observation object to create an array of dates
        const dates = response.body.observations.map(observation => observation.d);
  
        // Asserts that the number of dates is equal to the number of unique dates
        expect(dates).to.have.lengthOf(new Set(dates).size);
      });
  });

  it('should return an error for an invalid currency code', () => {
    const invalidCurrencyCode = 'INVALIDCODE';
    cy.request({
      method: 'GET',
      url: `/observations/${invalidCurrencyCode}?recent_weeks=${recentWeeks}`,
      failOnStatusCode: false
    }).then((response) => {
      // Response status should be 404 (Not Found)
      expect(response.status).to.eq(404);
  
      // Error message should indicate invalid currency code
      expect(response.body.message).to.eq(`Series ${invalidCurrencyCode} not found.`);
    });
  });

  it('should return an error for an invalid date range', () => {

    cy.request({
      method: 'GET',
      url: `/observations/${currencyPair}?start_date=${endDate}&end_date=${startDate}`,
      failOnStatusCode: false
    }).then((response) => {
      //Response status should be 400 (Bad Request)
      expect(response.status).to.eq(400);
  
      // Error message should indicate invalid date range
    expect(response.body.message).to.eq(`${invalidDateRangeErrorMessage}`);
    });
  });

  it("should return observations starting from a valid start date", () => {

    cy.request({
      method: "GET",
      url: `/observations/${currencyPair}?start_date=${startDate}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("observations").and.to.be.an("array");

      // Check if the first observation's date is equal to the valid start date
      expect(response.body.observations[0].d).to.eq(startDate);
    });
  });

  it("should return observations ending at a valid end date", () => {
    cy.request({
      method: "GET",
      url: `/observations/${currencyPair}?end_date=${endDate}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("observations").and.to.be.an("array");

      // Check if the last observation's date is equal to the valid end date
      const observations = response.body.observations;
      const lastObservation = observations[observations.length - 1];
      expect(lastObservation.d).to.eq(endDate);
    });
  });

  it("should return observations within a valid date range", () => {
    cy.request({
      method: "GET",
      url: `/observations/${currencyPair}?start_date=${startDate}&end_date=${endDate}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("observations").and.to.be.an("array");

      // Check if the first observation's date is equal to the start date
      expect(response.body.observations[0].d).to.eq(startDate);

      // Check if the last observation's date is equal to the end date
      const observations = response.body.observations;
      const lastObservation = observations[observations.length - 1];
      expect(lastObservation.d).to.eq(endDate);
    });

  });

  it("should return an error for an invalid date format", () => {

    cy.request({
      method: "GET",
      url: `/observations/${currencyPair}?start_date=${invalidDateFormat}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq(`${invalidDateFormatErrorMessage}`);
    });
  });

  it("should return the most recent X observations per series", () => {
    const recentX = 5;
    cy.request({
      method: "GET",
      url: `/observations/${currencyPair}?recent=${recentX}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("observations").and.to.be.an("array");

      // Check if the number of observations matches the recentX value
      expect(response.body.observations).to.have.lengthOf(recentX);
    });
  });

});
