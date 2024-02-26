import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './Styles.module.css';
import authService from './api-authorization/AuthorizeService';


 
export const RsvpConfirm = () => {
    const params = useParams();
    console.log('id from params', params.rsvpID);
    var rsvpID = params.rsvpID;
    useEffect(() => {
        confirmAttendance()
    },[])
    const confirmAttendance = async () => {
        
        try {
            const token = await authService.getAccessToken();
            const responseEmail = await fetch(`RSVP/confirmRSVP/${rsvpID}`, {
                method: 'get',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                
            });
            console.log(responseEmail.json());

            if (responseEmail.ok) {
                toast.success("event marked as attending");

                // Optionally, you can update the state or perform other actions after a successful deletion.
            } else {
                const errorData = await responseEmail.json();
                toast.error(`Error responding Event: ${errorData.message}`);
            }


        }
        catch (error) {
            console.error("An error occurred during Event response:", error);
            toast.error("An unexpected error occurred ");
        }
    }
    return (
        <div className='container'>
            <h1>Registration confirmation</h1>
           
            <p> Registration confirmed for the event </p>
         
        </div>
)
}
