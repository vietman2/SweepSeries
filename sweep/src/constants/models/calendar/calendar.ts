export type CalendarMemberType = {
  uuid: string;
  name: string;
  profile_image: string;
}

export type CalendarType = {
  id: number;
  name: string;
  color: string;
  is_owner: boolean;
  num_members: number;
  owner: CalendarMemberType;
  members: CalendarMemberType[];
};
