/* ==============================================
   ECHO 回聲 v3 — Google Auth + Enhanced Battle + Lucky Wheel
   + Publisher Names + Task Dashboard + AI Humor
   ============================================== */

// ===== CONSTANTS =====
const XP_TABLE = { EASY: 30, MEDIUM: 50, HARD: 80 };
const PTS_RATIO = 0.2;
const LEVEL_CAP = 50;
const FREE_TASK_LIMIT = 1;
const TYPE_LABELS = {
    CHORE: '🧹 家事小幫手', LEARNING: '📚 學習挑戰',
    ADVENTURE: '🌳 戶外探險', KINDNESS: '💖 善行任務', CREATIVE: '🎨 創意發想',
    GAME: '🎮 互動遊戲', GOAL: '🏆 成就目標'
};
const PUBLISHER_PRESETS = ['媽媽', '爸爸', '舅舅', '阿姨', '老師', '哥哥', '姊姊', '同學', '夥伴'];

// 3-TIER CHARACTER SYSTEM: custom art + emoji per tier
const CHARACTERS = [
    {
        id: 'warrior', emoji: '⚔️', name: '小劍士', baseClass: '見習劍士', img: 'img/chars/warrior.png',
        tiers: [{ lvl: 1, emoji: '⚔️', title: '見習劍士', color: '#B0A0D0' },
        { lvl: 10, emoji: '🗡️', title: '精銳劍士', color: '#00E5FF' },
        { lvl: 25, emoji: '⚜️', title: '聖騎士', color: '#FFD700' }]
    },
    {
        id: 'mage', emoji: '🧙', name: '小魔法師', baseClass: '見習魔法師', img: 'img/chars/mage.png',
        tiers: [{ lvl: 1, emoji: '🧙', title: '見習魔法師', color: '#B0A0D0' },
        { lvl: 10, emoji: '🔮', title: '元素法師', color: '#00E5FF' },
        { lvl: 25, emoji: '🌟', title: '大魔導師', color: '#FFD700' }]
    },
    {
        id: 'ranger', emoji: '🏹', name: '小弓箭手', baseClass: '見習弓手', img: 'img/chars/ranger.png',
        tiers: [{ lvl: 1, emoji: '🏹', title: '見習弓手', color: '#B0A0D0' },
        { lvl: 10, emoji: '🎯', title: '精準射手', color: '#00E5FF' },
        { lvl: 25, emoji: '🦅', title: '神射鷹眼', color: '#FFD700' }]
    },
    {
        id: 'healer', emoji: '🧝', name: '小精靈', baseClass: '見習精靈', img: 'img/chars/elf.png',
        tiers: [{ lvl: 1, emoji: '🧝', title: '見習精靈', color: '#B0A0D0' },
        { lvl: 10, emoji: '🌿', title: '森林守護者', color: '#00E5FF' },
        { lvl: 25, emoji: '🌸', title: '生命之花', color: '#FFD700' }]
    },
    {
        id: 'ninja', emoji: '🥷', name: '小忍者', baseClass: '見習忍者', img: 'img/chars/ninja.png',
        tiers: [{ lvl: 1, emoji: '🥷', title: '見習忍者', color: '#B0A0D0' },
        { lvl: 10, emoji: '💨', title: '疾風忍者', color: '#00E5FF' },
        { lvl: 25, emoji: '⚡', title: '雷光忍者', color: '#FFD700' }]
    },
    {
        id: 'dragon', emoji: '🐉', name: '小飛龍', baseClass: '見習飛龍', img: 'img/chars/dragon.png',
        tiers: [{ lvl: 1, emoji: '🐉', title: '見習飛龍', color: '#B0A0D0' },
        { lvl: 10, emoji: '🔥', title: '烈焰飛龍', color: '#00E5FF' },
        { lvl: 25, emoji: '🌋', title: '龍王', color: '#FFD700' }]
    },
];

// 3 major class tiers (simplified from 7)
const CLASS_PATH = [
    { lvl: 1, tier: 1, suffix: '見習', color: '#B0A0D0' },
    { lvl: 10, tier: 2, suffix: '進階', color: '#00E5FF' },
    { lvl: 25, tier: 3, suffix: '傳說', color: '#FFD700' },
];

const DEFAULT_REWARDS = [
    { sku: 'R1', title: '🍦 冰淇淋兌換券', desc: '兌換一支冰淇淋', cost: 80, icon: '🍦', custom: false },
    { sku: 'R2', title: '📖 故事書一本', desc: '家長陪讀一本故事書', cost: 50, icon: '📖', custom: false },
    { sku: 'R3', title: '🎮 30分鐘遊戲時間', desc: '額外30分鐘螢幕時間', cost: 100, icon: '🎮', custom: false },
    { sku: 'R4', title: '🌟 神秘驚喜盒', desc: '家長準備的驚喜小禮物', cost: 200, icon: '🎁', custom: false },
    { sku: 'R5', title: '🏕️ 週末戶外冒險', desc: '家長帶你去戶外探險', cost: 300, icon: '🏕️', custom: false },
];

const ACHIEVEMENTS = [
    { id: 'done5', icon: '🥉', name: '見習生', desc: '完成5個任務', check: s => s.completedCount >= 5 },
    { id: 'done20', icon: '🥈', name: '熟練者', desc: '完成20個任務', check: s => s.completedCount >= 20 },
    { id: 'done50', icon: '🥇', name: '任務大師', desc: '完成50個任務', check: s => s.completedCount >= 50 },
    { id: 'boss1', icon: '💀', name: '首戰告捷', desc: '打贏1次魔王', check: s => s.battlesWon >= 1 },
    { id: 'boss10', icon: '👑', name: '魔王剋星', desc: '打贏10次魔王', check: s => s.battlesWon >= 10 },
    { id: 'rich', icon: '💰', name: '大富翁', desc: '累積獲得500點數', check: s => s.points >= 500 },
    { id: 'lvl5', icon: '⭐', name: '漸入佳境', desc: '達到等級5', check: s => s.level >= 5 },
    { id: 'lvl10', icon: '🌟', name: '爐火純青', desc: '達到等級10', check: s => s.level >= 10 },
    { id: 'lvl20', icon: '🏆', name: '傳奇英雄', desc: '達到滿級Lv.20', check: s => s.level >= 20 },
    { id: 'first_blood', icon: '🩸', name: '第一滴血', desc: '第一次完成任務', check: s => s.completedCount >= 1 },
    { id: 'shopaholic', icon: '🛍️', name: '購物狂', desc: '兌換過3次獎勵', check: s => (s.redemptions || []).length >= 3 }
];

// MONSTER POOL for daily battles
const MONSTERS = [
    { name: '史萊姆', emoji: '🟢', hp: 60, atk: 8, xp: 25, pts: 5 },
    { name: '骷髏兵', emoji: '💀', hp: 80, atk: 12, xp: 35, pts: 8 },
    { name: '毒蘑菇', emoji: '🍄', hp: 50, atk: 15, xp: 30, pts: 6 },
    { name: '火焰蜥蜴', emoji: '🦎', hp: 100, atk: 14, xp: 45, pts: 10 },
    { name: '寒冰哥布林', emoji: '🧊', hp: 90, atk: 13, xp: 40, pts: 9 },
    { name: '暗影蝙蝠', emoji: '🦇', hp: 70, atk: 16, xp: 35, pts: 7 },
    { name: '石頭巨人', emoji: '🗿', hp: 150, atk: 10, xp: 60, pts: 15 },
    { name: '幽靈騎士', emoji: '👻', hp: 120, atk: 18, xp: 55, pts: 12 },
];

// AI TASK TEMPLATES (local, no API needed)
const AI_TEMPLATES = {
    CHORE: [
        { title: '整理書桌大冒險', desc: '把書桌上的文具和課本整理歸位，桌面要看得到桌墊！', location: '書房', checklist: ['清空桌面所有物品', '擦拭桌面', '文具放回筆筒', '課本按大小排好', '垃圾丟到垃圾桶'] },
        { title: '廚房小幫手', desc: '幫忙把餐桌上的碗盤收到水槽，並把桌子擦乾淨。', location: '廚房', checklist: ['收集所有碗盤', '放到水槽裡', '擦拭餐桌', '椅子推回原位'] },
        { title: '衣服王國整理術', desc: '把衣櫃裡的衣服重新摺好整齊排列！', location: '臥室', checklist: ['把衣服全部拿出來', '按種類分好', '每件衣服仔細摺好', '放回衣櫃排整齊'] },
        { title: '玩具歸位大作戰', desc: '把散落的玩具按類別放回玩具箱或櫃子裡。', location: '客廳', checklist: ['收集所有散落玩具', '按類別分類', '放回對應位置', '地板清空完畢'] },
    ],
    LEARNING: [
        { title: '英文單字挑戰', desc: '背誦 10 個新的英文單字，並用每個單字造一個句子。', location: '書房', checklist: ['選出10個新單字', '每個字寫3遍', '每個字造一個句子', '找家長聽寫驗收'] },
        { title: '數學闖關賽', desc: '完成數學習題練習，挑戰100分！', location: '書房', checklist: ['打開數學習作', '完成指定頁數', '自己先檢查一遍', '找家長批改'] },
        { title: '閱讀一本繪本', desc: '認真讀完一本繪本，然後跟家長分享故事大意。', location: '客廳', checklist: ['選一本繪本', '安靜閱讀15分鐘', '想想故事在說什麼', '跟家長分享心得'] },
    ],
    ADVENTURE: [
        { title: '公園自然觀察家', desc: '到公園觀察三種不同的植物或昆蟲，並畫下來。', location: '附近公園', checklist: ['帶上畫冊和色鉛筆', '觀察第一種生物', '觀察第二種生物', '觀察第三種生物', '把觀察畫在畫冊上'] },
        { title: '社區探險地圖', desc: '在社區散步一圈，畫一張簡單的社區地圖。', location: '社區', checklist: ['帶上紙和筆', '走一圈社區', '記住重要地標', '回家畫出地圖'] },
    ],
    KINDNESS: [
        { title: '寫一張感謝卡', desc: '親手寫一張感謝卡給家人或朋友，告訴他們你很感謝他們。', location: '家裡', checklist: ['準備卡紙和彩色筆', '想想要感謝誰', '寫下感謝的話', '裝飾卡片', '交給對方'] },
        { title: '鄰居問候行動', desc: '主動向鄰居打招呼，並幫忙提東西或按電梯。', location: '社區', checklist: ['準備好微笑', '主動打招呼', '詢問需要幫忙嗎', '幫忙完成一件小事'] },
    ],
    CREATIVE: [
        { title: '自由畫一幅畫', desc: '用畫筆畫一幅你今天最開心的事！', location: '書桌', checklist: ['準備畫具', '想一個主題', '畫出草稿', '上色完成', '簽上名字和日期'] },
        { title: '手作小禮物', desc: '用家裡現有的材料做一個小手工禮物。', location: '家裡', checklist: ['收集材料', '構思設計', '動手製作', '裝飾完成', '送給你想送的人'] },
    ],
};

