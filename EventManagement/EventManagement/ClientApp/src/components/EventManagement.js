import React, { Component, useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './Styles.module.css';
import authService from './api-authorization/AuthorizeService';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Declare addEvent function here

export const EventManagement = () => {
    const [seen, setSeen] = useState(false);
    const [hostID, setHostID] = useState(null);
    const togglePop = () => {
        setSeen(!seen);
    };

    const addEvent = async (EventToAdd) => {
        const token = await authService.getAccessToken();
        console.log('event came to event managetent', EventToAdd);
        // var object = {};
        //EventToAdd.forEach(function (value, key) {
          //  object[key] = value;});
        //var event = JSON.stringify(object);
        const response = await fetch('Event/createEvent', {
            method: 'post',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(EventToAdd)
        });

        const data = await response.json();

        console.log(response);

       
        // Handle the data as needed, e.g., update state or perform other actions
    };
    const [loadingEvents, setLoading] = useState(false);
    const [Events, setEvents] = useState([]);
   
    

    useEffect(() => {
        populateEvents();
    }, []); // Empty dependency array to mimic componentDidMount

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



        return (
            <div>
                <div className={styles.gridStyle}>
                    {Events.map((Event) => (
                        <div key={Event.EventID} className={styles.tileStyle}>
                            <div className={`container ${styles.EventsContainer}`}>
                                <h5 className={styles.containerTitle}>{Event.title}</h5>
                              
                         
                            {(Event.startDate == null) ? (<p>Date is not set yet</p>) : (
                                <p>On  {(Event.startDate.split('T')[0] == today.toISOString().split('T')[0]) ? ('Today' + '  ' + Event.startDate.split('T')[1].slice(0, 5)) : (Event.startDate.split('T')[0] + ' ' + Event.startDate.split('T')[1].slice(0, 5))}</p>)
                                }
                                {Event.no_Attending == 0 ? (<p>No registrations yet</p>) : (<p className={styles.h3style}>{Event.no_Attending} Registered</p>)}
                            </div>
                                <div class="d-flex p-2 justify-content-between  " >
                                    <button className={`btn btn-info  ${styles.actionButton}`} onclick="handleEdit(Event.EventID)">
                                    Edit
                                </button>
                                    <button className={`btn btn-danger ${styles.actionButton}`} onclick="handleDelete(Event.EventID)">
                                    Cancel 
                                </button>
                       
                            </div>
                        </div>
                    ))}

                </div>
            </div>)

    }

    let Events_view = loadingEvents
        ? <p><em>Loading...</em></p>
        : renderEventsTable(Events);

    return (
        <div className='md-4 '>
            <div class='container d-flex p-3 justify-content-between ' >
                <h1>Planned events</h1>
                <button onClick={togglePop} className={`btn btn-info ${styles.hostButton}`}>
                    Host an Event
                </button>
            </div>
                {seen ? <Popup toggle={togglePop} addEvent={addEvent} hostID={hostID} setHostID={setHostID} /> : null}
            
            <div>{Events_view}</div>
        </div>
    );
}

const Popup = ({ toggle, addEvent,hostID,setHostID }) => {
    const [eventPrivacy, onPrivacyChange] = useState('Public');
    const [eventName, onEventNameChange] = useState( '');
    const [description, onDescriptionChange] = useState('');
    const [startDate, onStartDateChange] = useState(new Date());
    const [endDate, onEndDateChange] = useState(new Date());
    const [startTime, onStartTimeChange] = useState( moment());
    const [endTime, onEndTimeChange] = useState(moment());
    const [location, onLocationChange] = useState( '');
    const [multiDayEvent, onMultiDayEventChange] = useState('');

    
    const handleDateChange = (startDate) => {
        onStartDateChange(startDate);
        onEndDateChange(startDate);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const offsetInMinutes = 330; // UTC+5:30 (5 hours and 30 minutes ahead of UTC)

        // Adjust the date by subtracting the offset (in milliseconds)
        const adjustedDate = new Date(startDate.getTime() + offsetInMinutes * 60000);
        console.log('start Date --------------------------------------', startDate, startDate.toISOString(), adjustedDate.toISOString());
        if (hostID == null) {
            const user =  authService.getUser();
            setHostID(user.name);
        }
        var event_to_add = {

            Title: eventName,
            Description: description,
            StartDate: adjustedDate.toISOString(),
            Location: location,
            hostID: hostID
            
        };

        addEvent(event_to_add);

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
                                    placeholder="Enter Event Title"
                                />
                            </div>
                            <div className="form-group">
                                <label></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={location}
                                    onChange={(e) => onLocationChange(e.target.value)}
                                    placeholder="Enter location"
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


                            <div className=" d-flex p-3 form-content__checkbox-calendar">
                          
                                {multiDayEvent ? (<div>
                                    <DatePicker selected={startDate} onChange={(date) => onStartDateChange(date)} />
                                    <DatePicker selected={endDate} onChange={(date) => onEndDateChange(date)} />
                                </div>
                                ) :
                                    (
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleDateChange}
                                            showTimeSelect
                                            dateFormat="Pp"
                                        />
                                    )
                                }

                            </div>
                            <div>
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className={`btn btn-primary ${styles.hostButton}`}>
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

