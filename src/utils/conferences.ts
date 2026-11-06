import raw from '../data/conferences.yml?raw';
import yaml from 'js-yaml';

export type ConferenceType = 'oral' | 'poster' | 'proceedings';

export type Conference = {
  authors: string[];
  title: string;
  event: string;
  location: string;
  date: string;
  type: ConferenceType;
  url: string;
  doi?: string;
  note?: string;
};

type FileShape = {records?: Conference[]};

const data = yaml.load(raw) as FileShape | null;
export const conferences: Conference[] = Array.isArray(data?.records) ? data!.records! : [];

export const conferenceTypeLabel: Record<ConferenceType, string> = {
  oral: '口头报告',
  poster: '海报',
  proceedings: '会议论文',
};
