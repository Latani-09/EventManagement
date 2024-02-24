import authService from '../api-authorization/AuthorizeService';


export class EventService {

    async GetEvents() {
        const token = await authService.getAccessToken();
        const response = await fetch('Event', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        return response;
    }


}
const eventService = new EventService();

export default eventService;