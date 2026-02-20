function toMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function numberFromInput(id) {
  const input = document.getElementById(id);
  const value = Number(input.value);
  return Number.isFinite(value) && value >= 0 ? value : NaN;
}

function renderList(targetId, rows, variant) {
  const target = document.getElementById(targetId);
  const items = rows
    .map(
      ([label, value]) =>
        `<li><span>${label}</span><strong>${value}</strong></li>`,
    )
    .join("");

  target.className = `result ${variant}`;
  target.innerHTML = `<ul class="result-list">${items}</ul>`;
}

document.getElementById("budget-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const income = numberFromInput("income");
  const fixed = numberFromInput("fixed");
  const variable = numberFromInput("variable");
  const saving = numberFromInput("saving");

  if ([income, fixed, variable, saving].some(Number.isNaN)) {
    const result = document.getElementById("budget-result");
    result.className = "result warn";
    result.textContent = "Please enter valid non-negative numbers.";
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
});

document.getElementById("split-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const income = numberFromInput("split-income");
  if (Number.isNaN(income)) {
    const result = document.getElementById("split-result");
    result.className = "result warn";
    result.textContent = "Please enter a valid non-negative income.";
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
});

document.getElementById("fund-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const essential = numberFromInput("essential");
  const months = numberFromInput("months");
  const currentFund = numberFromInput("current-fund");
  const contribution = numberFromInput("contribution");

  if ([essential, months, currentFund, contribution].some(Number.isNaN) || months < 1) {
    const result = document.getElementById("fund-result");
    result.className = "result warn";
    result.textContent = "Please enter valid values. Target months must be at least 1.";
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
});

// Render initial values for faster first interaction.
document.getElementById("budget-form").dispatchEvent(new Event("submit"));
document.getElementById("split-form").dispatchEvent(new Event("submit"));
document.getElementById("fund-form").dispatchEvent(new Event("submit"));