// ===== GLOBAL STATE (shared tasks across accounts) =====
let globalData = loadGlobal();
function defaultGlobal() {
    return {
        accounts: {},    // accountId -> account state
        activeId: null,  // current active account ID
        tasks: [],       // shared task pool
        rewards: [...DEFAULT_REWARDS],
        echoes: {},
        familyMembers: [
            { id: 'mom', name: '媽媽', role: 'parent' },
            { id: 'dad', name: '爸爸', role: 'parent' },
            { id: 'child1', name: '小明', role: 'child' },
        ],
    };
}
function defaultAccount(name, role) {
    return {
        name, role, character: null,
        points: 0, level: 1, totalXP: 0, completedCount: 0,
        achievements: [], redemptions: [], activeSub: null,
        battlesWon: 0, lastBattleDate: null,
    };
}
function loadGlobal() {
    try { const r = localStorage.getItem('echo3'); if (r) return JSON.parse(r); } catch (e) { }
    return defaultGlobal();
}
function saveGlobal() { localStorage.setItem('echo3', JSON.stringify(globalData)); }

// Active account helper
function me() { return globalData.accounts[globalData.activeId] || null; }
function myId() { return globalData.activeId; }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Force restore demo tasks if empty or too few for a good demo
    if (globalData.tasks.length < 3) {
        seedDemoTasks();
    }

    if (globalData.activeId && me()) {
        if (!me().character) { showScreen('screen-charselect'); renderCharGrid(); }
        else enterApp();
    }
    initWheel();
});

function seedDemoTasks() {
    const uid = 'demo_child';
    globalData.tasks = [
        { id: 'T_demo1', title: '幫忙收拾玩具', desc: '把客廳散落的玩具放回玩具箱裡，分類整齊！', type: 'CHORE', difficulty: 'EASY', creator: '媽媽', creatorId: 'mom', status: 'PUBLISHED', claimedBy: null, createdAt: Date.now() - 3600000, deadline: null, location: '客廳', checklist: [{ text: '收集散落玩具', done: false }, { text: '按類別分類', done: false }, { text: '放回玩具箱', done: false }] },
        { id: 'T_demo2', title: '背誦九九乘法 7 的段', desc: '完整背誦不能偷看！背完後找媽媽驗收。', type: 'LEARNING', difficulty: 'MEDIUM', creator: '爸爸', creatorId: 'dad', status: 'CLAIMED', claimedBy: uid, claimedAt: Date.now() - 1800000, createdAt: Date.now() - 7200000, deadline: null, location: '書房', checklist: [{ text: '熟讀7的段', done: true }, { text: '不看課本背一遍', done: true }, { text: '找家長驗收', done: false }] },
        { id: 'T_demo3', title: '到公園找三種不同的葉子', desc: '去附近的公園散步，撿三種不同形狀的葉子帶回來觀察！', type: 'ADVENTURE', difficulty: 'HARD', creator: '舅舅', creatorId: 'uncle', status: 'PUBLISHED', claimedBy: null, createdAt: Date.now() - 10800000, deadline: null, location: '社區公園', checklist: [{ text: '帶上袋子和放大鏡', done: false }, { text: '找到第一種葉子', done: false }, { text: '找到第二種葉子', done: false }] },
        { id: 'T_demo4', title: '寫一張感謝卡給老師', desc: '親手寫一張感謝卡，謝謝老師的辛苦教導！', type: 'KINDNESS', difficulty: 'EASY', creator: '阿姨', creatorId: 'aunt', status: 'COMPLETED_PENDING_CONFIRM', claimedBy: uid, completedAt: Date.now() - 600000, createdAt: Date.now() - 14400000, deadline: null, location: '家裡', checklist: [{ text: '準備卡紙', done: true }, { text: '寫感謝的話', done: true }, { text: '裝飾卡片', done: true }] },
        { id: 'T_demo5', title: '和家人一起玩桌遊30分鐘', desc: '選一款桌遊和家人一起玩！記錄誰贏了。', type: 'GAME', difficulty: 'EASY', creator: '姊姊', creatorId: 'sis', status: 'PUBLISHED', claimedBy: null, createdAt: Date.now() - 5400000, deadline: null, location: '客廳', checklist: [{ text: '選一款桌遊', done: false }, { text: '邀請家人', done: false }, { text: '玩30分鐘', done: false }] },
    ];
    saveGlobal();
}

// ===== AUTH =====
function doLogin() {
    const name = document.getElementById('auth-name').value.trim();
    const role = 'child';
    const age = parseInt(document.getElementById('auth-age').value) || 0;
    const loc = document.getElementById('auth-loc').value.trim();
    if (!name) { showToast('請輸入冒險者名稱！'); return; }

    // Check if user exists, if not loginAs will create it. We'll update the data right after.
    loginAs(name, role);
    const a = me();
    if (a) {
        if (age) a.age = age;
        if (loc) a.location = loc;
        saveGlobal();
    }
}

function doGoogleLogin() {
    // Simulated Google login for POC
    showToast('✅ Google 登入成功！');
    loginAs('小明', 'child');
}

function loginAs(name, role) {
    let accId = null;
    for (const [id, acc] of Object.entries(globalData.accounts)) {
        if (acc.name === name) { accId = id; break; }
    }
    if (!accId) {
        accId = 'demo_child';
        globalData.accounts[accId] = defaultAccount(name, role);
    }
    globalData.activeId = accId;
    saveGlobal();
    if (!me().character) {
        showScreen('screen-charselect');
        renderCharGrid();
        showToast(`歡迎，${name}！選擇你的角色！`);
    } else {
        enterApp();
        showToast(`歡迎回來，${name}！`);
    }
}

function doLogout() {
    globalData.activeId = null;
    saveGlobal();
    document.getElementById('main-nav').style.display = 'none';
    showScreen('screen-auth');
}

// ===== CHARACTER =====
let selectedCharId = null;
function renderCharGrid() {
    const grid = document.getElementById('char-grid');
    grid.innerHTML = CHARACTERS.map(c => `
    <div class="char-option ${selectedCharId === c.id ? 'selected' : ''}" onclick="selectChar('${c.id}')">
      <div class="char-avatar class-${c.id}">
        <img src="${c.transparentImg || c.img}" alt="${c.name}" style="width:64px;height:64px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4)); transition: opacity 0.3s; ${!c.transparentImg ? 'opacity: 0.8;' : 'opacity: 1;'}">
      </div>
      <div class="char-name">${c.name}</div>
      <div class="char-class">${c.baseClass}</div>
    </div>
  `).join('');
}
function selectChar(id) { selectedCharId = id; renderCharGrid(); }
function confirmCharacter() {
    if (!selectedCharId) { showToast('請先選一個角色！'); return; }
    const c = CHARACTERS.find(x => x.id === selectedCharId);
    me().character = { ...c };
    saveGlobal();
    showCelebration(c.emoji, `${c.name} 已加入隊伍！`, '冒險即將開始…');
    setTimeout(() => enterApp(), 2500);
}
function getCharTier(level) {
    if (level >= 25) return 2; // tier 3 (index 2)
    if (level >= 10) return 1; // tier 2 (index 1)
    return 0; // tier 1 (index 0)
}
function getCharEmoji(charDef, level) {
    if (!charDef) return '🧙';
    const fullChar = CHARACTERS.find(c => c.id === charDef.id);
    if (!fullChar || !fullChar.tiers) return charDef.emoji;
    const ti = getCharTier(level);
    return fullChar.tiers[ti].emoji;
}
function getCharImg(charDef, size) {
    if (!charDef) return '<img src="img/chars/mage.png" style="width:' + (size || 48) + 'px;height:' + (size || 48) + 'px;object-fit:contain">';
    const fullChar = CHARACTERS.find(c => c.id === charDef.id);
    const src = fullChar ? fullChar.img : 'img/chars/mage.png';
    return '<img src="' + src + '" alt="' + (charDef.name || '') + '" style="width:' + (size || 48) + 'px;height:' + (size || 48) + 'px;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(0,0,0,.35))">';
}
function getClassName(level, char) {
    if (!char) return '';
    const fullChar = CHARACTERS.find(c => c.id === char.id);
    if (fullChar && fullChar.tiers) {
        const ti = getCharTier(level);
        return fullChar.tiers[ti].title;
    }
    let cls = CLASS_PATH[0];
    for (const c of CLASS_PATH) { if (level >= c.lvl) cls = c; }
    return cls.suffix + char.name.replace('小', '');
}
function getClassColor(level) {
    let cls = CLASS_PATH[0];
    for (const c of CLASS_PATH) { if (level >= c.lvl) cls = c; }
    return cls.color;
}

