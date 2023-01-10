import { configureStore } from '@reduxjs/toolkit';
// Slices
import pomodoro from './slices/dataPomodoroSlice';
import setting from './slices/settingPomodoroSlice';

export const store = configureStore({
  reducer: { pomodoro, setting },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
