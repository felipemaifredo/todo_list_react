import './App.css';
import { useState, useEffect  } from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { CiSquareCheck } from "react-icons/ci";
import { CiSquareRemove } from "react-icons/ci";

function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [task, setTask] = useState({
    taskName: '',
    taskTimeStart: '',
    taskTimeEnd: '',
    taskID: '',
    completed: false, // Certifique-se de que esta propriedade está presente
  });

  useEffect(() => {
    // Carregar tarefas do LocalStorage quando o componente for montado
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    // Atualizar o LocalStorage sempre que as tarefas forem modificadas
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, []);
  
  function createTask({task_name, task_time_start, task_time_end, task_ID, completed}) {
    const currentHour = currentDateTime.getHours();
    const currentMinute = currentDateTime.getMinutes();
    const taskEndHour = parseInt(task_time_end.split(':')[0], 10);
    const taskEndMinute = parseInt(task_time_end.split(':')[1], 10);
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const taskEndTotalMinutes = taskEndHour * 60 + taskEndMinute;


    const isTaskLate = currentTotalMinutes > taskEndTotalMinutes;

    return (
      <div 
        className={`task-box ${completed ? 'completed' : ''} ${isTaskLate ? 'late' : ''}`}
        key={task_ID} id={task_ID}  
      >
        <p className='name-task'> {task_name} </p>
        {task_time_start && <p className='time-task'> {task_time_start} </p>}
        {task_time_end && <p className='time-task'> {task_time_end} </p>}
        <div className='btn-tasks'>
        <button className='btns' onClick={() => handleCompleteToggle(task_ID)}> <FaRegCheckCircle /> </button>
          <button className='btns' onClick={() => handleDelete(task_ID)}> <FaRegTrashAlt /> </button>
        </div>
      </div>
    );
  };

  const handleClick = () => {
    if (!task.taskName) {
      alert('Preencha um nome para a tarefa os campos');
      return;
    }

    if (task.taskTimeStart || task.taskTimeEnd) {
      const newTask = { ...task, taskID: generateID() };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      clearForm();
    } else {
      alert('Preencha um horário de inicio ou término para a tarefa');
      return
    };
  };

  const handleCompleteToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskID === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  
    // Atualizar o LocalStorage
    const updatedTasks = tasks.map((task) =>
      task.taskID === taskId ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDelete = (taskId) => { 
    let confirm = window.confirm("Tem certeza que deseja excluir a tarefa?");
    
    if (confirm) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.taskID !== taskId));
    };
  };

  function generateID() {
    return Math.floor(Math.random() * 3000)
  };

  function clearForm() {
    setTask({
      taskName: '',
      taskTimeStart: '',
      taskTimeEnd: '',
      taskID: '',
    });
  };

  const renderTasks = () => {
    return tasks.map((task) => (
      createTask({
        task_name: task.taskName,
        task_time_start: task.taskTimeStart,
        task_time_end: task.taskTimeEnd,
        task_ID: task.taskID,
        completed: task.completed
      })
    ));
  };

  const handleCompleteAll = () => {
    const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };
  
  const handleClearAllCompleted = () => {
    const updatedTasks = tasks.map((task) => ({ ...task, completed: false }));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
              value={task.taskTimeStart} 
              onChange={(e) => setTask({ ...task, taskTimeStart: e.target.value })} 
            />
            <input className='input-time' type='time' 
              value={task.taskTimeEnd} 
              onChange={(e) => setTask({ ...task, taskTimeEnd: e.target.value })} 
            />
            <button className='btn-action' 
              onClick={handleClick}
            > + </button>
          </div>
          <div className='container-tasks'>
            { renderTasks() }
          </div>
          <div className='btns-container'>
            <button className='btn-action' onClick={handleCompleteAll}> <CiSquareCheck /> </button>
            <button className='btn-action' onClick={handleClearAllCompleted}> <CiSquareRemove /> </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
