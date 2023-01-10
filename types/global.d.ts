declare module '*.module.scss';
declare module '*.mp3';
declare module '*.svg';

type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'CLEAR';

type TSize =
  | number
  | {
      width: number;
      height: number;
    };

type TSetting =
  | 'work'
  | 'breakShort'
  | 'breakLong'
  | 'breakFrequency'
  | 'notice';

type TActionControls = 'increase' | 'decrease' | 'edit' | 'delete';

type TIconName =
  | 'statistics'
  | 'controls'
  | 'add'
  | 'close'
  | 'arrow'
  | 'sun'
  | 'moon'
  | 'setting'
  | 'stops'
  | 'focus'
  | 'timePause'
  | 'checkbox'
  | TActionControls;

type TActiveWeek = 'thisWeek' | 'lastWeek' | 'twoWeeksAgo';
type TActiveDay =
  | 'Понедельник'
  | 'Вторник'
  | 'Среда'
  | 'Четверг'
  | 'Пятница'
  | 'Суббота'
  | 'Воскресенье';

type TActionTimer =
  | 'nothing'
  | 'start'
  | 'stop'
  | 'next'
  | 'pause-work'
  | 'break-work'
  | 'pause-success'
  | 'break-success';