// ===== ENTER APP =====
function enterApp() {
    document.getElementById('main-nav').style.display = 'flex';
    showScreen('screen-home');
    refreshAll();
}

// ===== NAVIGATION =====
let currentScreen = 'screen-auth';
let detailReturnScreen = 'screen-home';

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('hidden', s.id !== id));
    currentScreen = id;
    if (id === 'screen-home') { refreshHUD(); renderTaskFeed(); refreshDailyBanner(); refreshWheelHint(); }
    if (id === 'screen-dashboard') { renderDashboard('week'); }
    if (id === 'screen-mytasks') renderMyTasks();
    if (id === 'screen-rewards') { renderRewards(); document.getElementById('shop-bal').textContent = me()?.points || 0; }
    if (id === 'screen-character') refreshProfile();
    if (id === 'screen-subscription') refreshSubPage();
    if (id === 'screen-create') resetCreateForm();
}
function nav(id, btn) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    showScreen(id);
}

// ===== REFRESH =====
function refreshAll() { refreshHUD(); renderTaskFeed(); checkAchievements(); }

function refreshHUD() {
    const a = me(); if (!a) return;
    const c = a.character;
    const elIcon = document.getElementById('hud-char-icon');
    if (elIcon) elIcon.innerHTML = c ? getCharImg(c, 28) : '🧙';

    const elName = document.getElementById('hud-charname');
    if (elName) elName.textContent = a.name;

    const elLvl = document.getElementById('hud-level');
    if (elLvl) elLvl.textContent = a.level;

    const elPts = document.getElementById('hud-points');
    if (elPts) elPts.textContent = a.points;

    const elDone = document.getElementById('hud-done');
    if (elDone) elDone.textContent = a.completedCount;

    const elStreak = document.getElementById('streak-val');
    if (elStreak) elStreak.textContent = a.streak;

    const xpCur = xpForLevel(a.level);
    const xpNxt = xpForLevel(a.level + 1);
    const pct = xpNxt > xpCur ? ((a.totalXP - xpCur) / (xpNxt - xpCur)) * 100 : 100;

    const elXpFill = document.getElementById('xp-fill');
    if (elXpFill) elXpFill.style.width = Math.min(pct, 100) + '%';

    const elXpCur = document.getElementById('xp-current');
    if (elXpCur) elXpCur.textContent = `${a.totalXP} / ${xpNxt} XP`;

    const elXpNxt = document.getElementById('xp-next');
    if (elXpNxt) elXpNxt.textContent = a.level >= LEVEL_CAP ? 'MAX' : `→ Lv.${a.level + 1}`;
}

function refreshProfile() {
    const a = me(); if (!a) return;
    const c = a.character || { emoji: '🧙', name: '冒險者', id: 'mage' };
    const tierIdx = getCharTier(a.level);
    const bigEl = document.getElementById('prof-char');
    bigEl.innerHTML = getCharImg(c, 80);
    bigEl.className = 'char-big' + (tierIdx === 1 ? ' tier-2' : tierIdx === 2 ? ' tier-3' : '');
    // Set avatar ring gradient based on class
    const ringEl = document.getElementById('prof-avatar-ring');
    ringEl.className = 'char-profile-avatar class-' + (c.id || 'mage');
    document.getElementById('prof-name').textContent = a.name;
    const cn = getClassName(a.level, c);
    document.getElementById('prof-classname').textContent = cn;
    document.getElementById('prof-class-badge').innerHTML = `⭐ Lv.${a.level} ${cn}`;
    document.getElementById('prof-class-badge').style.color = getClassColor(a.level);
    document.getElementById('p-level').textContent = a.level;
    document.getElementById('p-xp').textContent = a.totalXP;
    document.getElementById('p-pts').textContent = a.points;
    document.getElementById('p-tasks').textContent = a.completedCount;
    document.getElementById('menu-sub-label').innerHTML = a.subscription === 'pro'
        ? '<span style="color:#FFD700">Pro</span> <i class="ph ph-caret-right"></i>'
        : '免費版 <i class="ph ph-caret-right"></i>';
    renderAchievements();
}

function refreshSubPage() {
    const a = me(); if (!a) return;
    if (a.subscription === 'pro') {
        document.getElementById('sub-title').textContent = '⭐ Pro 冒險隊員';
        document.getElementById('sub-desc').textContent = '享受無限任務與獨家獎勵！';
        document.getElementById('sub-action-btn').textContent = '已訂閱';
        document.getElementById('sub-action-btn').disabled = true;
        document.getElementById('sub-action-btn').style.opacity = '0.5';
    } else {
        document.getElementById('sub-title').textContent = '免費冒險者';
        document.getElementById('sub-desc').textContent = '可發布 1 次任務體驗';
        document.getElementById('sub-action-btn').textContent = '👑 立即訂閱';
        document.getElementById('sub-action-btn').disabled = false;
        document.getElementById('sub-action-btn').style.opacity = '1';
    }
}

// ===== TASK FEED =====
function renderTaskFeed() {
    const feed = document.getElementById('task-feed');
    const tasks = globalData.tasks.filter(t => t.status !== 'COMPLETED_CONFIRMED').sort((a, b) => b.createdAt - a.createdAt);
    if (!tasks.length) { feed.innerHTML = '<div class="text-center text-muted" style="padding:40px"><p>目前沒有任務！</p></div>'; return; }
    feed.innerHTML = tasks.map(t => taskCardHTML(t)).join('');
}

function taskCardHTML(t) {
    let dlStr = '';
    if (t.deadline) {
        const msLeft = new Date(t.deadline) - new Date();
        const isUrgent = msLeft > 0 && msLeft < 86400000;
        dlStr = `<span class="${isUrgent ? 'text-urgent' : ''}"><i class="ph ph-timer"></i> ${formatDeadline(t.deadline)}${isUrgent ? ' (緊急!)' : ''}</span>`;
    }
    const locStr = t.location ? `<span><i class="ph-fill ph-map-pin"></i> ${esc(t.location)}</span>` : '';
    const checkCount = t.checklist ? t.checklist.length : 0;
    const checkStr = checkCount ? `<span><i class="ph ph-list-checks"></i> ${checkCount}項</span>` : '';
    return `<div class="card task-card" onclick="openDetail('${t.id}')">
    <div class="flex justify-between items-center">
      <div class="task-type">${TYPE_LABELS[t.type] || t.type}</div>
      <span class="status-badge status-${t.status.toLowerCase()}">${statusLabel(t.status)}</span>
    </div>
    <h3>${esc(t.title)}</h3>
    <div class="task-desc">${esc(t.desc)}</div>
    <div class="task-meta">
      <span class="task-publisher"><i class="ph-fill ph-user-circle"></i> ${esc(t.creator)} 發布</span>
      <span><i class="ph-fill ph-lightning"></i> ${XP_TABLE[t.difficulty] || 50} XP</span>
      ${locStr}${dlStr}${checkStr}
    </div>
  </div>`;
}

function statusLabel(s) {
    return { PUBLISHED: '開放中', CLAIMED: '進行中', COMPLETED_PENDING_CONFIRM: '待確認', COMPLETED_CONFIRMED: '✅完成' }[s] || s;
}

// ===== MY TASKS =====
function renderMyTasks() {
    const uid = myId();
    const active = globalData.tasks.filter(t => (t.claimedBy === uid || t.creatorId === uid) && t.status !== 'COMPLETED_CONFIRMED');
    const done = globalData.tasks.filter(t => (t.claimedBy === uid || t.creatorId === uid) && t.status === 'COMPLETED_CONFIRMED');

    document.getElementById('mytasks-active').innerHTML = active.length
        ? active.map(t => taskCardHTML(t)).join('')
        : '<div class="text-center text-muted" style="padding:24px"><p>沒有進行中的任務</p></div>';
    document.getElementById('mytasks-done').innerHTML = done.length
        ? done.map(t => taskCardHTML(t)).join('')
        : '<div class="text-center text-muted" style="padding:24px"><p>還沒完成過任務！</p></div>';
}

