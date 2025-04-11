import {
  LessonDetailType,
  LessonType,
  LessonRequestType,
} from "@models/calendar";

export const sampleLessonSimple: LessonType = {
  id: "1",
  date: "11월 01일. 화",
  time: "오전 9시 ~ 오전 11시 (2시간)",
  color: "#14863E",
  title: "엘리트 (고등학생) 1:1 타격레슨",
  description: "코치: 홍길동\t수강생: 김철수",
  done: true,
  curriculum: "타격",
  full_date: "2022년 11월 01일",
  academy_name: "엘리트 야구 아카데미",
  coach_uuids: ["2"],
};

export const sampleLesson: LessonDetailType = {
  ...sampleLessonSimple,
  notes:
    "손목이 덮히는 현상을 고치려고 노력함\n단순히 손목이 덮히는 현상을 스윙 궤도의 변화로 수정하기보다 상하체 분리 후 진행되는 로테이션을 통해 전반적으로 수정함\n\n코치님 강조점:\n1. 랜딩 동작 시 상하체 분리\n2. 오른쪽 상체(팔꿈치) 오픈 수정",
  feedback:
    "레슨 내용: 상하체 분리 후 로테이션 수정\n레슨:\n- 레그 킥 이후 랜딩 동작 시 상하체 분리가 원활히 되지 않는 상태를 수정하고자 했음\n- 수정 전: 스윙 진행 시 팔꿈치가 오픈되며 배트의 중심점이 뒤에 남아있게 되고 손목이 덮힘\n- 수정 후: 안전한 랜딩 동작 수행 후 상체 돌림 현상이 줄어들고 히트 트랙 분석이 타구 속도 및 발사각이 조정됨",
  coaches: [1],
  student: "1",
};

export const sampleLessonRequests: LessonRequestType[] = [
  {
    id: 1,
    time: "오전 9시 ~ 오전 11시 (2시간)",
    title: "엘리트 (고등학생) 1:1 타격레슨",
    description: "코치: 홍길동\t수강생: 김철수",
    details:
      "손목이 덮히는 현상을 고치려고 노력함\n단순히 손목이 덮히는 현상을 스윙 궤도의 변화로 수정하기보다 상하체 분리 후 진행되는 로테이션을 통해 전반적으로 수정함\n\n코치님 강조점:\n1. 랜딩 동작 시 상하체 분리\n2. 오른쪽 상체(팔꿈치) 오픈 수정",
    color: "#14863E",
    date: "11월 01일. 화",
  },
  {
    id: 2,
    time: "오후 2시 ~ 오후 4시 (2시간)",
    title: "엘리트 (고등학생) 1:1 투수레슨",
    description: "코치: 홍길동\t수강생: 김철수",
    details:
      "손목이 덮히는 현상을 고치려고 노력함\n단순히 손목이 덮히는 현상을 스윙 궤도의 변화로 수정하기보다 상하체 분리 후 진행되는 로테이션을 통해 전반적으로 수정함\n\n코치님 강조점:\n1. 랜딩 동작 시 상하체 분리\n2. 오른쪽 상체(팔꿈치) 오픈 수정",
    color: "#14863E",
    date: "11월 01일. 화",
  },
];
