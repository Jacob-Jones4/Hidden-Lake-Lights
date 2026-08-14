/* =====================================================
   HIDDEN LAKE LIGHTS - MAIN WEBSITE JAVASCRIPT
===================================================== */

/* ===== BASIC SITE UI ===== */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

/* =====================================================
   LIVE SHOW STATUS
   All show times are evaluated in America/Chicago so the
   status is correct even if a visitor is in another timezone.
===================================================== */

const SHOW_TIME_ZONE = "America/Chicago";

/*
  MANUAL STATUS OVERRIDES

  Turn enabled to true when you need to temporarily replace
  the automatic schedule for weather, maintenance,
  cancellation, etc.

  state options:
  "delayed"
  "cancelled"
  "maintenance"
  "live"
*/
const showStatusOverrides = {
  christmas: {
    enabled: false,
    state: "delayed",
    title: "WEATHER DELAY",
    message: "The show is temporarily delayed. Please check back soon."
  },

  halloween: {
    enabled: false,
    state: "delayed",
    title: "WEATHER DELAY",
    message: "The show is temporarily delayed. Please check back soon."
  }
};

/* =====================================================
   SHOW SCHEDULES
===================================================== */

const showSchedules = {
  christmas: {
    label: "Christmas",

    seasonStart: "2026-11-28",
    seasonEnd: "2026-12-31",

    openingMessage:
      "The 2026 Christmas season opens November 28 at 7:00 PM.",

    weekly: {
      0: {
        start: 17 * 60,
        end: 21 * 60 + 30
      }, // Sunday 5 PM - 9:30 PM

      1: {
        start: 17 * 60,
        end: 21 * 60
      }, // Monday 5 PM - 9 PM

      2: {
        start: 17 * 60,
        end: 21 * 60
      }, // Tuesday

      3: {
        start: 17 * 60,
        end: 21 * 60
      }, // Wednesday

      4: {
        start: 17 * 60,
        end: 21 * 60
      }, // Thursday

      5: {
        start: 17 * 60,
        end: 22 * 60
      }, // Friday 5 PM - 10 PM

      6: {
        start: 17 * 60,
        end: 22 * 60
      } // Saturday 5 PM - 10 PM
    },

    special: {
      "2026-11-28": {
        start: 19 * 60,
        end: 22 * 60,
        name: "Opening Night"
      },

      "2026-12-24": {
        start: 17 * 60,
        end: 23 * 60,
        name: "Christmas Eve"
      },

      "2026-12-25": {
        start: 16 * 60,
        end: 23 * 60,
        name: "Christmas Day"
      },

      "2026-12-31": {
        start: 17 * 60,
        end: 24 * 60,
        name: "New Year's Eve"
      }
    }
  },

  halloween: {
    label: "Halloween",

    seasonStart: "2026-10-10",
    seasonEnd: "2026-10-31",

    openingMessage:
      "The 2026 Halloween season opens October 10 at 7:00 PM.",

    weekly: {
      0: {
        start: 18 * 60,
        end: 21 * 60 + 30
      }, // Sunday 6 PM - 9:30 PM

      1: {
        start: 18 * 60,
        end: 21 * 60
      }, // Monday 6 PM - 9 PM

      2: {
        start: 18 * 60,
        end: 21 * 60
      }, // Tuesday

      3: {
        start: 18 * 60,
        end: 21 * 60
      }, // Wednesday

      4: {
        start: 18 * 60,
        end: 21 * 60
      }, // Thursday

      5: {
        start: 18 * 60,
        end: 22 * 60
      }, // Friday 6 PM - 10 PM

      6: {
        start: 18 * 60,
        end: 22 * 60
      } // Saturday 6 PM - 10 PM
    },

    special: {
      "2026-10-10": {
        start: 19 * 60,
        end: 22 * 60,
        name: "Opening Night"
      }
    }
  }
};

/* =====================================================
   GET CURRENT ST. PETERS / CHICAGO TIME
===================================================== */

function getChicagoNowParts() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOW_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date())
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  const date =
    `${parts.year}-${parts.month}-${parts.day}`;

  const minutes =
    Number(parts.hour) * 60 +
    Number(parts.minute);

  return {
    date,
    minutes
  };
}

/* =====================================================
   DATE HELPERS
===================================================== */

function dateToUtc(dateString) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );
}

function addDays(dateString, days) {
  const date = dateToUtc(dateString);

  date.setUTCDate(
    date.getUTCDate() + days
  );

  return date
    .toISOString()
    .slice(0, 10);
}

