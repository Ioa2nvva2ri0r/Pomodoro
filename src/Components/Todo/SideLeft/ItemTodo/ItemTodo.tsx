import React, { useState, useRef, useEffect, useContext } from 'react';
// React Context
import { timerContext } from '../../../../context/timerContext';
// Redux
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { setTodo } from '../../../../redux/slices/dataPomodoroSlice';
// Hooks
import { useClickExept } from '../../../../hooks/useClickExept';
// Utils
import {
  capitalizedString,
  convertInString,
} from '../../../../Utils/js/сonvert';
import { invalidMessage } from '../../../../Utils/react/invalidMessage';
import { colorTheme } from '../../../../Utils/react/activeColor';
// Components
import Icon from '../../../Common/Icon/Icon';
import IconCompleted from '../../../Common/Icon/IconCompleted';
import Dropdown from '../../../Common/Dropdown';
import Modal from '../../../Common/Modal';
// Static-data
import { LISTCONTROL } from '../../../Common/static';
// Style-module
import styles from './itemtodo.module.scss';
// Types
import type { ITodo } from '../../../../redux/slices/types/typesDataPomodoro';
interface IChangeDataTodo {
  name?: string;
  pomodoro?: number;
}

export function ItemTodo(prop: ITodo) {
  const { id, name, pomodoro } = prop;
  // React Context
  const { action } = useContext(timerContext);
  const activeAction = action.active;
  // Redux
  const dispatch = useAppDispatch();
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  const todos = useAppSelector((state) => state.pomodoro.data);
  const changeTodo = (
    method: TMethod,
    { name, pomodoro }: IChangeDataTodo = {}
  ) =>
    dispatch(
      setTodo({
        method,
        data: {
          id,
          name,
          pomodoro,
        },
      })
    );
  // React State
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState('');
  const [valueEdit, setValueEdit] = useState(name);
  // React Ref
  const itemRef = useRef<HTMLLIElement>(null);
  const inputEditRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  // React Effect
  useEffect(() => {
    const item = itemRef.current;
    if (item) setTimeout(() => item?.classList.remove(styles.item__hidden), 10);
  }, [itemRef.current]);
  useEffect(() => inputEditRef.current?.focus(), [edit, inputEditRef.current]);
  useEffect(() => {
    const todoSuccess = todos.filter(({ success }) => success === true)[0];
    if (todoSuccess && todoSuccess.id === id && todoSuccess.pomodoro === 1)
      itemRef.current?.classList.add(styles.item__hidden);
  }, [todos, itemRef.current]);
  // Castom Hook
  useClickExept(inputEditRef.current, () => {
    setEdit(false);
  });
  // Action control
  const handleClickControl = (btnAction: TActionControls) =>
    btnAction === 'increase' || btnAction === 'decrease'
      ? changeTodo('PATCH', {
          pomodoro: btnAction === 'increase' ? pomodoro + 1 : pomodoro - 1,
        })
      : btnAction === 'edit'
      ? setEdit(true)
      : btnAction === 'delete' && setModalOpen(true);

  const editTodo = () => {
    // Message output
    const errorMessage = (message: string) => {
      invalidMessage(messageRef.current, setError, message);
      setValueEdit(name);
      setEdit(false);
    };
    // Validation input
    if (valueEdit === '' || valueEdit.length <= 3)
      return errorMessage('Название задачи не должно быть менее 3-х символов!');
    if (valueEdit !== name && todos.filter((obj) => obj.name === valueEdit)[0])
      return errorMessage('Задача с таким именем уже существует!');
    // Change data
    changeTodo('PATCH', { name: valueEdit });
    setEdit(false);
  };
  const deleteTodo = () => {
    itemRef.current?.classList.add(styles.item__hidden);
    setModalStyle(styles.modal__close);
    setTimeout(() => changeTodo('DELETE'), 400);
  };

  return (
    <>
      <li
        ref={itemRef}
        key={id}
        className={convertInString(styles.item, styles.item__hidden)}
      >
        <span
          className={styles.item__pomodoro}
          role="note"
          children={pomodoro}
        />
        <div className={styles.item__box}>
          {edit ? (
            <div className={styles.input__box}>
              <input
                ref={inputEditRef}
                className={styles.input}
                value={valueEdit}
                onChange={(e) =>
                  setValueEdit(capitalizedString(e.currentTarget.value))
                }
                onBlur={editTodo}
              />
            </div>
          ) : (
            <p className={styles.desc} title={name} children={name} />
          )}
          <p
            ref={messageRef}
            className={convertInString(styles.error, 'error')}
            role="alert"
            children={error}
          />
        </div>
        {(prop.action === 'break' || prop.action === 'break-stop') &&
        pomodoro === 1 ? (
          <div
            className={styles.completed__icon}
            children={<IconCompleted />}
          />
        ) : (
          <Dropdown
            button={
              <button
                className={styles.btn}
                children={
                  <Icon active="controls" size={{ width: 26, height: 6 }} />
                }
              />
            }
            children={
              <ul
                className={styles.dropdown}
                style={{
                  backgroundColor: colorTheme(themeLight ? 100 : 100 - 80),
                }}
              >
                {LISTCONTROL.map((props) => (
                  <li key={props.key} className={styles.dropdown__item}>
                    <button
                      className={styles.dropdown__btn}
                      onClick={() => handleClickControl(props.action)}
                      children={props.children}
                      {...(props.action !== 'delete' && {
                        disabled:
                          (props.action === 'increase' && pomodoro === 5) ||
                          (props.action === 'decrease' && pomodoro === 1) ||
                          (activeAction.START &&
                            (props.action === 'increase' ||
                              props.action === 'decrease' ||
                              props.action === 'edit')),
                      })}
                    />
                  </li>
                ))}
              </ul>
            }
          />
        )}
      </li>
      <Modal
        isOpen={modalOpen}
        setOpen={setModalOpen}
        children={
          <>
            <h2 className={styles.modal__title} children="Удалить задачу?" />
            <button
              className={convertInString(styles.modal__btn, 'us-btn')}
              onClick={deleteTodo}
              children="Удалить"
            />
          </>
        }
        cssClass={{
          main: modalStyle,
          content: styles.modal__content,
        }}
        cssStyle={{
          content: { backgroundColor: colorTheme(themeLight ? 100 : 17) },
        }}
        cancel
      />
    </>
  );
}
