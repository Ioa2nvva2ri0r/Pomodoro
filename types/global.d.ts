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
  | 'pauseShort'
  | 'pauseLong'
  | 'pauseFrequency'
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

type TActionTimer = 'nothing' | 'start' | 'break' | 'work-stop' | 'break-stop';
