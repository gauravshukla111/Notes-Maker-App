import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {doc, getDoc, onSnapshot, updateDoc, setDoc,} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "materialize-css/dist/css/materialize.min.css";

function TaskTaker({ user }) {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const docRef = doc(db, "tasks", user.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setTasks(docSnap.data().tasks || []);
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const addTask = async () => {
    if (!taskText.trim()) {
      console.error("Task text cannot be empty.");
      return;
    }

    try {
      const docRef = doc(db, "tasks", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          tasks: [...docSnap.data().tasks, taskText],
          updatedAt: new Date(),
        });
      } else {
        await setDoc(docRef, {
          tasks: [taskText],
          createdAt: new Date(),
        });
      }

      setTaskText("");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const deleteTask = async (taskToDelete) => {
    try {
      const docRef = doc(db, "tasks", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const updatedTasks = docSnap
          .data()
          .tasks.filter((task) => task !== taskToDelete);

        await updateDoc(docRef, {
          tasks: updatedTasks,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const updateTask = async () => {
    if (editIndex === null || !editText.trim()) {
      console.error("Task text cannot be empty or invalid edit index.");
      return;
    }

    try {
      const docRef = doc(db, "tasks", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const updatedTasks = [...docSnap.data().tasks];
        updatedTasks[editIndex] = editText;

        await updateDoc(docRef, {
          tasks: updatedTasks,
          updatedAt: new Date(),
        });

        setEditIndex(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="center-align">Task Manager</h1>

      <div className="row">
        <div className="input-field col s8 offset-s2">
          <input
            type="text"
            id="taskInput"
            placeholder="Enter a task"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light green"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s8 offset-s2">
          <input
            type="text"
            id="filterInput"
            placeholder="Filter tasks"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      <ul className="collection">
        {filteredTasks.map((task, index) => (
          <li className="collection-item" key={index}>
            {editIndex === index ? (
              <div>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  className="btn waves-effect waves-light blue"
                  onClick={updateTask}
                >
                  Save
                </button>
                <button
                  className="btn waves-effect waves-light grey"
                  onClick={() => setEditIndex(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <span>{task}</span>
                <button
                  className="btn-floating btn-small red right"
                  onClick={() => deleteTask(task)}
                >
                  <i className="material-icons">delete</i>
                </button>
                <button
                  className="btn-floating btn-small blue right"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    setEditIndex(index);
                    setEditText(task);
                  }}
                >
                  <i className="material-icons">edit</i>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskTaker;

