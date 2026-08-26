// Budget Challenge Game Logic

let balance = 0, income = 0, spent = 0, day = 0, month = 1, score = 0, emergencies = 0;
let paid = {};
let maxBalance = 0;

const bills = [
  ["🏠 Housing", 900, "need"],
  ["💡 Utilities", 180, "need"],
  ["🛒 Groceries", 300, "need"],
  ["📱 Phone", 70, "need"],
  ["🚗 Transportation", 250, "need"]
];

const events = [
  {
    title: "🚗 Car Trouble",
    text: "Your transportation suddenly needs a repair.",
    choices: [
      ["Pay $350 for the repair", 350, 2],
      ["Find a cheaper repair shop for $180", 180, 3],
      ["Use public transportation for $40", 40, 4]
    ]
  },
  {
    title: "🦷 Dental Emergency",
    text: "You need an unexpected dental visit.",
    choices: [
      ["Pay the $300 bill", 300, 2],
      ["Pay $100 today and delay the rest", 100, 3],
      ["Skip it for now", 0, 0]
    ]
  },
  {
    title: "📱 Broken Phone",
    text: "Your phone screen breaks.",
    choices: [
      ["Replace the phone for $500", 500, 1],
      ["Repair it for $150", 150, 3],
      ["Use an old phone", 0, 4]
    ]
  },
  {
    title: "🐕 Pet Emergency",
    text: "Your pet needs an unexpected vet visit.",
    choices: [
      ["Full vet visit: $250", 250, 2],
      ["Basic visit: $100", 100, 3],
      ["Wait and risk another $200 later", 200, 1]
    ]
  },
  {
    title: "🏠 Home Problem",
    text: "A pipe leaks and needs a quick repair.",
    choices: [
      ["Emergency repair: $400", 400, 2],
      ["Buy supplies and fix it: $80", 80, 4],
      ["Wait: $200 later", 200, 1]
    ]
  }
];

const tips = [
  "Needs come before wants. Housing, food, transportation and utilities are usually priorities.",
  "An emergency fund gives you options when something unexpected happens.",
  "$4 every day for 30 days would cost $120. Small purchases can add up!",
  "Before buying something, ask: Do I need it, or do I want it?",
  "A good budget leaves room for both necessities and fun.",
  "Saving money is a choice you make with every purchase."
];

function money(n) {
  return (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString();
}

function renderBills() {
  document.getElementById("bills").innerHTML = bills.map((b, i) => `
    <div class="expense">
      <span>${b[0]} <span class="pill need">NEED</span></span>
      <b>$${b[1]}</b>
      <button id="bill${i}" onclick="payBill(${i})">Pay</button>
    </div>`).join("");
}

function startGame() {
  income = +document.getElementById("job").value;
  balance = income / 2 + +document.getElementById("savings").value;
  spent = 0;
  day = 1;
  month = 1;
  score = 0;
  emergencies = 0;
  paid = {};
  maxBalance = balance;
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");
  renderBills();
  update();
}

function update() {
  document.getElementById("balance").textContent = money(balance);
  document.getElementById("balance").className = "money " + (balance < 0 ? "negative" : "");
  document.getElementById("spent").textContent = money(spent);
  document.getElementById("emergencies").textContent = emergencies;
  document.getElementById("day").textContent = day;
  document.getElementById("month").textContent = month;
  document.getElementById("score").textContent = score;
  let pct = Math.max(0, Math.min(100, (balance / 1500) * 100));
  document.getElementById("bar").style.width = pct + "%";
  document.getElementById("goalText").textContent = balance >= 500 ? "🏆 You have reached the $500 savings goal!" : "Try to finish with at least $500.";
}

function payBill(i) {
  if (paid[i]) return;
  let cost = bills[i][1];
  balance -= cost;
  spent += cost;
  paid[i] = true;
  score += 2;
  document.getElementById("bill" + i).textContent = "Paid ✓";
  document.getElementById("bill" + i).disabled = true;
  update();
}

function buy(cost, name) {
  if (balance < cost) {
    alert("You don't have enough money for this purchase right now.");
    return;
  }
  balance -= cost;
  spent += cost;
  score -= 1;
  showFeedback("You spent $" + cost + " on " + name + ". Was it worth it? Think about what you could have done with that money instead.");
  update();
}

function nextDay() {
  if (day >= 30) {
    finishGame();
    return;
  }
  day++;
  let chance = 0.23;
  if (Math.random() < chance) {
    emergencies++;
    let e = events[Math.floor(Math.random() * events.length)];
    document.getElementById("event").innerHTML = `<h3>${e.title}</h3><p>${e.text}</p>` +
      e.choices.map((c, i) => `<button class="choice" onclick="chooseEvent(${c[1]},${c[2]},'${c[0].replace(/'/g, "\\'")}')">${c[0]}</button>`).join("");
  } else {
    document.getElementById("event").innerHTML = `<h3>🌤️ Normal day</h3><p>No surprise today. Keep watching your spending.</p><button onclick="nextDay()">Next Day ➜</button>`;
  }
  update();
}

function chooseEvent(cost, points, label) {
  if (cost > balance) {
    showFeedback("⚠️ You couldn't afford that choice, so it costs you 5 points and the emergency remains unpaid.");
    score -= 5;
  } else {
    balance -= cost;
    spent += cost;
    score += points;
    showFeedback("You chose: " + label + ". This decision changed your balance by " + money(-cost) + ".");
  }
  document.getElementById("event").innerHTML = '<h3>Decision made! ✓</h3><p>Keep going and see what happens next.</p><button onclick="nextDay()">Continue ➜</button>';
  update();
}

function showFeedback(t) {
  document.getElementById("feedback").innerHTML = '<div class="feedback">' + t + '</div>';
}

function newTip() {
  document.getElementById("tip").textContent = tips[Math.floor(Math.random() * tips.length)];
}

function finishGame() {
  let final = balance >= 500 ? score + 10 : score;
  let rating = final >= 35 ? "🏆 Budget Boss" : final >= 20 ? "👍 Money Manager" : final >= 10 ? "🙂 Getting There" : "🧠 Learning the Hard Way";
  let student = document.getElementById("student").value || "Student";
  document.getElementById("game").classList.add("hidden");
  let r = document.getElementById("results");
  r.classList.remove("hidden");
  r.innerHTML = `<h2>🎉 ${student}'s Month Is Complete!</h2>
    <div class="big">${rating}</div>
    <p>You finished with <b>${money(balance)}</b> and spent <b>${money(spent)}</b>.</p>
    <p>Your score: <b>${final} points</b></p>
    <hr>
    <h3>Think About It 🤔</h3>
    <ul>
      <li>Which expense was hardest to afford?</li>
      <li>Which choice helped your budget the most?</li>
      <li>Did you spend money on any wants that you could have skipped?</li>
      <li>How would having $1,000 in savings change your decisions?</li>
      <li>What would you change if you played again?</li>
    </ul>
    <button onclick="location.reload()">Play Again 🔄</button>
    <button class="secondary" onclick="showTeacher()">Teacher Discussion Guide</button>`;
}

function showTeacher() {
  alert("CLASS DISCUSSION:\n\n1. What is the difference between a need and a want?\n2. Why is an emergency fund useful?\n3. Which job gave you the most flexibility?\n4. How did small purchases affect your budget?\n5. What surprised you about budgeting?");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
  renderBills();
});