// ===== TASK DETAIL =====
function openDetail(taskId, returnTo) {
    detailReturnScreen = returnTo || currentScreen;
    const t = globalData.tasks.find(x => x.id === taskId);
    if (!t) return;
    window._activeTaskId = taskId;

    document.getElementById('det-type').innerHTML = TYPE_LABELS[t.type] || t.type;
    document.getElementById('det-title').textContent = t.title;
    document.getElementById('det-desc').textContent = t.desc;
    document.getElementById('det-creator').textContent = t.creator;
    document.getElementById('det-time').textContent = timeAgo(t.createdAt);
    document.getElementById('det-xp').textContent = XP_TABLE[t.difficulty] || 50;
    document.getElementById('det-pts').textContent = Math.round((XP_TABLE[t.difficulty] || 50) * PTS_RATIO);

    const badge = document.getElementById('det-badge');
    badge.className = 'status-badge status-' + t.status.toLowerCase();
    badge.textContent = statusLabel(t.status);

    // Extra meta (time, location)
    let metaHTML = '';
    if (t.deadline) metaHTML += `<div class="reward-chip mb-2"><i class="ph ph-timer" style="color:var(--orange)"></i> 截止：${formatDeadline(t.deadline)}</div> `;
    if (t.location) metaHTML += `<div class="reward-chip mb-2"><i class="ph-fill ph-map-pin" style="color:var(--secondary)"></i> ${esc(t.location)}</div>`;
    document.getElementById('det-meta-extra').innerHTML = metaHTML ? `<div class="flex gap-2 flex-wrap">${metaHTML}</div>` : '';

    // Checklist
    const checkEl = document.getElementById('det-checklist');
    if (t.checklist && t.checklist.length) {
        const isClaimer = t.claimedBy === myId();
        checkEl.innerHTML = `<h3 class="mb-2" style="font-size:14px;font-weight:900">📝 任務步驟</h3>` +
            t.checklist.map((item, i) => `
        <div class="flex items-center gap-2 mb-2" style="padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:8px;cursor:${isClaimer ? 'pointer' : 'default'}"
          ${isClaimer ? `onclick="toggleCheckItem('${t.id}',${i})"` : ''}>
          <span style="font-size:18px">${item.done ? '✅' : '⬜'}</span>
          <span style="font-size:13px;font-weight:700;${item.done ? 'text-decoration:line-through;color:var(--text3)' : ''}">${esc(item.text)}</span>
        </div>
      `).join('');
    } else { checkEl.innerHTML = ''; }

    // Actions
    const acts = document.getElementById('detail-actions');
    const echoSec = document.getElementById('echo-section');
    const recSec = document.getElementById('record-section');
    echoSec.style.display = 'none'; recSec.style.display = 'none';

    const uid = myId();
    const isMine = t.creatorId === uid;
    let html = '';

    if (t.status === 'PUBLISHED' && !isMine)
        html = `<button class="btn btn-primary btn-block" onclick="claimTask('${t.id}')"><i class="ph-bold ph-hand-grabbing"></i> 接下這個任務！</button>`;
    else if (t.status === 'PUBLISHED' && isMine)
        html = `<p class="text-center text-muted text-sm">等待冒險者接取任務…</p>`;
    else if (t.status === 'CLAIMED' && t.claimedBy === uid)
        html = `<button class="btn btn-magic btn-block" onclick="submitComplete('${t.id}')"><i class="ph-bold ph-check-circle"></i> 任務完成！提交驗收</button>`;
    else if (t.status === 'CLAIMED' && isMine)
        html = `<p class="text-center text-muted text-sm">冒險者正在執行任務…</p>`;
    else if (t.status === 'COMPLETED_PENDING_CONFIRM' && isMine) {
        recSec.style.display = 'block';
        html = `<div class="flex gap-2"><button class="btn btn-green" style="flex:1" onclick="confirmComplete('${t.id}')"><i class="ph-bold ph-seal-check"></i> ✅ 通過！</button><button class="btn btn-secondary" style="flex:1;border-color:var(--red);color:var(--red)" onclick="rejectComplete('${t.id}')"><i class="ph-bold ph-x-circle"></i> ❌ 退回</button></div>`;
    } else if (t.status === 'COMPLETED_PENDING_CONFIRM' && !isMine)
        html = `<p class="text-center text-muted text-sm">已提交，等待 ${esc(t.creator)} 確認…</p>`;
    else if (t.status === 'COMPLETED_CONFIRMED') {
        html = `<p class="text-center font-bold" style="color:var(--green)"><i class="ph-fill ph-check-circle"></i> 冒險完成！</p>`;
        if (globalData.echoes[t.id]) { echoSec.style.display = 'block'; renderEchoPlayer(t.id); }
    }
    acts.innerHTML = html;
    showScreen('screen-detail');
}

function goBackFromDetail() { showScreen(detailReturnScreen); }

function toggleCheckItem(taskId, index) {
    const t = globalData.tasks.find(x => x.id === taskId);
    if (!t || !t.checklist || t.claimedBy !== myId()) return;
    t.checklist[index].done = !t.checklist[index].done;
    saveGlobal();
    openDetail(taskId);
}

// ===== TASK CREATE (Enhanced) =====
let createChecklist = [];

function resetCreateForm() {
    createChecklist = [];
    renderCreateChecklist();
    document.getElementById('c-title').value = '';
    document.getElementById('c-desc').value = '';
    document.getElementById('c-deadline').value = '';
    document.getElementById('c-location').value = '';
}

function renderCreateChecklist() {
    const el = document.getElementById('checklist-items');
    el.innerHTML = createChecklist.map((item, i) => `
    <div class="flex items-center gap-2 mb-2" style="padding:8px 12px;background:var(--surface);border:1px solid var(--border);border-radius:8px">
      <span style="font-size:13px;font-weight:700;flex:1">${i + 1}. ${esc(item)}</span>
      <button class="icon-btn" style="width:28px;height:28px;font-size:14px;color:var(--red)" onclick="removeChecklistItem(${i})"><i class="ph-bold ph-x"></i></button>
    </div>
  `).join('');
}

function addChecklistItem() {
    const input = document.getElementById('checklist-input');
    const val = input.value.trim();
    if (!val) return;
    createChecklist.push(val);
    input.value = '';
    renderCreateChecklist();
}

function removeChecklistItem(i) {
    createChecklist.splice(i, 1);
    renderCreateChecklist();
}

function aiGenerateTask() {
    const type = document.getElementById('c-type').value;
    const templates = AI_TEMPLATES[type] || AI_TEMPLATES.CHORE;
    const tpl = templates[Math.floor(Math.random() * templates.length)];

    document.getElementById('c-title').value = tpl.title;
    document.getElementById('c-desc').value = tpl.desc;
    if (tpl.location) document.getElementById('c-location').value = tpl.location;
    createChecklist = [...tpl.checklist];
    renderCreateChecklist();
    showToast('✨ AI 已為你生成任務內容！');
}

function publishTask() {
    const title = document.getElementById('c-title').value.trim();
    const desc = document.getElementById('c-desc').value.trim();
    const type = document.getElementById('c-type').value;
    const diff = document.getElementById('c-diff').value;
    const deadline = document.getElementById('c-deadline').value || null;
    const location = document.getElementById('c-location').value.trim() || null;
    if (!title) { showToast('請輸入任務名稱！'); return; }
    if (!desc) { showToast('請輸入任務說明！'); return; }

    const a = me();
    if (a.subscription === 'free' && a.tasksPublished >= FREE_TASK_LIMIT) {
        document.getElementById('paywall-modal').classList.add('show');
        return;
    }

    globalData.tasks.unshift({
        id: gid(), title, desc, type, difficulty: diff,
        creator: a.name, creatorId: myId(),
        status: 'PUBLISHED', claimedBy: null, createdAt: Date.now(),
        deadline, location,
        checklist: createChecklist.map(text => ({ text, done: false })),
    });
    a.tasksPublished++;
    saveGlobal();
    showToast('🎉 任務已發布！');
    checkAchievements();
    showScreen('screen-home');
}

// ===== TASK LIFECYCLE =====
function claimTask(id) {
    const t = globalData.tasks.find(x => x.id === id);
    if (!t || t.status !== 'PUBLISHED') return;
    t.status = 'CLAIMED'; t.claimedBy = myId(); t.claimedAt = Date.now();
    saveGlobal();
    showToast('💪 任務已接取！加油！');
    openDetail(id);
}

function submitComplete(id) {
    const t = globalData.tasks.find(x => x.id === id);
    if (!t || t.status !== 'CLAIMED') return;
    t.status = 'COMPLETED_PENDING_CONFIRM'; t.completedAt = Date.now();
    saveGlobal();
    showToast('📤 已提交！等待確認！');
    openDetail(id);
}

function confirmComplete(id) {
    const t = globalData.tasks.find(x => x.id === id);
    if (!t || t.status !== 'COMPLETED_PENDING_CONFIRM') return;
    t.status = 'COMPLETED_CONFIRMED'; t.confirmedAt = Date.now();

    // Award XP+Points to the claimer
    const claimerAcc = globalData.accounts[t.claimedBy];
    if (claimerAcc) {
        const xpG = XP_TABLE[t.difficulty] || 50, ptsG = Math.round(xpG * PTS_RATIO);
        claimerAcc.totalXP += xpG;
        claimerAcc.points += ptsG;
        claimerAcc.completedCount++;
        const oldLvl = claimerAcc.level;
        claimerAcc.level = calcLevel(claimerAcc.totalXP);
        if (claimerAcc.level > oldLvl && t.claimedBy === myId()) {
            showCelebration('🎊', `升級！→ Lv.${claimerAcc.level}`, `職業進化！ +${xpG}XP +${ptsG}點`);
        }
    }

    // Save echo
    if (currentRecordedBlob) {
        const reader = new FileReader();
        reader.onloadend = () => { globalData.echoes[id] = { audio: reader.result, duration: recordSec }; saveGlobal(); };
        reader.readAsDataURL(currentRecordedBlob);
        currentRecordedBlob = null;
    }

    saveGlobal(); checkAchievements();
    const xpG = XP_TABLE[t.difficulty] || 50, ptsG = Math.round(xpG * PTS_RATIO);
    showCelebration('🎉', '任務確認通過！', `獎勵 +${xpG}XP +${ptsG}點 已發送`);
    setTimeout(() => openDetail(id), 2600);
}

