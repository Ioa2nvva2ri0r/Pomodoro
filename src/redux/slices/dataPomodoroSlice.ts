import { createSlice } from '@reduxjs/toolkit';
// Id
import { nanoid } from 'nanoid';
// Moment
import moment from 'moment';
// Utils
import dataStorage from '../../Utils/js/dataStorage';
// Setting
import {
  defaultSetting,
  ISettingData,
  keySetting,
} from './settingPomodoroSlice';
// Types
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IOverallCompletedData,
  ITodo,
  ITodoCompleted,
  ITodoAllData,
} from './types/typesDataPomodoro';

// Key LocalStorage
export const keyTodo = 'pomodoro';
const keyTodoCompleted = 'pomodoro-completed';
const keyOverallCompleted = 'pomodoro-overallCompleted';
// Data LocalStorage
const data = dataStorage({ key: keyTodo }) as [] | ITodo[];
const dataCompleted = dataStorage({ key: keyTodoCompleted }) as
  | []
  | ITodoCompleted[];
const defualtDataOverallCompleted = {
  id: 'overall-completed',
  dateCreated: moment().format('YYYY-MM-DD'),
  time: {
    work: 0,
    spent: 0,
    break: 0,
  },
  count: {
    task: 0,
    stop: 0,
    break: 0,
  },
};
const dataOverallCompleted = (
  !localStorage.getItem(keyOverallCompleted)
    ? dataStorage({
        key: keyOverallCompleted,
        method: 'POST',
        data: { ...defualtDataOverallCompleted },
      })[0]
    : dataStorage({
        key: keyOverallCompleted,
      })[0]
) as IOverallCompletedData;

export const initValueTodo = {
  action: 'nothing' as TActionTimer,
  setTime:
    (dataStorage({ key: keySetting })[0] as ISettingData)?.initData ||
    defaultSetting.initData,
  passedTime: {
    spent: 0,
    break: 0,
  },
  count: {
    stop: 0,
    break: 0,
  },
  success: false,
};

export const dataPomodoroSlice = createSlice({
  name: 'dataPomodoro',
  initialState: {
    data,
    dataCompleted,
    dataOverallCompleted,
  } as ITodoAllData,
  reducers: {
    setTodo: (
      state,
      action: PayloadAction<{
        method: TMethod;
        data: { [key in keyof ITodo]?: any };
      }>
    ) => {
      const { method, data } = action.payload;
      const length = state.data.length;
      const lastSuccess = state.dataCompleted.at(-1);

      const newTodo = (): ITodo => ({
        id: nanoid(),
        task:
          lastSuccess && length === 0
            ? (lastSuccess?.task as number) + 1
            : lastSuccess && length !== 0
            ? (state.data.at(-1)?.task as number) + 1
            : !lastSuccess && length === 0
            ? 1
            : length + 1,
        name: data.name,
        ...initValueTodo,
      });

      state.data = dataStorage({
        key: keyTodo,
        method,
        data: method === 'POST' ? newTodo() : data,
      });
    },
    setAddTodoCompleted: (state, action: PayloadAction<ITodo>) => {
      const { id, task, passedTime, setTime, count } = action.payload;

      state.dataCompleted = dataStorage({
        key: keyTodoCompleted,
        method: 'POST',
        data: { id, task, workTime: setTime.work, passedTime, count },
      });

      const arrayCompleted = state.dataCompleted;

      if (arrayCompleted.length !== 0) {
        const finalVal = (val: number[]) => val.reduce((p, c) => p + c, 0);

        state.dataOverallCompleted = dataStorage({
          key: keyOverallCompleted,
          method: 'PATCH',
          data: {
            ...dataOverallCompleted,
            time: {
              work: finalVal(arrayCompleted.map((o) => o.workTime as number)),
              spent: finalVal(arrayCompleted.map((o) => o.passedTime.spent)),
              break: finalVal(arrayCompleted.map((o) => o.passedTime.break)),
            },
            count: {
              task: arrayCompleted.length,
              stop: finalVal(arrayCompleted.map((o) => o.count.stop)),
              break: finalVal(arrayCompleted.map((o) => o.count.break)),
            },
          },
        })[0];
      }
    },
    setDefaultCompletedData: (state) => {
      state.dataCompleted = dataStorage({
        key: keyTodoCompleted,
        method: 'CLEAR',
      });

      state.dataOverallCompleted = dataStorage({
        key: keyOverallCompleted,
        method: 'PUT',
        data: [{ ...defualtDataOverallCompleted }],
      })[0];
    },
  },
});

export const { setTodo, setAddTodoCompleted, setDefaultCompletedData } =
  dataPomodoroSlice.actions;
export default dataPomodoroSlice.reducer;
