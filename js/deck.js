/* =============================================================================
   Little Token — 발표 덱 엔진
   · 무대 스케일러는 게임 src/main.ts와 같은 방식(1920×1080 고정 후 축소)
   · 문장 조립기는 게임 core/compiler.ts의 공식을 그대로 돌린다
   · 토큰은 게임에서 맡은 역할(좌측 말풍선 안내) 그대로 발표를 안내한다
   ========================================================================== */

import { CARDS, COMBOS, PLAYER, compile, resolve } from './data.js';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ═══════════════════════════════════════════════════════════════════════════
   무대 스케일러 — 어떤 화면에 물려도 1920×1080 레이아웃이 깨지지 않는다
   ═══════════════════════════════════════════════════════════════════════════ */
const stage = $('#stage');
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.setProperty('--scale', s);
}
addEventListener('resize', fit);
fit();

/* ═══════════════════════════════════════════════════════════════════════════
   반딧불이 · 연필 커서
   ═══════════════════════════════════════════════════════════════════════════ */
(function fireflies() {
  const box = $('#fireflies');
  for (let i = 0; i < 34; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    const size = 2 + Math.random() * 4;
    f.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      --dx:${(Math.random() - 0.5) * 260}px; --dy:${(Math.random() - 0.5) * 200}px;
      --dur:${8 + Math.random() * 12}s; --blink:${2 + Math.random() * 4}s;
      animation-delay:${-Math.random() * 10}s, ${-Math.random() * 6}s;`;
    box.appendChild(f);
  }
})();

(function pencil() {
  const p = $('#pencil');
  addEventListener('mousemove', (e) => { p.style.left = e.clientX + 'px'; p.style.top = e.clientY + 'px'; });
  addEventListener('mousedown', () => p.classList.add('press'));
  addEventListener('mouseup',   () => p.classList.remove('press'));
})();

/* ═══════════════════════════════════════════════════════════════════════════
   토큰 — 안내 요정
   ═══════════════════════════════════════════════════════════════════════════ */
const Token = {
  stage: $('#token-stage'),
  img: $('#token'),
  bubble: $('#token-bubble'),
  timer: null,
  hideTimer: null,

  face(name) { this.img.src = `assets/img/token_${name}.webp`; },

  /** 한 글자씩 써지는 손글씨 말풍선. mood: '' | 'warn' | 'relief' */
  say(html, mood = '', face) {
    if (face) this.face(face);
    this.stage.classList.remove('hidden');
    this.stage.classList.add('talking');
    this.bubble.className = mood;

    // 태그는 보존하면서 텍스트 노드만 글자 단위로 쪼갠다
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach((ch) => {
            const s = document.createElement('span');
            s.className = 'ch'; s.textContent = ch;
            s.style.setProperty('--cd', (i++ * 0.022).toFixed(3) + 's');
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else walk(n);
      });
    };
    walk(tmp);

    this.bubble.innerHTML = tmp.innerHTML;
    requestAnimationFrame(() => this.bubble.classList.add('on'));

    // 말풍선은 순간적으로만 뜬다 — 슬라이드 본문을 가리면 안 된다
    const writeMs = i * 22 + 600;
    clearTimeout(this.timer); clearTimeout(this.hideTimer);
    this.timer = setTimeout(() => this.stage.classList.remove('talking'), writeMs);
    this.hideTimer = setTimeout(() => this.bubble.classList.remove('on'), writeMs + 4200);
  },

  hide() { this.bubble.classList.remove('on'); },
  center(on) { this.stage.classList.toggle('center', on); },
};

(function dust() {
  const box = $('#token-dust');
  for (let i = 0; i < 8; i++) {
    const d = document.createElement('i');
    d.style.cssText = `--x:${20 + Math.random() * 170}px; --y:${60 + Math.random() * 120}px;
      --dx:${(Math.random() - 0.5) * 70}px; --dur:${2.4 + Math.random() * 2}s; --dd:${-Math.random() * 4}s;`;
    box.appendChild(d);
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   발표를 관통하는 한 문장 — 이 덱 자체가 조립되는 문장이다
   ═══════════════════════════════════════════════════════════════════════════ */
const META = [
  { role: '주어',   text: '우리는' },
  { role: '수식어', text: 'AI와 함께' },
  { role: '목적어', text: '맥락을' },
  { role: '동사',   text: '만들었다' },
];
const msBar = $('#meta-sentence');
msBar.innerHTML = META.map((m) =>
  `<div class="ms-slot"><span class="ms-role">${m.role}</span>${m.text}</div>`).join('');
const msSlots = $$('.ms-slot', msBar);
let won = -1;

function winSlot(i) {
  if (i <= won) return;
  won = i;
  msBar.classList.remove('hidden');
  const el = msSlots[i];
  el.classList.add('on', 'just-won');
  setTimeout(() => el.classList.remove('just-won'), 1100);
}
/** 슬라이드를 되돌아갈 때 문장도 같이 되감는다 */
function syncSlots(upTo) {
  won = upTo;
  msSlots.forEach((el, i) => el.classList.toggle('on', i <= upTo));
  msBar.classList.toggle('hidden', upTo < 0);
}

/* ═══════════════════════════════════════════════════════════════════════════
   슬라이드별 토큰 대사 — 게임의 토큰 말투 그대로
   배열이면 스텝마다 한 줄씩 나간다. [html, mood, face]
   ═══════════════════════════════════════════════════════════════════════════ */
const LINES = {
  0: [
    ['펭귄...? 갑자기 웬 펭귄이야!!', '', 'sad'],
    ['아— 뒤에 한마디 붙으니까 <b>바로 알겠다</b>!!', 'relief', 'smile'],
    ['어?! 같은 「펭귄」인데 <b>완전 다른 말</b>이 됐어!!', 'warn', 'neutral'],
    ['이게 <b>맥락</b>이야, 프롬!!', 'relief', 'crown'],
  ],
  1:  ['그래서 우리는 맥락을 <b>설명하는 대신</b> — 아예 <b>규칙으로</b> 만들었어!!', '', 'neutral'],
  2:  ['안녕! 내가 <span class="tk">토큰</span>이야. 이 이야기의 안내를 맡았어!!', 'relief', 'smile'],
  3:  ['처음 만난 넷이서 <b>2박 3일</b> 만에 여기까지 왔어!!', 'relief', 'crown'],
  4:  ['카드를 <b>내는</b> 게 아니야. 문장을 <b>쓰는</b> 거야!!', '', 'neutral'],
  5:  ['직접 골라 봐! 단어 <b>세 개</b>면 문장이 완성돼!!', '', 'smile'],
  6:  ['태그가 맞물리면 <b>관용구</b>가 터져! 배수 <b>상한은 없어</b>!!', 'relief', 'crown'],
  7:  ['보스가 온다!! 이 녀석들은 <b>방어를 부수는 수단</b>을 하나씩 갖고 있어 — 조심해!!', 'warn', 'sad'],
  8:  ['여기서부터가 진짜야. 우리가 <b>AI를 어떻게 썼는지</b>!!', '', 'neutral'],
  9:  ['일을 시키기 전에 <b>규칙부터</b> 알려줬어. 그게 제일 빨랐어!!', 'relief', 'smile'],
  10: ['경우의 수가 너무 많아!! 사람 손으로는 <b>다 못 세</b>!!', 'warn', 'sad'],
  11: ['48시간 뒤에 <b>이만큼</b> 남았어!!', 'relief', 'crown'],
  12: ['그리고 이 화면도... 사실 <b>AI가 만든 거야</b>!!', 'relief', 'smile'],
  13: ['문장을 완성하자, 프롬!!', '', 'crown'],
};

/* ═══════════════════════════════════════════════════════════════════════════
   슬라이드 네비게이션
   ═══════════════════════════════════════════════════════════════════════════ */
const slides = $$('.slide');
const progress = $('#progress');
const chapterMark = $('#chapter-mark');
const hint = $('#hint');
let cur = 0, step = 0;

/** 이 슬라이드까지 왔을 때 채워져 있어야 할 문장 칸 수 */
function slotsUpTo(index) {
  let last = -1;
  slides.forEach((s, i) => { if (i <= index && s.dataset.win !== undefined) last = +s.dataset.win; });
  return last;
}

function show(i, { back = false } = {}) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  const slide = slides[i];
  const changed = i !== cur;
  cur = i;
  if (changed || back) step = 0;

  slides.forEach((s, k) => s.classList.toggle('active', k === i));

  // 배경 이미지는 처음 보일 때 로드한다
  const bg = $('.slide-bg', slide);
  if (bg && !bg.style.backgroundImage) bg.style.backgroundImage = `url('${bg.dataset.src}')`;

  // 영상 — 보이는 슬라이드만 재생
  $$('video.cine').forEach((v) => {
    if (v.closest('.slide') === slide) {
      if (!v.src) { v.src = v.dataset.src; v.loop = true; }
      v.play().catch(() => {});
    } else v.pause();
  });

  progress.style.width = ((i + 1) / slides.length) * 100 + '%';
  chapterMark.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b> / ${slide.dataset.chapter || ''}`;

  hint.textContent = slide.dataset.hint || '';
  hint.classList.toggle('hidden', !slide.dataset.hint);

  applySteps(slide);
  syncSlots(slotsUpTo(back ? i : i - 1));
  if (slide.dataset.win !== undefined && !back) setTimeout(() => winSlot(+slide.dataset.win), 700);
  else if (slide.dataset.win !== undefined) winSlot(+slide.dataset.win);

  countUp(slide);
  if (slide.dataset.comboGrid) buildComboGrid();
  if (slide.id === 'playable') resetAssembler();

  Token.center(slide.id === 'finale');
  speakFor(i, 0);
  buildOverview();
}

/** 슬라이드 안의 단계 연출 — 펭귄 훅처럼 한 겹씩 붙는 화면용 */
function applySteps(slide) {
  const total = +(slide.dataset.steps || 0);
  if (!total) return;
  $$('[data-step]', slide).forEach((el) => {
    el.classList.toggle('on', +el.dataset.step <= step);
  });
  if ($('#pg-prefix', slide)) {
    swapPrefix(step >= 2);
    // 뒤 문장(「펭귄은 조류이다」)은 앞 맥락을 갈아끼운 순간 의미를 잃는다
    const sub = $('.penguin-line.sub', slide);
    if (sub) sub.classList.toggle('on', step === 1);
  }
}

/* 「펭귄」은 그대로 두고 앞 맥락만 통째로 갈아끼운다 — 이 덱의 첫 번째 논증 */
const PREFIX = ['문맥은 ', '우리 팀의 주제는 '];
let prefixOn = 0;
function swapPrefix(toSecond) {
  const want = toSecond ? 1 : 0;
  if (want === prefixOn) return;
  prefixOn = want;
  const host = $('#pg-prefix');
  const old = $('.sw', host);
  old.classList.add('out');
  const fresh = document.createElement('span');
  fresh.className = 'sw in';
  fresh.textContent = PREFIX[want];
  host.appendChild(fresh);
  setTimeout(() => old.remove(), 460);
}

function speakFor(i, s) {
  const line = LINES[i];
  if (!line) { Token.hide(); return; }
  const pick = Array.isArray(line[0]) ? line[Math.min(s, line.length - 1)] : line;
  Token.say(pick[0], pick[1], pick[2]);
}

function next() {
  const slide = slides[cur];
  const total = +(slide.dataset.steps || 0);
  if (total && step < total - 1) {
    step++;
    applySteps(slide);
    speakFor(cur, step);
    return;
  }
  if (slide.id === 'finale' && !slide.dataset.done) { finale(); return; }
  show(cur + 1);
}

function prev() {
  const slide = slides[cur];
  if (+(slide.dataset.steps || 0) && step > 0) {
    step--; applySteps(slide); speakFor(cur, step); return;
  }
  if (cur === 0) return;
  const target = cur - 1;
  show(target, { back: true });
  const t = slides[target];
  step = Math.max(0, +(t.dataset.steps || 1) - 1);
  applySteps(t);
  speakFor(target, step);
}

/* ═══════════════════════════════════════════════════════════════════════════
   숫자 카운트업
   ═══════════════════════════════════════════════════════════════════════════ */
function countUp(slide) {
  $$('[data-count]', slide).forEach((el) => {
    const target = +el.dataset.count;
    const plus = target >= 100 ? '+' : '';
    let v = 0;
    const t0 = performance.now(), dur = 1000;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + (p === 1 ? plus : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   관용구 34종 그리드 — 실제 combos.csv 전량
   ═══════════════════════════════════════════════════════════════════════════ */
let comboGridBuilt = false;
function buildComboGrid() {
  if (comboGridBuilt) return;
  comboGridBuilt = true;
  $('#combo-grid').innerHTML = COMBOS.map((c) =>
    `<div class="combo-chip" data-id="${c.id}">${c.name}<span class="cm">×${c.mult.toFixed(2)}</span></div>`).join('');
  // 랜덤하게 하나씩 반짝이며 "발견되는" 느낌
  setInterval(() => {
    const chips = $$('#combo-grid .combo-chip');
    if (!chips.length || !slides[cur].dataset.comboGrid) return;
    chips.forEach((c) => c.classList.remove('hot'));
    for (let i = 0; i < 3; i++) chips[Math.floor(Math.random() * chips.length)].classList.add('hot');
  }, 1400);
}

/* ═══════════════════════════════════════════════════════════════════════════
   문장 조립기 — 게임과 같은 공식으로 실제 전투를 계산한다
   ═══════════════════════════════════════════════════════════════════════════ */
const SLOTS = [
  { key: 'subj', role: '주어' },
  { key: 'adv',  role: '수식어' },
  { key: 'verb', role: '동사' },
];
let picked = [];
/* 발표 모드(기본): 확률 굴림을 최댓값으로 고정한다. 무대에서 시연이 헛나가면
   안 되기 때문이고, 화면에 「× 확률 2.20 × 대성공 1.50」이 그대로 표시되므로
   무엇이 곱해졌는지 감추지 않는다. F 키로 실제 확률 굴림으로 바꿀 수 있다. */
let forceMax = true;

function resetAssembler() {
  picked = [];
  renderSentence();
  renderHand();
  $('#result').classList.remove('on');
  $('#combos').innerHTML = '';
  $('#formula').innerHTML = '';
  $('#damage-value').textContent = '0';
}

function renderSentence() {
  $('#sentence').innerHTML = SLOTS.map((s, i) => {
    const w = picked[i];
    const cls = w ? 'filled' : i === picked.length ? 'current' : '';
    return `<div class="slot ${cls}"><span class="slot-tag">${s.role}</span>${w ? w.text : '____'}</div>`;
  }).join('');
}

function renderHand() {
  const i = picked.length;
  if (i >= SLOTS.length) { $('#hand').innerHTML = ''; return; }
  const list = CARDS[SLOTS[i].key];
  $('#hand').innerHTML = list.map((w, k) => `
    <div class="card" data-rarity="${w.rarity}" data-i="${k}">
      <div class="card-text">${w.text}</div>
      <div class="card-note">${w.note}</div>
      <div class="card-lore">${w.lore}</div>
      <div class="card-tags">${w.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
    </div>`).join('');

  $$('#hand .card').forEach((el) => el.addEventListener('click', () => {
    picked.push(list[+el.dataset.i]);
    renderSentence();
    if (picked.length === SLOTS.length) fire();
    else renderHand();
  }));
}

function fire() {
  $('#hand').innerHTML = '';
  const c = compile(picked[0], picked[1], picked[2], PLAYER);
  const r = resolve(c, forceMax ? { variance: 0, crit: 0 } : {});

  // 관용구
  $('#combos').innerHTML = r.combos.length
    ? r.combos.map((k, i) => `
        <div class="combo" style="--cd:${0.15 + i * 0.22}s">
          <span class="combo-badge">×${k.mult.toFixed(2)}</span>
          <span>${k.name}</span>
          <span class="combo-flavor">「${k.flavor}」</span>
        </div>`).join('')
    : `<div class="combo" style="--cd:.15s"><span class="dim" style="font-size:26px">맞물린 관용구 없음 — 그래도 손해는 없습니다</span></div>`;

  // 공식 — 게임의 계산을 그대로 노출한다
  const kindLabel = { attack: '공격', guard: '방어', heal: '회복' }[r.kind];
  const statLabel = { atk: '공격력', guard: '방어력', heal: '회복력' }[r.statKey];
  $('#formula').innerHTML = `
    <em>${statLabel} ${PLAYER[r.statKey]}</em> × 계수 ${picked[2].mult}
    &nbsp;·&nbsp; 배율 풀 <em>(1 + ${r.bonusPool.toFixed(2)})</em>
    × 관용구 <em>${r.comboMult.toFixed(2)}</em>
    ${r.variance !== 1 ? `× 확률 <em>${r.variance.toFixed(2)}</em>` : ''}
    × 운 <em>${r.luckMult.toFixed(2)}</em>
    ${r.crit ? `× 대성공 <em>1.50</em>` : ''}
    <br /><span class="dim">= 최종 배수 <em>×${r.mult.toFixed(2)}</em> · ${kindLabel} 문장</span>`;

  // 수치
  const dmg = $('#damage');
  dmg.className = 'damage' + (r.crit ? ' crit' : '') + (r.kind === 'heal' ? ' heal-k' : r.kind === 'guard' ? ' guard-k' : '');
  $('#damage-label').innerHTML = (r.crit ? '<span class="crit-mark">대성공</span><br />' : '') + kindLabel.toUpperCase();

  $('#result').classList.add('on');

  // 수치 롤업 + 화면 임팩트
  const delay = 300 + r.combos.length * 220;
  setTimeout(() => {
    const el = $('#damage-value');
    const t0 = performance.now(), dur = 700;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(r.value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    if (r.combos.length || r.crit) {
      const f = $('#flash');
      f.classList.remove('fire'); void f.offsetWidth; f.classList.add('fire');
    }
    // 토큰이 결과에 반응한다
    if (r.crit && r.combos.length >= 2)
      Token.say(`<b>대성공</b>에 관용구 <b>${r.combos.length}개</b>!! 이게 완벽한 맥락이야!!`, 'relief', 'party');
    else if (r.combos.length)
      Token.say(`「<b>${r.combos[0].name}</b>」 발동!! 앞뒤가 맞물렸어!!`, 'relief', 'crown');
    else
      Token.say('관용구는 안 터졌지만 <b>손해는 하나도 없어</b>. 이득의 종류가 다를 뿐이야!!', '', 'smile');
  }, delay);
}

/* ═══════════════════════════════════════════════════════════════════════════
   피날레 — 문장이 완성되고 관용구처럼 터진다
   ═══════════════════════════════════════════════════════════════════════════ */
function finale() {
  const slide = slides[cur];
  slide.dataset.done = '1';
  msBar.classList.remove('hidden');
  msSlots.forEach((el, i) => setTimeout(() => { el.classList.add('on', 'just-won'); }, i * 260));
  setTimeout(() => {
    msBar.classList.add('complete');
    const f = $('#flash');
    f.classList.remove('fire'); void f.offsetWidth; f.classList.add('fire');
    Token.say('<b>문장 완성!!</b>', 'relief', 'party');
  }, 260 * 4 + 300);
}

/* ═══════════════════════════════════════════════════════════════════════════
   오버뷰 · 입력
   ═══════════════════════════════════════════════════════════════════════════ */
function buildOverview() {
  $('#ov-grid').innerHTML = slides.map((s, i) => {
    const t = ($('h1', s) || $('h2', s) || {}).textContent || s.dataset.chapter || '—';
    return `<div class="ov-item ${i === cur ? 'cur' : ''}" data-i="${i}">
      <span class="n">${String(i + 1).padStart(2, '0')} · ${s.dataset.chapter || ''}</span>
      ${t.trim().slice(0, 40)}</div>`;
  }).join('');
  $$('#ov-grid .ov-item').forEach((el) => el.addEventListener('click', () => {
    $('#overview').classList.remove('on');
    show(+el.dataset.i);
  }));
}

addEventListener('keydown', (e) => {
  const ov = $('#overview');
  switch (e.key) {
    case 'ArrowRight': case ' ': case 'PageDown': case 'Enter':
      e.preventDefault(); ov.classList.remove('on'); next(); break;
    case 'ArrowLeft': case 'PageUp':
      e.preventDefault(); ov.classList.remove('on'); prev(); break;
    case 'Home': show(0); break;
    case 'End': show(slides.length - 1); break;
    case 'r': case 'R': if (slides[cur].id === 'playable') resetAssembler(); break;
    case 'f': case 'F':
      forceMax = !forceMax;
      Token.say(forceMax ? '<b>발표 모드</b> — 확률을 최댓값으로 고정했어!!' : '<b>실전 모드</b> — 확률을 진짜로 굴릴게!!', 'warn', 'neutral');
      break;
    case 'o': case 'O': case 'Escape': ov.classList.toggle('on'); break;
    case 't': case 'T': Token.stage.classList.toggle('hidden'); break;
  }
});

// 클릭으로도 넘긴다 — 카드/오버뷰 클릭은 제외
addEventListener('click', (e) => {
  if (e.target.closest('.card, #overview, #hand')) return;
  if ($('#overview').classList.contains('on')) return;
  next();
});

show(0);
