export interface IControlsData {
  name: string;
  setTime: {
    work: number;
    break: { short: number; long: number };
  };
}
export interface ITodoCountAndPassedTime {
  id: string;
  task: number;
  passedTime: {
    spent: number;
    break: number;
  };
  count: {
    stop: number;
    break: number;
  };
}
export interface IOverallCompletedData {
  id: string;
  dateCreated: string;
  time: {
    work: number;
    spent: number;
    break: number;
  };
  count: {
    task: number;
    stop: number;
    break: number;
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
