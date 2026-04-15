const ROUND_TIME = 25;
const TOTAL_LIVES = 3;
const SHOT_POINTS = 180;

const scenarios = [
  {
    title: "Three Possible Outcomes",
    difficulty: "Matchday",
    market: "3-Way Moneyline",
    selection: "Team A to Win",
    result: "Final score is 1-1 after 90 minutes + stoppage time",
    timeContext: "Customer is focused on the team not losing",
    prompt: "A customer placed a 3-way moneyline bet on Team A. The match ended in a draw. What happens to the bet?",
    coachTip: "Soccer can have three possible outcomes: win, loss, or draw.",
    resolutionScript: "\"In a 3-way moneyline, a draw is a separate outcome. Because the match ended level, the Team A win selection loses.\"",
    outcomeChoices: [
      { key: "win", title: "Wins", description: "The ticket cashes because Team A did not lose." },
      { key: "lose", title: "Loses", description: "The draw is its own outcome, so Team A to win loses." },
      { key: "void", title: "Voided / Refunded", description: "The stake comes back on a draw." }
    ],
    correctOutcome: "lose",
    outcomeFeedback: "Exactly. In a 3-way moneyline, a draw is not a partial win. It is its own settled result."
  },
  {
    title: "Regulation Time Only",
    difficulty: "Pressure Build",
    market: "Moneyline",
    selection: "Team B to Win",
    result: "0-0 after 90 minutes, Team B wins in extra time",
    timeContext: "Customer is pointing to the final competition result",
    prompt: "A customer says Team B advanced, so their win bet should cash. What happens to the bet?",
    coachTip: "Soccer bets are typically settled using regulation time only.",
    resolutionScript: "\"Soccer bets are settled using 90 minutes plus stoppage time only. Since the match was tied at the end of regulation, the win bet does not cash.\"",
    outcomeChoices: [
      { key: "win", title: "Wins", description: "Advancing in extra time makes it a winner." },
      { key: "lose", title: "Loses", description: "The team did not win during regulation time." },
      { key: "void", title: "Voided / Refunded", description: "The stake is automatically returned." }
    ],
    correctOutcome: "lose",
    outcomeFeedback: "Right. Extra time and penalties do not change the standard regulation-time settlement."
  },
  {
    title: "Player Prop Voiding",
    difficulty: "Pressure Build",
    market: "Player Prop",
    selection: "Anytime Goal Scorer - Player X",
    result: "Player X entered as a substitute in the 68th minute",
    timeContext: "Customer says the player still appeared in the match",
    prompt: "The player did not start but entered later as a substitute. What happens to the bet?",
    coachTip: "For this lesson, player props are usually voided if the player did not start.",
    resolutionScript: "\"Player props require the player to start the match. Because the player entered later as a substitute, the bet is voided.\"",
    outcomeChoices: [
      { key: "win", title: "Wins", description: "The prop stays live because the player appeared." },
      { key: "lose", title: "Loses", description: "The prop remains active and loses." },
      { key: "void", title: "Voided / Refunded", description: "The stake returns because the player did not start." }
    ],
    correctOutcome: "void",
    outcomeFeedback: "Yes. The start requirement is the key detail, so the wager is void."
  },
  {
    title: "Asian Handicap Split",
    difficulty: "Derby Mode",
    market: "Asian Handicap -0.25",
    selection: "Team A -0.25",
    result: "Match ends level after regulation",
    timeContext: "Customer expected a full win or full loss",
    prompt: "A customer sees only part of the stake returned on an Asian Handicap. What is the best ruling?",
    coachTip: "Some Asian Handicap lines split the wager into two parts.",
    resolutionScript: "\"Some Asian Handicap lines split the wager into two parts, which can create a partial win or partial refund instead of a full all-or-nothing result.\"",
    outcomeChoices: [
      { key: "win", title: "Wins", description: "The full wager pays out." },
      { key: "lose", title: "Loses", description: "The full wager is lost." },
      { key: "void", title: "Voided / Partial Refund", description: "Part of the stake can be returned." }
    ],
    correctOutcome: "void",
    outcomeFeedback: "Exactly. This line can produce a partial refund instead of a simple full win or full loss."
  },
  {
    title: "Read The Ticket",
    difficulty: "Derby Mode",
    market: "Draw No Bet",
    selection: "Team C",
    result: "Match ends 2-2 after regulation",
    timeContext: "Customer thinks every draw means a loss",
    prompt: "The ticket is draw no bet, not a 3-way moneyline. What happens to the bet on a draw?",
    coachTip: "Start with the market type before explaining any soccer case.",
    resolutionScript: "\"This ticket is draw no bet, not a 3-way moneyline. On a draw, draw no bet returns the stake instead of grading the selection as a loss.\"",
    outcomeChoices: [
      { key: "win", title: "Wins", description: "The selected team is treated as the winner." },
      { key: "lose", title: "Loses", description: "Any draw means the selection loses." },
      { key: "void", title: "Voided / Refunded", description: "Draw no bet returns the stake on a draw." }
    ],
    correctOutcome: "void",
    outcomeFeedback: "Right. Reading the ticket matters because similar soccer markets settle differently."
  },
  {
    title: "Championship Round",
    difficulty: "Golden Goal",
    market: "3-Way Moneyline",
    selection: "Team D to Win",
    result: "1-1 after 90 minutes, Team D advances on penalties",
    timeContext: "Customer is citing the penalties screen as proof of a win",
    prompt: "The team advanced on penalties. What happens to a 3-way moneyline bet on Team D to win?",
    coachTip: "This combines the two biggest lesson points: three possible outcomes and regulation time settlement.",
    resolutionScript: "\"In a 3-way moneyline, the match settled as a draw at the end of regulation time. Penalties decide who advances, but they do not change the bet result.\"",
    outcomeChoices: [
      { key: "win", title: "Wins", description: "Advancing on penalties makes it a winner." },
      { key: "lose", title: "Loses", description: "The draw at regulation means the Team D win selection loses." },
      { key: "void", title: "Voided / Refunded", description: "Every draw refunds the stake." }
    ],
    correctOutcome: "lose",
    outcomeFeedback: "Perfect. In a 3-way market, the regulation-time draw is the settled result."
  }
];

