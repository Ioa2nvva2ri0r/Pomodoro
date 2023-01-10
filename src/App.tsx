import React, { useEffect } from 'react';
// Router
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router';
// Redux
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setDefaultCompletedData } from './redux/slices/dataPomodoroSlice';
// API
import axios from 'axios';
// Moment
import moment from 'moment';
import 'moment/locale/ru';
// Utils
import { colorTheme } from './Utils/react/activeColor';
// Components
import { Header } from './Components/Header';
import { Statistics } from './Components/Statistics';
import { Todo } from './Components/Todo';

function App() {
  // .env
  const env = process.env;
  const dispatch = useAppDispatch();
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  const { id, ...dataCompleted } = useAppSelector(
    (state) => state.pomodoro.dataOverallCompleted
  );

  useEffect(() => {
    if (
      moment().format('YYYY-MM-DD') !== dataCompleted.dateCreated &&
      dataCompleted.count.task !== 0
    ) {
      axios(env.REACT_APP__CASE_REPOSITORY_PATH as string, {
        method: 'POST',
        data: { ...dataCompleted },
      });
      dispatch(setDefaultCompletedData());
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = colorTheme(
      themeLight ? 100 : 100 - 80
    );
    document.body.style.color = colorTheme(themeLight ? 100 - 80 : 100);
  }, [themeLight]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              {new URLSearchParams(useLocation().search).get('p') ? (
                <Statistics />
              ) : (
                <Todo />
              )}
            </main>
          }
        />
      </Routes>
    </>
  );
}

export default App;
