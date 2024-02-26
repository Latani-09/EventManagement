import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { EventManagement } from "./components/EventManagement";
import { EventCalender } from "./components/EventCalender";
import { RsvpConfirm } from "./components/rsvpConfirm";
import { Home } from "./components/Home";
import { useParams } from 'react-router-dom';




const AppRoutes = [
  {
    index: true,
    element: <Home />
    },
    {
        path: '/rsvpConfirm/:rsvpID',
      
        element: <RsvpConfirm/>
    },
  {
      path: '/EventManagement',
      requireAuth: true,
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