const shotTargets = {
  left: { ballClass: "is-left", saveClass: "is-dive-left", savedBallClass: "is-saved-left" },
  center: { ballClass: "is-center", saveClass: "is-dive-center", savedBallClass: "is-saved-center" },
  right: { ballClass: "is-right", saveClass: "is-dive-right", savedBallClass: "is-saved-right" }
};

const state = {
  roundIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lives: TOTAL_LIVES,
  timer: ROUND_TIME,
  intervalId: null,
  currentScenario: null,
  correctCount: 0,
  shotDirection: "right",
  shotPending: false
};

const elements = {
  introPanel: document.getElementById("introPanel"),
  gamePanel: document.getElementById("gamePanel"),
  resultsPanel: document.getElementById("resultsPanel"),
  startButton: document.getElementById("startButton"),
  restartButton: document.getElementById("restartButton"),
  nextButton: document.getElementById("nextButton"),
  bonusButton: document.getElementById("bonusButton"),
  scoreValue: document.getElementById("scoreValue"),
  streakValue: document.getElementById("streakValue"),
  timerValue: document.getElementById("timerValue"),
  livesValue: document.getElementById("livesValue"),
  timerFill: document.getElementById("timerFill"),
  tickerText: document.getElementById("tickerText"),
  celebrationLayer: document.getElementById("celebrationLayer"),
  celebrationBurst: document.getElementById("celebrationBurst"),
  celebrationBanner: document.getElementById("celebrationBanner"),
  roundValue: document.getElementById("roundValue"),
  totalRoundsValue: document.getElementById("totalRoundsValue"),
  caseTitle: document.getElementById("caseTitle"),
  difficultyBadge: document.getElementById("difficultyBadge"),
  marketValue: document.getElementById("marketValue"),
  selectionValue: document.getElementById("selectionValue"),
  resultValue: document.getElementById("resultValue"),
  timeValue: document.getElementById("timeValue"),
  scenarioPrompt: document.getElementById("scenarioPrompt"),
  coachTip: document.getElementById("coachTip"),
  scriptValue: document.getElementById("scriptValue"),
  phaseLabel: document.getElementById("phaseLabel"),
  questionTitle: document.getElementById("questionTitle"),
  momentumBadge: document.getElementById("momentumBadge"),
  choicesContainer: document.getElementById("choicesContainer"),
  bonusPanel: document.getElementById("bonusPanel"),
  bonusCopy: document.getElementById("bonusCopy"),
  bonusStatus: document.getElementById("bonusStatus"),
  shotControls: document.getElementById("shotControls"),
  shotChoiceRow: document.getElementById("shotChoiceRow"),
  goalkeeper: document.getElementById("goalkeeper"),
  shotBall: document.getElementById("shotBall"),
  shotResult: document.getElementById("shotResult"),
  feedbackTag: document.getElementById("feedbackTag"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackBody: document.getElementById("feedbackBody"),
  finalRank: document.getElementById("finalRank"),
  finalScoreValue: document.getElementById("finalScoreValue"),
  bestStreakValue: document.getElementById("bestStreakValue"),
  correctValue: document.getElementById("correctValue"),
  resultsSummary: document.getElementById("resultsSummary")
};

elements.totalRoundsValue.textContent = String(scenarios.length);

function startGame() {
  resetState();
  elements.introPanel.hidden = true;
  elements.resultsPanel.hidden = true;
  elements.gamePanel.hidden = false;
  loadScenario();
}

function resetState() {
  clearTimer();
  state.roundIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.lives = TOTAL_LIVES;
  state.timer = ROUND_TIME;
  state.currentScenario = null;
  state.correctCount = 0;
  state.shotDirection = "right";
  state.shotPending = false;
  updateHud();
}

function loadScenario() {
  clearTimer();

  if (state.roundIndex >= scenarios.length || state.lives <= 0) {
    showResults();
    return;
  }

  state.currentScenario = scenarios[state.roundIndex];
  state.timer = ROUND_TIME;
  state.shotDirection = "right";
  state.shotPending = false;

  elements.roundValue.textContent = String(state.roundIndex + 1);
  elements.caseTitle.textContent = state.currentScenario.title;
  elements.difficultyBadge.textContent = state.currentScenario.difficulty;
  elements.marketValue.textContent = state.currentScenario.market;
  elements.selectionValue.textContent = state.currentScenario.selection;
  elements.resultValue.textContent = state.currentScenario.result;
  elements.timeValue.textContent = state.currentScenario.timeContext;
  elements.scenarioPrompt.textContent = state.currentScenario.prompt;
  elements.coachTip.textContent = state.currentScenario.coachTip;
  elements.scriptValue.textContent = "Make the right call to unlock the analyst soundbite.";
  elements.phaseLabel.textContent = "Live Call";
  elements.questionTitle.textContent = "What happens to the bet?";
  elements.tickerText.textContent = `Segment ${state.roundIndex + 1}: ${state.currentScenario.market} under review. Make the studio call before the clock expires.`;
  elements.bonusPanel.hidden = true;
  elements.shotControls.hidden = true;
  elements.bonusButton.disabled = false;
  elements.nextButton.hidden = true;
  resetShotScene();
  updateShotButtons();

  renderChoices();
  updateMomentum();
  setFeedback("Studio Open", "New segment live.", "Make the right ruling, then take a shot on goal to see the outcome.", false);
  startTimer();
  updateHud();
}

function renderChoices() {
  elements.choicesContainer.className = "choices choices-outcome";
  elements.choicesContainer.innerHTML = "";

  state.currentScenario.outcomeChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.dataset.key = choice.key;
    button.innerHTML = `<strong>${choice.title}</strong><span>${choice.description}</span>`;
    button.addEventListener("click", () => handleChoice(choice.key));
    elements.choicesContainer.appendChild(button);
  });
}

