import React, { useEffect, useState } from 'react';
import './App.css';

function Form() {
  const [users, setUsers] = useState([]);
  const [dishname, setDishname] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { dishname, ingredients };

    try {
      const res = await fetch(`http://localhost:5000/${editId || ''}`, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      setDishname('');
      setIngredients([]);
      setIngredientInput('');
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = (user) => {
    setDishname(user.dishname);
    setIngredients(user.ingredients);
    setIngredientInput('');
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/${id}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="App">
      <div className="floating-dish dish1"></div>
      <div className="floating-dish dish2"></div>
      <div className="floating-dish dish3"></div>
      <div className="floating-dish dish4"></div>
      <div className="floating-dish dish5"></div>
      <div className="floating-dish dish6"></div>

      <h2>Dish Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={dishname}
          placeholder="Dish name"
          onChange={(e) => setDishname(e.target.value)}
          required
        />

        <div>
          <input
            type="text"
            value={ingredientInput}
            placeholder="Enter ingredient"
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        </div>

        <ul>
          {ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing} <button type="button" onClick={() => handleRemoveIngredient(idx)}>x</button>
            </li>
          ))}
        </ul>

        <button type="submit">
          {editId ? 'Update' : 'Add'} Dish
        </button>
      </form>

      <h3>Dish List</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="dish-card">
            <strong>{user.dishname}</strong>
            <ul>
              {user.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Form;
