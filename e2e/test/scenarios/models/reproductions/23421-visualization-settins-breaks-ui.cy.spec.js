import { restore, openQuestionActions } from "e2e/support/helpers";

const query = 'SELECT 1 AS "id", current_timestamp::timestamp AS "created_at"';

const questionDetails = {
  native: {
    query,
  },
  displayIsLocked: true,
  visualization_settings: {
    "table.columns": [],
    "table.pivot_column": "orphaned1",
    "table.cell_column": "orphaned2",
  },
  type: "model",
};

describe("issue 23421", () => {
  beforeEach(() => {
    restore();
    cy.signInAsAdmin();

    cy.createNativeQuestion(questionDetails, { visitQuestion: true });
  });

  it("`visualization_settings` should not break UI (metabase#23421)", () => {
    openQuestionActions();
    // eslint-disable-next-line no-unscoped-text-selectors -- deprecated usage
    cy.findByText("Edit query definition").click();

    cy.get(".ace_content").should("contain", query);
    // This test used to check for the presense of 4 cell data elements, implying that we should generate a default
    // value for table.columns. However, as of #33841, having an empty table.columns setting is valid, so the
    // assertion in this test has changed
    cy.findByTestId("visualization-root").should(
      "contain.text",
      "Every field is hidden right now",
    );

    cy.button("Save changes").should("be.disabled");
  });
});
