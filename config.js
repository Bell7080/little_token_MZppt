/* ============================================================
   Little Token · G-STAR 2026 팔로우/위시 룰렛 — 기본 설정
   ------------------------------------------------------------
   · 이 파일을 메모장으로 열어 숫자/글자만 바꾸고 저장하면 됩니다.
   · 현장에서는 화면 오른쪽 위 톱니바퀴(또는 키보드 S)로도
     가중치·재고를 바꿀 수 있고, 그 값은 이 PC 브라우저에 자동 저장되어
     다음에 다시 열어도 그대로 유지됩니다.
   · 패널의 "파일 기본값으로" 버튼을 누르면 이 파일 값으로 되돌아갑니다.
   · 이 파일의 가중치·재고를 바꾸면, 브라우저에 저장돼 있던 예전 가중치·재고는
     자동으로 새 값으로 바뀝니다. (지급 기록은 유지)
   ============================================================ */
window.ROULETTE_CONFIG = {
  // 상단 문구
  eventTitle: "팔로우 · 위시 이벤트",
  eventSub: "G-STAR 2026 한정",

  // 참여 방법 (왼쪽 패널에 순서대로 표시)
  missions: [
    { icon: "♥", text: "인스타그램 팔로우" },
    { icon: "★", text: "스팀 위시리스트 추가" },
    { icon: "✓", text: "스태프에게 화면 보여주기" },
  ],

  /* 상품 목록
     weight : 가중치(비율). 89/10/1 이면 89% / 10% / 1%
              합이 100일 필요는 없음 (예: 6/3/1 도 같은 확률)
     stock  : 남은 재고. null 이면 무제한, 0 이 되면 더 이상 당첨되지 않음
     tier   : "common"(일반) / "rare"(레어) / "epic"(에픽)
              등급이 높을수록 룰렛 표시와 당첨 연출이 화려해짐            */
  prizes: [
    { id: "sticker", name: "스티커", weight: 89, stock: null, tier: "common",
      desc: "적 캐릭터 이미지 스티커!", color: "#ffb7c5", deep: "#d9667f" },
    { id: "keyring", name: "키링",   weight: 10, stock: null, tier: "rare",
      desc: "리틀토큰 프롬 키링!",      color: "#a8dcff", deep: "#3f8fc4" },
    { id: "ecobag",  name: "에코백", weight: 1, stock: null, tier: "epic",
      desc: "대박! 리틀토큰 에코백!",   color: "#d9b8ff", deep: "#8a4fd0" },
  ],

  // 룰렛 칸 배치 (위 id를 순서대로). 칸 수·배치는 보이는 모양만 바꾸고,
  // 실제 확률은 위 weight 로만 결정됩니다.
  wheel: ["ecobag", "sticker", "keyring", "sticker", "ecobag", "keyring", "sticker", "keyring"],

  spinSeconds: 5.2,     // 회전 시간(초)
  showOdds: false,      // true 면 오른쪽 상품 카드에 확률(%) 표시
  sound: true,          // 효과음
};
