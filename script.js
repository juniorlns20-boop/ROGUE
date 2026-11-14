// ROGUE | Calculadora de divisão
// Regras: Parceria 25/75; Pista 30/70; Membro 15/85.
// Comissão opcional de 20% sobre a parte da ROGUE apenas em Parceria e Pista.

(() => {
  const valorInput = document.getElementById("valor");
  const modeButtons = [...document.querySelectorAll(".mode-button")];
  const commissionCheckbox = document.getElementById("comissao");
  const commissionPanel = document.getElementById("commissionPanel");
  const commissionResult = document.getElementById("commissionResult");

  const output = {
    total: document.getElementById("total"),
    faction: document.getElementById("faccao"),
    partner: document.getElementById("parceiro"),
    commission: document.getElementById("comissaoValor"),
    net: document.getElementById("valorFinal")
  };

  const modes = {
    parceria: { faction: 0.25, partner: 0.75, commission: true },
    pista: { faction: 0.30, partner: 0.70, commission: true },
    membro: { faction: 0.15, partner: 0.85, commission: false }
  };

  let currentMode = "parceria";

  const money = (amount) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(amount);

  function readAmount() {
    const raw = String(valorInput.value || "").trim().replace(",", ".");
    const amount = Number.parseFloat(raw);
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }

  function calculate() {
    const amount = readAmount();
    const config = modes[currentMode];
    const factionShare = Math.round((amount * config.faction + Number.EPSILON) * 100) / 100;
    const partnerShare = Math.round((amount * config.partner + Number.EPSILON) * 100) / 100;
    const commissionActive = config.commission && commissionCheckbox.checked;
    const commission = commissionActive
      ? Math.round((factionShare * 0.20 + Number.EPSILON) * 100) / 100
      : 0;
    const finalFaction = Math.round((factionShare - commission + Number.EPSILON) * 100) / 100;

    output.total.textContent = money(amount);
    output.faction.textContent = money(factionShare);
    output.partner.textContent = money(partnerShare);
    output.commission.textContent = money(commission);
    output.net.textContent = money(finalFaction);

    commissionResult.hidden = !commissionActive;
    commissionPanel.hidden = !config.commission;
    if (!config.commission) commissionCheckbox.checked = false;
  }

  function selectMode(mode) {
    if (!modes[mode]) return;
    currentMode = mode;

    modeButtons.forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (!modes[mode].commission) commissionCheckbox.checked = false;
    calculate();
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => selectMode(button.dataset.mode));
  });

  valorInput.addEventListener("input", calculate);
  commissionCheckbox.addEventListener("change", calculate);

  calculate();
})();
