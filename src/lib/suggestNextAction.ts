export type Capacity = "low" | "med" | "high";

export type EssentialsState = {
  eaten: boolean;
  water: boolean;
  moved: boolean;
  lastCheckInAt?: Date | null;
  capacity?: Capacity | null;
};

export type TaskSuggestion = {
  title: string;
  duration: "quick" | "standard" | "big";
  type: string;
  actionLink?: string;
};

export type SuggestionInput = {
  minutesUntilNextEvent?: number | null;
  essentials: EssentialsState;
  followUpsDue: number;
  hasUniNextStep: boolean;
  hasPinnedToday: boolean;
  quickWinAvailable: boolean;
  deepFocusAvailable: boolean;
};

export type SuggestionOutput = {
  recommended: TaskSuggestion;
  alternatives: TaskSuggestion[];
};

const twoMinuteReset: TaskSuggestion = {
  title: "2-minute reset",
  duration: "quick",
  type: "reset",
  actionLink: "/checkin"
};

const hoursSince = (date?: Date | null) => {
  if (!date) return null;
  const diffMs = Date.now() - date.getTime();
  return diffMs / (1000 * 60 * 60);
};

export const suggestNextAction = (input: SuggestionInput): SuggestionOutput => {
  const { essentials, minutesUntilNextEvent } = input;
  const hours = hoursSince(essentials.lastCheckInAt);
  const needsFood = !essentials.eaten && (hours === null || hours >= 4);
  const lowCapacity = essentials.capacity === "low";
  const eventSoon = minutesUntilNextEvent !== null && minutesUntilNextEvent !== undefined && minutesUntilNextEvent < 30;
  const hasGapForDeep = minutesUntilNextEvent !== null && minutesUntilNextEvent !== undefined && minutesUntilNextEvent >= 45;

  if (needsFood) {
    return {
      recommended: {
        title: "Grab a quick snack",
        duration: "quick",
        type: "food",
        actionLink: "/checkin"
      },
      alternatives: [
        {
          title: "Make a simple meal",
          duration: "standard",
          type: "food",
          actionLink: "/checkin"
        },
        {
          title: "Order or meal-prep",
          duration: "big",
          type: "food",
          actionLink: "/checkin"
        }
      ]
    };
  }

  if (eventSoon) {
    return {
      recommended: {
        title: "Quick tidy or 5-minute task",
        duration: "quick",
        type: "quick",
        actionLink: "/todo"
      },
      alternatives: [
        {
          title: "Send a follow-up nudge",
          duration: "quick",
          type: "followup",
          actionLink: "/work"
        },
        twoMinuteReset
      ]
    };
  }

  if (lowCapacity) {
    return {
      recommended: {
        title: "Low-energy win from your list",
        duration: "quick",
        type: "task",
        actionLink: "/todo"
      },
      alternatives: [
        {
          title: "Top 3 focus pass",
          duration: "standard",
          type: "plan",
          actionLink: "/todo"
        },
        twoMinuteReset
      ]
    };
  }

  if (input.followUpsDue > 0 && minutesUntilNextEvent && minutesUntilNextEvent >= 10 && minutesUntilNextEvent <= 20) {
    return {
      recommended: {
        title: "Send a follow-up",
        duration: "quick",
        type: "followup",
        actionLink: "/work"
      },
      alternatives: [
        {
          title: "Quick admin sweep",
          duration: "standard",
          type: "admin",
          actionLink: "/todo"
        },
        twoMinuteReset
      ]
    };
  }

  if (hasGapForDeep && essentials.capacity !== "low") {
    return {
      recommended: {
        title: "Deep focus sprint",
        duration: "big",
        type: "deep",
        actionLink: "/work"
      },
      alternatives: [
        {
          title: "Knock over your Top 3",
          duration: "standard",
          type: "task",
          actionLink: "/todo"
        },
        {
          title: "Short admin task",
          duration: "quick",
          type: "admin",
          actionLink: "/todo"
        }
      ]
    };
  }

  if (!input.hasPinnedToday && !input.quickWinAvailable && !input.deepFocusAvailable) {
    return {
      recommended: twoMinuteReset,
      alternatives: [
        {
          title: "Capture inbox",
          duration: "quick",
          type: "inbox",
          actionLink: "/todo"
        },
        {
          title: "Set your Top 3",
          duration: "standard",
          type: "plan",
          actionLink: "/todo"
        }
      ]
    };
  }

  return {
    recommended: {
      title: "Next task from your list",
      duration: "standard",
      type: "task",
      actionLink: "/todo"
    },
    alternatives: [
      {
        title: input.hasUniNextStep ? "Uni next step" : "Set a uni next step",
        duration: "standard",
        type: "uni",
        actionLink: "/settings"
      },
      twoMinuteReset
    ]
  };
};
