import { SettingType, SettingGroupType } from "@models/customers";

const reservationSettings: SettingType[] = [
  {
    id: 1,
    title: "예약 승인 알림",
    subTitle: "예약 후 상품에 대한 예약 승인 알림",
    isSet: false,
  },
  {
    id: 2,
    title: "남은 회차 알림",
    subTitle: "다회권, 정기권의 회차 정보 알림",
    isSet: true,
  },
  {
    id: 3,
    title: "리뷰 알림",
    subTitle: "완료된 예약의 리뷰, 해당 리뷰의 댓글 알림",
    isSet: false,
  },
];

const togetherSettings: SettingType[] = [
  {
    id: 4,
    title: "함께 예약 알림",
    subTitle: "함께 예약한 사람의 예약 정보 알림",
    isSet: true,
  },
  {
    id: 5,
    title: "함께 예약 취소 알림",
    subTitle: "함께 예약한 사람의 예약 취소 정보 알림",
    isSet: false,
  },
];

const eventSettings: SettingType[] = [
  {
    id: 6,
    title: "이벤트 알림",
    subTitle: "이벤트 정보 및 이벤트 참여 알림",
    isSet: true,
  },
  {
    id: 7,
    title: "이벤트 리뷰 알림",
    subTitle: "이벤트 후 리뷰 작성 알림",
    isSet: false,
  },
  {
    id: 8,
    title: "이벤트 당첨 알림",
    subTitle: "이벤트 당첨자 발표 및 당첨자 정보 알림",
    isSet: true,
  },
];

export const sampleSettings: SettingGroupType[] = [
  {
    title: "예약",
    settings: reservationSettings,
  },
  {
    title: "함께하기",
    settings: togetherSettings,
  },
  {
    title: "이벤트",
    settings: eventSettings,
  },
];
