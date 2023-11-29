import './App.css';
import { useState } from 'react';

function App() {
  const [task, setTask] = useState({
    taskName: '',
    taskTime: '',
    taskID: '',
  });

  const [tasks, setTasks] = useState([]);

  const handleClick = () => {
    if (!task.taskName || !task.taskTime) {
      alert('Preencha todos os campos');
      return;
    }
    const newTask = { ...task, taskID: generateID() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    
    clearForm();
  };
  
  function createTask({task_name, task_time, task_ID}) {
    return (
      <div className='task-box' key={task_ID} id={task_ID}>
        <p className='name-task'> {task_name} </p>
        <p className='time-task'> {task_time} </p>
        <div className='btn-tasks'>
            <button> L </button>
        </div>
      </div>
    )
  }

  function generateID() {
    return Math.floor(Math.random() * 3000)
  }

  function clearForm() {
    setTask({
      taskName: '',
      taskTime: '',
      taskID: '',
    });
  }

  const renderTasks = () => {
    return tasks.map((task) => (
      createTask({
        task_name: task.taskName,
        task_time: task.taskTime,
        task_ID: task.taskID
      })
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className='tasks-container'>
          <div className='box-add-tasks'>
            <input className='input-text' type='text' placeholder='Adicionar uma nova tarefa'
              value={task.taskName} 
              onChange={ (e) => setTask({ ...task, taskName: e.target.value })} 
            />
            <input className='input-time' type='time' 
              value={task.taskTime} 
              onChange={(e) => setTask({ ...task, taskTime: e.target.value })} 
            />
            <button className='btn-action' onClick={handleClick} > + </button>
          </div>
          <div className='container-tasks'>
            { renderTasks() }
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
