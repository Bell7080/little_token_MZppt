# Little Token — 발표 덱

2026 NEXON AI 게임잼 · 주제 「맥락(Context)」 · 1조
[`Yeop-Git/little_token`](https://github.com/Yeop-Git/little_token) 발표용 HTML 프레젠테이션.

파워포인트가 아니라 **HTML 한 페이지**다. 게임의 팔레트·폰트·마스코트·전투 공식을
저장소에서 직접 가져와 이식했고, 발표 자체가 하나의 문장을 조립하는 구조로 되어 있다.

발표 대본은 [`SCRIPT.md`](SCRIPT.md)에 있다.

---

## 실행

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

ES 모듈과 로컬 에셋을 쓰기 때문에 `index.html`을 파일로 직접 열면 동작하지 않는다.
반드시 서버로 띄운다.

발표 직전에는 브라우저 **전체화면(F11)** 으로 두면 1920×1080 무대가 화면에 꽉 찬다.
해상도가 달라도 게임과 같은 방식으로 자동 축소되므로 레이아웃은 깨지지 않는다.

---

## 조작

| 키 | 동작 |
|---|---|
| `Space` `→` `Enter` `클릭` | 다음 (단계가 있는 슬라이드는 단계부터) |
| `←` | 이전 |
| `Home` / `End` | 처음 / 마지막 |
| `O` / `Esc` | 슬라이드 목록 — 클릭해서 점프 |
| `R` | 문장 조립기 초기화 (시연 다시 하기) |
| `F` | 발표 모드 ↔ 실전 확률 모드 |
| `T` | 토큰 숨기기/보이기 |

### `F` — 발표 모드에 대해

기본값은 **발표 모드**로, 확률 굴림(확률형 어미·대성공)을 최댓값으로 고정한다.
무대 위에서 시연이 헛나가면 안 되기 때문이다.

무엇이 곱해졌는지는 숨기지 않는다 — 화면에 `× 확률 2.20 × 대성공 1.50`이
전부 표시되므로, 유리한 굴림이 나온 상태라는 게 그대로 보인다.
관용구 발동 자체는 확률이 아니라 **태그 매칭**이라 어느 모드에서든 결정적이다.

`F`를 누르면 실제 확률로 굴린다. 리허설 때 한 번 눌러보고 취향에 맞는 쪽으로 두면 된다.

---

## 구조

```
index.html          슬라이드 14장 (본문은 전부 여기 · 수정하기 쉽게 HTML로 둠)
css/deck.css        디자인 시스템 — 게임 src/style.css 팔레트 이식
js/data.js          단어 카드 · 관용구 34종 · 전투 공식 (게임 데이터 이식)
js/deck.js          네비게이션 · 토큰 · 문장 조립기 · 연출
assets/
  font/             Griun_PolFairness — 게임 본문 폰트 그대로
  img/              타이틀 아트 · 배경 · 토큰 표정 6종
  enemy/            벌레·보스 스프라이트
  video/            opening(오프닝 시네마틱) · boss(5층 보스 컷씬)
```

---

## 게임에서 가져온 것

에셋만 복사한 게 아니라 **규칙과 구조**를 가져왔다.

| 항목 | 출처 | 비고 |
|---|---|---|
| 팔레트 | `src/style.css` | `--gold #ffcf76` 등 변수 값 그대로 |
| 폰트 | `src/assets/fonts/` | Griun_PolFairness |
| 무대 스케일러 | `src/main.ts` | 1920×1080 고정 후 뷰포트에 맞춰 축소 |
| 관용구 34종 | `src/data/csv/combos.csv` | 전량 |
| 전투 공식 | `src/core/compiler.ts` | 태그 멀티셋 매칭 · 가산 보너스 풀 · 관용구 곱셈 |
| 플레이어 스탯 | `src/core/player.ts` | 런 중반 기준으로 조정 |
| 토큰의 역할 | `src/views/BattleView.ts` | 게임에서 좌측 말풍선으로 안내하던 역할 그대로 |
| 연필 커서 | `src/ui/CustomCursor.ts` | |

문장 조립기의 수치는 하드코딩된 연출이 아니다. `js/data.js`의 `compile()`과
`resolve()`가 게임과 같은 순서로 배수를 확정한다.

---

## 고치는 법

**문구 수정** — `index.html`에서 해당 슬라이드를 찾아 고친다. 슬라이드마다
어느 챕터인지 주석이 달려 있다.

**슬라이드 추가** — `<section class="slide" data-chapter="...">`를 원하는 위치에
넣으면 끝이다. 번호·진행바·목록은 자동으로 다시 계산된다.

**토큰 대사** — `js/deck.js`의 `LINES`. 키가 슬라이드 순번(0부터)이다.
`['대사', 'warn|relief|', '표정']` 형식이고, 표정은
`neutral · smile · sad · crown · party · gloom` 중 하나다.
배열의 배열로 넣으면 단계마다 한 줄씩 나간다.

**하단 문장 바** — `js/deck.js`의 `META`. 어느 슬라이드에서 칸이 채워지는지는
`index.html`의 `data-win="0|1|2|3"` 속성으로 정한다.

**조립기 카드** — `js/data.js`의 `CARDS`. 태그를 바꾸면 어떤 관용구가 터지는지가
바뀐다. 게임 원본과 어긋나지 않게 하려면 `src/data/csv/words.csv`를 참고할 것.

---

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 GitHub Pages로 게시한다
(`.github/workflows/deploy.yml`). 저장소 Settings → Pages → Source를
**GitHub Actions**로 두면 된다.

발표는 로컬에서 하는 편이 안전하다. 네트워크에 기대지 않고, 14MB짜리 영상 두 개가
처음부터 디스크에 있기 때문이다.
