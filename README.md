# Speech-to-Task Application

A modern web application that converts speech input into actionable tasks, built with React (TypeScript) frontend and Python FastAPI backend.

## Architecture Overview

### Frontend (`/frontend`)
- Built with React and TypeScript
- Component-based architecture:
  - `App.tsx`: Main application container with theme support
  - `Sidebar.tsx`: Navigation and interaction panel
  - `ConfigStatus.tsx`: Configuration status display
  - Theme-aware components with dark/light mode support
- Located in `/frontend/src/`

### Backend (`/backend`)
- Built with Python FastAPI
- RESTful API architecture
- Features:
  - Health check endpoint
  - CORS configuration for frontend communication
  - Configuration-driven setup
- Located in `/backend/`

### Configuration
- Centralized configuration using `config.json` in the root directory
- Shared between frontend and backend
- Configurable ports and other settings

## Getting Started

### Prerequisites
- Node.js and npm for frontend
- Python 3.x for backend
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd speech-to-task
```

2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

## Building on Top of the Application

### Adding New Features

1. **Backend Extensions**
   - Add new endpoints in `backend/main.py`
   - Follow FastAPI's dependency injection pattern
   - Update configuration if needed

2. **Frontend Components**
   - Create new components in `frontend/src/components/`
   - Use TypeScript for type safety
   - Follow existing theme structure for consistent styling

3. **Configuration Changes**
   - Update `config.json` for new settings
   - Ensure both frontend and backend handle new configurations

### Best Practices

1. **Code Organization**
   - Keep components modular and single-responsibility
   - Use TypeScript interfaces for type definitions
   - Follow existing project structure

2. **State Management**
   - Use React hooks for local state
   - Consider Redux/Context for global state
   - Keep configuration in `config.json`

3. **Styling**
   - Use the theme context for consistent styling
   - Follow the existing dark/light mode pattern
   - Use CSS-in-JS with style objects

4. **API Integration**
   - Add new endpoints in FastAPI
   - Use TypeScript interfaces for API responses
   - Handle errors gracefully

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]