function handleChoice(key) {
  if (state.shotPending) {
    return;
  }

  const correctKey = state.currentScenario.correctOutcome;
  const isCorrect = key === correctKey;

  disableChoices();
  highlightChoices(correctKey, key);
  clearTimer();
  state.shotPending = true;
  elements.bonusPanel.hidden = false;
  elements.shotControls.hidden = false;
  elements.scriptValue.textContent = state.currentScenario.resolutionScript;

  if (isCorrect) {
    state.correctCount += 1;
    awardPoints(SHOT_POINTS);
    elements.tickerText.textContent = "Great call on the desk. Pick your corner and finish the chance.";
    elements.bonusCopy.textContent = "You got the ruling right. Pick your spot and beat the keeper.";
    elements.bonusStatus.textContent = "Choose a corner, then take the shot.";
    setFeedback("Big Call", "Correct call.", `${state.currentScenario.outcomeFeedback} Now finish the play.`, true);
  } else {
    state.streak = 0;
    state.lives -= 1;
    elements.tickerText.textContent = "The desk missed the ruling. Take the shot and watch the keeper shut it down.";
    elements.bonusCopy.textContent = "Wrong ruling. The keeper is ready for this one.";
    elements.bonusStatus.textContent = "Take the shot and watch the save.";
    setFeedback("Missed Call", "Not this one.", `${state.currentScenario.outcomeFeedback} ${state.currentScenario.resolutionScript}`, false, true);
    updateMomentum();
    updateHud();
  }
}

