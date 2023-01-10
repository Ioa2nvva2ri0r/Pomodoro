import React, { useState, useRef } from 'react';
// Redux
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { setTodo } from '../../../../redux/slices/dataPomodoroSlice';
// Utils
import {
  capitalizedString,
  convertInString,
} from '../../../../Utils/js/сonvert';
import { colorTheme } from '../../../../Utils/react/activeColor';
import { invalidMessage } from '../../../../Utils/react/invalidMessage';
import { preventDefault } from '../../../../Utils/react/preventDefault';
// Style-module
import styles from './createtodo.module.scss';

export function CreateTodo() {
  // Redux
  const dispatch = useAppDispatch();
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  const todos = useAppSelector((state) => state.pomodoro.data);
  // React State
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  // React Ref
  const messageRef = useRef<HTMLParagraphElement>(null);

  const handleSubmit = () => {
    // Message output
    const errorMessage = (message: string) =>
      invalidMessage(messageRef.current, setError, message);
    // Validation form
    if (value === '' || value.length <= 3)
      return errorMessage('Название задачи не должно быть менее 3-х символов!');
    if (todos.filter((obj) => obj.name === value)[0])
      return errorMessage('Задача с таким именем уже существует!');
    // Post data
    dispatch(setTodo({ method: 'POST', data: { name: value } }));
    setValue('');
  };

  return (
    <form className={styles.form} onSubmit={preventDefault(handleSubmit)}>
      <label
        htmlFor="add-todo"
        className={styles.form__label}
        children="Название задачи"
      />
      <input
        id="add-todo"
        className={styles.form__input}
        type="text"
        name="todo"
        placeholder="Название задачи"
        autoComplete="off"
        value={value}
        style={{ backgroundColor: colorTheme(themeLight ? 96 : 30) }}
        onChange={(e) => setValue(capitalizedString(e.currentTarget.value))}
        aria-invalid={error !== '' ? 'true' : 'false'}
      />
      <p ref={messageRef} className="error" role="alert" children={error} />
      <button
        className={convertInString(styles.form__btn, 'us-btn', 'us-btn__run')}
        type="submit"
        children="Добавить"
      />
    </form>
  );
}
