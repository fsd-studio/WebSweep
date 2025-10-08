import React, { useState, useEffect } from 'react';

const ChangeMenu = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [editingData, setEditingData] = useState({});
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [menuItems, setMenuItems] = useState([]);

    const fetchRestaurants = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/restaurants');
          const data = await response.json();
          setRestaurants(data);
        } catch (error) {
          console.error('Error:', error);
        }
    };

    const getMenu = async (restaurantId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/menu/${restaurantId}`);
    
            if (!response.ok) {
                alert('Failed to fetch menu');
                return;
            }
    
            const data = await response.json();
            setMenuItems(data);
            console.log(data)
            fetchRestaurants(); // Assuming this refreshes something after menu is set
        } catch (error) {
            console.error('Error fetching menu:', error);
            alert('Error fetching menu');
        }
    };
    

    const updateMenu = async (restaurantId, menu) => {
        try {
            const response = await fetch(`http://localhost:8080/api/menu/${restaurantId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menu),
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

    const handleInputChange = (foodId, field, value) => {
        const key = `${foodId}`;
        setEditingData(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            [field]: value
          }
        }));
    };

    const saveFood = (originalFood) => {
        const key = `${originalFood.id}`;
        const updatedFood = {
            id: originalFood.id,
            name: editingData[key]?.name || originalFood.name,
            description: editingData[key]?.description || originalFood.description,
            price: editingData[key]?.price || originalFood.price
        };
        updateMenu(selectedRestaurant, updatedFood);
    };

    return (
        <div>
            <h1>Menu</h1>

            <div>
                <label>Restaurant: </label>
                <select 
                    value={selectedRestaurant}
                    onChange={(e) => {
                        setSelectedRestaurant(e.target.value);
                        if (e.target.value) {
                            getMenu(e.target.value);
                        }
                    }}
                >
                    <option value="">Select a restaurant</option>
                    {restaurants.map(restaurant => (
                        <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                    ))}
                </select>

                {selectedRestaurant &&
                Array.isArray(menuItems) && menuItems.map(item => (
                    <div key={item.id}>
                      <p><strong>{item.name}</strong></p>
                      <p>{item.description}</p>
                      <p>Price: {item.price}</p>
                    </div>
                  ))}
            </div>
        </div>
    )
}

export default ChangeMenu;