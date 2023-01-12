export interface IControlsData {
  name: string;
  setTime: {
    work: number;
    pause: { short: number; long: number };
  };
}
export interface ITodoCountAndPassedTime {
  id: string;
  task: number;
  pomodoro: number;
  passedTime: {
    spent: number;
    pause: number;
  };
  count: {
    stop: number;
    pause: number;
  };
}
export interface IOverallCompletedData {
  id: string;
  dateCreated: string;
  time: {
    work: number;
    spent: number;
    pause: number;
  };
  count: {
    pomodoro: number;
    stop: number;
    pause: number;
  };
}
export interface ITodoCompleted extends ITodoCountAndPassedTime {
  workTime: number;
}
export interface ITodo extends IControlsData, ITodoCountAndPassedTime {
  action: TActionTimer;
  success: boolean;
}
export interface ITodoAllData {
  data: [] | ITodo[];
  dataCompleted: [] | ITodoCompleted[];
  dataOverallCompleted: IOverallCompletedData;
}
