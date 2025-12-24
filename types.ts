export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}

export interface ProcessingStats {
  fileName: string;
  fileSize: number;
  duration?: number;
}