function rejectComplete(id) {
    const t = globalData.tasks.find(x => x.id === id);
    if (!t || t.status !== 'COMPLETED_PENDING_CONFIRM') return;
    t.status = 'CLAIMED'; // Send back to in-progress
    // Reset checklist
    if (t.checklist) t.checklist.forEach(c => c.done = false);
    saveGlobal();
    showToast('📋 已退回，請重新完成任務！');
    openDetail(id);
}

// ===== GAMIFICATION =====
function xpForLevel(l) { return Math.floor(50 * l * (l - 1) / 2); }
function calcLevel(xp) { return Math.min(Math.floor((Math.sqrt(1 + 8 * xp / 50) - 1) / 2) + 1, LEVEL_CAP); }

// ===== ACHIEVEMENTS =====
function checkAchievements() {
    const a = me(); if (!a) return;
    // Bind state obj for checks
    const s = { ...a, tasks: globalData.tasks, echoes: globalData.echoes };
    for (const ach of ACHIEVEMENTS) {
        if (!a.achievements.includes(ach.id) && ach.check(s)) {
            a.achievements.push(ach.id);
            saveGlobal();
            setTimeout(() => showToast(`🏆 成就解鎖：${ach.name}！`), 300);
        }
    }
}

function renderAchievements() {
    const a = me(); if (!a) return;

    let obtainedHtml = '';
    let lockedHtml = '';

    ACHIEVEMENTS.forEach(ach => {
        const unlocked = a.achievements.includes(ach.id);
        const itemHtml = `<div class="ach-item ${unlocked ? '' : 'locked'}" title="${ach.desc}"><span class="ach-icon">${ach.icon}</span><div class="ach-name">${ach.name}</div></div>`;
        if (unlocked) {
            obtainedHtml += itemHtml;
        } else {
            lockedHtml += itemHtml;
        }
    });

    const finalHtml = `
        <div style="width:100%; margin-bottom: 24px;">
            <div style="font-size:13px; font-weight:800; color:var(--text2); margin-bottom:8px; padding:0 16px;">已獲得 (${a.achievements.length}/${ACHIEVEMENTS.length})</div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; padding:0 16px;">
                ${obtainedHtml || '<div style="grid-column:1/-1; color:var(--text3); font-size:13px; text-align:center;">尚未獲得成就</div>'}
            </div>
        </div>
        <div style="width:100%;">
            <div style="font-size:13px; font-weight:800; color:var(--text2); margin-bottom:8px; padding:0 16px;">未獲得</div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; padding:0 16px;">
                ${lockedHtml}
            </div>
        </div>
    `;
    document.getElementById('ach-grid').innerHTML = finalHtml;
    // Remove default grid layout from parent to allow sections
    document.getElementById('ach-grid').style.display = 'block';
}

function renderClassPath() {
    const a = me(); if (!a) return;
    const c = a.character; if (!c) return;
    const fullChar = CHARACTERS.find(x => x.id === c.id);
    if (!fullChar || !fullChar.tiers) return;
    document.getElementById('class-path').innerHTML = fullChar.tiers.map((tier, i) => {
        const reached = a.level >= tier.lvl;
        return `<div class="card flex items-center gap-2" style="${reached ? 'border-color:' + tier.color : 'opacity:.4'}">
      <span style="font-size:36px;filter:${reached ? 'none' : 'grayscale(1)'}">${tier.emoji}</span>
      <div>
        <div style="font-weight:900;color:${reached ? tier.color : 'var(--text3)'}">${tier.title}</div>
        <div class="text-xs text-muted">Lv.${tier.lvl} ${i === 0 ? '起始' : '進化'}</div>
      </div>
      <span style="margin-left:auto;font-size:18px">${reached ? '✅' : '🔒'}</span>
    </div>`;
    }).join('');
}

// ===== REWARDS =====
function renderRewards() {
    const a = me(); if (!a) return;
    const heroBal = document.getElementById('shop-bal-hero');
    if (heroBal) heroBal.textContent = a.points;

    // Separate featured reward (highest cost or specific item)
    const sortedRewards = [...globalData.rewards].sort((a, b) => b.cost - a.cost);
    const featured = sortedRewards[0]; // Highest cost is featured
    const regular = sortedRewards.slice(1);

    // Render Featured
    if (featured) {
        const canAffordF = a.points >= featured.cost;
        const htmlF = `
        <div class="card" style="padding: 20px; display:flex; flex-direction:row; align-items:center; border: 2px solid ${canAffordF ? 'rgba(255,215,0,0.6)' : 'rgba(255,255,255,0.1)'}; background: ${canAffordF ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(139,92,246,0.2))' : 'rgba(255,255,255,0.03)'}; box-shadow: ${canAffordF ? '0 0 20px rgba(255,215,0,0.2)' : 'none'}; position:relative; overflow:hidden;">
            <div style="font-size:72px; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.5)); transform: scale(1.1); margin-right: 16px; animation: charFloat 3s ease-in-out infinite;">${featured.icon}</div>
            <div style="flex:1;">
                <div style="font-size:11px; font-weight:900; color:var(--primary); margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">終極大獎</div>
                <h3 style="font-size:18px;font-weight:900;margin-bottom:6px;">${esc(featured.title)}</h3>
                <p class="text-xs text-muted" style="margin-bottom:12px; line-height:1.4;">${esc(featured.desc)}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:900; color:var(--primary); font-size:18px; font-family:monospace; background:rgba(0,0,0,0.3); padding:4px 12px; border-radius:20px;">💰 ${featured.cost}</div>
                    <button class="btn ${canAffordF ? 'btn-magic' : 'btn-secondary'}" style="padding:6px 16px; font-size:14px; border-radius:12px; font-weight:800;" onclick="redeemReward('${featured.sku}')" ${!canAffordF ? 'disabled style="opacity:.5"' : ''}>${canAffordF ? '兌換！' : '點數不足'}</button>
                </div>
            </div>
        </div>`;
        document.getElementById('rewards-featured').innerHTML = htmlF;
    }

    // Render Regular List
    document.getElementById('rewards-list').innerHTML = regular.map(r => {
        const canAfford = a.points >= r.cost;
        return `
    <div class="card" style="padding: 16px 12px; display:flex; flex-direction:column; align-items:center; text-align:center; border: 1px solid ${canAfford ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}; background: ${canAfford ? 'linear-gradient(180deg, rgba(255,215,0,0.08) 0%, rgba(255,255,255,0.02) 100%)' : 'rgba(255,255,255,0.02)'}; ${!canAfford ? 'filter: grayscale(0.6); opacity: 0.7;' : 'box-shadow: 0 4px 12px rgba(255,215,0,0.08);'} transition: transform 0.2s, box-shadow 0.2s;">
      <div style="font-size:48px; margin-bottom:12px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); transform: scale(1.1);">${r.icon}</div>
      <h3 style="font-size:15px;font-weight:900;margin-bottom:4px;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(r.title)}</h3>
      <p class="text-xs text-muted" style="min-height:36px; margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${esc(r.desc)}</p>
      
      <div style="width:100%; height:1px; background:rgba(255,255,255,0.1); margin-bottom:12px;"></div>
      
      <div style="font-weight:900; color:var(--primary); font-size:16px; margin-bottom:12px; font-family:monospace; display:flex; align-items:center; gap:4px;">💰 ${r.cost}</div>
      <button class="btn ${canAfford ? 'btn-primary' : 'btn-secondary'}" style="width:100%; padding:8px 0; font-size:14px; border-radius:12px; margin-top:auto; font-weight:800; border:none;" onclick="redeemReward('${r.sku}')" ${!canAfford ? 'disabled style="opacity:.6"' : ''}>${canAfford ? '兌換！' : '點數不足'}</button>
    </div>
  `;
    }).join('');
}

function redeemReward(sku) {
    const a = me(); if (!a) return;
    const r = globalData.rewards.find(x => x.sku === sku);
    if (!r || a.points < r.cost) { showToast('點數不足！'); return; }
    a.points -= r.cost; a.redemptions.push({ sku, at: Date.now() });
    saveGlobal(); checkAchievements();
    showCelebration(r.icon, '兌換成功！', r.title);
    setTimeout(() => renderRewards(), 2600);
}

