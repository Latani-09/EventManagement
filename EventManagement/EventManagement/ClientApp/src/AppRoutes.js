import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { EventManagement } from "./components/EventManagement";
import { EventDashboard } from "./components/EventDashboard";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
      path: '/EventManagement',
      element: <EventManagement />
  },
  {
    path: '/eventDashboard',
    requireAuth: true,
    element: <EventDashboard />
  },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
