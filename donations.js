
/* ==========================================
   HIDDEN LAKE LIGHTS - DONATION SETTINGS
   Change donations2026 to update both pages.
========================================== */

const donations2026 = 42;
const donations2018Through2025 = 13213.88;
const donationGoal2026 = 1200;

const lifetimeDonations =
  Math.round((donations2018Through2025 + donations2026) * 100) / 100;

function formatDonation(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

document.addEventListener("DOMContentLoaded", () => {
  function updateText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  // Homepage donation statistics
  updateText("donationRaisedAmount", formatDonation(donations2026));
  updateText("donationSeasonStat", formatDonation(donations2026));
  updateText("donationGoalAmount", formatDonation(donationGoal2026));
  updateText("donationGoalStat", formatDonation(donationGoal2026));
  updateText("donationLifetimeStat", formatDonation(lifetimeDonations));

  const percentage = donationGoal2026 > 0
    ? (donations2026 / donationGoal2026) * 100
    : 0;

  updateText(
    "donationProgressPercent",
    `${Math.round(percentage)}% of goal`
  );

  const fill = document.getElementById("donationProgressFill");
  if (fill) {
    fill.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
  }

  const bar = document.getElementById("donationProgressBar");
  if (bar) {
    bar.setAttribute("aria-valuemax", String(donationGoal2026));
    bar.setAttribute("aria-valuenow", String(donations2026));
  }

  // Donation History count-up target
  const lifetimeCounter = document.getElementById("lifetimeDonationCounter");
  if (lifetimeCounter) {
    lifetimeCounter.dataset.target = String(lifetimeDonations);
  }
});