function toggleCustomReward() {
    const panel = document.getElementById('custom-reward-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function createCustomReward() {
    const title = document.getElementById('rw-title').value.trim();
    const desc = document.getElementById('rw-desc').value.trim();
    const icon = document.getElementById('rw-icon').value.trim() || '🎁';
    const cost = parseInt(document.getElementById('rw-cost').value) || 0;
    if (!title) { showToast('請輸入獎勵名稱'); return; }
    if (cost < 1) { showToast('點數至少為 1'); return; }
    globalData.rewards.push({ sku: 'C' + Date.now(), title: icon + ' ' + title, desc, icon, cost, custom: true });
    saveGlobal();
    document.getElementById('rw-title').value = ''; document.getElementById('rw-desc').value = '';
    document.getElementById('rw-icon').value = ''; document.getElementById('rw-cost').value = '';

    showToast('🎁 自訂獎勵已新增！');
    showScreen('screen-rewards');
}

// ===== SUBSCRIPTION & REDEEM =====
function processRedeemCode() {
    const code = document.getElementById('redeem-code-input').value.trim().toUpperCase();
    if (!code) { showToast('請輸入兌換碼'); return; }

    const a = me();
    if (!a) return;

    if (code === 'WELCOME100') {
        a.points += 100;
        showCelebration('🪙', '兌換成功！', '獲得 100 點數');
    } else if (code === 'LEVELUP') {
        a.totalXP += 500;
        a.level = calcLevel(a.totalXP);
        showCelebration('🌟', '兌換成功！', '獲得 500 經驗值');
    } else if (code === 'CLEARALL') {
        let count = 0;
        globalData.tasks.forEach(t => {
            if ((t.claimedBy === a.id || t.creatorId === a.id) && t.status !== 'COMPLETED_CONFIRMED') {
                t.status = 'COMPLETED_CONFIRMED';
                count++;
            }
        });
        if (count > 0) {
            a.completedCount += count;
            showCelebration('✅', '兌換成功！', `強制完成 ${count} 個任務`);
        } else {
            showToast('目前沒有進行中的任務');
            return;
        }
    } else {
        showToast('無效的兌換碼或已過期');
        return;
    }

    saveGlobal();
    refreshHUD();
    refreshProfile();
    document.getElementById('redeem-code-input').value = '';
}

function activateSubscription() {
    const a = me(); if (!a) return;
    a.subscription = 'pro'; a.points += 200;
    saveGlobal(); closePaywall();
    showCelebration('👑', '歡迎加入 Pro！', '獲得 200 回聲點數禮包');
    setTimeout(() => refreshAll(), 2600);
}
function closePaywall() { document.getElementById('paywall-modal').classList.remove('show'); }

// ===== AUDIO ECHO =====
let mediaRec = null, audioChunks = [], currentRecordedBlob = null, recordSec = 0, recInt = null, isRec = false;
async function toggleRecording() { isRec ? stopRec() : await startRec(); }
async function startRec() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRec = new MediaRecorder(stream); audioChunks = []; recordSec = 0;
        mediaRec.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
        mediaRec.onstop = () => { currentRecordedBlob = new Blob(audioChunks, { type: 'audio/webm' }); stream.getTracks().forEach(t => t.stop()); document.getElementById('rec-hint').textContent = `✅ 錄音完成 (${recordSec}秒)`; };
        mediaRec.start(); isRec = true;
        document.getElementById('record-btn').classList.add('recording');
        document.getElementById('rec-icon').className = 'ph-fill ph-stop';
        document.getElementById('rec-hint').textContent = '錄音中…點擊停止';
        recInt = setInterval(() => { recordSec++; document.getElementById('rec-timer').textContent = String(Math.floor(recordSec / 60)).padStart(2, '0') + ':' + String(recordSec % 60).padStart(2, '0'); if (recordSec >= 60) stopRec(); }, 1000);
    } catch (e) { showToast('無法存取麥克風'); console.error(e); }
}
function stopRec() { if (mediaRec && mediaRec.state !== 'inactive') mediaRec.stop(); isRec = false; clearInterval(recInt); document.getElementById('record-btn').classList.remove('recording'); document.getElementById('rec-icon').className = 'ph-fill ph-microphone'; }

function renderEchoPlayer(taskId) {
    const echo = globalData.echoes[taskId]; if (!echo) return;
    const bars = Array.from({ length: 12 }, () => '<div class="bar"></div>').join('');
    document.getElementById('echo-container').innerHTML = `<div class="echo-player"><button class="echo-play-btn" onclick="playEcho('${taskId}')"><i class="ph-fill ph-play" id="epi-${taskId}"></i></button><div><div class="echo-wave paused" id="ew-${taskId}">${bars}</div><div class="text-xs text-muted mt-2">${echo.duration || 0}秒 · 回聲鼓勵</div></div></div>`;
}
let curAudio = null;
function playEcho(tid) {
    const echo = globalData.echoes[tid]; if (!echo || !echo.audio) { showToast('回聲未載入'); return; }
    if (curAudio) { curAudio.pause(); curAudio = null; document.querySelectorAll('.echo-wave').forEach(w => w.classList.add('paused')); return; }
    curAudio = new Audio(echo.audio); document.getElementById(`ew-${tid}`).classList.remove('paused'); document.getElementById(`epi-${tid}`).className = 'ph-fill ph-pause';
    curAudio.play().catch(e => console.error(e));
    curAudio.onended = () => { document.getElementById(`ew-${tid}`).classList.add('paused'); document.getElementById(`epi-${tid}`).className = 'ph-fill ph-play'; curAudio = null; };
}

// ===== UI HELPERS =====
let toastTmr;
function showToast(msg) { const el = document.getElementById('toast'); if (!el) return; document.getElementById('toast-msg').textContent = msg; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); clearTimeout(toastTmr); toastTmr = setTimeout(() => { el.classList.remove('show'); }, 2200); }
let celTmr;
function showCelebration(icon, title, sub) { document.getElementById('cel-icon').textContent = icon; document.getElementById('cel-title').textContent = title; document.getElementById('cel-sub').textContent = sub; const cel = document.getElementById('celebration'); cel.classList.add('show'); spawnConfetti(); clearTimeout(celTmr); celTmr = setTimeout(() => cel.classList.remove('show'), 2500); }
function spawnConfetti() { const cel = document.getElementById('celebration'); const co = ['#FFD700', '#FF6B00', '#7C5CFC', '#39FF14', '#FF3860', '#00E5FF', '#FF6EB4', '#B0A0D0']; for (let i = 0; i < 50; i++) { const p = document.createElement('div'); p.style.cssText = `position:absolute;width:${3 + Math.random() * 7}px;height:${3 + Math.random() * 7}px;background:${co[i % co.length]};border-radius:${Math.random() > .5 ? '50%' : '2px'};left:${Math.random() * 100}%;top:${-5 + Math.random() * 25}%;animation:cFall ${1.2 + Math.random() * 2}s ease-out forwards;opacity:.9;pointer-events:none;`; cel.appendChild(p); setTimeout(() => p.remove(), 4000); } }
const csty = document.createElement('style'); csty.textContent = `@keyframes cFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(${window.innerHeight}px) rotate(720deg);opacity:0}}`; document.head.appendChild(csty);

