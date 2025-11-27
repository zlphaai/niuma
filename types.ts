export interface UserSettings {
  username: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  monthlySalary: number;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export enum WorkStatus {
  NOT_STARTED = 'NOT_STARTED',
  WORKING = 'WORKING',
  FINISHED = 'FINISHED',
}

export interface DailyProgress {
  status: WorkStatus;
  percentage: number;
  timeLeftStr: string;
}