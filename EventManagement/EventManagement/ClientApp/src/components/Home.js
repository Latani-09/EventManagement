import React, { Component, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import authService from './api-authorization/AuthorizeService';
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Styles.module.css';
import { Eye } from 'react-bootstrap-icons';

const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export const Home=()=> {
    const [loadingEvents, setLoading] = useState(false);
    const[Events, setEvents] = useState([]);
    const [seen, setSeen] = useState(false);
    const [eventIDReg, setID] = useState('');
    const [eventTitle, setTitle] = useState("");
   

    useEffect(() => {
        populateEvents();
    }, []);

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
      
        console.log(Events)
        const togglePop = () => {
            setSeen(!seen);
           
        };
        
        const markAttending = async  (rsvp) => {
            try {
                const token = await authService.getAccessToken();
                const responseEmail = await fetch(`RSVP/sendMail`, {
                    method: 'post',
                    headers: !token ? { 'Content-Type': 'application/json' } : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(rsvp)
                });
                const result = await responseEmail.json();

                if (responseEmail.ok) {
                    toast.success("Check mail inbox for Confirmation mail!");
                } else if (result.message=='duplicateRSVP') {
                    toast.error('already registered this event with this email Id'); // e.g., duplicateRSVP
                }


            } catch (error) {
                
                //toast.error(`Error responding Event: ${error}`);
                console.error("An error occurred during Event response:", error);
               
                toast.error("Oops something happened try again to Register ")
               // toast.error("An unexpected error occurred ");
            }
        }


        
        const handleAttend = async (eventID, title) => {

            // Handle edit operation
            togglePop()
            setID(eventID);
            setTitle(title);
                
            console.log(`mark Event with ID: ${eventID}`);
        };
        
       

        let today = new Date();



        return (
            <div>
                <div className={styles.gridStyle}>

                    {Events.map((Event) => (

                        <div key={Event.eventID} className={`${styles.tileStyle} ${styles.eventCard}`}>

                            <h6 className= { styles.containerTitle }>{Event.title}</h6>
                            {(Event.startDate == null) ? (
                                <p>Date will be announced soon</p>
                            ) : (
                                <div >
                                        {(Event.startDate.split('T')[0] === today.toISOString().split('T')[0]) ? (
                                        <div>
                                                <p className={styles.paraStyle}>Today</p>
                                                <p className={styles.paraStyle}>{( Event.startDate.split('T')[1].slice(0, 5))}</p>
                                        </div>
                                    ) : (
                                        <div>
                                                    <p className={styles.paraStyle} >On {Event.startDate.split('T')[0]}</p>
                                                    <p className={styles.paraStyle} >{Event.startDate.split('T')[1].slice(0, 5)} </p>
                                        </div>
                                        )}
                                        {(Event.location == null) ? (null) : (<p className={styles.paraStyle}>@{Event.location}</p>)}

                                        {Event.foodServed ? (<div className={styles.paraStyle} >Food will be served</div>) : (null)}
                                        
                                        <button className={`btn btn-dark ${styles.registerButton}`} onClick={() => handleAttend(Event.eventID, Event.title)} >

                                        Register
                                        </button>
                                        <div>
                                            {seen ? <Popup toggle={togglePop} markAttending={markAttending} id={eventIDReg} title={eventTitle} /> : null}
                                            </div>
                                </div>
                            )}
                        </div>
                    ))}

                </div>
                <ToastContainer />
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

const Popup = ({ toggle, markAttending, id, title}) => {
    const [attendieName, onNameChange] = useState('');

    const [emailID, onemailIDChange] = useState('');
    const [errors, setErrors] = useState({});
 
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("event Registering", id);

    
       const errors = {};

        if (!isEmail(emailID)) {
            errors.email = "Enter valid email";


            setErrors(errors);

            if (!Object.keys(errors).length) {
                alert(JSON.stringify(emailID, null, 2));
            }
        }
        else {
        var RSVP = {

            eventID: id,
            emailID: emailID,
            attendieName: attendieName

        };
        markAttending(RSVP);

            toggle(); // Close the popup after submitting
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Register as a participant</h5>
                        <button type="button" className="close" onClick={toggle}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Form onSubmit={handleSubmit}>
                            <h5>{title}</h5>
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
                                {Object.entries(errors).map(([key, error]) => (
                                    <span
                                        key={`${key}: ${error}`}
                                        style={{
                                            fontWeight: "bold",
                                            color: "red"
                                        }}
                                    >
                                        {key}: {error}
                                    </span>
                                ))}
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
