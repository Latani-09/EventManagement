import authService from '../api-authorization/AuthorizeService';


export class RSVPService {
    async markAttending(rsvp) {
        const token = await authService.getAccessToken();
        const response = await fetch(`RSVP/createRSVP`, {
            method: 'post',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(rsvp)
        }); return response
    }
    async getRSVP(ID) {
        const token = await authService.getAccessToken();
        const response = await fetch(`RSVP/${ID}`, {
            method: 'get',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          
        }); return response
    }

}