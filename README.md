# Latency Topology Visualizer

A Next.js application that displays a 3D world map visualizing exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions for cryptocurrency trading infrastructure.

---

## Features

### Core Features

- **3D Interactive Globe** - Rotate, zoom, and pan the 3D Earth visualization
- **2D Map View** - Switch to Leaflet map view with OpenStreetMap tiles
- **24 Exchange Servers** - Monitor major cryptocurrency exchanges (Binance, Coinbase, OKX, Bybit, etc.)
- **Real-time Latency Visualization** - Animated connections showing latency with color coding
- **Historical Latency Charts** - Time-series analysis with 1h, 24h, 7d, 30d ranges
- **Cloud Provider Filtering** - Filter by AWS, GCP, or Azure
- **Search Functionality** - Quickly locate exchanges by name or location
- **Responsive Design** - Optimized for desktop, tablet, and mobile

### Advanced Features

- **AI-Powered Predictions** - Machine learning-based latency forecasting
- **Arbitrage Detector** - Real-time profit opportunity identification
- **Smart Alert System** - Customizable latency threshold notifications
- **Advanced Analytics** - Pie charts, bar charts, and radar performance metrics
- **Network Topology** - Connection analysis and most connected servers
- **Dark/Light Theme** - Toggle between themes
- **Export Reports** - Download comprehensive JSON reports
- **Pause/Resume** - Control data updates

---

## Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone   https://github.com/Abishek0612/Latency-Topology-Visualizer.git
cd latency-topology-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Technology            | Purpose                      |
| --------------------- | ---------------------------- |
| **Next.js**           | React framework              |
| **TypeScript**        | Type safety                  |
| **Three.js**          | 3D graphics                  |
| **React Three Fiber** | React renderer for Three.js  |
| **Leaflet**           | 2D map library               |
| **React Leaflet**     | React components for Leaflet |
| **Recharts**          | Data visualization           |
| **Tailwind CSS**      | Styling                      |
| **Lucide React**      | Icons                        |

---

## Map Technologies

### 3D Globe View (Three.js)

- **Procedural Earth generation** with ocean and land layers
- **Custom pin markers** color-coded by cloud provider
- **Animated latency connections** with curved bezier paths
- **Zoom controls** with +/- buttons
- **Auto-rotation** with manual override
- **Stars background** for space effect

### 2D Map View (Leaflet)

- **OpenStreetMap tiles** (CartoDB Dark theme)
- **100% free** - no API key required
- **Custom SVG pin markers** with provider colors
- **Hover tooltips** for quick information
- **Click popups** for detailed server info
- **Latency connection lines** with color coding

---

## How to Use

### View Modes

#### 3D Globe View

1. **Rotate** - Click and drag to rotate the Earth
2. **Zoom** - Scroll wheel or use +/- buttons
3. **Pan** - Right-click and drag
4. **Hover markers** - See server tooltips
5. **Click markers** - Select for latency analysis

#### 2D Map View

1. **Pan** - Click and drag to move
2. **Zoom** - Scroll wheel or use map controls
3. **Hover markers** - See quick tooltip
4. **Click markers** - See detailed popup

### Comparing Latency

1. Click **first exchange marker** (e.g., Binance Tokyo)
2. Click **second exchange marker** (e.g., Coinbase Virginia)
3. Historical latency chart appears below
4. Select time range: 1h, 24h, 7d, or 30d

### Filtering

- **Search** - Type exchange name or city
- **Cloud Providers** - Toggle AWS, GCP, Azure
- **Visualization Layers** - Toggle connections and regions
- **Time Range** - Select historical data period

### Features

#### Arbitrage Opportunities

- Shows profit potential between exchanges
- Factors in latency impact
- Color-coded risk levels (low/medium/high)
- Updates every 8 seconds

#### AI Predictions

- Forecasts latency trends
- Shows increasing/decreasing/stable predictions
- Confidence percentages
- Based on mathematical models

#### Alert System

- Click bell icon to open
- Adjust threshold slider
- Get notifications for high latency
- Critical vs warning alerts

#### Export Reports

- Click download button
- Gets comprehensive JSON report
- Includes all metrics and server data
- Timestamped filename

---

## Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with:

- Dark mode support via `dark:` classes
- Custom color palette
- Responsive breakpoints
- Animation utilities

### Custom CSS

Map-specific styles in `src/app/globals.css`:

- Leaflet control styling
- Dark theme overrides
- Popup customization
- Marker animations

---

## Data Flow

```
Exchange Servers (24)
    ↓
Latency Simulator (calculates geographical distances)
    ↓
Real-time Updates (every 5 seconds)
    ↓
State Management (useVisualizerState hook)
    ↓
3D Globe / 2D Map Visualization
    ↓
Charts, Analytics, AI Predictions
    ↓
Export Reports (JSON)

---

##  Deployment

### Vercel

https://latency-topology-visualizer-orcin.vercel.app/

```

## Requirements Checklist

### Core Requirements

- 3D World Map Display
- Interactive rotation, zoom, pan
- Exchange server markers (24 exchanges)
- Real-time latency visualization
- Color-coded connections (green/yellow/red)
- Historical latency charts
- Time range selectors (1h, 24h, 7d, 30d)
- Cloud provider visualization (AWS/GCP/Azure)
- Filtering controls
- Search functionality
- Performance metrics dashboard
- Responsive design

### Bonus Features (100% Complete)

- Latency heatmap overlay
- Network topology visualization
- Animated data flow
- Dark/light theme toggle
- Export functionality
- AI-powered predictions
- Arbitrage detection
- Alert system
- Advanced analytics dashboard
- 2D Map view with Leaflet

### Technical Requirements (100% Complete)

- TypeScript for type safety
- Proper error handling
- Optimized 3D rendering
- React hooks and patterns
- State management
- Data caching

---

## Acknowledgments

- **Three.js** - 3D graphics library
- **Leaflet** - Open-source mapping library
- **OpenStreetMap** - Free map tiles
- **Next.js** - React framework

```

```
