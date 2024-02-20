import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { EventManagement } from "./components/EventManagement";
import { EventCalender } from "./components/EventCalender";
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
    path: '/EventCalender',
    requireAuth: true,
    element: <EventCalender />
  },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
