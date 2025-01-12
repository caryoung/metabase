import { restore, questionInfoButton, visitModel } from "e2e/support/helpers";
import { ORDERS_BY_YEAR_QUESTION_ID } from "e2e/support/cypress_sample_instance_data";

describe("scenarios > models > revision history", () => {
  beforeEach(() => {
    restore();
    cy.signInAsAdmin();
    cy.request("PUT", `/api/card/${ORDERS_BY_YEAR_QUESTION_ID}`, {
      name: "Orders Model",
      type: "model",
    });
  });

  it("should allow reverting to a saved question state and back into a model again", () => {
    visitModel(ORDERS_BY_YEAR_QUESTION_ID);

    openRevisionHistory();
    revertTo("You created this");
    cy.wait("@modelQuery" + ORDERS_BY_YEAR_QUESTION_ID);

    cy.location("pathname").should("match", /^\/question\/\d+/);
    cy.get(".LineAreaBarChart");

    revertTo("You edited this");
    cy.wait("@modelQuery" + ORDERS_BY_YEAR_QUESTION_ID);

    cy.location("pathname").should("match", /^\/model\/\d+/);
    cy.get(".cellData");
  });
});

function openRevisionHistory() {
  cy.intercept("GET", "/api/user").as("user");
  questionInfoButton().click();
  cy.wait("@user");

  cy.findByText("History");
}

function revertTo(history) {
  const r = new RegExp(history);
  cy.findByText(r).closest("li").findByTestId("question-revert-button").click();
}
