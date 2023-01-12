import { createSlice } from '@reduxjs/toolkit';
// Utils
import dataStorage from '../../Utils/js/dataStorage';
// Types
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ISettingСonfig {
  notice: boolean;
  pauseFrequency: number;
  initData: { work: number; pause: { short: number; long: number } };
}
export interface ISettingData extends ISettingСonfig {
  id: 'setting';
  theme: 'light' | 'dark';
}

export const keySetting = 'pomodoro-setting';
export const defaultSetting: ISettingСonfig = {
  notice: true,
  pauseFrequency: 4,
  initData: { work: 1500, pause: { short: 300, long: 900 } },
};

const setting = (
  !localStorage.getItem(keySetting)
    ? dataStorage({
        key: keySetting,
        method: 'POST',
        data: {
          id: 'setting',
          theme: 'light',
          ...defaultSetting,
        },
      })[0]
    : dataStorage({
        key: keySetting,
      })[0]
) as ISettingData;

export const settingPomodoroSlice = createSlice({
  name: 'settingPomodoro',
  initialState: setting,
  reducers: {
    themeChange: (state, action: PayloadAction<boolean>) => {
      const theme = action.payload ? 'dark' : 'light';

      dataStorage({
        key: keySetting,
        method: 'PATCH',
        data: { id: setting.id, theme },
      });

      state.theme = theme;
    },
    setSetting: (state, action: PayloadAction<ISettingСonfig>) => {
      const { notice, pauseFrequency, initData } = action.payload;

      dataStorage({
        key: keySetting,
        method: 'PATCH',
        data: { id: setting.id, pauseFrequency, notice, initData },
      });

      state.notice = notice;
      state.pauseFrequency = pauseFrequency;
      state.initData = initData;
    },
  },
});

export const { themeChange, setSetting } = settingPomodoroSlice.actions;
export default settingPomodoroSlice.reducer;
