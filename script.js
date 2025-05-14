document.addEventListener("DOMContentLoaded", () => {

  // === Charger l'historique au démarrage ===
  loadHistory();

  // === Écouteur du formulaire ===
  document.getElementById("converter-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const currency = document.getElementById("currency").value;

    if (isNaN(amount) || amount <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }

    try {
      /*const response = await fetch(`https://api.exchangerate.host/convert?from=EUR&to=${currency}&amount=${amount}`);*/
      // Remplace "your_api_key" par ta clé réelle
      const apiKey = 'ee5bfeb8bb28870485cda8d48d7169dc';  // Ta clé d'API
      const response = await fetch(`https://api.exchangerate.host/convert?from=EUR&to=${currency}&amount=${amount}&access_key=${apiKey}`);

      const data = await response.json();

      if (!data.result) {
        throw new Error("Taux de conversion non disponible.");
      }

      const converted = data.result.toFixed(2);
      document.getElementById("result").textContent = `${amount} EUR = ${converted} ${currency}`;

      const record = {
        date: new Date().toLocaleString(),
        from: "EUR",
        to: currency,
        amount: amount,
        result: converted
      };

      saveToHistory(record);
    } catch (error) {
      alert("Erreur lors de la conversion : " + error.message);
    }
  });

  // === Bouton pour vider l'historique ===
  document.getElementById("clear-history").addEventListener("click", () => {
    localStorage.removeItem("currencyHistory");
    loadHistory();
  });

  // === Fonction pour sauvegarder une conversion ===
  function saveToHistory(entry) {
    const history = JSON.parse(localStorage.getItem("currencyHistory")) || [];
    history.unshift(entry); // Ajoute en haut de la liste
    localStorage.setItem("currencyHistory", JSON.stringify(history));
    loadHistory();
  }

  // === Fonction pour charger l'historique dans la page ===
  function loadHistory() {
    const list = document.getElementById("history-list");
    list.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("currencyHistory")) || [];

    if (history.length === 0) {
      list.innerHTML = "<li>Aucune conversion enregistrée.</li>";
      return;
    }

    history.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.date} — ${entry.amount} EUR → ${entry.result} ${entry.to}`;
      list.appendChild(li);
    });
  }
});
