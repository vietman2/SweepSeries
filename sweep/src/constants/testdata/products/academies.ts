import { AcademyDetailType, AcademySimpleType } from "@models/products";

export const sampleAcademies: AcademySimpleType[] = [
  {
    uuid: "1",
    logo: "https://yaguin.com/lf_img/lfi15856190990.jpeg",
    name: "유더스타 청라 아카데미",
    location: "인천시 서구 청라동",
    rating: 5.0,
    num_reviews: 10,
    top_review: "최고의 시설과 코치진! 추천합니다!",
  },
  {
    uuid: "2",
    logo: "https://cdn.ccdailynews.com/news/photo/202101/2030853_517727_5828.jpg",
    name: "관악 JS 아카데미",
    location: "서울시 관악구 대학동",
    rating: 4.2,
    num_reviews: 14,
    top_review: "좋은 시설과 친절한 코치들이 많아요!",
  },
];

const daily = {
  open_time: "09:00",
  close_time: "22:00",
  is_allday: false,
  is_closed: false,
};

export const sampleAcademyDetail: AcademyDetailType = {
  uuid: "1",
  name: "Catch B 아카데미",
  address: "인천시 서구 청라한내로 72번길 17, 416호",
  rating: 4.2,
  num_reviews: 42,
  introduction:
    "인천광역시 서구 청라동에 위치한 캐치비 아카데미입니다.\n\n200평 규모의 시설에 야구를 위한 최첨단 장비까지 갖추고 있습니다. 세련된 야구 레슨을 위한 서비스를 제공하는 캐치비 아카데미는 인천 지역 최고의 코치진을 자랑하고 있기도 합니다.\n\n저희 아카데미는 공휴일을 제외한 어떠한 날에도 휴무하지 않고 있으니 참고바랍니다.",
  schedules: [
    {
      day: "매일",
      schedule: "09:00 ~ 22:00",
    },
  ],
  schedule_details: [daily, daily, daily, daily, daily, daily, daily],
  convenience: [
    {
      id: 1,
      name: "helmet",
      kor_name: "헬멧",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/helmets.svg",
      type: "구비장비",
    },
    {
      id: 2,
      name: "gloves",
      kor_name: "글러브",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/gloves.svg",
      type: "구비장비",
    },
    {
      id: 3,
      name: "catcher_gear",
      kor_name: "포수장비",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/catcher_gear.svg",
      type: "구비장비",
    },
    {
      id: 4,
      name: "batting_tee",
      kor_name: "배팅티",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/batting_tee.svg",
      type: "구비장비",
    },
    {
      id: 5,
      name: "monitor",
      kor_name: "영상분석",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/monitor.svg",
      type: "구비장비",
    },
    {
      id: 6,
      name: "bats",
      kor_name: "배트대여",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/bats.svg",
      type: "구비장비",
    },
    {
      id: 7,
      name: "speakers",
      kor_name: "스피커",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/speaker.svg",
      type: "구비장비",
    },
    {
      id: 8,
      name: "speed_gun",
      kor_name: "스피드건",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/speed_gun.svg",
      type: "구비장비",
    },
    {
      id: 9,
      name: "pitching_machine",
      kor_name: "피칭머신",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/pitching_machine.svg",
      type: "구비장비",
    },
    {
      id: 10,
      name: "fitness",
      kor_name: "헬스기구",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/fitness.svg",
      type: "구비장비",
    },
    {
      id: 11,
      name: "free_parking",
      kor_name: "무료 주차",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/free_parking.svg",
      type: "편의시설",
    },
    {
      id: 12,
      name: "wifi",
      kor_name: "Wi-Fi",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/wifi.svg",
      type: "편의시설",
    },
    {
      id: 13,
      name: "air_conditioner",
      kor_name: "에어컨",
      icon_url:
        "https://kr.object.ncloudstorage.com/sweepdev/facicons/air_conditioner.svg",
      type: "편의시설",
    },
  ],
  logo: "https://yaguin.com/lf_img/lfi15856190990.jpeg",
  images: [
    {
      id: 1,
      uri: "https://kr.object.ncloudstorage.com/sweepdev/test_images/academy1.jpg",
    },
    {
      id: 2,
      uri: "https://kr.object.ncloudstorage.com/sweepdev/test_images/academy2.jpg",
    },
    {
      id: 3,
      uri: "https://kr.object.ncloudstorage.com/sweepdev/test_images/academy3.jpg",
    },
  ],
  map: "https://kr.object.ncloudstorage.com/sweepdev/test_images/map.png",
};
