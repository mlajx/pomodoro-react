import React, { memo, useState, useEffect } from 'react';
import produce from 'immer';
import TaskContext from './context';
import Task from '../Task';
import TypeSelect from '../../TypeSelect';

import './styles.css';

const TaskList = ({ selectedTaskType }) => {
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState(false);
  const taskStatus = [
    { name: 'All', value: -1 },
    { name: 'Open', value: false },
    { name: 'Closed', value: true }
  ];

  const [tasks, setTasks] = useState(
    JSON.parse(window.localStorage.getItem('pomodoro-react-tasks')) || []
  );
  const [selectedStatus, setSelectedStatus] = useState(taskStatus[0]);

  useEffect(() => {
    window.localStorage.setItem('pomodoro-react-tasks', JSON.stringify(tasks));
  }, [tasks]);

  function move(from, to) {
    setTasks(
      produce(tasks, draft => {
        const fromIndex = draft.findIndex(item => item.id === from.id);
        const toIndex = draft.findIndex(item => item.id === to.id);
        const draftFrom = draft[fromIndex];
        const draftTo = draft[toIndex];
        
        const orderFromFlag = draftFrom.order;
        draftFrom.order = draftTo.order;
        draftTo.order = orderFromFlag;
      })
    );
  }

  function handleInput(e) {
    setInputError(false);    
    setInput(e.target.value);
  }
  
  function handleStatus(task) {
    setTasks(
      produce(tasks, draft => {
        const foundIndex = draft.findIndex(item => item.id === task.id);
        draft[foundIndex].closed = !draft[foundIndex].closed;
      })
    );
  }

  function addTask() {
    if (!input.length) {
      setInputError(true);
      return;
    }
    
    setTasks(
      produce(tasks, draft => {
        draft.push({id: draft.length + 1, title: input, closed: false, order: tasks.length + 1});
      })
    );
    setInput('');
  }

  return (
    <TaskContext.Provider value={{ tasks, move, handleStatus }}>
      <TypeSelect
        types={taskStatus}
        selected={selectedStatus}
        changeType={setSelectedStatus}
      />
      <div className="Tasks">
        <div className="Tasks-box">
          {tasks.length > 0 ? (
            tasks
              .filter(
                task =>
                  task.closed === selectedStatus.value ||
                  selectedStatus.value === -1
              )
              .sort((a, b) => a.order > b.order)
              .map((task) => (
                <Task key={task.id} task={task} />
              ))
          ) : (
            <div className="Task">No Tasks</div>
          )}
        </div>
      </div>
      <div className="Task">
        <input
          value={input}
          onChange={handleInput}
          placeholder="New Task"
        />
        <span onClick={addTask}>{'Add'}</span>
      </div>
      {inputError ? (
        <div className="Task-error">
          <p>Please, enter a task name before to add.</p>
        </div>
      ) : (<div/>)}
    </TaskContext.Provider>
  );
};

export default memo(TaskList);
