import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Timelog.css';

function Timelog() {
  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState('');
  const [timelogEntries, setTimelogEntries] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [entryMode, setEntryMode] = useState('manual');

  useEffect(() => {
    if (timerRunning) {
      const timer = setInterval(() => {
        setStopTime(new Date());
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [timerRunning]);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
    setStartTime(new Date());
    setStopTime(null);
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
    addEntry();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (entryMode === 'timer' && timerRunning) {
      handleStopTimer();
    } else {
      addEntry();
    }
  };

  const addEntry = () => {
    const start = entryMode === 'timer' ? startTime : parseTime(startTime);
    const stop = entryMode === 'timer' ? stopTime : parseTime(stopTime);
    const duration = calculateDuration(start, stop);

    const entry = {
      projectName,
      date: date ? date.toLocaleDateString() : new Date().toLocaleDateString(),
      description,
      startTime: formatTime(start),
      stopTime: formatTime(stop),
      duration,
    };

    setTimelogEntries((prevEntries) => [...prevEntries, entry]);
    setProjectName('');
    setDate(null);
    setDescription('');
    setStartTime(null);
    setStopTime(null);
  };

  const calculateDuration = (start, stop) => {
    if (!start || !stop) {
      return '';
    }

    const durationInMs = stop - start;
    const hours = Math.floor(durationInMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (time) => {
    if (!time) {
      return '';
    }

    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const parseTime = (timeString) => {
    if (!timeString) {
      return null;
    }

    const [hours, minutes] = timeString.split(':');
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  };

  const handleEntryModeChange = (event) => {
    setEntryMode(event.target.value);
  };

  const sortedEntries = timelogEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="timelog-container">
      <form onSubmit={handleSubmit}>
        <div className="entry-mode-container">
          <label>
            <input
              type="radio"
              value="manual"
              checked={entryMode === 'manual'}
              onChange={handleEntryModeChange}
            />
            Manual Entry
          </label>
          <label>
            <input
              type="radio"
              value="timer"
              checked={entryMode === 'timer'}
              onChange={handleEntryModeChange}
            />
            Timer
          </label>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Project Name:</label>
            <input
              type="text"
              value={projectName}
              onChange={handleProjectNameChange}
              required
            />
          </div>
          {entryMode === 'manual' && (
            <div className="form-field">
              <label>Date:</label>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
              />
            </div>
          )}
          <div className="form-field">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              required
            ></textarea>
          </div>
        </div>
        {entryMode === 'timer' && !timerRunning && (
          <div className="form-row">
            <button className="start-timer-btn" onClick={handleStartTimer}>
              Start Timer
            </button>
          </div>
        )}
        {entryMode === 'timer' && timerRunning && (
          <div className="form-row">
            <button className="stop-timer-btn" onClick={handleStopTimer}>
              Stop Timer
            </button>
          </div>
        )}
        {entryMode === 'manual' && (
          <div className="form-row">
            <div className="form-field">
              <label>Start Time:</label>
              <input
                type="time"
                value={startTime || ''}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Stop Time:</label>
              <input
                type="time"
                value={stopTime || ''}
                onChange={(e) => setStopTime(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        <div className="form-row">
          <button type="submit" className="submit-btn">
            {entryMode === 'timer' && timerRunning ? 'Stop Timer & Add Entry' : 'Add Entry'}
          </button>
        </div>
      </form>
      <table className="timelog-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>Stop Time</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Project Name</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.startTime}</td>
              <td>{entry.stopTime}</td>
              <td>{entry.description}</td>
              <td>{entry.duration}</td>
              <td>{entry.projectName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timelog;
