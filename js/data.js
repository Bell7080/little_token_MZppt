/* =============================================================================
   Little Token — 발표 덱 데이터
   src/data/csv/words.csv · combos.csv · core/compiler.ts · core/player.ts 에서
   그대로 옮겨온 값이다. 슬라이드의 문장 조립기는 게임과 같은 공식으로 계산한다.
   ========================================================================== */

/* 게임 상수 — core/compiler.ts */
export const LUCK_MULT = 0.02;   // 운 1당 +2%
export const CRIT_MULT = 1.5;    // 대성공 배수
export const CRIT_CAP = 0.6;     // 대성공 확률 수렴 상한

/* 런 중반 플레이어 (STARTING_COMBAT_STATS에서 성장한 상태) */
export const PLAYER = { hp: 52, atk: 14, guard: 9, heal: 11, luck: 6, context: 12 };

/* ── 단어 카드 ─────────────────────────────────────────────────────────────
   bonus   : 배율 풀에 가산되는 값 (가산)
   variance: 확률형 어미 — p 확률로 hi, 아니면 lo
   crit    : 대성공 확률 가산
   mult    : 동사의 스탯 계수
   kind    : attack | guard | heal                                          */

export const CARDS = {
  subj: [
    { id: 'na',      text: '나는',            tags: ['self'],                bonus: 0.2,  rarity: 'common', note: '배율 ×1.20',            lore: '오늘도 일기를 편다.' },
    { id: 'dachin',  text: '다친 나는',        tags: ['self', 'hurt'],        bonus: 0,    rarity: 'rare',   note: '50% 확률로 배율 ×2.20', lore: '아픈 자리가 오히려 뜨겁다.', variance: { p: 0.5, hi: 2.2, lo: 1 } },
    { id: 'gyeop',   text: '이를 악문 나는',    tags: ['self', 'grit'],        bonus: 0,    rarity: 'rare',   note: '40% 확률로 배율 ×2.50', lore: '분한 마음을 꾹 삼키고 연필을 쥔다.', variance: { p: 0.4, hi: 2.5, lo: 1 } },
    { id: 'uri',     text: '우리는',           tags: ['self', 'both'],        bonus: 0,    rarity: 'epic',   note: '50% 확률로 배율 ×3.20', lore: '함께라면 크게 타오른다.', variance: { p: 0.5, hi: 3.2, lo: 1 } },
  ],
  adv: [
    { id: 'saljjak', text: '살짝',    tags: ['soft'],           bonus: 0,    crit: 0.40, rarity: 'common', note: '배율 ×1.00 · 대성공 40%', lore: '조심스럽게.' },
    { id: 'himkkeot',text: '힘껏',    tags: ['force'],          bonus: 0.15, crit: 0.10, rarity: 'common', note: '배율 ×1.15 · 대성공 10%', lore: '팔에 힘을 준다.' },
    { id: 'kkuk',    text: '꾹 참고',  tags: ['grit', 'solid'],  bonus: 0.45, crit: 0.20, rarity: 'rare',   note: '배율 ×1.45 · 대성공 20%', lore: '울음을 삼킨 만큼 단단해진다.' },
    { id: 'michin',  text: '미친듯이', tags: ['mad'],            bonus: 0.70, crit: 0.45, rarity: 'epic',   note: '배율 ×1.70 · 대성공 45%', lore: '종이가 타는 냄새. 멈출 수 없다.' },
  ],
  verb: [
    { id: 'ttaeryeot', text: '때렸다',        tags: ['atk'],           mult: 1,   kind: 'attack', rarity: 'common', note: '공격 ×1',   lore: '정직한 한 방.' },
    { id: 'makat',     text: '막았다',        tags: ['grd'],           mult: 1,   kind: 'guard',  rarity: 'common', note: '방어 ×1',   lore: '한 발 버틴다.' },
    { id: 'gamssat',   text: '감쌌다',        tags: ['mend'],          mult: 1,   kind: 'heal',   rarity: 'common', note: '회복 ×1',   lore: '상처를 매만진다.' },
    { id: 'huryeo',    text: '춤추듯 피했다',  tags: ['grd', 'dance'],  mult: 1.5, kind: 'guard',  rarity: 'rare',   note: '방어 ×1.5', lore: '발끝이 먼저 종이 위를 미끄러진다.' },
  ],
};

