import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './styles.css';

import TaskContext from '../TaskList/context';

export default function Task({ task }) {
  const ref = useRef();
  const { move, handleStatus } = useContext(TaskContext);
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'TASK', id: task.id, order: task.order },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, dropRef] = useDrop({
    accept: 'TASK',
    hover(item, monitor) {
      if (item.id === task.id) return;
      move(item, task);
    }
  });

  dragRef(dropRef(ref));

  return (
    <div ref={ref} className={isDragging ? 'Task Dragging' : 'Task'}>
      <div>{task.title}</div>
      <span onClick={() => handleStatus(task)}>
        {task.closed ? 'Open' : 'Close'}
      </span>
    </div>
  );
}
