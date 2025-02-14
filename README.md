# 📈 Stocks Frontend Application

## 🚀 Overview
This is a **React-based frontend application** for real-time stock price visualization. The application fetches stock data from a backend API and updates the chart every 5 minutes, displaying stock price trends from the last 15 days.

## 🛠️ Features
- 📊 Real-time stock price updates every 5 minutes
- 🗓️ Displays stock data for the last 15 days
- 📅 X-axis shows dates in "dd, MMM" format
- 📈 Interactive line chart using Chart.js
- 🚀 Built with React and Axios for seamless API integration

## 📂 Project Structure
```
📁 src/
   📂 components/
       📄 StockRealtimeChart.jsx  // Main chart component
   📄 index.js                    // Entry point
   📄 App.js                     // Main application wrapper
```

## 💻 Installation
### Prerequisites:
- Node.js (v16 or above)
- npm or yarn

### Steps to Run:
```bash
# Clone the repository
git clone https://github.com/your-username/stocks-frontend.git

# Navigate to the project directory
cd stocks-frontend

# Install dependencies
npm install

# Start the development server
npm start
```
The application will be available at `http://localhost:3000`.

## 🛎️ API Configuration
Ensure that your backend API endpoints are correctly set up:
- `/api/stock-data` - Fetches stock prices for the last 15 days
- `/api/update-price` - Fetches the latest stock price update

You can configure API URLs in `.env`:
```env
REACT_APP_STOCK_DATA_API=http://localhost:5000/api/stock-data
REACT_APP_UPDATE_PRICE_API=http://localhost:5000/api/update-price
```

## 🧪 Testing
```bash
# Run tests
npm test
```

## 📝 Contribution Guidelines
1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 💡 License
This project is licensed under the MIT License.

---
🚀 **Happy Coding!** 💻

