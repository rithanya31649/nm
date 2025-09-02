// ------------------ Crypto Data from CoinGecko ------------------
async function fetchCrypto() {
  try {
    let res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true");
    let data = await res.json();
    document.getElementById("btcPrice").innerText = data.bitcoin.usd.toFixed(2);
    document.getElementById("btcChange").innerText = data.bitcoin.usd_24h_change.toFixed(2);

    // Chart data (mock for 7 days historical price)
    let history = [];
    let labels = [];
    let histRes = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7");
    let histData = await histRes.json();

    histData.prices.forEach(point => {
      labels.push(new Date(point[0]).toLocaleDateString());
      history.push(point[1]);
    });

    new Chart(document.getElementById("btcChart"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "BTC Price (USD)",
          data: history,
          borderColor: "#f39c12",
          fill: false
        }]
      }
    });

  } catch (err) {
    console.error("Crypto fetch error:", err);
  }
}

// ------------------ Stock Data from Alpha Vantage ------------------
async function fetchStock() {
  const apiKey = "demo"; // Replace with your Alpha Vantage API key
  try {
    let res = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=${apiKey}`);
    let data = await res.json();
    let series = data["Time Series (Daily)"];
    let dates = Object.keys(series).slice(0, 7).reverse();

    let prices = dates.map(d => parseFloat(series[d]["4. close"]));
    let change = ((prices[prices.length-1] - prices[0]) / prices[0] * 100).toFixed(2);

    document.getElementById("stockPrice").innerText = prices[prices.length-1].toFixed(2);
    document.getElementById("stockChange").innerText = change;

    new Chart(document.getElementById("stockChart"), {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          label: "AAPL Price (USD)",
          data: prices,
          borderColor: "#3498db",
          fill: false
        }]
      }
    });

  } catch (err) {
    console.error("Stock fetch error:", err);
  }
}

// ------------------ Initialize ------------------
fetchCrypto();
fetchStock();
