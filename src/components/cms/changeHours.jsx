import React, { useState, useEffect } from 'react';

const ChangeHours = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [editingData, setEditingData] = useState({});

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateOpeningHour = async (restaurantId, openingHour) => {
    try {
      const response = await fetch(`http://localhost:8080/api/openings/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(openingHour),
      });
      
      if (response.ok) {
        alert('Updated successfully!');
        fetchRestaurants();
      } else {
        alert('Failed to update');
      }
    } catch (error) {
      alert('Error updating');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleInputChange = (restaurantId, hourId, field, value) => {
    const key = `${restaurantId}-${hourId}`;
    setEditingData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const saveHour = (restaurantId, originalHour) => {
    const key = `${restaurantId}-${originalHour.id}`;
    const updatedHour = {
      id: originalHour.id,
      day: editingData[key]?.day || originalHour.day,
      open: editingData[key]?.open || originalHour.open,
      close: editingData[key]?.close || originalHour.close
    };
    updateOpeningHour(restaurantId, updatedHour);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Opening Hours</h1>
      
      {restaurants.map(restaurant => (
        <div key={restaurant.id} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
          <h2>{restaurant.name || `Restaurant ${restaurant.id}`}</h2>
          
          {restaurant.openingsHours?.map(hour => {
            const key = `${restaurant.id}-${hour.id}`;
            return (
              <div key={hour.id} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5' }}>
                
                <div style={{ margin: '10px 0' }}>
                  <label>Day: </label>
                  <select 
                    value={editingData[key]?.day || hour.day}
                    onChange={(e) => handleInputChange(restaurant.id, hour.id, 'day', e.target.value)}
                  >
                    <option value="MONDAY">Monday</option>
                    <option value="TUESDAY">Tuesday</option>
                    <option value="WEDNESDAY">Wednesday</option>
                    <option value="THURSDAY">Thursday</option>
                    <option value="FRIDAY">Friday</option>
                    <option value="SATURDAY">Saturday</option>
                    <option value="SUNDAY">Sunday</option>
                  </select>
                </div>
                
                <div style={{ margin: '10px 0' }}>
                  <label>Open: </label>
                  <input 
                    type="time"
                    value={editingData[key]?.open || hour.open || ''}
                    onChange={(e) => handleInputChange(restaurant.id, hour.id, 'open', e.target.value)}
                  />
                </div>
                
                <div style={{ margin: '10px 0' }}>
                  <label>Close: </label>
                  <input 
                    type="time"
                    value={editingData[key]?.close || hour.close || ''}
                    onChange={(e) => handleInputChange(restaurant.id, hour.id, 'close', e.target.value)}
                  />
                </div>
                
                <button onClick={() => saveHour(restaurant.id, hour)}>
                  Save
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChangeHours;