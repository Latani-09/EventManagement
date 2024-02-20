import React, { useState } from 'react';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';



export const EventCalender = () =>
{

    const [eventsSample, setEventSample ]= useState([
        { title: 'Meeting', start: new Date() },
        { title: 'Meeting2', start: new Date() }
    ]);
 
    return (
        <div>
          
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={eventsSample}
                eventContent={renderEventContent}
              
            />
        </div>


    );

    function renderEventContent(eventInfo)
    {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        )
    }
}

