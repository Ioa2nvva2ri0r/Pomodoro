import React, { useState, useRef, useEffect } from 'react';
// Redux
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  setTodo,
  setAddTodoCompleted,
} from '../../../../redux/slices/dataPomodoroSlice';
// Utils
import { convertTime } from '../../../../Utils/js/сonvert';
// Components
import { ItemTodo } from '../ItemTodo';
// Styles-module
import styles from './listtodo.module.scss';

export function ListTodo() {
  // Redux
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.pomodoro.data);
  const completedTodos = useAppSelector(
    (state) => state.pomodoro.dataCompleted
  );
  const allTime = todos.map(
    (o) => o.setTime.work * o.pomodoro - o.passedTime.spent
  );
  // React State
  const [length, setLength] = useState(todos.length);
  // React Ref
  const timeRef = useRef<HTMLTimeElement>(null);
  // React Effect
  useEffect(() => {
    const time = timeRef.current;
    const todoSuccess = todos.filter(({ success }) => success === true)[0];

    if (todoSuccess) {
      dispatch(setAddTodoCompleted({ ...todoSuccess, pomodoro: 1 }));

      if (todoSuccess.pomodoro === 1) {
        time?.classList.add(styles.time__hidden);
        setTimeout(() => {
          time?.classList.remove(styles.time__hidden);
          dispatch(setTodo({ method: 'DELETE', data: { id: todoSuccess.id } }));
        }, 400);
      } else {
        dispatch(
          setTodo({
            method: 'POST',
            data: { ...todoSuccess, pomodoro: todoSuccess.pomodoro - 1 },
          })
        );
        dispatch(setTodo({ method: 'DELETE', data: { id: todoSuccess.id } }));
      }
    }
  }, [todos, timeRef.current]);
  useEffect(() => {
    setLength(todos.length);

    if (todos.length !== 0 && todos.length < length)
      todos.forEach(({ id }, i) =>
        dispatch(
          setTodo({
            method: 'PATCH',
            data: { id, task: (completedTodos.at(-1)?.task || 0) + i + 1 },
          })
        )
      );
  }, [todos.length]);

  return todos.length !== 0 ? (
    <>
      <ol className={styles.list}>
        {todos.map((todo) => (
          <ItemTodo key={todo.id} {...todo} />
        ))}
      </ol>
      <time
        ref={timeRef}
        className={styles.time}
        children={convertTime(allTime.reduce((prev, curr) => prev + curr, 0))}
      />
    </>
  ) : (
    <></>
  );
}
