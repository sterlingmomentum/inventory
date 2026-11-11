/* =====================================================================
   Site copy: everything on the page that is NOT questionnaire wording
   (questionnaire.js) or feedback wording (rules/feedback-rules-v2.2.js).
   Items marked DRAFT need Sterling Momentum approval before launch.
   ===================================================================== */
window.LWCI_SITE_COPY = {
  brandName: "Sterling Momentum",
  // Welcome-page title, purpose and instructions come from questionnaire.js
  // (instrument_name, intro, instructions, estimated_minutes).
  welcome: {
    timeLabel: "About {minutes} minutes",
    noScores: "There are no scores or grades. You will receive a personal reflection based on your answers.",
    button: "Begin the Inventory"
  },

  // DRAFT: privacy notice, shown on the welcome page and results page.
  privacy: {
    heading: "About your answers",
    body: "Your answers are not sent to or collected by Sterling Momentum. Your reflection is created on this device. So a page refresh does not lose your place, your answers are kept in this browser tab until you close the tab or choose “Clear my answers.” As with any website, the hosting service may keep standard technical logs, such as visit times, but these do not include your answers."
  },

  quiz: {
    progressLabel: "Question {n} of {total}",
    contextLabel: "Before your reflection",
    back: "Back",
    next: "Continue",
    finish: "See My Reflection",
    required: "Choose an answer to continue.",
    requiredGrid: "Choose an answer for each time of day to continue.",
    optional: "Optional"
  },

  // DRAFT, for approval: Q6 is skipped when Q5 = "0 days". The summary shows:
  skippedQ6: "Not asked (0 active days selected)",

  results: {
    pageTitle: "Your Leading Well Capacity Reflection",
    intro: "This reflection is based on your answers. It is not a score, grade or diagnosis. Look for what feels meaningful to you.",
    supportsHeading: "Exploring What Supports Your Capacity",
    patternsHeading: "Patterns Worth Noticing",
    promptsHeading: "Additional Questions to Explore",
    summaryHeading: "Your Personal Response Summary",
    contextHeading: "Recent context",
    contextExplanationLabel: "What made this period different",
    print: "Print or Save as PDF",
    clear: "Clear my answers",
    clearConfirm: "Clear your answers from this browser tab? Your reflection will be removed from the screen.",
    printNote: "To keep a copy, choose Print or Save as PDF. Your reflection is not emailed or stored for you."
  },

  // Coaching invitation (photo + booking link). OFF for the initial launch.
  // To turn it on later: change enabled to true. Edit headline, copy, button
  // and url below as needed. To change the photo, replace
  // assets/kimberly-sterling.jpg with a new file of the same name.
  closing: {
    enabled: false,
    headline: "Want to talk through what you noticed?",
    copy: "Schedule a connection call with Kimberly to talk about what stood out in your responses and what support might help you lead well.",
    button: "Schedule a Connection Call",
    url: "https://calendly.com/klsterling/introductory-call",
    photoAlt: "Dr. Kimberly L. Sterling"
  },

  error: {
    heading: "Something went wrong",
    body: "The page could not continue. Your answers have not been sent anywhere. You can start again, or reload the page to return to where you were.",
    restart: "Start again",
    reload: "Reload page"
  }
};
