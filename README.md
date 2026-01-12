# 🌍 PlacePulse - Real-Time Place Intelligence

<div align="center">

![PlacePulse Banner](https://img.shields.io/badge/PlacePulse-Real--Time%20Place%20Intelligence-6366f1?style=for-the-badge&logo=google-maps&logoColor=white)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?style=flat-square&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Discover nearby places based on your mood or intent. Just tell us how you feel!**

[Demo](#-demo) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 🎯 What is PlacePulse?

PlacePulse is a modern, intelligent place discovery application that helps users find nearby places based on their **mood** or **intent**. Instead of searching for specific place types, simply describe what you're in the mood for:

- 🍵 *"coffee"* → Finds cafes, coffee shops, bakeries
- 💼 *"work"* → Finds co-working spaces, cafes with wifi, libraries  
- 🌙 *"date night"* → Finds romantic restaurants, bars, theaters
- 🍔 *"quick bite"* → Finds fast food, casual dining, food courts
- 😌 *"chill"* → Finds parks, lounges, bookstores

---

## ✨ Features

### 🔍 Smart Search
- **Mood-Based Discovery** - Natural language search understands your intent
- **Google Places Autocomplete** - Search by actual place names
- **Quick Mood Picks** - One-click preset moods with beautiful gradients
- **Intelligent Mapping** - AI-powered mood-to-place-type algorithm

### 🗺️ Interactive Map
- **Real-Time Markers** - See all results on an interactive Google Map
- **Custom Markers** - Numbered markers with selection highlighting
- **Info Windows** - Quick preview on marker click
- **User Location** - Centered on your current position

### 📋 Rich Results
- **Detailed Cards** - Photos, ratings, distance, price level
- **Opening Hours** - Real-time open/closed status
- **Distance Calculator** - Walking & driving time estimates
- **Filter & Sort** - By rating, distance, price, open now

### 🎨 Beautiful UI/UX
- **Dark/Light Theme** - Toggle with smooth sun/moon animation
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Smooth Animations** - Polished micro-interactions
- **Modern Design System** - Custom design tokens

### 📱 Mobile Optimized
- **List/Map Toggle** - Switch views on mobile
- **Touch Friendly** - Optimized for touch interactions
- **Fast Loading** - Optimized for performance

---

## 🖼️ Screenshots

<div align="center">

| Dark Mode | Light Mode |
|:---------:|:----------:|
| ![Dark Mode](https://via.placeholder.com/400x300/0f172a/60a5fa?text=Dark+Mode) | ![Light Mode](https://via.placeholder.com/400x300/ffffff/3b82f6?text=Light+Mode) |

| Search Autocomplete | Place Details |
|:------------------:|:-------------:|
| ![Search](https://via.placeholder.com/400x300/1e293b/60a5fa?text=Autocomplete) | ![Details](https://via.placeholder.com/400x300/1e293b/60a5fa?text=Place+Details) |

</div>

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Google Cloud Platform** account with billing enabled

### Step 1: Clone the Repository
```bash
git clone https://github.com/Premkumar1845/PlacePulse.git
cd PlacePulse
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Create an API key and restrict it to your domains

### Step 4: Set Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Step 5: Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18.2, Vite 5.0 |
| **Styling** | CSS3 with Design Tokens |
| **Maps** | Google Maps JavaScript API |
| **Places** | Google Places API |
| **State** | React Hooks |
| **Build** | Vite, ESBuild |

---

## 📁 Project Structure

```
PlacePulse/
├── src/
│   ├── components/          # React components
│   │   ├── App/            # Main app component
│   │   ├── Header/         # Header with location & theme
│   │   ├── SearchBar/      # Search with autocomplete
│   │   ├── Map/            # Google Maps integration
│   │   ├── PlacesList/     # Results list
│   │   ├── PlaceCard/      # Individual place card
│   │   ├── PlaceDetails/   # Full place details modal
│   │   ├── Filters/        # Filter & sort controls
│   │   └── ThemeToggle/    # Dark/light mode toggle
│   ├── hooks/              # Custom React hooks
│   │   ├── useGeolocation  # User location tracking
│   │   ├── usePlaces       # Places search logic
│   │   └── useTheme        # Theme management
│   ├── services/           # API services
│   │   ├── mapsLoader.js   # Google Maps loader
│   │   └── placesApi.js    # Places API wrapper
│   ├── utils/              # Utilities
│   │   ├── constants.js    # App constants
│   │   ├── moodMapping.js  # Mood to places mapping
│   │   └── filterSort.js   # Filter/sort logic
│   └── styles/             # Global styles
│       └── tokens.css      # Design tokens
├── .env                    # Environment variables
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

---

## 🎮 Usage

### Basic Search
1. Type a mood like "coffee", "lunch", or "date night"
2. Click a suggestion or press Enter
3. Browse results on the list or map
4. Click a place for more details

### Quick Picks
Click any of the preset mood buttons:
- ☕ **Coffee** - Cafes & coffee shops
- 🍽️ **Lunch** - Restaurants & eateries
- 😌 **Chill** - Relaxed hangout spots
- 💼 **Work** - Productive workspaces
- 🌙 **Date** - Romantic venues
- 🍔 **Quick Bite** - Fast & casual food

### Filters
- **Rating**: 3+, 4+, 4.5+ stars
- **Distance**: 500m, 1km, 2km, 5km
- **Price**: $, $$, $$$, $$$$
- **Open Now**: Currently open places only

---

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |

### API Key Setup
Your Google Cloud API key needs these APIs enabled:
- ✅ Maps JavaScript API
- ✅ Places API  
- ✅ Geocoding API

**Recommended restrictions:**
- HTTP referrers (websites)
- API restrictions (only enabled APIs)

---

## 📦 Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` folder.

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Prem Kumar**
- GitHub: [@Premkumar1845](https://github.com/Premkumar1845)

---

## 🙏 Acknowledgments

- [Google Maps Platform](https://developers.google.com/maps) for the amazing APIs
- [React](https://reactjs.org/) for the UI framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [Prem Kumar](https://github.com/Premkumar1845)

</div>