function gid() { return 'T' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function timeAgo(ts) { const d = Date.now() - ts; if (d < 60000) return '剛剛'; if (d < 3600000) return Math.floor(d / 60000) + '分鐘前'; if (d < 86400000) return Math.floor(d / 3600000) + '小時前'; return Math.floor(d / 86400000) + '天前'; }
function formatDeadline(dl) { if (!dl) return ''; try { const d = new Date(dl); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; } catch (e) { return dl; } }

// ===== DAILY BATTLE SYSTEM =====
let battleState = null;

function getDailyMonster() {
    // Deterministic daily monster based on date
    const dayHash = new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return MONSTERS[dayHash % MONSTERS.length];
}

function refreshDailyBanner() {
    const a = me(); if (!a) return;
    const m = getDailyMonster();
    document.getElementById('daily-monster-name').textContent = m.name;
    document.getElementById('daily-monster-emoji').textContent = m.emoji;
    const today = new Date().toDateString();
    if (a.lastBattleDate === today) {
        document.getElementById('daily-battle-hint').textContent = '✅ 今天已挑戰過了！明天再來';
        document.getElementById('battle-banner').style.opacity = '0.5';
    } else {
        document.getElementById('daily-battle-hint').textContent = '點擊開始戰鬥！';
        document.getElementById('battle-banner').style.opacity = '1';
    }
}

function startDailyBattle() {
    const a = me(); if (!a) return;
    const today = new Date().toDateString();
    if (a.lastBattleDate === today) { showToast('今天已經挑戰過了！明天再來！'); return; }
    const m = getDailyMonster();
    const c = a.character;
    const playerHp = 100 + a.level * 5;
    const playerAtk = 15 + a.level * 2;
    battleState = {
        monster: { ...m, curHp: m.hp },
        player: { hp: playerHp, maxHp: playerHp, atk: playerAtk, skillUsed: false, healsLeft: 2 },
        log: [`⚔️ ${m.name} 出現了！準備戰鬥！`],
        done: false
    };
    // Render battle screen
    document.getElementById('bm-sprite').textContent = m.emoji;
    document.getElementById('bm-name').textContent = m.name;
    document.getElementById('bp-sprite').innerHTML = getCharImg(c, 56);
    document.getElementById('bp-name').textContent = a.name;
    updateBattleUI();
    showScreen('screen-battle');
}

function updateBattleUI() {
    if (!battleState) return;
    const bs = battleState;
    const mPct = Math.max(0, (bs.monster.curHp / bs.monster.hp) * 100);
    const pPct = Math.max(0, (bs.player.hp / bs.player.maxHp) * 100);
    document.getElementById('bm-hp').style.width = mPct + '%';
    document.getElementById('bm-hp-text').textContent = `HP: ${Math.max(0, bs.monster.curHp)}/${bs.monster.hp}`;
    document.getElementById('bp-hp').style.width = pPct + '%';
    document.getElementById('bp-hp-text').textContent = `HP: ${Math.max(0, bs.player.hp)}/${bs.player.maxHp}`;
    document.getElementById('battle-log').innerHTML = bs.log.map(l => `<div>${l}</div>`).join('');
    document.getElementById('battle-log').scrollTop = 9999;
    // Disable buttons if done
    document.getElementById('btn-attack').disabled = bs.done;
    document.getElementById('btn-skill').disabled = bs.done || bs.player.skillUsed;
    document.getElementById('btn-heal').disabled = bs.done || bs.player.healsLeft <= 0;
    if (bs.done) {
        document.getElementById('btn-attack').style.opacity = '0.4';
        document.getElementById('btn-skill').style.opacity = '0.4';
        document.getElementById('btn-heal').style.opacity = '0.4';
    }
}

function battleAttack() {
    if (!battleState || battleState.done) return;
    const bs = battleState;
    const dmg = Math.floor(bs.player.atk * (0.8 + Math.random() * 0.4));
    bs.monster.curHp -= dmg;
    bs.log.push(`<span class="log-atk">⚔️ 你攻擊了 ${bs.monster.name}，造成 ${dmg} 傷害！</span>`);
    rushAnim('bp-sprite');
    shakeElement('bm-sprite');
    hurtFlash('bm-sprite');
    spawnDmgFloat('monster-area', `-${dmg}`, 'atk');
    if (bs.monster.curHp <= 0) { battleWin(); } else { setTimeout(() => { monsterTurn(); updateBattleUI(); }, 600); }
    updateBattleUI();
}

function battleSkill() {
    if (!battleState || battleState.done || battleState.player.skillUsed) return;
    const bs = battleState;
    bs.player.skillUsed = true;
    const dmg = Math.floor(bs.player.atk * 2.5);
    bs.monster.curHp -= dmg;
    bs.log.push(`<span class="log-skill">💥 必殺技！造成 ${dmg} 暴擊傷害！</span>`);
    rushAnim('bp-sprite');
    shakeElement('bm-sprite');
    hurtFlash('bm-sprite');
    spawnDmgFloat('monster-area', `-${dmg}`, 'crit');
    if (bs.monster.curHp <= 0) { battleWin(); } else { setTimeout(() => { monsterTurn(); updateBattleUI(); }, 600); }
    updateBattleUI();
}

function battleHeal() {
    if (!battleState || battleState.done || battleState.player.healsLeft <= 0) return;
    const bs = battleState;
    bs.player.healsLeft--;
    const heal = Math.floor(bs.player.maxHp * 0.3);
    bs.player.hp = Math.min(bs.player.maxHp, bs.player.hp + heal);
    bs.log.push(`<span class="log-heal">💚 治療！恢復 ${heal} 生命值！(剩餘 ${bs.player.healsLeft} 次)</span>`);
    spawnDmgFloat('player-area', `+${heal}`, 'heal');
    setTimeout(() => { monsterTurn(); updateBattleUI(); }, 400);
    updateBattleUI();
}

function monsterTurn() {
    if (!battleState || battleState.done) return;
    const bs = battleState;
    const dmg = Math.floor(bs.monster.atk * (0.7 + Math.random() * 0.6));
    bs.player.hp -= dmg;
    bs.log.push(`<span class="log-enemy">👹 ${bs.monster.name} 反擊！造成 ${dmg} 傷害！</span>`);
    shakeElement('bp-sprite');
    spawnDmgFloat('player-area', `-${dmg}`, 'atk');
    if (bs.player.hp <= 0) { battleLose(); }
}

function battleWin() {
    const bs = battleState;
    bs.done = true;
    bs.monster.curHp = 0;
    const a = me();
    const xpGain = bs.monster.xp;
    const ptsGain = bs.monster.pts;
    a.totalXP += xpGain;
    a.points += ptsGain;
    a.battlesWon = (a.battlesWon || 0) + 1;
    a.lastBattleDate = new Date().toDateString();
    const oldLvl = a.level;
    a.level = calcLevel(a.totalXP);
    saveGlobal(); checkAchievements();
    bs.log.push(`<span class="log-win">🎉 勝利！獲得 +${xpGain} XP · +${ptsGain} 點數！</span>`);
    if (a.level > oldLvl) {
        const newClass = getClassName(a.level, a.character);
        bs.log.push(`<span class="log-win">🎊 升級！→ Lv.${a.level} ${newClass}</span>`);
    }
    setTimeout(() => showCelebration('🏆', '戰鬥勝利！', `+${xpGain} XP · +${ptsGain} 點`), 500);
}

function battleLose() {
    const bs = battleState;
    bs.done = true;
    bs.player.hp = 0;
    const a = me();
    // Consolation: small XP just for trying
    a.totalXP += 5;
    a.lastBattleDate = new Date().toDateString();
    a.level = calcLevel(a.totalXP);
    saveGlobal();
    bs.log.push(`<span class="log-enemy">💔 戰敗了…獲得 +5 XP 安慰獎</span>`);
    bs.log.push(`<span class="log-enemy">明天可以再次挑戰！</span>`);
    setTimeout(() => showToast('下次加油！明天再來挑戰！'), 800);
}

function exitBattle() {
    battleState = null;
    showScreen('screen-home');
}

function shakeElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('shake-hit');
    void el.offsetWidth;
    el.classList.add('shake-hit');
    setTimeout(() => el.classList.remove('shake-hit'), 500);
}
function rushAnim(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('attack-rush');
    void el.offsetWidth;
    el.classList.add('attack-rush');
    setTimeout(() => el.classList.remove('attack-rush'), 500);
}
function hurtFlash(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('monster-hurt');
    void el.offsetWidth;
    el.classList.add('monster-hurt');
    setTimeout(() => el.classList.remove('monster-hurt'), 400);
}
// ===== UTILS =====
function getCharImg(cId, size) {
    const c = CHARACTERS.find(x => x.id === cId);
    if (!c) return '🧙';
    return `<img src="${c.transparentImg || c.img}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:contain; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">`;
}

function esc(s) {
    if (!s) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return s.replace(/[&<>"']/g, m => map[m]);
}

function showToast(msg) {
    const b = document.createElement('div');
    b.className = 'toast show';
    b.innerHTML = msg;
    document.body.appendChild(b);
    setTimeout(() => { b.classList.remove('show'); setTimeout(() => b.remove(), 300); }, 3000);
}

// ===== BACKGROUND REMOVAL (Imgly) =====
async function initTransparentCharacters() {
    if (typeof imglyRemoveBackground === 'undefined') return;

    // We only process them once and store the blob URL in memory
    for (let c of CHARACTERS) {
        if (!c.img || c.transparentImg) continue;

        try {
            console.log(`Processing background removal for ${c.name}...`);
            const blob = await imglyRemoveBackground(c.img);
            c.transparentImg = URL.createObjectURL(blob);

            // Re-render components if needed now that transparent version is ready
            if (document.getElementById('screen-charselect') && !document.getElementById('screen-charselect').classList.contains('hidden')) {
                renderCharGrid();
            }
            refreshAll();
        } catch (e) {
            console.error("Failed to remove background for " + c.id, e);
        }
    }
}

// Start processing slightly after load to not block UI
setTimeout(() => {
    initTransparentCharacters();
}, 1000);
function spawnDmgFloat(areaId, text, type) {
    const area = document.getElementById(areaId);
    if (!area) return;
    area.style.position = 'relative';
    const el = document.createElement('div');
    el.className = 'damage-float' + (type === 'heal' ? ' heal' : '') + (type === 'crit' ? ' crit' : '');
    el.textContent = text;
    el.style.left = (30 + Math.random() * 40) + '%';
    el.style.top = '10px';
    area.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

// ===== LUCKY WHEEL =====
const WHEEL_PRIZES = [
    { label: '+10 點數', icon: '💰', action: a => { a.points += 10; } },
    { label: '+20 XP', icon: '⭐', action: a => { a.totalXP += 20; a.level = calcLevel(a.totalXP); } },
    { label: '+5 點數', icon: '🪙', action: a => { a.points += 5; } },
    { label: '+30 XP', icon: '🔥', action: a => { a.totalXP += 30; a.level = calcLevel(a.totalXP); } },
    { label: '再轉一次', icon: '🌀', action: () => { } },
    { label: '+15 點數', icon: '🌟', action: a => { a.points += 15; } },
    { label: '+50 XP', icon: '💎', action: a => { a.totalXP += 50; a.level = calcLevel(a.totalXP); } },
    { label: '+25 點數', icon: '🏆', action: a => { a.points += 25; } },
];
const WHEEL_COLORS = ['#FF6B00', '#7C5CFC', '#39FF14', '#FF3860', '#FFD700', '#00E5FF', '#FF6EB4', '#B0A0D0'];
let wheelSpinning = false;

function initWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    drawWheel(canvas, 0);
}

function drawWheel(canvas, rotation) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 4;
    const n = WHEEL_PRIZES.length;
    const arc = (2 * Math.PI) / n;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, i * arc, (i + 1) * arc);
        ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Text
        ctx.save();
        ctx.rotate(i * arc + arc / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Nunito';
        ctx.fillText(WHEEL_PRIZES[i].icon, r * 0.65, 4);
        ctx.font = 'bold 9px Nunito';
        ctx.fillText(WHEEL_PRIZES[i].label, r * 0.45, 16);
        ctx.restore();
    }
    ctx.restore();
}

