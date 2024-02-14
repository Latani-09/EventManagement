import React, { useState, useEffect } from 'react';

import DatePicker from 'react-datepicker'
import moment from 'moment';
import { Form, Button, InputGroup, FormControl, Label } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
const AddEventForm=(props) =>{

    const [eventName, onEventNameChange] = useState(props.event ? props.event.eventName : '');
    const [description, onDescriptionChange] = useState(props.event ? props.event.description : '');
    const [imageUrl, onImageUrlChange] = useState(props.event ? props.event.imageUrl : '');
    const [startDate, onStartDateChange] = useState(new Date());
    const [endDate, onEndDateChange] = useState(new Date());
    const [startTime, onStartTimeChange] = useState(props.event ? moment(props.event.startTime) : moment());
    const [endTime, onEndTimeChange] = useState(props.event ? moment(props.event.endTime) : moment());
    const [location, onLocationChange] = useState(props.event ? props.event.location : '');
    const [fee, onFeeChange] = useState(props.event ? props.event.fee : '');
    const [focusedInput, onFocusedInputChange] = useState(null);
    const [calendarFocused, onCalendarFocusedChange] = useState(false);
    const [error, onErrorChange] = useState('');
    const [toggle, toggler] = useState(false);
    const [image, onImage] = useState();
    const [multiDayEvent, onMultiDayEventChange] = useState('');
    const formData = new FormData();

    const onTitleChange = (e) => {
        onEventNameChange(e.target.value);
    }

    const handleLocationChange = (e) => {
        onLocationChange(e.target.value)
    }
    const handleFeeChange = (e) => {
        const fees = e.target.value;
        if (!fees || fees.match(/^\d{1,}(\.\d{0,2})?$/)) {
            onFeeChange(fees)
        }
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

    const handleEditPicture = () => {
        const fileInput = document.getElementById('imageChange');
        fileInput.click();
    }
    const onImageChange = (e) => {
        onImage(e.target.files[0]);
        const url = URL.createObjectURL(e.target.files[0]);
        onImageUrlChange(url);
        console.log(!!image);

    }

    //for DateRangePicker
    const handleDatesChange = ({ startDate, endDate }) => {
        onStartDateChange(startDate);
        onEndDateChange(endDate);
    }

    const handleMultiFocusChange = (focusedInput) => {
        onFocusedInputChange(focusedInput);
    };

    // for singleDatePicker
    const handleDateChange = (startDate) => {
        onStartDateChange(startDate);
        onEndDateChange(startDate);
    };
    const handleFocusChange = ({ focused }) => {
        onCalendarFocusedChange(focused);
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
        else if (!fee) {
            onErrorChange('Please provide the fee.');
        }

        else {
            onErrorChange('');
            const check = {
                eventName,
                description,
                startDate: startDate.format("LL"),
                endDate: endDate.format("LL"),
                startTime: startTime.format("LT"),
                endTime: endTime.format("LT"),
                fee,
                location
            }
            formData.append('eventName', eventName);
            formData.append('description', description)
            formData.append('startDate', startDate.format("LL"));
            formData.append('endDate', endDate.format("LL"))
            formData.append('startTime', startTime.format("LT"));
            formData.append('endTime', endTime.format("LT"))
            formData.append('fee', fee);
            formData.append('location', location);
            console.log(!!image);
            !!image && formData.append('image', image, image.name);
            console.log(check)
            props.onSubmit(formData);
        }
    }
        return (<div className="form">
            <div className="form-image ">
                {props.event ? <div className="form-image-exist"><img src={imageUrl || props.event.imageUrl} alt='' /></div> : (imageUrl ? <img src={imageUrl} alt="" /> : <img src='images/empty.jpg' alt='' />)}
                <input type="file" hidden="hidden" name="" id="imageChange" onChange={onImageChange} />
                <Button className="btn third" onClick={handleEditPicture}>{props.event ? 'edit image' : "add image"}</Button>
            </div>
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

                            <div className="form-fees">
                                <label>Fees:</label>
                                <div className="form-fees__icon">
                                    <input type="text"
                                        value={fee}
                                        onChange={handleFeeChange}
                                    />
                                    {/* <FontAwesomeIcon className="icon" icon={faRupeeSign} /> */}
                                </div>
                            </div>

                           
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