function getWeekday(dateString) {
  return dateToUtc(dateString)
    .getUTCDay();
}

/* =====================================================
   GET SHOW HOURS FOR A DATE
===================================================== */

function getScheduleForDate(
  season,
  dateString
) {
  const config =
    showSchedules[season];

  if (
    !config ||
    dateString < config.seasonStart ||
    dateString > config.seasonEnd
  ) {
    return null;
  }

  /*
    Special dates override the
    normal weekly schedule.
  */
  if (config.special[dateString]) {
    return config.special[dateString];
  }

  return (
    config.weekly[
      getWeekday(dateString)
    ] || null
  );
}

/* =====================================================
   TIME FORMATTING
===================================================== */

function formatMinutes(minutes) {
  /*
    Midnight at the end of
    New Year's Eve.
  */
  if (minutes === 24 * 60) {
    return "12:00 AM";
  }

  const hour24 =
    Math.floor(minutes / 60);

  const minute =
    minutes % 60;

  const suffix =
    hour24 >= 12 ? "PM" : "AM";

  const hour12 =
    hour24 % 12 || 12;

  return (
    `${hour12}:` +
    `${String(minute).padStart(2, "0")} ` +
    suffix
  );
}

function formatDateLabel(
  dateString,
  todayString
) {
  if (dateString === todayString) {
    return "Today";
  }

  if (
    dateString ===
    addDays(todayString, 1)
  ) {
    return "Tomorrow";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    }
  ).format(
    dateToUtc(dateString)
  );
}

/* =====================================================
   FIND NEXT SHOW
===================================================== */

function findNextShow(
  season,
  todayString,
  currentMinutes
) {
  const config =
    showSchedules[season];

  if (!config) {
    return null;
  }

  const searchStart =
    todayString < config.seasonStart
      ? config.seasonStart
      : todayString;

  /*
    Search forward through the
    calendar for the next valid
    show day.
  */
  for (let i = 0; i < 370; i++) {
    const date =
      addDays(searchStart, i);

    if (date > config.seasonEnd) {
      return null;
    }

    const schedule =
      getScheduleForDate(
        season,
        date
      );

    if (!schedule) {
      continue;
    }

    /*
      If today's show has already
      begun or ended, don't call it
      the "next" show.
    */
    if (
      date === todayString &&
      currentMinutes >= schedule.start
    ) {
      continue;
    }

    return {
      date,
      ...schedule
    };
  }

  return null;
}

/* =====================================================
   UPDATE STATUS CARD APPEARANCE
===================================================== */

function setLiveStatusCard(
  card,
  state,
  title,
  message
) {
  card.dataset.status = state;

  const titleElement =
    card.querySelector(
      ".live-status-title"
    );

  const messageElement =
    card.querySelector(
      ".live-status-message"
    );

  if (titleElement) {
    titleElement.textContent =
      title;
  }

  if (messageElement) {
    messageElement.textContent =
      message;
  }
}

/* =====================================================
   LIVE SHOW STATUS MAIN FUNCTION
===================================================== */

function updateLiveShowStatus() {
  const card =
    document.getElementById(
      "liveShowStatus"
    );

  /*
    If this page doesn't contain
    the live status card, stop.
  */
  if (!card) {
    return;
  }

  const season =
    card.dataset.season;

  const config =
    showSchedules[season];

  if (!config) {
    return;
  }

  /* ===== MANUAL OVERRIDE ===== */

  const override =
    showStatusOverrides[season];

  if (override?.enabled) {
    setLiveStatusCard(
      card,
      override.state,
      override.title,
      override.message
    );

    return;
  }

  /* ===== CURRENT TIME ===== */

  const now =
    getChicagoNowParts();

  const todaySchedule =
    getScheduleForDate(
      season,
      now.date
    );

  /* ===== SHOW IS CURRENTLY LIVE ===== */

  if (
    todaySchedule &&
    now.minutes >=
      todaySchedule.start &&
    now.minutes <
      todaySchedule.end
  ) {
    const specialText =
      todaySchedule.name
        ? ` — ${todaySchedule.name}`
        : "";

    setLiveStatusCard(
      card,
      "live",
      "SHOW RUNNING NOW",
      `Tune to 90.1 FM and enjoy the ${config.label} show${specialText}. Tonight's show runs until ${formatMinutes(
        todaySchedule.end
      )}.`
    );

    return;
  }

  /* ===== SEASON HASN'T STARTED ===== */

  if (
    now.date <
    config.seasonStart
  ) {
    setLiveStatusCard(
      card,
      "upcoming",
      "SHOW SEASON COMING SOON",
      config.openingMessage
    );

    return;
  }

  /* ===== SEASON IS OVER ===== */

  if (
    now.date >
    config.seasonEnd
  ) {
    setLiveStatusCard(
      card,
      "closed",
      "2026 SEASON COMPLETE",
      `Thank you for visiting Hidden Lake Lights during the 2026 ${config.label} season!`
    );

    return;
  }

  /* ===== FIND NEXT SHOW ===== */

  const nextShow =
    findNextShow(
      season,
      now.date,
      now.minutes
    );

  if (nextShow) {
    const dateLabel =
      formatDateLabel(
        nextShow.date,
        now.date
      );

    const specialText =
      nextShow.name
        ? ` (${nextShow.name})`
        : "";

    setLiveStatusCard(
      card,
      "closed",
      "SHOW OFFLINE",
      `Next show: ${dateLabel} at ${formatMinutes(
        nextShow.start
      )}${specialText}.`
    );
  } else {
    setLiveStatusCard(
      card,
      "closed",
      "SHOW OFFLINE",
      `There are no additional 2026 ${config.label} showtimes scheduled.`
    );
  }
}

