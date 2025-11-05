import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const username = "juanje"; 
  const API_URL = "https://playground.4geeks.com/todo";


  const createUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username }),
      });

      if (res.ok) {
        console.log(`Usuario '${username}' creado.`);
        getTodos();
      } else {
        console.error("❌ Error al crear el usuario");
      }
    } catch (err) {
      console.error("Error de red al crear usuario:", err);
    }
  };

 
  const getTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${username}`);
      if (!res.ok) {
        console.warn("Usuario no encontrado, creando...");
        await createUser();
        return;
      }

      const data = await res.json();
      setTasks(data.todos || []);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
    }
  };

  
  const addTodo = async (label) => {
    try {
      const res = await fetch(`${API_URL}/todos/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          is_done: false,
        }),
      });

      if (res.ok) {
        console.log("✅ Tarea añadida correctamente");
        getTodos(); 
      } else {
        console.error("❌ Error al añadir tarea");
      }
    } catch (err) {
      console.error("Error de red al añadir tarea:", err);
    }
  };

 
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log("🗑️ Tarea eliminada correctamente");
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } else {
        console.error("❌ Error al eliminar tarea");
      }
    } catch (err) {
      console.error("Error de red al eliminar tarea:", err);
    }
  };


  const onInputChange = (e) => setInputValue(e.target.value);

  const handleKeyup = (e) => {
    if (e.key === "Enter") {
      const texto = inputValue.trim();
      if (texto === "") return;
      addTodo(texto);
      setInputValue("");
    }
  };

  
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="container mt-4">
      <label className="form-label" htmlFor="todo">
        Escribe una tarea
      </label>
      <input
        className="form-control mb-3"
        id="todo"
        type="text"
        value={inputValue}
        onChange={onInputChange}
        onKeyUp={handleKeyup}
        placeholder="Pulsa Enter para añadir una tarea"
      />

      {tasks.length === 0 ? (
        <div className="card">
          <div className="card-body text-muted">No hay tareas aún</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {tasks.map((task) => (
            <div key={task.id} className="card" style={{ maxWidth: "720px" }}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <span>{task.label}</span>
                <i
                  className="fa-solid fa-trash text-danger"
                  title="Eliminar tarea"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteTodo(task.id)}
                ></i>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
