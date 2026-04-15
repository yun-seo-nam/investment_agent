# AI Quant Trading & MLOps Terminal

A sophisticated Next.js dashboard combining real-time AI-powered quantitative trading with comprehensive MLOps capabilities for testing and deploying open-source language models.

## Features

### 🚀 Live Trading Interface
- **Advanced Technical Charts**: Real-time candlestick charts with SMA 20/60 indicators and volume analysis
- **ReAct Agent Terminal**: Color-coded trading agent logs with execution latency metrics
- **Real-time Data Feed**: Market news and SEC filings with sentiment analysis
- **Portfolio Monitoring**: Live portfolio value tracking and ticker selection

### 🤖 MLOps Registry
- **Model Deployment Control**: Hot-swap between different LLMs and LoRA/DPO adapters
- **Performance Leaderboard**: Comprehensive backtest results with equity curves
- **Resource Monitoring**: GPU VRAM usage and system performance metrics
- **Model Comparison**: Win rates, Sharpe ratios, and inference time analysis

### 📊 System Monitoring
- **Live System Logs**: Real-time logging with filtering and search capabilities
- **Performance Metrics**: Execution times, memory usage, and request tracking
- **Alert Management**: Error, warning, and success log categorization
- **Export Functionality**: Download logs for analysis and debugging

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for complex data visualization
- **Animations**: Framer Motion for smooth terminal animations
- **Icons**: Lucide React for modern iconography
- **TypeScript**: Full type safety throughout the application

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd investment-agent/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

### Component Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with global styles
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles and animations
├── components/
│   ├── Sidebar.tsx        # Collapsible navigation sidebar
│   ├── Header.tsx         # Top header with portfolio metrics
│   ├── AgentLiveTrading.tsx  # Trading interface with charts and terminal
│   ├── MLOpsLab.tsx       # MLOps deployment and performance tracking
│   └── SystemLogs.tsx     # System monitoring and log viewer
└── lib/
    └── utils.ts           # Utility functions and helpers
```

### Key Features Implementation

#### ReAct Agent Terminal
The terminal displays real-time AI trading decisions with color-coded steps:
- **Thought** (blue): AI reasoning and market analysis
- **Action** (yellow): API calls and data fetching operations
- **Observation** (gray): Market data and analysis results
- **Final Decision** (green): Trade execution commands

#### Technical Analysis Charts
Interactive charts featuring:
- Real-time price updates with smooth animations
- Technical indicators (SMA 20, SMA 60)
- Volume bars with overlay capability
- Responsive design for all screen sizes

#### Model Performance Tracking
Comprehensive MLOps features:
- Live model deployment with progress tracking
- Performance comparison across multiple models
- Equity curve visualization for backtest results
- Resource usage monitoring (GPU, CPU, memory)

## Customization

### Theme Customization
The application uses a custom dark theme defined in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      terminal: {
        bg: '#0a0a0a',
        text: '#00ff00',
        border: '#1a1a1a',
        thought: '#60a5fa',
        action: '#fbbf24',
        observation: '#d1d5db',
        decision: '#34d399',
      }
    }
  }
}
```

### Adding New Models
To add new models to the MLOps registry:
1. Update the `baseModels` array in `MLOpsLab.tsx`
2. Add new adapters to the `adapters` array
3. Update the mock data generation functions

### Extending Chart Features
The chart components use Recharts and can be extended with:
- Additional technical indicators
- Custom tooltips and legends
- Real-time data streaming
- Interactive drawing tools

## Performance Optimizations

- **React.memo**: Used for component optimization
- **Debouncing**: Applied to search and filter functions
- **Virtual Scrolling**: Implemented for large log datasets
- **Lazy Loading**: Charts and components load on demand
- **Animation Performance**: Framer Motion optimized for 60fps

## Mock Data

The application uses realistic mock data to demonstrate:
- Live price movements with volatility patterns
- ReAct agent decision-making processes
- Model performance metrics and backtest results
- System logs with various severity levels

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Component-based architecture

### Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for user workflows
- Performance testing for chart rendering

## Production Deployment

### Build Optimization
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file for production configuration:
```env
NEXT_PUBLIC_API_URL=your-api-endpoint
NEXT_PUBLIC_WS_URL=your-websocket-endpoint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details
