export interface CheckinRule {
  id: string;
  eventId: string;
  name: string;
  startOffsetMinutes: number;
  endOffsetMinutes: number;
  required: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}