/* ── 관용구 34종 — src/data/csv/combos.csv 전량 ──────────────────────────── */
export const COMBOS = [
  { id: 'ec1',  name: '정면돌파',          need: ['force', 'atk'],           mult: 1.5,  flavor: '망설임 없이' },
  { id: 'ec2',  name: '철벽',              need: ['solid', 'grd'],           mult: 1.45, flavor: '한 치도 안 밀린다' },
  { id: 'ec3',  name: '함께라면',          need: ['both', 'force'],          mult: 1.6,  flavor: '둘이 쥔 연필은 안 부러진다' },
  { id: 'ec4',  name: '홀로서기',          need: ['solo', 'solid'],          mult: 1.55, flavor: '혼자여도 무너지지 않는다' },
  { id: 'ec5',  name: '오늘의 다짐',        need: ['now', 'atk'],             mult: 1.5,  flavor: '오늘 일은 오늘 끝낸다' },
  { id: 'ec6',  name: '상처의 값',          need: ['hurt', 'force'],          mult: 1.7,  flavor: '아픈 만큼 세게' },
  { id: 'ec7',  name: '메아리',            need: ['echo', 'mend'],           mult: 1.5,  flavor: '너를 감싸며 나도 아문다' },
  { id: 'ec8',  name: '지난 일은 잊고',     need: ['mind', 'mend'],           mult: 1.55, flavor: '덮으면 낫는 것도 있다' },
  { id: 'ec9',  name: '조심스러운 손길',    need: ['soft', 'mend'],           mult: 1.6,  flavor: '살살, 그래서 더 잘 아문다' },
  { id: 'ec10', name: '이를 악물고 한 발',  need: ['grit', 'solid'],          mult: 1.5,  flavor: '분한 마음을 삼키고도 물러서지 않았다' },
  { id: 'ec11', name: '거침없이',          need: ['rush', 'atk'],            mult: 1.5,  flavor: '앞뒤 없이 내지른다' },
  { id: 'ec12', name: '이 악물고',          need: ['grit', 'grd'],            mult: 1.45, flavor: '삼킨 울음이 방패가 된다' },
  { id: 'ec13', name: '눈물 닦고',          need: ['tear', 'mend'],           mult: 1.5,  flavor: '울면서도 손은 낫게 한다' },
  { id: 'ec14', name: '빙글 돌아',          need: ['dance', 'force'],         mult: 1.55, flavor: '발끝까지 힘을 실어 몸을 피한다' },
  { id: 'ec15', name: '신난 불꽃',          need: ['play', 'atk'],            mult: 1.6,  flavor: '들뜬 손끝에서 불꽃이 튄다' },
  { id: 'ec16', name: '다시 일어서기',      need: ['grit', 'mend'],           mult: 1.7,  flavor: '아문 마음으로 다음 줄을 쓴다' },
  { id: 'ec17', name: '포근한 손길',        need: ['warm', 'mend'],           mult: 1.5,  flavor: '따뜻하게 감싸 다시 아문다' },
  { id: 'ec18', name: '눈 깜짝할 새',       need: ['swift', 'atk'],           mult: 1.5,  flavor: '재빠른 손끝이 먼저 닿는다' },
  { id: 'ec19', name: '광란의 일격',        need: ['mad', 'atk'],             mult: 1.6,  flavor: '생각할 틈 없이 몰아친다' },
  { id: 'ec20', name: '물러설 곳 없이',     need: ['reckless', 'atk'],        mult: 1.6,  flavor: '끝까지 몰린 마음으로 내지른다' },
  { id: 'ec21', name: '환한 수선',          need: ['bright', 'mend'],         mult: 1.5,  flavor: '밝은 마음으로 찢어진 줄을 잇는다' },
  { id: 'ec22', name: '반가운 손길',        need: ['greet', 'mend'],          mult: 1.5,  flavor: '다시 만난 이야기를 다정히 고친다' },
  { id: 'ec23', name: '웃으며 고치기',      need: ['smile', 'mend'],          mult: 1.5,  flavor: '웃음을 잃지 않고 상처를 다듬는다' },
  { id: 'ec24', name: '성난 일격',          need: ['rage', 'atk'],            mult: 1.55, flavor: '거친 마음을 한 획에 싣는다' },
  { id: 'ec25', name: '쓸쓸한 방패',        need: ['lone', 'grd'],            mult: 1.5,  flavor: '혼자 남아도 한 줄을 지킨다' },
  { id: 'ec26', name: '애써 일어서기',      need: ['endure', 'mend'],         mult: 1.55, flavor: '흔들리는 손으로 다시 마음을 잇는다' },
  { id: 'ec27', name: '들썩이는 공격',      need: ['bounce', 'atk'],          mult: 1.5,  flavor: '신난 박자가 타격으로 이어진다' },
  { id: 'ec28', name: '경쾌한 회복',        need: ['lively', 'mend'],         mult: 1.5,  flavor: '가벼운 박자로 상처를 풀어낸다' },
  { id: 'c1',   name: '고독한 전사',        need: ['solo', 'war', 'atk'],     mult: 1.55, flavor: '혼자서 맞서는 자' },
  { id: 'c2',   name: '화염광란',          need: ['mad', 'fire', 'fire'],    mult: 1.9,  flavor: '미쳐 타오르다' },
  { id: 'c3',   name: '완전한 정적',        need: ['quiet', 'quiet'],         mult: 1.6,  flavor: '숨죽인 방어' },
  { id: 'c4',   name: '망각의 의식',        need: ['mind', 'mind'],           mult: 1.5,  flavor: '잊으며 회복하다' },
  { id: 'c5',   name: '공멸',              need: ['both', 'fire'],           mult: 2.0,  flavor: '함께 타 죽는다' },
  { id: 'c6',   name: '장맛비',            need: ['wide', 'water'],          mult: 1.6,  flavor: '모두를 적시는 비' },
];

