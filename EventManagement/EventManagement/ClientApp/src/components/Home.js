import React, { Component, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import authService from './api-authorization/AuthorizeService';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Styles.module.css';
import { Eye } from 'react-bootstrap-icons';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardImageHeader,
    CardText,
    CardTitle,
} from 'react-bootstrap';

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
            /*
            var ID ="f395e13e-c645-40c2-06cd-08dc32404575"
            const response1 = await fetch(`RSVP/${ID}`, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            console.log(response1);
            */
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
        const markAttending = async  (rsvp) => {
            try {
                const token = await authService.getAccessToken();
                const response = await fetch(`RSVP/createRSVP`, {
                    method: 'post',
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(rsvp)
                });

                if (response.ok) {
                    toast.success("event marked as attending");

                    // Optionally, you can update the state or perform other actions after a successful deletion.
                } else {
                    const errorData = await response.json();
                    toast.error(`Error responding Event: ${errorData.message}`);
                }
                const responseEmail = await fetch(`RSVP/sendMail/${rsvp.attendieName}`, {
                    method: 'post',
                    headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(rsvp)
                });
                console.log(responseEmail.json());

            } catch (error) {
                console.error("An error occurred during Event response:", error);
                toast.error("An unexpected error occurred ");
            }
           }
        const handleExpand = (EventId) => {
            expandedEventId = (EventId === expandedEventId ? null : EventId);
        };

        const handleAttend =async  (EventId) => {
            // Handle edit operation
           
                const user =await authService.getUser();
            var hostID = user.name;
            
            var rsvp = {

                eventID: EventId,
                emailID: hostID,
                attendieName: hostID

            };

            markAttending(rsvp);
            console.log(`mark Event with ID: ${EventId}`);
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
        const eyeSymbol ='\uF341';


        return (
            <div>
                <div className={styles.gridStyle}>

                    {Events.map((Event) => (

                        <div key={Event.EventID} className={`${styles.tileStyle} ${styles.eventCard}`}>
                            <button className={styles.viewButton} onClick={() => handleExpand(Event.eventID)}>
                                <Eye />
                            </button>
                            <h6 className= { styles.containerTitle }>{Event.title}</h6>
                            {(Event.Location == null) ? (null) : (<p className={styles.paraStyle}>@{Event.Location}</p>)}
                            {(Event.startDate == null) ? (
                                <p>Date will be announced soon</p>
                            ) : (
                                <div >
                                    {(Event.startDate.split('T')[0] === today.toISOString().split('T')[0]) ? (
                                        <p>{('Today' + '  ' + Event.startDate.split('T')[1].slice(0, 5))}</p>
                                    ) : (
                                        <div>
                                            <p className={styles.paraStyle} >On {Event.startDate.split('T')[0]}</p>
                                                    <p className={styles.paraStyle} >{Event.startDate.split('T')[1].slice(0, 5)} </p>
                                        </div>
                                        )}

                                        
                                        <button className={`btn btn-dark ${styles.registerButton}`} onClick={togglePop} >

                                        Register
                                        </button>
                                        <div>
                                            {seen ? <Popup toggle={togglePop} markAttending={markAttending} eventID={Event.eventID} /> : null}
                                            </div>
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>)

    }

    let Events_view = loadingEvents
        ? <p><em>Loading...</em></p>
        : renderEventsTable(Events,seen,setSeen);

    return (
        <div>
            <div class='container d-flex p-3 justify-content-between ' >
                <h1>Upcoming Events</h1>
            </div>
            <div>{Events_view}</div>

        </div>
    )

}

const Popup = ({ toggle, markAttending, eventID }) => {
    const [attendieName, onNameChange] = useState('');

    const [emailID, onemailIDChange] = useState('');




    const handleSubmit = (e) => {
        e.preventDefault();

      
        var RSVP = {

            eventID: eventID,
            emailID: emailID,
            attendieName: attendieName

        };

        markAttending(RSVP);

        toggle(); // Close the popup after submitting
    };

    return (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Registerk</h5>
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
                                    value={attendieName}
                                    onChange={(e) => onNameChange(e.target.value)}
                                    placeholder="Enter Full Name"
                                />
                            </div>
                            <div className="form-group">
                                <label></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={emailID}
                                    onChange={(e) => onemailIDChange(e.target.value)}
                                    placeholder="Enter email ID"
                                />
                            </div>
                           <div></div>


                            <div className="modal-footer">
                                <button type="submit" className={`btn btn-primary ${styles.hostButton}`} >
                                    Register for event
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