function setShotDirection(direction) {
  state.shotDirection = direction;
  updateShotButtons();
}

function updateShotButtons() {
  elements.shotChoiceRow.querySelectorAll(".shot-choice").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.shot === state.shotDirection);
  });
}

function resetShotScene() {
  elements.goalkeeper.className = "goalkeeper";
  elements.shotBall.className = "shot-ball";
  elements.shotResult.className = "shot-result";
  elements.shotResult.textContent = "GOAL";
}

function handleShot() {
  if (!state.shotPending) {
    return;
  }

  state.shotPending = false;
  elements.bonusButton.disabled = true;

  const correctWasChosen = elements.feedbackTag.textContent === "Big Call";
  const target = shotTargets[state.shotDirection];

  resetShotScene();

  if (correctWasChosen) {
    elements.goalkeeper.classList.add("is-dive-center");
    elements.shotBall.classList.add(target.ballClass);
    elements.shotResult.textContent = "GOAL";
    window.setTimeout(() => {
      elements.shotResult.classList.add("is-visible");
      playCelebration("GOAL", true);
    }, 360);
    elements.tickerText.textContent = "Goal on the broadcast board. Correct call and clean finish.";
    elements.bonusStatus.textContent = "Goal. The desk nailed the call and buried the finish.";
  } else {
    elements.goalkeeper.classList.add(target.saveClass);
    elements.shotBall.classList.add(target.savedBallClass);
    elements.shotResult.textContent = "SAVE";
    elements.shotResult.classList.add("is-save");
    window.setTimeout(() => {
      elements.shotResult.classList.add("is-visible");
    }, 360);
    elements.tickerText.textContent = "Big save by the keeper after the missed call.";
    elements.bonusStatus.textContent = "Saved. The keeper got there easily on the wrong answer.";
  }

  window.setTimeout(() => {
    elements.nextButton.hidden = false;
  }, 900);
}

function awardPoints(basePoints) {
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.score += basePoints + state.timer * 6 + state.streak * 25;
  updateHud();
  updateMomentum();
}

function disableChoices() {
  elements.choicesContainer.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
}

function highlightChoices(correctKey, chosenKey) {
  elements.choicesContainer.querySelectorAll("button").forEach((button) => {
    if (button.dataset.key === correctKey) {
      button.classList.add("is-correct");
    }
    if (button.dataset.key === chosenKey && chosenKey !== correctKey) {
      button.classList.add("is-wrong");
    }
  });
}

function setFeedback(tag, title, body, positive, danger = false) {
  elements.feedbackTag.textContent = tag;
  elements.feedbackTag.classList.toggle("is-danger", danger);
  elements.feedbackTitle.textContent = title;
  elements.feedbackBody.textContent = body;
}

function startTimer() {
  clearTimer();
  state.intervalId = window.setInterval(() => {
    state.timer -= 1;
    updateHud();

    if (state.timer <= 0) {
      clearTimer();
      timeoutRound();
    }
  }, 1000);
}

function clearTimer() {
  if (state.intervalId) {
    window.clearInterval(state.intervalId);
    state.intervalId = null;
  }
}

function timeoutRound() {
  disableChoices();
  state.streak = 0;
  state.lives -= 1;
  elements.tickerText.textContent = "Segment clock expired before the desk could lock in the ruling.";
  setFeedback("Clock Hit Zero", "Time expired.", "The case clock ran out before you made the ruling. Reset and attack the next one.", false, true);
  elements.nextButton.hidden = false;
  updateHud();
  updateMomentum();
}

