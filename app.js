function toMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function numberFromInput(id) {
  const input = document.getElementById(id);
  if (!input) {
    return NaN;
  }

  const value = Number(input.value);
  return Number.isFinite(value) && value >= 0 ? value : NaN;
}

function renderList(targetId, rows, variant) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  const items = rows
    .map(
      ([label, value]) =>
        `<li><span>${label}</span><strong>${value}</strong></li>`,
    )
    .join("");

  target.className = `result ${variant}`;
  target.innerHTML = `<ul class="result-list">${items}</ul>`;
}

function showError(targetId, message) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  target.className = "result warn";
  target.textContent = message;
}

function runBudgetCalculator() {
  const income = numberFromInput("income");
  const fixed = numberFromInput("fixed");
  const variable = numberFromInput("variable");
  const saving = numberFromInput("saving");

  if ([income, fixed, variable, saving].some(Number.isNaN)) {
    showError("budget-result", "Please enter valid non-negative numbers.");
    return;
  }

  const totalPlanned = fixed + variable + saving;
  const remaining = income - totalPlanned;
  const fixedPct = income > 0 ? (fixed / income) * 100 : 0;
  const variablePct = income > 0 ? (variable / income) * 100 : 0;
  const savingPct = income > 0 ? (saving / income) * 100 : 0;

  renderList(
    "budget-result",
    [
      ["Planned Spending + Savings", toMoney(totalPlanned)],
      ["Remaining This Month", toMoney(remaining)],
      ["Fixed Expense Ratio", `${fixedPct.toFixed(1)}%`],
      ["Variable Expense Ratio", `${variablePct.toFixed(1)}%`],
      ["Savings/Debt Ratio", `${savingPct.toFixed(1)}%`],
    ],
    remaining >= 0 ? "ok" : "warn",
  );
}

function runSplitCalculator() {
  const income = numberFromInput("split-income");
  if (Number.isNaN(income)) {
    showError("split-result", "Please enter a valid non-negative income.");
    return;
  }

  renderList(
    "split-result",
    [
      ["Needs (50%)", toMoney(income * 0.5)],
      ["Wants (30%)", toMoney(income * 0.3)],
      ["Savings or Debt (20%)", toMoney(income * 0.2)],
    ],
    "ok",
  );
}

function runFundCalculator() {
  const essential = numberFromInput("essential");
  const months = numberFromInput("months");
  const currentFund = numberFromInput("current-fund");
  const contribution = numberFromInput("contribution");

  if ([essential, months, currentFund, contribution].some(Number.isNaN) || months < 1) {
    showError(
      "fund-result",
      "Please enter valid values. Target months must be at least 1.",
    );
    return;
  }

  const targetAmount = essential * months;
  const gap = Math.max(targetAmount - currentFund, 0);
  const monthsToGoal = gap === 0 ? 0 : contribution > 0 ? Math.ceil(gap / contribution) : Infinity;
  const timeline = Number.isFinite(monthsToGoal)
    ? monthsToGoal === 0
      ? "Goal already reached"
      : `${monthsToGoal} month(s)`
    : "No timeline (monthly contribution is $0)";

  renderList(
    "fund-result",
    [
      ["Emergency Fund Target", toMoney(targetAmount)],
      ["Current Gap", toMoney(gap)],
      ["Estimated Time to Goal", timeline],
    ],
    gap === 0 ? "ok" : contribution > 0 ? "ok" : "warn",
  );
}

function initBudgetCalculator() {
  const form = document.getElementById("budget-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runBudgetCalculator();
  });

  runBudgetCalculator();
}

function initSplitCalculator() {
  const form = document.getElementById("split-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSplitCalculator();
  });

  runSplitCalculator();
}

function initFundCalculator() {
  const form = document.getElementById("fund-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runFundCalculator();
  });

  runFundCalculator();
}

initBudgetCalculator();
initSplitCalculator();
initFundCalculator();
