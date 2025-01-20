import { useState, useEffect } from "react";
import "./styles/App.css";

const App = () => {
  const [amount, setAmount] = useState<number>(1.0); 
  const [rate, setRate] = useState<number>(1.0); 
  const [convertedAmount, setConvertedAmount] = useState<number>(1.0); 
  const [reverseConvertedAmount, setReverseConvertedAmount] = useState<number>(1.0); 
  const [lastUpdated, setLastUpdated] = useState<string>(""); 
  const [isEuroToUsd, setIsEuroToUsd] = useState<boolean>(true); 

  // Función para obtener la tasa de cambio desde la API
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch("https://api.vatcomply.com/rates?base=EUR");
      const data = await response.json();
      const usdRate = data.rates.USD; 
      setRate(usdRate);
      setConvertedAmount(amount * usdRate);
      setReverseConvertedAmount(1.0 / usdRate); 

   
      const utcDate = new Date(data.date);
      const formattedDate = utcDate.toLocaleString("en-GB", { 
        timeZone: "UTC", 
        day: "2-digit", 
        month: "short", 
        year: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      });
      setLastUpdated(formattedDate); 
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [amount]);

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;

    const positiveValue = numericValue < 0 ? 0 : numericValue;
    setAmount(positiveValue);
    setConvertedAmount(positiveValue * rate);
    setReverseConvertedAmount(1.0 / rate); 
  };

  const toggleConversionDirection = () => {
    setIsEuroToUsd(!isEuroToUsd);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Currency Exchange</h1>
      </header>
      <div className="subheader">
        <p>100 EUR to USD - Convert Euros to US Dollars</p>
      </div>
      <main className="main-content">
        <div className="card">
          <div className="input-group-container">
            <div className="input-group">
              <label htmlFor="amount">Amount:</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="from">From:</label>
              <select id="from" disabled>
                <option value={isEuroToUsd ? "euro" : "dollar"}>{isEuroToUsd ? "Euro" : "Dollar"}</option>
              </select>
            </div>
            <div className="exchange-icon" onClick={toggleConversionDirection}>
              <img src="src/assets/Button.svg" alt="Exchange" />
            </div>
            <div className="input-group">
              <label htmlFor="to">To:</label>
              <select id="to" disabled>
                <option value={isEuroToUsd ? "dollar" : "euro"}>{isEuroToUsd ? "Dollar" : "Euro"}</option>
              </select>
            </div>
          </div>
          <div className="conversion-result">
            <p>
              <strong>{amount} {isEuroToUsd ? "Euro" : "Dollar"}</strong> ={" "}
              <strong>{isEuroToUsd ? convertedAmount.toFixed(6) : reverseConvertedAmount.toFixed(6)} {isEuroToUsd ? "US Dollars" : "Euros"}</strong>
            </p>
            <p style={{ fontSize: "14px", color: "gray", fontWeight: 400 }}>
              1 {isEuroToUsd ? "USD" : "EUR"} ={" "}
              {isEuroToUsd ? reverseConvertedAmount.toFixed(6) : (1 / rate).toFixed(6)} {isEuroToUsd ? "EUR" : "USD"}
            </p>
          </div>
          <div className="info">
            <p>
              We use the mid-market rate for our Converter. This is for
              informational purposes only. You won't receive this rate when
              sending money.
            </p>
          </div>
          <div className="last-updated">
            <p style={{ textAlign: "right" }}>
              Euro to US Dollar conversion — Last updated: {lastUpdated} UTC
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
