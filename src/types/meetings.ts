import type { User } from './user';
import { Timestamp } from 'firebase/firestore';

export type Meeting = {
  id: string;
  name: string;
  place: string;
  members: Members;
  host: User;
};

export type Meetings = Meeting[];

export type Members = User[];

export type Timetable = {
  id: string;
  user: User;
  from: Timestamp;
  to: Timestamp;
  isAvailable: boolean;
};
export type Timetables = Timetable[];

export type Schedule = {
  id: string;
  name: string;
  range_from: Timestamp;
  range_to: Timestamp;
};
export type Schedules = Schedule[];
