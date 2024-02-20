import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from './api-authorization/AuthorizeService';
import styles from './eventDashboard.module.css';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export const EventDashboard = () => {

    const [seen, setSeen] = useState(false);
    const [Events, setEvents] = useState([]);
    const [loadingEvents, setLoading] = useState(false);

    const [eventsSample, setEventSample ]= useState([
        { title: 'Meeting', start: new Date() },
        { title: 'Meeting2', start: new Date() }
    ]);

 
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

    useEffect(() => {
        populateEvents();
    }, []); // Empty dependency array to mimic componentDidMount

    

    
    const handleAddEvent = (e) => {
        e.preventDefault();
        toast.success("Event added successfully!");

    };

    let Events_view = loadingEvents
        ? <p><em>Loading...</em></p>
        : renderEventsTable(Events,eventsSample);

    return (
        <div>
           
            
            {Events_view}
        </div>
    );
};

// Rest of the code remains the same...

const renderEventsTable = (Events, eventsSample,seen,setSeen) => {
    

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

    const addEvent = async (EventToAdd) => {
        const token = await authService.getAccessToken();
        console.log('event came to event managetent', EventToAdd);
        var object = {};
        EventToAdd.forEach(function (value, key) {
            object[key] = value;
        });
        var event = JSON.stringify(object);
        const response = await fetch('Event/createEvent', {
            method: 'post',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        });

        const data = await response.json();

        console.log(response);


        // Handle the data as needed, e.g., update state or perform other actions
    };
    return (
        <div>
            <div className={styles.gridStyle}>
                {Events.map((Event) => (
                    <div key={Event.EventID} className={styles.tileStyle}>
                        <h5 className={styles.h3Style}>{Event.title}</h5>

                         <p>Starting Date: {(Event.startDate.split('T')[0] == today.toISOString().split('T')[0]) ? ('Today' + '  ' + Event.startDate.split('T')[1].slice(0, 5)) : (Event.startDate.split('T')[0] + ' ' + Event.startDate.split('T')[1].slice(0, 5))}</p>
                  
                        <button className={styles.buttonStyle} onClick={() => handleEdit(Event.EventID)}>
                            {editSymbol}
                        </button>
                        <button className={styles.buttonStyle} onClick={() => handleDelete(Event.EventID)}>
                            {deleteSymbol}
                        </button>

                    </div>
                ))}

            </div>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={eventsSample}
                eventContent={renderEventContent}
              
            />
            {seen ? <Popup toggle={togglePop} addTask={addEvent} /> : null}
        </div>


    );

    function renderEventContent(eventInfo) {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        )
    }
}

const Popup = ({ toggle, addTask }) => {

    const [eventName, onEventNameChange] = useState('');
    const [description, onDescriptionChange] = useState('');
    const [startDate, onStartDateChange] = useState(new Date());
    const [endDate, onEndDateChange] = useState(new Date());
    const [startTime, onStartTimeChange] = useState(moment());
    const [endTime, onEndTimeChange] = useState(moment());
    const [location, onLocationChange] = useState('');
    const [multiDayEvent, onMultiDayEventChange] = useState('');


    const handleDateChange = (startDate) => {
        onStartDateChange(startDate);
        onEndDateChange(startDate);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        var event_to_add = {

            Title: eventName,
            Description: description,
            StartDate: startDate,

        };

        addTask(event_to_add);

        toggle(); // Close the popup after submitting
    };

    return (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Task</h5>
                        <button type="button" className="close" onClick={toggle}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={eventName}
                                    onChange={(e) => onEventNameChange(e.target.value)}
                                    placeholder="Enter task"
                                />
                            </div>
                            <div className="form-group">
                                <label></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => onDescriptionChange(e.target.value)}
                                    placeholder="Enter description"
                                />
                            </div>


                            <div className="form-content__checkbox-calendar">
                                {multiDayEvent ? (<div>
                                    <DatePicker selected={startDate} onChange={(date) => onStartDateChange(date)} />
                                    <DatePicker selected={endDate} onChange={(date) => onEndDateChange(date)} />
                                </div>
                                ) :
                                    (
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => handleDateChange(date)}
                                        />
                                    )
                                }

                            </div>


                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">
                                    Add
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={toggle}>
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
