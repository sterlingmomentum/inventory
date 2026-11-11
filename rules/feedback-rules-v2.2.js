/* =====================================================================
   LWCI Short Form feedback rules: v0.2.2 (2026-11-06), participant-neutral
   Source: LWCI_Round2_Feedback_Rules_v2_2_Participant_Neutral.gs

   The function lwciV2Evaluate_ below is copied VERBATIM from the approved
   Apps Script file (only the pure evaluation logic; no Google Sheets code).
   Approved edit, Nov 9, 2026: the first sentence of N_POST_STRESS (Q27)
   was reworded. No conditions, priorities or other wording changed.

   Do not edit rule conditions or wording here without Sterling Momentum
   approval. If an updated .gs file is approved, replace the function body.

   The adapter at the bottom maps the microsite's answer IDs (Q9, Q11, ...)
   onto the inputs the rules expect (q9, q11, ..., context = CTX1).
   Fixed rules only: the same answers always return the same text.
   Nothing here is sent anywhere.
   ===================================================================== */
(function () {
function lwciV2Evaluate_(p) {
  const get = k => String(p[k] == null ? '' : p[k]).trim();
  const one = (k,vals) => vals.some(v => v.toLowerCase() === get(k).toLowerCase());
  const FREQ_HIGH = ['Often','Always'];
  const FREQ_LOW = ['Never','Rarely'];
  const AGREE_HIGH = ['Very true of me','Completely true of me'];
  const AGREE_LOW = ['Not at all true of me','Slightly true of me'];
  const supports = [], explores = [], flags=[];
  function add(kind, id, theme, title, description, prompt, evidence, priority) {
    const arr = kind==='support' ? supports : explores;
    arr.push({id,theme,text:title+'\n'+description,prompt:prompt||'',evidence,priority});
  }

  // Personal energy alignment — not a claim of objectively optimal scheduling.
  if (one('q9',FREQ_HIGH)) add('support','S_ENERGY','Energy alignment',
    'Working with your energy rhythm',
    'You reported that your schedule often allows activities requiring your best focus during your higher-energy periods. Consider what enables that alignment.', '', 'Q9='+get('q9'),10);
  else if (one('q9',FREQ_LOW)) add('explore','N_ENERGY','Energy alignment',
    'Opportunities to align focus and energy',
    'You reported that your schedule rarely or never allows your most focused activities during higher-energy periods. Consider what influences that pattern.',
    'What flexibility, if any, could help you match an important focused activity with a higher-energy period?', 'Q9='+get('q9'),10);
  else if (one('q9',['Sometimes'])) add('explore','N_ENERGY_VARIABLE','Energy alignment',
    'When focused activities fit your energy',
    'You reported that your schedule sometimes makes room for focused activities during higher-energy periods. What makes alignment easier on some days than others?',
    'What conditions help you make the most of your higher-energy periods?', 'Q9='+get('q9'),40);

  // Communicating availability: ability/practice, not a judgement about boundaries.
  if (one('q18',AGREE_HIGH)) add('support','S_AVAIL','Availability communication',
    'Communicating your availability',
    'You strongly endorsed communicating your availability and limitations clearly to others. Consider when this practice is most useful.', '', 'Q18='+get('q18'),10);
  else if (one('q18',AGREE_LOW)) add('explore','N_AVAIL','Availability communication',
    'Communicating expectations',
    'You gave a lower endorsement to clearly communicating your availability and limitations. Consider how you currently communicate what you can take on.',
    'What would make it easier to communicate your availability or limits in a way that fits your circumstances?', 'Q18='+get('q18'),20);
  else if (one('q18',['Somewhat true of me'])) add('explore','N_AVAIL_VARIABLE','Availability communication',
    'When communicating limits feels easier',
    'You reported that communicating availability and limitations is somewhat characteristic of you. Consider how the setting or relationship affects this.',
    'Where is communicating your availability easiest, and what makes that possible?', 'Q18='+get('q18'),45);

  // Everyday restoration and restoration after stressful periods are DISTINCT practices.
  if (one('q27',AGREE_HIGH)) add('support','S_POST_STRESS','Recovery after stress',
    'Restoring after demanding experiences',
    'You strongly endorsed taking steps to restore your energy after stressful periods. Consider what helps you carry out that practice.', '', 'Q27='+get('q27'),25);
  if (one('q11',FREQ_HIGH)) add('support','S_EVERYDAY_RESTORE','Everyday restoration',
    'Making space for enjoyable or restorative experiences',
    'You reported often or always making time for enjoyable or restorative experiences. Reflect on which experiences feel most supportive to you.', '', 'Q11='+get('q11'),20);
  else if (one('q11',FREQ_LOW)) add('explore','N_EVERYDAY_RESTORE','Everyday restoration',
    'Space for enjoyable or restorative experiences',
    'You reported rarely or never intentionally making time for enjoyable or restorative experiences. Consider whether this reflects your preferences, available opportunities, or current demands.',
    'What would make an enjoyable or restorative activity possible, if you wanted more of it?', 'Q11='+get('q11'),15);
  else if (one('q11',['Sometimes'])) add('explore','N_EVERYDAY_VARIABLE','Everyday restoration',
    'When restoration fits into daily life',
    'You reported sometimes intentionally making time for enjoyable or restorative experiences. Consider what affects that opportunity.',
    'What tends to help or interfere with making time for experiences that feel restorative or enjoyable?', 'Q11='+get('q11'),35);
  if (one('q27',AGREE_LOW)) add('explore','N_POST_STRESS','Recovery after stress',
    'Restoration following demanding experiences',
    'You indicated that taking steps to restore your energy after stressful periods is less characteristic of your current practices. Consider how you usually respond after demanding experiences.',
    'After a particularly demanding period, what would help you notice and respond to your recovery needs?', 'Q27='+get('q27'),30);

  // Competing commitments are described, NOT labelled poor boundary-setting.
  // Use the respondent's EXACT Q15/Q20 frequencies rather than an imprecise band.
  // The single-item branch names which item supplied the observation.
  const frequencyWord = k => get(k).toLowerCase();
  const q15high=one('q15',['Sometimes','Often','Always']);
  const q20high=one('q20',['Sometimes','Often','Always']);
  if (q15high && q20high) add('explore','N_COMMIT','Commitments and personal time',
    'When commitments affect personal time',
    'You reported that commitments '+frequencyWord('q15')+' extend into time intended for yourself or important relationships, and '+frequencyWord('q20')+' lead you to reschedule personal plans. Consider whether these are intentional choices or trade-offs you would like to revisit.',
    'When commitments affect personal time, how do you decide whether those trade-offs reflect what matters most to you?',
    'Q15='+get('q15')+'; Q20='+get('q20'),12);
  else if (q15high || q20high) add('explore','N_COMMIT_ONE','Commitments and personal time',
    'Choices affecting personal time',
    q15high
      ? 'You reported that commitments '+frequencyWord('q15')+' extend into time intended for yourself or important relationships. Consider how that fits your priorities.'
      : 'You reported that commitments '+frequencyWord('q20')+' lead you to reschedule personal plans. Consider how that fits your priorities.',
    'Which changes to your personal plans feel intentional, and which—if any—would you like to approach differently?',
    (q15high?'Q15='+get('q15'):'Q20='+get('q20')),32);
  else if (one('q15',FREQ_LOW) && one('q20',FREQ_LOW)) add('support','S_COMMIT','Commitments and personal time',
    'Personal plans and competing commitments',
    'You reported that commitments rarely or never extend into intended personal time or lead you to reschedule personal plans. Consider whether this reflects how you prefer to manage those commitments.',
    '', 'Q15='+get('q15')+'; Q20='+get('q20'),35);

  const context = /^yes\b/i.test(get('context'));
  if(context) flags.push('UNUSUAL PERIOD: include context note; do not treat these responses as necessarily typical');
  // Selection: deterministic, no score, max two each, distinct *specific* themes.
  function choose(arr) {
    const chosen=[], seen=new Set();
    arr.slice().sort((a,b)=>a.priority-b.priority || a.id.localeCompare(b.id)).forEach(x=>{
      if(chosen.length>=2 || seen.has(x.theme)) return;
      chosen.push(x); seen.add(x.theme);
    });
    return chosen;
  }
  const selectedS=choose(supports), selectedN=choose(explores);
  if (selectedS.length<2) flags.push('FEWER THAN TWO SUPPORTED OBSERVATIONS — leave unused slots neutral');
  if (selectedN.length<2) flags.push('FEWER THAN TWO EXPLORATORY OBSERVATIONS — leave unused slots neutral');
  if (supports.length>2) flags.push('ADDITIONAL SUPPORT CANDIDATES — review selection priorities');
  if (explores.length>2) flags.push('ADDITIONAL EXPLORATORY CANDIDATES — review selection priorities');
  if (selectedS.some(s=>selectedN.some(n=>s.theme===n.theme))) flags.push('SAME SPECIFIC THEME IN BOTH GROUPS — REVIEW');
  if (selectedS.some(s=>s.theme==='Recovery after stress') && selectedN.some(n=>n.theme==='Everyday restoration'))
    flags.push('RELATED BUT DISTINCT RESTORATION PRACTICES — verify nuance is clear');
  if ([p.q9,p.q11,p.q15,p.q18,p.q20,p.q27].some(v=>!String(v||'').trim())) flags.push('MISSING INPUT(S) IN PILOT-RULE ITEMS');
  // Participant-facing neutral invitations when the limited pilot rules cannot
  // justify a specific supporting/exploratory observation. These are QUESTIONS,
  // not claims that any supportive practice or problem was detected.
  // The rule-coverage limitations remain visible in research-only review flags.
  const neutralSupports = [
    'Recognizing what you can draw upon\nAs you review your responses, which personal resources, relationships, or practices have been helpful to you recently—even if you have not relied on them consistently?',
    'Noticing conditions that help\nThink about a time in the past four weeks when managing your responsibilities felt more workable. What, if anything, contributed to that experience?'
  ];
  const neutralNotices = [
    'What feels most relevant right now\nLooking across your answers, which pattern is most meaningful for you to consider, whether or not it appears in this summary?',
    'Where circumstances make a difference\nWhich experiences seem to vary depending on your commitments, relationships, or routines? What might explain those differences?'
  ];
  return {
    supports:selectedS, explores:selectedN, allSupports:supports, allExplores:explores,
    supportText:[selectedS[0]?.text||neutralSupports[0], selectedS[1]?.text||neutralSupports[1]],
    noticeText:[selectedN[0]?.text||neutralNotices[0], selectedN[1]?.text||neutralNotices[1]],
    prompts:[selectedN[0]?.prompt||'What else, if anything, stands out to you in your responses?',
             selectedN[1]?.prompt||'What is one insight you want to carry forward from this reflection?'],
    flags, context:context?'This period was different from usual; consider that context when reflecting.':'',
    evidence:selectedS.concat(selectedN).map(x=>x.id+' {'+x.evidence+'}').join(' | ')
  };
}

/* Synthetic stress-test profiles, copied verbatim from runLWCIStressTestsV2().
   Used only by test.html. */
function lwciV2StressCases_() {
  const cases=[
    {id:'SYNTH-SUPPORTIVE',q9:'Often',q11:'Often',q15:'Rarely',q18:'Very true of me',q20:'Rarely',q27:'Very true of me',context:'No'},
    {id:'SYNTH-STRETCHED',q9:'Rarely',q11:'Rarely',q15:'Often',q18:'Slightly true of me',q20:'Often',q27:'Slightly true of me',context:'Yes, this period was significantly different.'},
    {id:'SYNTH-MIXED',q9:'Often',q11:'Sometimes',q15:'Sometimes',q18:'Somewhat true of me',q20:'Sometimes',q27:'Very true of me',context:'Yes, this period was somewhat different.'},
    {id:'SYNTH-CONFLICT',q9:'Rarely',q11:'Never',q15:'Never',q18:'Very true of me',q20:'Never',q27:'Very true of me',context:'No'},
    {id:'SYNTH-BLANK',q9:'',q11:'',q15:'',q18:'',q20:'',q27:'',context:'No'}
  ];
  return cases;
}

/* ---------- Adapter (microsite) ---------- */
function toRuleInput(answers) {
  const a = answers || {};
  return { q9: a.Q9, q11: a.Q11, q15: a.Q15, q18: a.Q18, q20: a.Q20, q27: a.Q27, context: a.CTX1 };
}
function splitText(text) {
  const i = String(text).indexOf('\n');
  return i < 0 ? { title: '', body: String(text) } : { title: text.slice(0, i), body: text.slice(i + 1) };
}

window.LWCI_RULES = {
  version: 'v0.2.2 (2026-11-06) + Q27 wording edit (2026-11-09)',
  evaluateRaw: lwciV2Evaluate_,
  stressCases: lwciV2StressCases_,
  // Returns participant-facing content plus developer-only diagnostics.
  evaluate(answers) {
    const r = lwciV2Evaluate_(toRuleInput(answers));
    return {
      supports: r.supportText.map(splitText),
      patterns: r.noticeText.map(splitText),
      prompts: r.prompts.slice(),
      contextNote: r.context,
      dev: {
        selectedIds: r.supports.concat(r.explores).map(x => x.id),
        supportIds: r.supports.map(x => x.id),
        exploreIds: r.explores.map(x => x.id),
        allSupportIds: r.allSupports.map(x => x.id),
        allExploreIds: r.allExplores.map(x => x.id),
        evidence: r.evidence,
        flags: r.flags
      }
    };
  }
};
})();