function updateHud() {
  elements.scoreValue.textContent = String(state.score);
  elements.streakValue.textContent = String(state.streak);
  elements.timerValue.textContent = String(Math.max(state.timer, 0));
  elements.livesValue.textContent = String(Math.max(state.lives, 0));
  elements.timerFill.style.width = `${(Math.max(state.timer, 0) / ROUND_TIME) * 100}%`;
  elements.timerValue.classList.toggle("is-low", state.timer <= 10 && state.timer > 5);
  elements.timerValue.classList.toggle("is-critical", state.timer <= 5);
}

function updateMomentum() {
  if (state.streak >= 4) {
    elements.momentumBadge.textContent = `Hot desk: ${state.streak} straight calls`;
    elements.momentumBadge.classList.add("is-hot");
  } else if (state.streak > 0) {
    elements.momentumBadge.textContent = `Building buzz: ${state.streak} in a row`;
    elements.momentumBadge.classList.remove("is-hot");
  } else {
    elements.momentumBadge.textContent = "Desk is warming up";
    elements.momentumBadge.classList.remove("is-hot");
  }
}

function playCelebration(label, extra = false) {
  elements.celebrationBanner.textContent = label;
  elements.celebrationBurst.innerHTML = "";

  const colors = extra
    ? ["#ff7d25", "#58a6ff", "#ffd166", "#13d261", "#ffffff"]
    : ["#ff7d25", "#58a6ff", "#13d261"];
  const dotCount = extra ? 24 : 14;

  for (let i = 0; i < dotCount; i += 1) {
    const dot = document.createElement("span");
    dot.className = "burst-dot";
    dot.style.left = `${40 + Math.random() * 20}%`;
    dot.style.top = `${18 + Math.random() * 18}%`;
    dot.style.background = colors[i % colors.length];
    dot.style.setProperty("--burst-x", `${(Math.random() - 0.5) * (extra ? 280 : 180)}px`);
    dot.style.setProperty("--burst-y", `${80 + Math.random() * (extra ? 180 : 120)}px`);
    dot.style.animationDelay = `${Math.random() * 120}ms`;
    elements.celebrationBurst.appendChild(dot);
  }

  elements.celebrationLayer.classList.remove("is-active");
  void elements.celebrationLayer.offsetWidth;
  elements.celebrationLayer.classList.add("is-active");

  window.setTimeout(() => {
    elements.celebrationLayer.classList.remove("is-active");
  }, extra ? 1400 : 1200);
}

function showResults() {
  clearTimer();
  let rank = "Rookie Ref";
  let summary = "You got a few calls right, but there is still room to tighten up your soccer settlement reads.";

  if (state.score >= 2600 && state.correctCount >= 5) {
    rank = "Studio Star";
    summary = "Sharp rulings, confident explanations, and a few clean finishes. This feels like a strong end-of-lesson show closer.";
  } else if (state.score >= 1800) {
    rank = "Lead Analyst";
    summary = "Nice run. You're reading the cases well and turning correct rulings into real studio momentum.";
  } else if (state.score >= 1100) {
    rank = "Desk Contributor";
    summary = "Solid progress. You are picking up the key lesson ideas and getting more comfortable on the air.";
  }

  elements.tickerText.textContent = `Show wrap: ${rank}. Final score ${state.score}.`;
  elements.gamePanel.hidden = true;
  elements.resultsPanel.hidden = false;
  elements.finalRank.textContent = rank;
  elements.resultsSummary.textContent = `${summary} You got ${state.correctCount} of ${scenarios.length} case calls correct.`;
  elements.finalScoreValue.textContent = String(state.score);
  elements.bestStreakValue.textContent = String(state.bestStreak);
  elements.correctValue.textContent = `${state.correctCount} / ${scenarios.length}`;
}

function nextScenario() {
  state.roundIndex += 1;
  loadScenario();
}

elements.startButton.addEventListener("click", startGame);
elements.restartButton.addEventListener("click", startGame);
elements.nextButton.addEventListener("click", nextScenario);
elements.bonusButton.addEventListener("click", handleShot);
elements.shotChoiceRow.querySelectorAll(".shot-choice").forEach((button) => {
  button.addEventListener("click", () => setShotDirection(button.dataset.shot));
});
