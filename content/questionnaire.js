/* =====================================================================
   LWCI Short Form questionnaire: candidate v1.1
   Generated directly from LWCI_Short_Form_Developer_Questionnaire.json.
   This is the source of truth for question wording, choices and order.
   To apply an approved wording change, edit the text here only. Keep the
   "id" values unchanged: the feedback rules and results labels use them.
   Nov 9, 2026: Q22 question and choices updated per Sterling Momentum.
   Numbered choices ("1 — Very poor") keep their stored values here; the
   page shows them without the number (see displayChoice in app.js).
   ===================================================================== */
window.LWCI_QUESTIONNAIRE = {
  "version": "Candidate Short Form v1.1 — freeze pending Round 2 cognitive retests",
  "instrument_name": "Leading Well Capacity Inventory Short Form",
  "short_name": "LWCI Short Form",
  "intro": "Leading well involves personal resources, practices, and adaptive behaviors that help us sustain energy, well-being, relationships, and effectiveness. The Leading Well Capacity Inventory Short Form is a self-reflection tool that invites you to notice how you are currently navigating your commitments, priorities, and everyday practices. The goal is to help you recognize patterns and consider intentional actions—not to grade, rank, or judge your leadership ability.",
  "instructions": "Think about how you generally operate now—not just today or how you would ideally like things to be. Consider commitments across your whole life, use the timeframe in each question, and select the answer that best fits your experience. There are no right or wrong answers.",
  "estimated_minutes": "5–10",
  "sections": [
    {
      "title": "Part 1 — Energy & Well-being",
      "question_ids": [
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
        "Q8",
        "Q9",
        "Q10",
        "Q11",
        "Q12",
        "Q13"
      ]
    },
    {
      "title": "Part 2 — Demands, Boundaries & Relationships",
      "question_ids": [
        "Q14",
        "Q15",
        "Q16",
        "Q17",
        "Q18",
        "Q19",
        "Q20",
        "Q21",
        "Q22",
        "Q23",
        "Q24"
      ]
    },
    {
      "title": "Part 3 — Recovery & Adaptability",
      "question_ids": [
        "Q25",
        "Q26",
        "Q27",
        "Q28",
        "Q29",
        "Q30",
        "CTX1",
        "CTX2"
      ]
    }
  ],
  "questions": [
    {
      "id": "Q1",
      "text": "During a typical weekday or work night, approximately how many hours of sleep do you get?",
      "type": "single-choice",
      "choices": [
        "Less than 5 hours",
        "5 to less than 6 hours",
        "6 to less than 7 hours",
        "7 to less than 8 hours",
        "8 to less than 9 hours",
        "9 hours or more"
      ],
      "required": true
    },
    {
      "id": "Q2",
      "text": "During a typical weekend or non-work night, approximately how many hours of sleep do you get?",
      "type": "single-choice",
      "choices": [
        "Less than 5 hours",
        "5 to less than 6 hours",
        "6 to less than 7 hours",
        "7 to less than 8 hours",
        "8 to less than 9 hours",
        "9 hours or more"
      ],
      "required": true
    },
    {
      "id": "Q3",
      "text": "Thinking about the past four weeks, how would you rate the overall quality of your sleep?",
      "type": "single-choice",
      "choices": [
        "1 — Very poor",
        "2 — Poor",
        "3 — Fair",
        "4 — Good",
        "5 — Very good"
      ],
      "required": true
    },
    {
      "id": "Q4",
      "text": "During the past four weeks, how often have you awakened feeling rested enough for the day ahead?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q5",
      "text": "During a typical week, on how many days do you engage in intentional physical activity or exercise?",
      "type": "single-choice",
      "choices": [
        "0 days",
        "1 day",
        "2 days",
        "3 days",
        "4 days",
        "5 days",
        "6 days",
        "7 days"
      ],
      "required": true
    },
    {
      "id": "Q6",
      "text": "On days when you are physically active, about how much time do you usually spend being active?",
      "type": "single-choice",
      "choices": [
        "Less than 15 minutes",
        "15–29 minutes",
        "30–44 minutes",
        "45–59 minutes",
        "60 minutes or more"
      ],
      "required": true
    },
    {
      "id": "Q7",
      "text": "Based on your experience, to what extent does your current level of physical activity support your energy and overall well-being?",
      "type": "single-choice",
      "choices": [
        "1 — Not at all",
        "2 — Slightly",
        "3 — Moderately",
        "4 — Quite a bit",
        "5 — Very much"
      ],
      "required": true
    },
    {
      "id": "Q8",
      "text": "During a typical day, how would you rate your energy at each of the following times?",
      "type": "energy-grid",
      "choices": [
        "Very low",
        "Low",
        "Moderate",
        "High",
        "Very high"
      ],
      "required": true,
      "rows": [
        "Upon waking",
        "Mid-morning",
        "Midday",
        "Late afternoon",
        "Evening"
      ]
    },
    {
      "id": "Q9",
      "text": "How often does your schedule allow you to use your highest-energy periods for work or activities that require your best focus?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q10",
      "text": "During the past four weeks, how often have you had enough energy to meet both your professional and personal responsibilities?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q11",
      "text": "During the past four weeks, how often have you intentionally made time for activities or experiences that you find enjoyable or restorative?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q12",
      "text": "To the best of your knowledge, are you up to date with preventive health care appropriate for you?",
      "type": "single-choice",
      "choices": [
        "Yes",
        "No",
        "Not sure"
      ],
      "required": true
    },
    {
      "id": "Q13",
      "text": "During the past 12 months, how often have work or other responsibilities caused you to postpone preventive or routine health care?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q14",
      "text": "In a typical week, approximately how many total hours do you spend fulfilling commitments and responsibilities, including paid work, unpaid work, volunteer activities, board service, caregiving, and other personal obligations?",
      "type": "single-choice",
      "choices": [
        "Less than 10 hours",
        "10–19 hours",
        "20–29 hours",
        "30–39 hours",
        "40–49 hours",
        "50–59 hours",
        "60 hours or more"
      ],
      "required": true
    },
    {
      "id": "Q15",
      "text": "During the past four weeks, how often have your commitments and responsibilities extended into time you intended to reserve for yourself or people important to you?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q16",
      "text": "During the past four weeks, how often have you felt that you had more responsibilities than you had sufficient time, energy, or attention to manage well?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q17",
      "text": "I can say no to a request or suggest an alternative when it conflicts with an important priority.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q18",
      "text": "I communicate my availability and limitations clearly to others.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q19",
      "text": "When I establish a boundary, I generally maintain it even when others have competing expectations.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q20",
      "text": "During the past four weeks, how often have you rescheduled or cancelled personal plans because of other commitments or responsibilities?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q21",
      "text": "I am comfortable protecting time for rest, relationships, or personal priorities.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q22",
      "text": "Imagine asking the people closest to you about your availability for meaningful time together. Based on how you believe they experience your availability, which statement would they be most likely to choose?",
      "type": "single-choice",
      "choices": [
        "They would say I generally make plans with them and reliably follow through.",
        "They would say I usually follow through with plans, although other responsibilities occasionally interfere.",
        "They would say I often hesitate to make plans because I am unsure whether I will have the time or energy.",
        "They would say it can be difficult to make plans with me because other responsibilities regularly take priority."
      ],
      "required": true
    },
    {
      "id": "Q23",
      "text": "During the past four weeks, how often have you been fully present when spending time with people important to you?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q24",
      "text": "During the past four weeks, how often have you had enough time and energy to meaningfully engage with the relationships that matter most to you?",
      "type": "single-choice",
      "choices": [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ],
      "required": true
    },
    {
      "id": "Q25",
      "text": "After a difficult experience, I am able to regain my focus and continue moving forward.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q26",
      "text": "I recognize when I need time, recovery, or support after demanding situations.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q27",
      "text": "After particularly stressful periods, I intentionally take steps to restore my physical or emotional energy.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q28",
      "text": "When circumstances change, I adjust my plans while keeping my important priorities in mind.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q29",
      "text": "I am willing to reconsider an established approach when it is no longer effective.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    },
    {
      "id": "Q30",
      "text": "When my responsibilities change, I reassess how I allocate my time and energy.",
      "type": "single-choice",
      "choices": [
        "Not at all true of me",
        "Slightly true of me",
        "Somewhat true of me",
        "Very true of me",
        "Completely true of me"
      ],
      "required": true
    }
  ],
  "context_questions": [
    {
      "id": "CTX1",
      "text": "Thinking about the past four weeks, did anything unusual significantly affect your energy, responsibilities, routines, or ability to engage in your usual practices?",
      "type": "single-choice",
      "required": true,
      "choices": [
        "No, this period was generally typical for me.",
        "Yes, this period was somewhat different.",
        "Yes, this period was significantly different."
      ]
    },
    {
      "id": "CTX2",
      "text": "Optional: What made this period different?",
      "type": "free-text",
      "required": false
    }
  ]
};
