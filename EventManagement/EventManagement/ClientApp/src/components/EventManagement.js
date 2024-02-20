import React, { Component, useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup'
import { ToggleButton } from 'react-bootstrap';
import styles from './eventDashboard.module.css';
import authService from './api-authorization/AuthorizeService';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// Declare addEvent function here

export const EventManagement = () => {
    const [seen, setSeen] = useState(false);

    const togglePop = () => {
        setSeen(!seen);
    };
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
            <div>
                <button onClick={togglePop} className={styles.addButtonStyle}>+</button>
                {seen ? <Popup toggle={togglePop} addTask={addEvent} /> : null}
            </div>

        </div>
    );
}

const Popup = ({ toggle, addTask }) => {

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