function openLuckyWheel() {
    const a = me(); if (!a) return;
    const today = new Date().toDateString();
    if (a.lastWheelDate === today) {
        showToast('今天已經轉過了！明天再來！');
        return;
    }
    showScreen('screen-wheel');
    initWheel();
}

function spinWheel() {
    if (wheelSpinning) return;
    const a = me(); if (!a) return;
    const today = new Date().toDateString();
    if (a.lastWheelDate === today) { showToast('今天已轉過了！'); return; }
    wheelSpinning = true;
    document.getElementById('wheel-spin-btn').disabled = true;
    document.getElementById('wheel-result').textContent = '';
    const canvas = document.getElementById('wheel-canvas');
    const n = WHEEL_PRIZES.length;
    const winIdx = Math.floor(Math.random() * n);
    const arc = (2 * Math.PI) / n;
    const targetAngle = (2 * Math.PI * 5) + (2 * Math.PI - winIdx * arc - arc / 2);
    let currentAngle = 0;
    const duration = 3000;
    const start = performance.now();
    function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        currentAngle = targetAngle * ease;
        drawWheel(canvas, currentAngle);
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            wheelSpinning = false;
            const prize = WHEEL_PRIZES[winIdx];
            prize.action(a);
            a.lastWheelDate = today;
            saveGlobal();
            document.getElementById('wheel-result').textContent = `🎉 獲得：${prize.icon} ${prize.label}！`;
            showCelebration(prize.icon, '轉盤獲獎！', prize.label);
            if (prize.label === '再轉一次') {
                a.lastWheelDate = null; saveGlobal();
                document.getElementById('wheel-spin-btn').disabled = false;
            }
        }
    }
    requestAnimationFrame(animate);
}

function refreshWheelHint() {
    const a = me(); if (!a) return;
    const hint = document.getElementById('wheel-hint');
    if (hint) {
        const today = new Date().toDateString();
        hint.textContent = a.lastWheelDate === today ? '✅ 今天已轉過' : '今天還沒轉！免費一次';
    }
}

// ===== TASK COMPLETION DASHBOARD =====
let currentDashPeriod = 'week';

function switchDashPeriod(period, btn) {
    currentDashPeriod = period;
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderDashboard(period);
}

function renderDashboard(period) {
    const a = me(); if (!a) return;
    const uid = myId();
    const now = new Date();
    // Calculate period start
    let startDate;
    if (period === 'week') {
        const d = new Date(now); d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); startDate = d.getTime();
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    } else if (period === 'year') {
        startDate = new Date(now.getFullYear(), 0, 1).getTime();
    } else {
        startDate = 0; // all time
    }
    // Filter tasks for this user in period
    const tasks = globalData.tasks.filter(t => {
        const time = t.completedAt || t.claimedAt || t.createdAt || 0;
        return (t.claimedBy === uid || t.creatorId === uid) && time >= startDate;
    });
    const done = tasks.filter(t => t.status === 'COMPLETED_CONFIRMED' || t.status === 'COMPLETED_PENDING_CONFIRM');
    const failed = tasks.filter(t => t.status === 'FAILED' || t.status === 'EXPIRED');
    const total = tasks.length;
    // Summary
    document.getElementById('dash-summary').innerHTML = `
        <div class="dash-stat stat-done"><span class="ds-val">${done.length}</span><span class="ds-label">✅ 完成</span></div>
        <div class="dash-stat stat-fail"><span class="ds-val">${failed.length}</span><span class="ds-label">❌ 失敗</span></div>
        <div class="dash-stat stat-total"><span class="ds-val">${total}</span><span class="ds-label">📋 總任務</span></div>
    `;
    // Type breakdown
    const typeCount = {};
    const typeColors = { CHORE: '#FF6B00', LEARNING: '#7C5CFC', ADVENTURE: '#39FF14', KINDNESS: '#FF6EB4', CREATIVE: '#00E5FF', GAME: '#FFD700', GOAL: '#FF3860' };
    Object.keys(TYPE_LABELS).forEach(k => typeCount[k] = 0);
    done.forEach(t => { if (typeCount[t.type] !== undefined) typeCount[t.type]++; });
    const maxCount = Math.max(1, ...Object.values(typeCount));
    document.getElementById('dash-type-grid').innerHTML = Object.entries(TYPE_LABELS).map(([k, label]) => {
        const c = typeCount[k];
        const pct = (c / maxCount * 100).toFixed(0);
        const color = typeColors[k] || 'var(--primary)';
        return `<div class="dash-type-card">
            <span class="dash-type-icon">${label.split(' ')[0]}</span>
            <div class="dash-type-info">
                <div class="dash-type-name">${label}</div>
                <div class="dash-type-bar"><div class="dash-type-bar-fill" style="width:${pct}%;background:${color}"></div></div>
                <div class="dash-type-count">${c} 個完成</div>
            </div>
        </div>`;
    }).join('');
    // Achievements in this period
    const achList = ACHIEVEMENTS.filter(ach => {
        const s = { completedCount: done.length, tasks: tasks, battlesWon: a.battlesWon || 0, points: a.points, level: a.level, totalXP: a.totalXP, redemptions: a.redemptions || [] };
        try { return ach.check(s); } catch (e) { return false; }
    });
    document.getElementById('dash-achievements').innerHTML = achList.length > 0
        ? `<div class="dash-ach-row">${achList.map(a => `<span class="dash-ach-chip">${a.icon} ${a.name}</span>`).join('')}</div>`
        : '<div class="text-muted" style="font-size:12px;padding:8px 0">尚未達成任何成就，繼續加油！</div>';
    // AI humor comment
    const comment = getAIComment(done.length, failed.length, total, typeCount, period);
    document.getElementById('dash-ai-text').textContent = comment;
}

function getAIComment(done, failed, total, typeCount, period) {
    const periodName = { week: '這週', month: '這個月', year: '今年', all: '到目前為止' }[period];
    // No tasks at all
    if (total === 0) {
        const idle = [
            `${periodName}你完全沒動耶…是在練習「忍術：完全隱身」嗎？🥷`,
            `${periodName}零任務？你是不是把冒險當觀光在玩？📸`,
            `任務板空空如也，連史萊姆看了都替你著急 🟢💦`,
            `${periodName}的任務數量跟我銀行餘額一樣——零 😭`,
            `勇者大人，${periodName}休息夠了吧？該出門打怪了！⚔️`,
        ];
        return idle[Math.floor(Math.random() * idle.length)];
    }
    // All done, none failed
    if (done === total && total > 0) {
        const perfect = [
            `${periodName}全部完成！你是不是開了外掛？🤖💯`,
            `100% 完成率！你媽看到一定超驕傲 👩‍👧‍👦✨`,
            `完美表現！這個勇者有前途，連魔王都要怕 🐲💀`,
            `${periodName}根本是任務粉碎機，給你跪了 🧎‍♂️`,
            `全滿！廢話不多說，直接封你為「${periodName}MVP」🏆`,
            `太猛了吧！你的完成率比珍珠奶茶的珍珠還要滿 🧋`,
        ];
        return perfect[Math.floor(Math.random() * perfect.length)];
    }
    // Mostly failed
    if (failed > done && total > 0) {
        const oof = [
            `${periodName}失敗比完成多…沒關係，失敗為成功之母，你媽一定也這樣說 👩`,
            `戰績有點慘烈，但至少你有勇氣接任務！比待在村子裡的NPC強多了 🏠`,
            `嗯…成績不太好看，但沒關係，連林書豪也有低潮期 🏀`,
            `${periodName}有點卡關齁？建議你先從簡單任務開始，打怪也要循序漸進 📈`,
        ];
        return oof[Math.floor(Math.random() * oof.length)];
    }
    // Some mix
    const rate = total > 0 ? Math.round(done / total * 100) : 0;
    const mixed = [
        `${periodName}完成 ${done} 個任務，完成率 ${rate}%，跟段考成績差不多嘛 📝`,
        `${rate}% 完成率！不算差，但離「台積電等級」還有一段距離 🏭`,
        `做了 ${done} 個任務，CP值不錯👍 下次目標：打敗自己的紀錄！`,
        `${periodName}的表現就像鹹酥雞——外表普通但其實蠻好吃的 🍗`,
        `完成了 ${done}/${total} 個任務。嗯，有進步的空間，就像手搖飲的甜度一樣可以調 🧋`,
        `${rate}%！勇者的道路本來就不容易，至少你沒放棄 💪`,
    ];
    // Bonus for specific types
    if (typeCount.KINDNESS > 0) {
        mixed.push(`善良值 MAX！你做了 ${typeCount.KINDNESS} 個善行任務，這個世界因為你更美好了 🌈`);
    }
    if (typeCount.ADVENTURE > 0) {
        mixed.push(`出門冒險了 ${typeCount.ADVENTURE} 次！比大部分宅在家的大人還厲害 🌳🚶`);
    }
    if (typeCount.LEARNING > 0) {
        mixed.push(`學習了 ${typeCount.LEARNING} 個知識挑戰！你的腦袋一定比 WiFi 訊號還強 📶🧠`);
    }
    return mixed[Math.floor(Math.random() * mixed.length)];
}
