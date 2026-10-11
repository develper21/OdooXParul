import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ActivityCard } from "../../components/ui/ActivityCard";
import { BudgetCard } from "../../components/ui/BudgetCard";
import { TripCard } from "../../components/ui/TripCard";

describe("travel cards", () => {
  it("renders trip details and the view action", () => {
    const markup = renderToStaticMarkup(
      <TripCard
        title="Paris getaway"
        destination="Paris, France"
        startDate="Jun 15"
        endDate="Jun 20"
        travelers={2}
      />
    );

    expect(markup).toContain("Paris getaway");
    expect(markup).toContain("Paris, France");
    expect(markup).toContain("Jun 15 - Jun 20");
    expect(markup).toContain("2 travelers");
    expect(markup).toContain("View Trip");
  });

  it("renders budget totals, remaining balance, and item breakdown", () => {
    const markup = renderToStaticMarkup(
      <BudgetCard
        title="Trip budget"
        spent={650}
        budget={1000}
        currency="$"
        items={[{ name: "Hotel", amount: 400 }, { name: "Food", amount: 250 }]}
      />
    );

    expect(markup).toContain("Trip budget");
    expect(markup).toContain("Spent");
    expect(markup).toContain("Remaining: $350");
    expect(markup).toContain("Hotel");
    expect(markup).toContain("Food");
  });

  it("renders an over-budget balance without showing a negative remainder", () => {
    const markup = renderToStaticMarkup(
      <BudgetCard title="Over budget" spent={1200} budget={1000} currency="$" />
    );

    expect(markup).toContain("Remaining: $0");
    expect(markup).toContain("Over budget");
  });

  it("renders activity details and leaves optional content out when absent", () => {
    const markup = renderToStaticMarkup(
      <ActivityCard
        title="Museum visit"
        location="Louvre"
        time="10:00"
        category="Sightseeing"
        cost={25}
      />
    );

    expect(markup).toContain("Museum visit");
    expect(markup).toContain("Louvre");
    expect(markup).toContain("Sightseeing");
    expect(markup).toContain("₹25");
  });
});