/* ── 컴파일러 ──────────────────────────────────────────────────────────────
   AGENTS.md 불변식:
   · 관용구는 선택 단어의 태그를 "멀티셋"으로 매칭한다 (유일한 곱셈 요소)
   · 보너스 풀은 가산이다
   · 컴파일러 배수 = (1 + 보너스 풀) × 관용구 배수 — 상한 없음
   · 깡수치는 고정 위력이 아니라 스탯 × 계수에서 나온다                        */

/** 태그 멀티셋 매칭 — need의 각 태그를 태그 풀에서 하나씩 소비할 수 있어야 발동. */
function matchesMultiset(need, tags) {
  const pool = [...tags];
  for (const t of need) {
    const i = pool.indexOf(t);
    if (i === -1) return false;
    pool.splice(i, 1);
  }
  return true;
}

export function compile(subj, adv, verb, player = PLAYER) {
  const tags = [...subj.tags, ...adv.tags, ...verb.tags];
  const combos = COMBOS.filter((c) => matchesMultiset(c.need, tags));

  const bonusPool = (subj.bonus || 0) + (adv.bonus || 0);
  const comboMult = combos.reduce((a, c) => a * c.mult, 1);
  const baseMult = (1 + bonusPool) * comboMult;

  const critP = Math.min(CRIT_CAP, (adv.crit || 0) + player.context * 0.01);
  const luckMult = 1 + player.luck * LUCK_MULT;

  const statKey = verb.kind === 'attack' ? 'atk' : verb.kind === 'guard' ? 'guard' : 'heal';
  const raw = player[statKey] * verb.mult;

  return { tags, combos, bonusPool, comboMult, baseMult, critP, luckMult, raw, statKey, kind: verb.kind, variance: subj.variance || null };
}

/** 배수 확정 — variance·운·룰렛을 곱한다. rolls를 넘기면 결정적으로 재현된다. */
export function resolve(c, rolls = {}) {
  const varRoll = rolls.variance ?? Math.random();
  const critRoll = rolls.crit ?? Math.random();

  const variance = c.variance ? (varRoll < c.variance.p ? c.variance.hi : c.variance.lo) : 1;
  const crit = critRoll < c.critP;
  const rouletteMult = crit ? CRIT_MULT : 1;

  const mult = c.baseMult * variance * c.luckMult * rouletteMult;
  return { ...c, variance, crit, rouletteMult, mult, value: Math.round(c.raw * mult) };
}

/* ── 레포에서 실측한 프로젝트 지표 ────────────────────────────────────────── */
export const FACTS = {
  version: 'v_0.5.37',
  commits: 91,
  humans: 4,
  days: '2박 3일',
  words: 75,
  combos: 34,
  models: 12,
  audio: 27,
  icons: 100,
  agentsLines: 262,
  /** 75단어를 3슬롯에 배치하는 문장 경우의 수 (subj 20 × adv 20 × verb 20 급) */
  get combinations() { return this.words * this.combos; },
};

export const TEAM = {
  name: '1조',
  jam: '2026 NEXON AI 게임잼',
  theme: '맥락 (Context)',
  title: 'Little Token',
  tagline: '문장을 조립해 이야기를 지키는 단어장 덱빌딩 로그라이트',
};
