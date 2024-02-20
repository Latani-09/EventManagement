import React, { Component,useState,useEffect } from 'react';
import authService from './api-authorization/AuthorizeService';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './eventCalender.module.css';

export const Home=()=> {
    const [loadingEvents, setLoading] = useState(false);
    const[Events, setEvents] = useState([]);
    const[seen, setSeen] = useState(false);

    useEffect(() => {
        populateEvents();
    }, []); // Empty dependency array to mimic componentDidMount

    const populateEvents = async () => {
        try {
            setLoading(true);
            const token = await authService.getAccessToken();
            const response = await fetch('Event', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setEvents(data);
                setLoading(false);
            } else {
                console.error("Invalid data format for Events:", data);
            }
        } catch (error) {
            console.log(error);
        }

    };


    const renderEventsTable = (Events, seen, setSeen) => {


        const togglePop = () => {
            setSeen(!seen);
        };
        let expandedEventId = null;
        const deleteEvent = async (EventId) => {
            try {
                const token = await authService.getAccessToken();
                const response = await fetch(`Event/EventDelete${EventId}`, {
                    method: 'delete',
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    toast.success("Event deleted successfully!");

                    // Optionally, you can update the state or perform other actions after a successful deletion.
                } else {
                    const errorData = await response.json();
                    toast.error(`Error deleting Event: ${errorData.message}`);
                }
            } catch (error) {
                console.error("An error occurred during Event deletion:", error);
                toast.error("An unexpected error occurred while deleting the Event.");
            }
        }
        const handleExpand = (EventId) => {
            expandedEventId = (EventId === expandedEventId ? null : EventId);
        };

        const handleEdit = (EventId) => {
            // Handle edit operation
            console.log(`Edit Event with ID: ${EventId}`);
        };

        const handleDelete = (EventId) => {
            deleteEvent(EventId);

            // Handle delete operation

            console.log(`Delete Event with ID: ${EventId}`);
        };

        let today = new Date();
        const editSymbol = '\u270E'; // Edit symbol
        const deleteSymbol = '\u2716'; // Delete symbol
        const expandSymbol = '\u2193'; // Expand symbol


        return (
            <div>
                <div className={styles.gridStyle}>
                    {Events.map((Event) => (
                        <div key={Event.EventID} className={styles.tileStyle}>
                            <h5 className={styles.h3Style}>{Event.title}</h5>
                            {(Event.startDate==null) ?(<p>Date will be announced soon</p>):(
                                <p>Starting Date: {(Event.startDate.split('T')[0] == today.toISOString().split('T')[0]) ? ('Today' + '  ' + Event.startDate.split('T')[1].slice(0, 5)) : (Event.startDate.split('T')[0] + ' ' + Event.startDate.split('T')[1].slice(0, 5))}</p>) 
                            }
                            <button className={styles.buttonStyle} onClick={() => handleEdit(Event.EventID)}>
                                {editSymbol}
                            </button>
                            <button className={styles.buttonStyle} onClick={() => handleDelete(Event.EventID)}>
                                {deleteSymbol}
                            </button>

                        </div>
                    ))}

                </div>
            </div>)

    }

    let Events_view = loadingEvents
        ? <p><em>Loading...</em></p>
        : renderEventsTable(Events);

    return (
        <div>
            <h1>Upcoming</h1>
            <div>{Events_view}</div>

        </div>
    )

}