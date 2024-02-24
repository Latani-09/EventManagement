import React, { useState } from 'react';

import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick


export const EventCalender = () =>
{

    const [eventsSample, setEventSample ]= useState([
        { title: 'Meeting', start: new Date() },
        { title: 'Meeting2', start: new Date() }
    ]);
    const handleDateClick = (arg) => {
        alert(arg.dateStr)
    }

    return (
        <div>
          
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={eventsSample}
                eventContent={renderEventContent}
                dateClick={handleDateClick}


              
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

