import { describe, expect, it } from "vitest";
import { suggestNextAction } from "./suggestNextAction";

describe("suggestNextAction", () => {
  it("recommends food when not eaten recently", () => {
    const result = suggestNextAction({
      minutesUntilNextEvent: 120,
      essentials: {
        eaten: false,
        water: true,
        moved: true,
        lastCheckInAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        capacity: "med"
      },
      followUpsDue: 0,
      hasUniNextStep: true,
      hasPinnedToday: true,
      quickWinAvailable: true,
      deepFocusAvailable: true
    });

    expect(result.recommended.type).toBe("food");
  });

  it("limits to quick actions before an event", () => {
    const result = suggestNextAction({
      minutesUntilNextEvent: 15,
      essentials: {
        eaten: true,
        water: true,
        moved: false,
        lastCheckInAt: new Date(),
        capacity: "med"
      },
      followUpsDue: 1,
      hasUniNextStep: true,
      hasPinnedToday: true,
      quickWinAvailable: true,
      deepFocusAvailable: false
    });

    expect(result.recommended.duration).toBe("quick");
  });

  it("uses reset when no data", () => {
    const result = suggestNextAction({
      minutesUntilNextEvent: null,
      essentials: {
        eaten: true,
        water: true,
        moved: true,
        lastCheckInAt: null,
        capacity: null
      },
      followUpsDue: 0,
      hasUniNextStep: false,
      hasPinnedToday: false,
      quickWinAvailable: false,
      deepFocusAvailable: false
    });

    expect(result.recommended.title).toContain("reset");
  });
});
