import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Timelog.css';

function Timelog() {
  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [timelogEntries, setTimelogEntries] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualStopTime, setManualStopTime] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

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

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
    setStartTime(new Date());
    setStopTime(null);
    setManualStartTime('');
    setManualStopTime('');
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
    addEntry();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (timerRunning) {
      handleStopTimer();
    } else {
      addEntry();
    }
  };

  const addEntry = () => {
    const start = timerRunning ? startTime : parseTime(manualStartTime);
    const stop = timerRunning ? stopTime : parseTime(manualStopTime);
    const duration = calculateDuration(start, stop);

    const entry = {
      projectName,
      date: date ? date.toLocaleDateString() : new Date().toLocaleDateString(),
      description,
      summary,
      startTime: formatTime(start),
      stopTime: formatTime(stop),
      duration,
    };

    setTimelogEntries((prevEntries) => [...prevEntries, entry]);
    setProjectName('');
    setDate(null);
    setDescription('');
    setSummary('');
    setStartTime(null);
    setStopTime(null);
    setManualStartTime('');
    setManualStopTime('');
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
    const [hours, minutes] = timeString.split(':');
    const currentDate = new Date();
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filterEntries = () => {
    let filteredEntries = [...timelogEntries];

    if (fromDate) {
      filteredEntries = filteredEntries.filter(
        (entry) => new Date(entry.date) >= new Date(fromDate.setHours(0, 0, 0, 0))
      );
    }

    if (toDate) {
      filteredEntries = filteredEntries.filter(
        (entry) => new Date(entry.date) <= new Date(toDate.setHours(23, 59, 59, 999))
      );
    }

    return filteredEntries;
  };

  const parseDuration = (duration) => {
    const [hours, minutes] = duration.split('h ');
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const renderTimer = () => {
    if (timerRunning) {
      return (
        <div className="timer-container">
          <span>{formatTime(startTime)}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="timelog-container">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Project Name:</label>
          <input type="text" value={projectName} onChange={handleProjectNameChange} required />
        </div>
        {timerRunning ? (
          renderTimer()
        ) : (
          <div className="form-row">
            <div className="form-column">
              <label>Date:</label>
              <DatePicker selected={date} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
            </div>
            <div className="form-column">
              <label>Manual Start Time:</label>
              <input
                type="time"
                value={manualStartTime}
                onChange={(e) => setManualStartTime(e.target.value)}
                required={!timerRunning}
              />
            </div>
            <div className="form-column">
              <label>Manual Stop Time:</label>
              <input
                type="time"
                value={manualStopTime}
                onChange={(e) => setManualStopTime(e.target.value)}
                required={!timerRunning}
              />
            </div>
          </div>
        )}
        <div className="form-row">
          {timerRunning ? (
            <button type="button" onClick={handleStopTimer} disabled={!timerRunning}>
              Stop Timer
            </button>
          ) : (
            <button type="button" onClick={handleStartTimer}>
              Start Timer
            </button>
          )}
          <button type="submit">{timerRunning ? 'Stop Timer & Add Entry' : 'Add Entry'}</button>
        </div>
        <div className="form-row">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="form-row">
          <label>Summary:</label>
          <textarea value={summary} onChange={handleSummaryChange} placeholder="Enter summary" required />
        </div>
      </form>
      <div className="filter-row">
        <label>From Date:</label>
        <DatePicker selected={fromDate} onChange={setFromDate} dateFormat="dd/MM/yyyy" />
        <label>To Date:</label>
        <DatePicker selected={toDate} onChange={setToDate} dateFormat="dd/MM/yyyy" />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('projectName')}>
              Project Name {sortField === 'projectName' && sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('date')}>
              Date {sortField === 'date' && sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('startTime')}>
              Start Time {sortField === 'startTime' && sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('stopTime')}>
              Stop Time {sortField === 'stopTime' && sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('duration')}>
              Duration {sortField === 'duration' && sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th>Description</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {filterEntries()
            .sort((a, b) => {
              const aValue = a[sortField];
              const bValue = b[sortField];
              return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            })
            .map((entry, index) => (
              <tr key={index}>
                <td>{entry.projectName}</td>
                <td>{entry.date}</td>
                <td>{entry.startTime}</td>
                <td>{entry.stopTime}</td>
                <td>{entry.duration}</td>
                <td>{entry.description}</td>
                <td>{entry.summary}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timelog;