/*
  Update immediately when the
  page loads.
*/
updateLiveShowStatus();

/*
  Refresh every 30 seconds so the
  website automatically changes
  between offline/live states.
*/
setInterval(
  updateLiveShowStatus,
  30 * 1000
);

/* =====================================================
   2026 CHRISTMAS DONATION PROGRESS

   IMPORTANT:
   Update currentAmount whenever
   the season donation total changes.

   Example:
   currentAmount: 427.50
===================================================== */

const christmasDonation = {
  currentAmount: 0,
  goalAmount: 1200
};

/* =====================================================
   MONEY FORMATTING
===================================================== */

function formatMoney(amount) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",

      minimumFractionDigits:
        amount % 1 === 0
          ? 0
          : 2,

      maximumFractionDigits: 2
    }
  ).format(amount);
}

/* =====================================================
   UPDATE CHRISTMAS DONATION BAR
===================================================== */

function updateDonationProgress() {
  const progress =
    document.getElementById(
      "donationProgress"
    );

  /*
    Halloween doesn't have this
    element, so this safely stops
    on the Halloween page.
  */
  if (!progress) {
    return;
  }

  const raised =
    Math.max(
      0,
      christmasDonation.currentAmount
    );

  const goal =
    Math.max(
      1,
      christmasDonation.goalAmount
    );

  const percent =
    Math.min(
      100,
      (raised / goal) * 100
    );

  const raisedAmount =
    document.getElementById(
      "donationRaisedAmount"
    );

  const goalAmount =
    document.getElementById(
      "donationGoalAmount"
    );

  const progressFill =
    document.getElementById(
      "donationProgressFill"
    );

  const progressPercent =
    document.getElementById(
      "donationProgressPercent"
    );

  const progressBar =
    document.getElementById(
      "donationProgressBar"
    );

  const seasonStat =
    document.getElementById(
      "donationSeasonStat"
    );

  const goalStat =
    document.getElementById(
      "donationGoalStat"
    );

  /* ===== UPDATE TEXT ===== */

  if (raisedAmount) {
    raisedAmount.textContent =
      formatMoney(raised);
  }

  if (goalAmount) {
    goalAmount.textContent =
      formatMoney(goal);
  }

  if (progressPercent) {
    progressPercent.textContent =
      `${Math.round(percent)}% of goal`;
  }

  if (seasonStat) {
    seasonStat.textContent =
      formatMoney(raised);
  }

  if (goalStat) {
    goalStat.textContent =
      formatMoney(goal);
  }

  /* ===== ACCESSIBILITY ===== */

  if (progressBar) {
    progressBar.setAttribute(
      "aria-valuemax",
      String(goal)
    );

    progressBar.setAttribute(
      "aria-valuenow",
      String(raised)
    );

    progressBar.setAttribute(
      "aria-valuetext",
      `${formatMoney(
        raised
      )} raised toward a ${formatMoney(
        goal
      )} goal`
    );
  }

  /* ===== ANIMATE BAR ===== */

  if (progressFill) {
    requestAnimationFrame(() => {
      progressFill.style.width =
        `${percent}%`;
    });
  }
}

/*
  Update donation information
  when the page loads.
*/
updateDonationProgress();
