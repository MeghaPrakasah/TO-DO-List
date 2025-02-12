import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS
import "./styles.css"; // Import Custom CSS

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Function to add a new task with validation
  const addTask = () => {
    const trimmedTask = newTask.trim();
    if (!trimmedTask) {
      setError("Task cannot be empty!");
      return;
    }
    setError("");

    axios.post("http://localhost:5000/api/tasks", { text: trimmedTask })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask("");
        toast.success("Task added successfully!"); // Show toast message
      })
      .catch((err) => console.log(err));
  };

  // Function to delete a task
  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
        toast.error("Task deleted successfully!"); // Show toast message
      })
      .catch(err => console.log(err));
  };

  // Function to start editing a task
  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditedText(task.text);
  };

  // Function to update a task with validation
  const updateTask = (id) => {
    const trimmedText = editedText.trim();
    if (!trimmedText) {
      setError("Edited task cannot be empty!");
      return;
    }
    setError("");

    axios.put(`http://localhost:5000/api/tasks/${id}`, { text: trimmedText })
      .then((res) => {
        setTasks(tasks.map(task => task._id === id ? res.data : task));
        setEditingTask(null);
        toast.info("Task updated successfully!"); // Show toast message
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>

      {/* Input Field for New Task */}
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a new task..."
      />
      <button className="add" onClick={addTask}>Add Task</button>

      {/* Display Validation Error */}
      {error && <p className="error-message">{error}</p>}

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={editingTask === task._id ? "editing" : ""}>
            {editingTask === task._id ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button className="save" onClick={() => updateTask(task._id)}>Save</button>
                <button className="cancel" onClick={() => setEditingTask(null)}>Cancel</button>
              </>
            ) : (
              <>
                {task.text}
                <button className="edit" onClick={() => startEditing(task)}>Edit</button>
                <button className="remove" onClick={() => deleteTask(task._id)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Toast Notification Component */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
