import React, { useState,useEffect } from 'react';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import authService from './api-authorization/AuthorizeService';


export const EventCalender = () =>
{
    
    const [events, setEvent ]= useState([

    ]);
    const [loadingEvents, setLoading] = useState(false);
    const [hostID, setHostID] = useState(null);
    const populateEvents = async () => {
        try {
            setLoading(true);
            const token = await authService.getAccessToken();
            const user = await authService.getUser();
            setHostID(user.name);

            const response = await fetch(`Event/getEvents/${user.name}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            var eventToAdd = { title: '', start: new Date() }
            console.log(eventToAdd.start)
            var events_Array=[]
            if (Array.isArray(data)) {
                data.forEach(function (event) {
                    console.log(event.startDate);
                    var eventToAdd = { title: event.title, start: new Date(event.startDate)}

                    console.log(eventToAdd.start);
                    events_Array.push(eventToAdd);

                })
                setEvent(events_Array);



            }
            else {
                console.error("Invalid data format for Events:", data);
            }
        } catch (error) {
            console.log(error);
        }

    };
    useEffect(() => {
        populateEvents();
    }, []); // Empty dependency array to mimic componentDidMount
    const handleDateClick = (arg) => {
        alert(arg.dateStr)
    }

    return (
        <div>
          
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={events}
                eventContent={renderEventContent}
                dateClick={handleDateClick}
            />
        </div>


    );

    function renderEventContent(eventInfo)
    {

        return (
            <>
                <b>{eventInfo.start}</b>
                <i>{eventInfo.event.title}</i>
                
            </>
        )
    }
}

