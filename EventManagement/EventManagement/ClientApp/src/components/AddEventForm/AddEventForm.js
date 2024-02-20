import React, { useState, useEffect } from 'react';

import DatePicker from 'react-datepicker'
import moment from 'moment';
import { Form, Button, InputGroup, FormControl, Label } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
const AddEventForm=(props) =>{
    
    const [eventName, onEventNameChange] = useState(props.event ? props.event.eventName : '');
    const [description, onDescriptionChange] = useState(props.event ? props.event.description : '');
    const [startDate, onStartDateChange] = useState(new Date());
    const [endDate, onEndDateChange] = useState(new Date());
    const [startTime, onStartTimeChange] = useState(props.event ? moment(props.event.startTime) : moment());
    const [endTime, onEndTimeChange] = useState(props.event ? moment(props.event.endTime) : moment());
    const [location, onLocationChange] = useState(props.event ? props.event.location : '');
    const [multiDayEvent, onMultiDayEventChange] = useState('');
    const formData = new FormData();
    const [error, onErrorChange] = useState('');
    console.log('intialized form data', formData);

    const onTitleChange = (e) => {
        onEventNameChange(e.target.value);
    }

    const handleLocationChange = (e) => {
        onLocationChange(e.target.value)
    }


    const handleDescriptionChange = (e) => {
        const description = e.target.value;
        onDescriptionChange(description);
    }

    const handleStartTimeChange = startTime => {
        onStartTimeChange(startTime);
        console.log(startTime);
    };

    const handleEndTimeChange = endTime => {
        onEndTimeChange(endTime);
        console.log(endTime);

    };




    //for DateRangePicker
    const handleDatesChange = ({ startDate, endDate }) => {
        onStartDateChange(startDate);
        onEndDateChange(endDate);
    }
    
    // for singleDatePicker
    const handleDateChange = (startDate) => {
        onStartDateChange(startDate);
        onEndDateChange(startDate);
    };

    const isMultiDayEvent = () => {
        onMultiDayEventChange(!multiDayEvent);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (!eventName) {
            onErrorChange('Please provide the Event name.');
        }
        else if (!description) {
            onErrorChange('Please provide the description.');
        }
        else if (!location) {
            onErrorChange('Please provide the venue.');
        }


        else {
            onErrorChange('');
            const check = {
                eventName,
                description,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                        location
            }
            console.log('event daya from add data' ,eventName)
            formData.append('Title', eventName);
            formData.append('Description', description)
   

          
            formData.append('Location', location);
            for (const key of formData.keys()) {
                console.log(key);
            }
            for (const value of formData.values()) {
                console.log(value);
            }

            console.log('form data from add event component', formData);
            props.onSubmit(formData);
        }
        
    }
        return (<div className="form">

            <Form action="" onSubmit={onSubmit}>
                {error && <p className="form__error">{error}</p>}
                <div className="form-content__main">
                    <FormControl
                        type="text"
                        placeholder="Enter the title here"
                        className="form-title"
                        value={eventName}
                        onChange={onTitleChange}
                    />
                    <FormControl
                        as="textarea"
                        placeholder="A description for your event"
                        className="form-description"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <div className="form-content__others">
                        <div className="form-content__others-others">
                            <FormControl
                                type="text"
                                placeholder="Venue"
                                className="form-venue"
                                value={location}
                                onChange={handleLocationChange}
                            />

                        </div>
                        <div InputGroup>
                           
                            <Form.Check
                                type="checkbox"
                                label="Multi-day Event?"
                                onClick={isMultiDayEvent}
                            />
                            <div className="form-content__checkbox-calendar">
                                {multiDayEvent ? (<div>
                                    <DatePicker selected={startDate} onChange={(date) => onStartDateChange(date)}/>
                                    <DatePicker selected={endDate} onChange={(date) => onEndDateChange(date)} />
                                        </div>
                                        ):
                                    (
                                        <DatePicker
                                                selected={startDate}
                                                onChange={(date) => handleDateChange(date)}
                                        />
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="button button-primary button-submit">Post</Button>

                </div>
            </Form>
        </div>);
    
}
export default AddEventForm;