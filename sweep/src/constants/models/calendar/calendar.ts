export type CalendarMemberType = {
  uuid: string;
  name: string;
  profile_image: string;
}

export type CalendarType = {
  id: number;
  title: string;
  color: string;
  owner: CalendarMemberType;
  members: CalendarMemberType[];
};
