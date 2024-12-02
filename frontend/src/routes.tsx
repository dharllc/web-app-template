// File: frontend/src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SessionView from './components/SessionView';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <SessionView sessionId={null} />
      },
      {
        path: "/sessions/:sessionId",
        element: <SessionView />
      }
    ]
  }
]);