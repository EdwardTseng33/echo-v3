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
        id: 'warrior', emoji: '⚔️', name: '劍士', baseClass: '見習劍士', img: 'img/chars/warrior.png',
        quotes: [
            "又在摸魚？我的大劍都生鏽了啦！",
            "這點小任務也叫大冒險？我阿嬤都解得比你快。",
            "快點動起來啊，你想當一輩子的見習生嗎？",
            "看什麼看？還不快去農經驗值！"
        ],
        tiers: [{ lvl: 1, emoji: '⚔️', title: '見習劍士', color: '#B0A0D0' },
        { lvl: 10, emoji: '🗡️', title: '精銳劍士', color: '#00E5FF' },
        { lvl: 25, emoji: '⚜️', title: '聖騎士', color: '#FFD700' }]
    },
    {
        id: 'mage', emoji: '🧙', name: '魔法師', baseClass: '見習魔法師', img: 'img/chars/mage.png',
        quotes: [
            "你的智力點數是不是都拿去換珍奶了？",
            "進度太慢了！看來你需要一發火球術醒醒腦。",
            "身為偉大魔法師的夥伴，你這完成率不及格啊！",
            "我感受不到你的魔力...啊，原來是你在發呆。"
        ],
        tiers: [{ lvl: 1, emoji: '🧙', title: '見習魔法師', color: '#B0A0D0' },
        { lvl: 10, emoji: '🔮', title: '元素法師', color: '#00E5FF' },
        { lvl: 25, emoji: '🌟', title: '大魔導師', color: '#FFD700' }]
    },
    {
        id: 'ranger', emoji: '🏹', name: '弓箭手', baseClass: '見習弓手', img: 'img/chars/ranger.png',
        quotes: [
            "我的箭可是長眼睛的，你偷懶我看得一清二楚！",
            "解個任務拖拖拉拉的，像在閉著眼睛射靶。",
            "少囉嗦，快出發吧！不然我就拿你當標靶！",
            "風告訴我...你今天好像還沒什麼進度喔？"
        ],
        tiers: [{ lvl: 1, emoji: '🏹', title: '見習弓手', color: '#B0A0D0' },
        { lvl: 10, emoji: '🎯', title: '精準射手', color: '#00E5FF' },
        { lvl: 25, emoji: '🦅', title: '神射鷹眼', color: '#FFD700' }]
    },
    {
        id: 'healer', emoji: '🧝', name: '小精靈', baseClass: '見習精靈', img: 'img/chars/elf.png',
        quotes: ["今天也要開開心心的解任務喔！", "別太累了，記得喝水休息！", "哇！你真的好棒！"],
        tiers: [{ lvl: 1, emoji: '🧝', title: '見習精靈', color: '#B0A0D0' },
        { lvl: 10, emoji: '🌿', title: '森林守護者', color: '#00E5FF' },
        { lvl: 25, emoji: '🌸', title: '生命之花', color: '#FFD700' }]
    },
];

// 3 major class tiers (simplified from 7)
const CLASS_PATH = [
    { lvl: 1, tier: 1, suffix: '見習', color: '#B0A0D0' },
    { lvl: 10, tier: 2, suffix: '進階', color: '#00E5FF' },
    { lvl: 25, tier: 3, suffix: '傳說', color: '#FFD700' },
];

const DEFAULT_REWARDS = [
    { sku: 'EQ1', title: '🗡️ 新手鐵劍', desc: '+5 攻擊力', cost: 150, icon: '🗡️', type: 'EQUIP', atk: 5, def: 0, custom: false },
    { sku: 'EQ2', title: '🛡️ 木板盾牌', desc: '+5 防禦力', cost: 150, icon: '🛡️', type: 'EQUIP', atk: 0, def: 5, custom: false },
    { sku: 'EQ3', title: '🔥 烈焰法杖', desc: '+15 攻擊力', cost: 500, icon: '🔥', type: 'EQUIP', atk: 15, def: 0, custom: false },
    { sku: 'R0', title: '🧪 治療藥水', desc: '恢復 100% 總血量，挑戰魔王必備！', cost: 15, icon: '<i class="ph-bold ph-flask"></i>', type: 'POTION', custom: false },
    { sku: 'R1', title: '🍦 冰淇淋兌換券', desc: '兌換一支冰淇淋', cost: 80, icon: '🍦', custom: false },
    { sku: 'R2', title: '📖 故事書一本', desc: '家長陪讀一本故事書', cost: 50, icon: '📖', custom: false },
    { sku: 'R3', title: '🎮 30分鐘遊戲時間', desc: '額外30分鐘螢幕時間', cost: 100, icon: '🎮', custom: false },
    { sku: 'R4', title: '🌟 神秘驚喜盒', desc: '家長準備的驚喜小禮物', cost: 200, icon: '🎁', custom: false },
    { sku: 'R5', title: '🏕️ 週末戶外冒險', desc: '家長帶你去戶外探險', cost: 300, icon: '🏕️', custom: false },
];

const ACHIEVEMENTS = [
    { id: '3tasks', icon: '🦄', name: '好事成三', desc: '勇於嘗試！發布或是進行3個任務', check: s => { const myT = s.tasks.filter(t => t.creatorId === s.id || t.claimedBy === s.id); return myT.length >= 3; }, reward: { name: '彩虹小馬', emoji: '🦄', atk: 5, def: 5, desc: '充滿魔力的小夥伴，會為你提振士氣！' } },
    { id: 'done5', icon: '🥉', name: '見習生', desc: '完成5個任務', check: s => s.completedCount >= 5 },
    { id: 'done20', icon: '🥈', name: '熟練者', desc: '完成20個任務', check: s => s.completedCount >= 20 },
    { id: 'done50', icon: '🥇', name: '任務大師', desc: '完成50個任務', check: s => s.completedCount >= 50 },
    { id: 'boss1', icon: '💀', name: '首戰告捷', desc: '打贏1次魔王', check: s => s.battlesWon >= 1 },
    { id: 'boss10', icon: '👑', name: '魔王剋星', desc: '打贏10次魔王', check: s => s.battlesWon >= 10 },
    { id: 'rich', icon: '<i class="ph-bold ph-coin"></i>', name: '大富翁', desc: '累積獲得500點數', check: s => s.points >= 500 },
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

// ===== SFX MANAGER (Web Audio API) =====
const SoundManager = {
    ctx: null,
    init: function () {
        if (!this.ctx) {
            try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
            catch (e) { console.warn('Web Audio API not supported'); }
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    play: function (type) {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        // Retro sound synthesis rules
        if (type === 'click') {
            // Removed click sound logic
        } else if (type === 'attack') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        } else if (type === 'skill') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.1);
            osc.frequency.linearRampToValueAtTime(200, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'heal') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        } else if (type === 'win') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.setValueAtTime(400, now + 0.1);
            osc.frequency.setValueAtTime(500, now + 0.2);
            osc.frequency.setValueAtTime(600, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now); osc.stop(now + 0.6);
        }
    }
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
        battlesWon: 0, lastBattleDate: null, potions: 0,
        consecutiveLogins: 0, lastDailyClaim: null,
        equipment: []
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

function getPlayerStats(acc) {
    if (!acc) return { atk: 0, def: 0, pets: [] };
    let atk = 15 + acc.level * 2;
    let def = 5 + acc.level * 1;
    let pets = [];

    // Add pet bonuses from unlocked achievements
    for (const achId of acc.achievements) {
        const achDef = ACHIEVEMENTS.find(x => x.id === achId);
        if (achDef && achDef.reward) {
            atk += (achDef.reward.atk || 0);
            def += (achDef.reward.def || 0);
            pets.push(achDef.reward);
        }
    }

    // Add Equipment bonuses
    if (acc.equipment) {
        for (const eq of acc.equipment) {
            atk += (eq.atk || 0);
            def += (eq.def || 0);
        }
    }

    return { atk, def, pets };
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Force restore demo tasks if empty or too few for a good demo
    if (globalData.tasks.length < 3) {
        seedDemoTasks();
    }

    if (globalData.activeId && me()) {
        if (!me().character) {
            showScreen('screen-auth-step2');
            renderCharGrid();
        } else {
            enterApp();
        }
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
function doLoginStep1() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    if (!email) { showToast('請輸入 Email！'); return; }
    if (!password) { showToast('請輸入密碼！'); return; }

    // POC: check if existing account with this email
    let accId = null;
    for (const [id, acc] of Object.entries(globalData.accounts)) {
        if (acc.email === email) { accId = id; break; }
    }

    if (accId) {
        // Existing user — log in directly
        globalData.activeId = accId;
        saveGlobal();
        if (!me().character) {
            showScreen('screen-auth-step2');
            renderCharGrid();
            showToast('歡迎回來！請完成你的冒險者檔案');
        } else {
            enterApp();
            showToast(`歡迎回來，${me().name}！`);
        }
    } else {
        // New user — create account stub, go to step 2
        accId = 'U' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
        globalData.accounts[accId] = defaultAccount('冒險者', 'child');
        globalData.accounts[accId].email = email;
        globalData.activeId = accId;
        saveGlobal();
        showScreen('screen-auth-step2');
        renderCharGrid();
        showToast('帳號已建立！請輸入你的資訊');
    }
}

function completeRegistration() {
    const name = document.getElementById('auth-name').value.trim();
    const age = parseInt(document.getElementById('auth-age').value) || 0;
    const loc = document.getElementById('auth-loc').value.trim();
    if (!name) { showToast('請輸入冒險者名稱！'); return; }
    if (!selectedCharId) { showToast('請選擇一個角色！'); return; }

    const a = me();
    a.name = name;
    if (age) a.age = age;
    if (loc) a.location = loc;

    const c = CHARACTERS.find(x => x.id === selectedCharId);
    a.character = { ...c };
    saveGlobal();
    showCelebration(c.emoji, `${c.name} 已加入隊伍！`, '冒險即將開始…');
    setTimeout(() => enterApp(), 2500);
}

// Legacy doLogin for backward compatibility
function doLogin() { doLoginStep1(); }

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
        showScreen('screen-auth-step2');
        renderCharGrid();
        showToast(`歡迎，${name}！完成你的冒險者檔案！`);
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
      <div class="char-avatar">
        <img src="${c.img}" alt="${c.name}" style="width:80px;height:80px;object-fit:contain;filter:drop-shadow(0 4px 10px rgba(0,0,0,.3));">
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
let dialogueInterval = null;

function enterApp() {
    document.getElementById('main-nav').style.display = 'flex';
    showScreen('screen-home');
    refreshAll();

    checkDailyLogin();

    // Setup Random Character Dialogues
    if (dialogueInterval) clearInterval(dialogueInterval);
    dialogueInterval = setInterval(() => {
        if ((currentScreen === 'screen-home' || currentScreen === 'screen-character') && Math.random() > 0.4) {
            showCharacterQuote();
        }
    }, 6000); // 6 seconds
}

function showCharacterQuote() {
    const a = me();
    if (!a || !a.character || !a.character.quotes || a.character.quotes.length === 0) return;

    const quotes = a.character.quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const homeBubble = document.getElementById('home-char-bubble');
    const profBubble = document.getElementById('prof-char-bubble');

    // Only animate the bubble for the screen currently active
    const activeBubble = currentScreen === 'screen-home' ? homeBubble : profBubble;
    if (!activeBubble) return;

    activeBubble.textContent = randomQuote;
    activeBubble.style.opacity = '1';
    activeBubble.style.transform = 'translateY(0) scale(1)';

    // Hide it again after 4 seconds
    setTimeout(() => {
        activeBubble.style.opacity = '0';
        activeBubble.style.transform = 'translateY(10px) scale(0.95)';
    }, 4000);
}

// ===== DAILY LOGIN =====
const DAILY_REWARDS = [
    { day: 1, icon: '💎', label: '10 點數', action: a => a.points += 10 },
    { day: 2, icon: '<i class="ph-bold ph-flask"></i>', label: '1 藥水', action: a => a.potions = (a.potions || 0) + 1 },
    { day: 3, icon: '⚡', label: '50 XP', action: a => { a.totalXP += 50; a.level = calcLevel(a.totalXP); } },
    { day: 4, icon: '💎', label: '30 點數', action: a => a.points += 30 },
    { day: 5, icon: '<i class="ph-bold ph-flask"></i>', label: '2 藥水', action: a => a.potions = (a.potions || 0) + 2 },
    { day: 6, icon: '⚡', label: '200 XP', action: a => { a.totalXP += 200; a.level = calcLevel(a.totalXP); } },
    { day: 7, icon: '🎁', label: '神秘大獎', action: a => { a.points += 100; a.potions = (a.potions || 0) + 3; } }
];

function checkDailyLogin() {
    const a = me();
    if (!a) return;

    const now = new Date();
    const todayStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    if (a.lastDailyClaim === todayStr) return; // Already claimed today

    // Check if yesterday was claimed to maintain streak
    let isStreak = false;
    if (a.lastDailyClaim) {
        const lastDate = new Date(a.lastDailyClaim);
        const diffTime = Math.abs(now - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 2) { // 1 day difference
            isStreak = true;
        }
    }

    if (isStreak) {
        a.consecutiveLogins = (a.consecutiveLogins || 0) + 1;
    } else {
        a.consecutiveLogins = 1;
    }

    // Cap at 7 for UI logic
    let displayStreak = a.consecutiveLogins % 7;
    if (displayStreak === 0) displayStreak = 7;

    const countEl = document.getElementById('daily-streak-count');
    if (countEl) countEl.textContent = displayStreak;

    const gridEl = document.getElementById('daily-rewards-grid');
    if (gridEl) {
        gridEl.innerHTML = DAILY_REWARDS.map(r => `
            <div style="background:${r.day === displayStreak ? 'rgba(255,215,0,0.1)' : 'var(--bg)'}; border:2px solid ${r.day === displayStreak ? 'var(--primary)' : 'var(--border)'}; border-radius:12px; padding:12px 8px; text-align:center; position:relative; opacity:${r.day < displayStreak ? '0.5' : '1'};">
                ${r.day < displayStreak ? '<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:24px; z-index:2; text-shadow:0 0 4px #fff;">✅</div>' : ''}
                <div style="font-size:10px; font-weight:800; color:var(--text2); margin-bottom:4px">Day ${r.day}</div>
                <div style="font-size:24px; margin-bottom:4px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1));">${r.icon}</div>
                <div style="font-size:11px; font-weight:900; color:var(--text);">${r.label}</div>
                ${r.day === 7 ? '<div style="position:absolute; top:-8px; right:-8px; background:#FF4757; color:#fff; font-size:9px; padding:2px 6px; border-radius:10px; font-weight:900;">大獎！</div>' : ''}
            </div>
        `).join('');
    }

    document.getElementById('daily-login-modal').style.display = 'flex';
}

function claimDailyReward() {
    const a = me();
    if (!a) return;

    const now = new Date();
    const todayStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    a.lastDailyClaim = todayStr;

    let displayStreak = a.consecutiveLogins % 7;
    if (displayStreak === 0) displayStreak = 7;

    const reward = DAILY_REWARDS[displayStreak - 1];
    if (reward) {
        reward.action(a);
        showCelebration(reward.icon, '簽到成功！', `獲得 ${reward.label}！連續登入 ${a.consecutiveLogins} 天！`);
    }

    saveGlobal();
    refreshAll();

    document.getElementById('daily-login-modal').style.display = 'none';
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
    SoundManager.play('click');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    showScreen(id);
}

// ===== REFRESH =====
function refreshAll() { refreshHUD(); renderTaskFeed(); checkAchievements(); }

function refreshHUD() {
    const a = me(); if (!a) return;
    const c = a.character;
    const stats = getPlayerStats(a);

    const elIcon = document.getElementById('hud-char-icon');
    if (elIcon) elIcon.innerHTML = c ? getCharImg(c, 28) : '🧙';

    const elName = document.getElementById('hud-charname');
    if (elName) elName.textContent = a.name;

    const elLvl = document.getElementById('hud-level');
    if (elLvl) elLvl.textContent = a.level;

    const elPts = document.getElementById('hud-points');
    if (elPts) elPts.textContent = a.points;

    const elAtk = document.getElementById('hud-atk');
    if (elAtk) elAtk.textContent = stats.atk;

    const elDef = document.getElementById('hud-def');
    if (elDef) elDef.textContent = stats.def;

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

    // Guild badge in home profile
    const guildBadge = document.getElementById('hud-guild-badge');
    if (guildBadge) {
        const guild = a.guildId && globalData.guilds ? globalData.guilds[a.guildId] : null;
        if (guild) {
            const member = guild.members.find(m => m.id === globalData.activeId);
            const roleTitle = member ? member.roleTitle || '成員' : '成員';
            guildBadge.innerHTML = `${guild.icon} ${guild.name} · ${roleTitle}`;
            guildBadge.style.display = 'inline-flex';
        } else {
            guildBadge.style.display = 'none';
        }
    }
}

function refreshProfile() {
    const a = me(); if (!a) return;
    const c = a.character || { emoji: '🧙', name: '冒險者', id: 'mage' };
    const tierIdx = getCharTier(a.level);
    const stats = getPlayerStats(a);

    const bigEl = document.getElementById('prof-char');
    bigEl.innerHTML = getCharImg(c, 80);
    bigEl.className = 'char-big' + (tierIdx === 1 ? ' tier-2' : tierIdx === 2 ? ' tier-3' : '');

    // Show pet icons overlay if any
    if (stats.pets && stats.pets.length > 0) {
        const petsHtml = stats.pets.map((p, i) => `<div style="position:absolute; bottom:${-10 + i * 15}px; right:${-10 - i * 5}px; font-size:24px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5)); animation: charFloat ${2 + i * 0.5}s ease-in-out infinite;">${p.emoji}</div>`).join('');
        bigEl.innerHTML += petsHtml;
    }

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

    // Stats inject
    const pAtk = document.getElementById('p-atk');
    if (pAtk) pAtk.textContent = stats.atk;
    const pDef = document.getElementById('p-def');
    if (pDef) pDef.textContent = stats.def;

    // Equip rendering
    const eqGrid = document.getElementById('equip-grid');
    if (eqGrid) {
        if (!a.equipment || a.equipment.length === 0) {
            eqGrid.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:12px;width:100%;grid-column:span 2">尚未裝備任何物品</div>';
        } else {
            eqGrid.innerHTML = a.equipment.map(eq => `
                <div class="card flex items-center gap-2" style="padding: 12px; border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.02)">
                    <span style="font-size:32px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1))">${eq.emoji}</span>
                    <div style="flex:1">
                        <div style="font-weight:900; font-size:14px; color:var(--text); line-height:1.2; margin-bottom:2px;">${eq.name}</div>
                        <div style="font-size:11px; color:var(--text2); display:flex; gap:6px;">
                            ${eq.atk ? `<span style="color:#FF6B00"><i class="ph-bold ph-sword"></i> +${eq.atk}</span>` : ''}
                            ${eq.def ? `<span style="color:#00E5FF"><i class="ph-bold ph-shield"></i> +${eq.def}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Account UI Update
    const accUser = document.getElementById('acc-username');
    if (accUser) accUser.textContent = a.name;
    const accAge = document.getElementById('acc-age');
    if (accAge) accAge.textContent = a.age || 10;
    const emailEl = document.getElementById('acc-email');
    if (emailEl) emailEl.textContent = a.email || 'user@example.com';
    const goo = document.getElementById('acc-google-status');
    if (goo) {
        if (a.googleBound) {
            goo.innerHTML = '<span style="color:#10b981; font-weight:800;">已綁定</span> <i class="ph ph-caret-right"></i>';
        } else {
            goo.innerHTML = '未綁定 <i class="ph ph-caret-right"></i>';
        }
    }
    const locEl = document.getElementById('acc-location');
    if (locEl) locEl.innerHTML = `${a.location || '台灣, 台北'} <i class="ph ph-caret-right"></i>`;

    const subEl = document.getElementById('menu-sub-label');
    if (subEl) {
        subEl.innerHTML = a.subscription === 'pro'
            ? '<span style="color:#FFD700">Pro</span> <i class="ph ph-caret-right"></i>'
            : '免費版 <i class="ph ph-caret-right"></i>';
    }

    // Update promoted guild card in profile
    const guildCard = document.getElementById('profile-guild-card');
    const guildIcon = document.getElementById('profile-guild-icon');
    const guildName = document.getElementById('profile-guild-name');
    const guildDesc = document.getElementById('profile-guild-desc');
    if (guildCard) {
        const guild = a.guildId && globalData.guilds ? globalData.guilds[a.guildId] : null;
        if (guild) {
            const member = guild.members.find(m => m.id === globalData.activeId);
            const roleTitle = member ? member.roleTitle || '成員' : '成員';
            if (guildIcon) guildIcon.textContent = guild.icon;
            if (guildName) guildName.textContent = guild.name;
            if (guildDesc) guildDesc.innerHTML = `<span style="color:var(--primary);font-weight:800;">${roleTitle}</span> · ${guild.members.length} 位成員`;
        } else {
            if (guildIcon) guildIcon.textContent = '🏰';
            if (guildName) guildName.textContent = '加入冒險小隊';
            if (guildDesc) guildDesc.textContent = '加入或建立你的公會，解鎖更多任務！';
        }
    }

    // Guild badge under character name in profile
    const profClassBadge = document.getElementById('prof-class-badge');
    if (profClassBadge) {
        const guild = a.guildId && globalData.guilds ? globalData.guilds[a.guildId] : null;
        let badgeHtml = `⭐ Lv.${a.level} ${cn}`;
        if (guild) {
            const member = guild.members.find(m => m.id === globalData.activeId);
            const roleTitle = member ? member.roleTitle || '成員' : '成員';
            badgeHtml += ` <span class="guild-inline-badge" style="margin-left:6px;margin-top:0;">${guild.icon} ${guild.name}</span>`;
        }
        profClassBadge.innerHTML = badgeHtml;
        profClassBadge.style.color = getClassColor(a.level);
    }

    renderAchievements();
}

function editUsername() {
    const a = me();
    if (!a) return;
    const newName = prompt('請輸入新的冒險者名稱：', a.name);
    if (newName && newName.trim().length > 0) {
        a.name = newName.trim().substring(0, 15);
        saveGlobal();
        refreshProfile();
        refreshHome(); // update dashboard header if needed
        showToast('名稱修改成功！');
    }
}

function editAge() {
    const a = me();
    if (!a) return;
    const newAge = prompt('請輸入年齡：', a.age || 10);
    if (newAge && !isNaN(parseInt(newAge)) && parseInt(newAge) > 0) {
        a.age = parseInt(newAge);
        saveGlobal();
        refreshProfile();
        showToast('年齡修改成功！');
    }
}

function openAccountSettings() {
    showScreen('screen-account');
    refreshProfile();
}

// ===== ACCOUNT SETTINGS LOGIC =====
function toggleGoogleBind() {
    const a = me(); if (!a) return;
    if (a.googleBound) {
        if (confirm('確定要解除綁定 Google 帳號嗎？')) {
            a.googleBound = false;
            saveGlobal();
            refreshProfile();
            showToast('已解除 Google 帳號綁定。');
        }
    } else {
        // Mock Google Auth Flow
        a.googleBound = true;
        saveGlobal();
        refreshProfile();
        showCelebration('🌐', '綁定成功', '您現在可以使用 Google 登入了！');
    }
}

function changePasswordFlow() {
    const a = me(); if (!a) return;
    const oldPass = prompt('請輸入目前密碼：', '');
    if (oldPass === null) return;
    if (oldPass.trim() === '') {
        showToast('密碼不正確。'); return;
    }
    const newPass = prompt('請輸入新密碼：', '');
    if (newPass === null || newPass.trim() === '') return;
    const confirmPass = prompt('請再次輸入新密碼：', '');
    if (newPass !== confirmPass) {
        showToast('兩次密碼不一致，請重試！');
        return;
    }
    showCelebration('🔒', '密碼更新成功', '下次請使用新密碼登入！');
}

function editLocation() {
    const a = me(); if (!a) return;
    const newLoc = prompt('請輸入您目前的所在地：', a.location || '台灣, 台北');
    if (newLoc !== null && newLoc.trim() !== '') {
        a.location = newLoc.trim();
        saveGlobal();
        refreshProfile();
        showToast('所在地已更新！');
    }
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
    const a = me();
    const hasGuild = a && a.guildId && globalData.guilds && globalData.guilds[a.guildId];

    if (!hasGuild) {
        // Guild gate: show guidance banner + only self-created tasks
        const myTasks = globalData.tasks.filter(t => t.status === 'PUBLISHED' && t.createdBy === globalData.activeId).sort((a, b) => b.createdAt - a.createdAt);
        let html = `
            <div class="no-guild-banner">
                <div class="no-guild-icon">🏰</div>
                <div class="no-guild-title">加入公會解鎖更多任務！</div>
                <div class="no-guild-desc">加入或建立一個公會，即可查看並接取其他成員的任務，並解鎖獎勵商店。<br>你仍可以建立任務給自己嗎！</div>
                <button class="btn btn-primary" style="padding:10px 28px;font-size:14px;border-radius:14px;" onclick="openGuildJoinScreen()">
                    <i class="ph-bold ph-castle-turret"></i> 加入或建立公會
                </button>
            </div>`;
        if (myTasks.length) {
            html += `<div style="padding:0 16px 8px;"><div style="font-size:13px;font-weight:800;color:var(--text2);margin-bottom:8px;">📋 我的任務</div></div>`;
            html += myTasks.map(t => taskCardHTML(t)).join('');
        }
        feed.innerHTML = html;
        return;
    }

    const tasks = globalData.tasks.filter(t => t.status === 'PUBLISHED').sort((a, b) => b.createdAt - a.createdAt);
    if (!tasks.length) { feed.innerHTML = '<div class="text-center text-muted" style="padding:40px"><p>目前沒有可接取的任務！</p></div>'; return; }
    feed.innerHTML = tasks.map(t => taskCardHTML(t)).join('');
}

function taskCardHTML(t) {
    let dlStr = '';
    if (t.deadline) {
        const msLeft = new Date(t.deadline).getTime() - Date.now();
        const isUrgent = msLeft > 0 && msLeft < 86400000;
        dlStr = `<div class="reward-chip ${isUrgent ? 'urgent' : ''}"><i class="ph-fill ph-timer"></i> ${formatDeadline(t.deadline)}${isUrgent ? ' (緊急!)' : ''}</div>`;
    }
    const locStr = t.location ? `<div class="reward-chip"><i class="ph-fill ph-map-pin"></i> ${esc(t.location)}</div>` : '';
    const checkCount = t.checklist ? t.checklist.length : 0;
    const checkStr = checkCount ? `<div class="reward-chip"><i class="ph-bold ph-list-checks"></i> ${checkCount}步驟</div>` : '';
    return `<div class="card task-card" onclick="openDetail('${t.id}')">
    <div class="flex justify-between items-center mb-2">
      <div class="task-type">${TYPE_LABELS[t.type] || t.type}</div>
      <span class="status-badge status-${t.status.toLowerCase()}">${statusLabel(t.status)}</span>
    </div>
    <h3>${esc(t.title)}</h3>
    <div class="task-desc">${esc(t.desc)}</div>
    <div class="task-meta-flex">
      ${locStr}${dlStr}${checkStr}
    </div>
    <div style="width:100%; height:1px; background:var(--border); margin: 12px 0;"></div>
    <div class="task-meta" style="margin-top:0">
      <span class="task-publisher"><i class="ph-fill ph-user-circle"></i> ${esc(t.creator)} 發布</span>
      <div style="display:flex; gap:8px;">
          <span style="font-weight:900; color:#F59E0B; font-family:monospace; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.2); padding:4px 10px; border-radius:12px; display:flex; align-items:center; gap:4px;"><i class="ph-bold ph-lightning" style="font-size:14px;"></i> ${XP_TABLE[t.difficulty] || 50} XP</span>
          <span style="font-weight:900; color:var(--primary); font-family:monospace; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); padding:4px 10px; border-radius:12px; display:flex; align-items:center; gap:4px;"><i class="ph-bold ph-coin" style="font-size:14px;"></i> ${Math.round((XP_TABLE[t.difficulty] || 50) * PTS_RATIO)} 點數</span>
      </div>
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
        if (claimerAcc.level > oldLvl) {
            const pStats = getPlayerStats(claimerAcc);
            claimerAcc.currentHp = 100 + claimerAcc.level * 10 + (pStats.def * 2); // Level up heals to full
            if (t.claimedBy === myId()) {
                showCelebration('🎊', `升級！→ Lv.${claimerAcc.level}`, `血量全滿！ +${xpG}XP +${ptsG}點`);
            }
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
        <div class="ach-section" style="margin-bottom: 16px;">
            <div class="ach-section-header" onclick="toggleAchievementSection('ach-list-obtained', 'icon-obtained')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; padding:8px 16px; background:var(--surface); border-radius:12px; margin-bottom:8px;">
                <div style="font-size:14px; font-weight:900; color:var(--text);"><i class="ph-fill ph-medal"></i> 已獲得徽章 (${a.achievements.length})</div>
                <i class="ph-bold ph-caret-down" id="icon-obtained" style="transition:transform 0.2s;"></i>
            </div>
            <div id="ach-list-obtained" style="display:block;">
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; padding:0 16px;">
                    ${obtainedHtml || '<div style="grid-column:1/-1; color:var(--text3); font-size:13px; text-align:center; padding:12px;">尚未獲得徽章</div>'}
                </div>
            </div>
        </div>
        
        <div class="ach-section">
            <div class="ach-section-header" onclick="toggleAchievementSection('ach-list-locked', 'icon-locked')" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; padding:8px 16px; background:var(--surface); border-radius:12px; margin-bottom:8px;">
                <div style="font-size:14px; font-weight:900; color:var(--text);"><i class="ph-fill ph-trophy"></i> 風雲榜 (未解鎖)</div>
                <i class="ph-bold ph-caret-right" id="icon-locked" style="transition:transform 0.2s; transform:rotate(-90deg);"></i>
            </div>
            <div id="ach-list-locked" style="display:none;">
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; padding:0 16px;">
                    ${lockedHtml || '<div style="grid-column:1/-1; color:var(--green); font-size:13px; text-align:center; padding:12px; font-weight:800;">🎊 太神啦！所有成就皆已解鎖！</div>'}
                </div>
            </div>
        </div>
    `;
    document.getElementById('ach-grid').innerHTML = finalHtml;
    document.getElementById('ach-grid').style.display = 'block';
}

function toggleAchievementSection(contentId, iconId) {
    const content = document.getElementById(contentId);
    const icon = document.getElementById(iconId);
    if (!content || !icon) return;

    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'none';
        icon.style.transform = 'rotate(-90deg)';
    }
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

    // Render Unclaimed Echo Boxes (Audio Rewards)
    let echoBoxesHtml = '';
    const myIdStr = myId();
    Object.keys(globalData.echoes).forEach(taskId => {
        const echoData = globalData.echoes[taskId];
        const task = globalData.tasks.find(t => t.id === taskId);
        // If it's my task that I completed, and I haven't listened to the echo reward yet
        if (task && task.claimedBy === myIdStr && task.status === 'COMPLETED_CONFIRMED' && !echoData.listened) {
            echoBoxesHtml += `
            <div class="card" style="padding: 20px; display:flex; flex-direction:row; align-items:center; border: 2px solid #F59E0B; background: linear-gradient(135deg, rgba(255,255,255,1), rgba(245,158,11,0.05)); box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2); position:relative; overflow:hidden; margin-bottom: 16px; cursor: pointer;" onclick="playEchoReward('${taskId}')">
                <div style="font-size:64px; margin-right: 16px; animation: charFloat 3s ease-in-out infinite;">🎁</div>
                <div style="flex:1;">
                    <div style="font-size:11px; font-weight:900; color:#F59E0B; margin-bottom:4px; text-transform:uppercase; letter-spacing:1px; display:flex; align-items:center; gap:4px;"><i class="ph-fill ph-sparkle"></i> 神秘寶箱歸屬：${esc(a.name)}</div>
                    <h3 style="font-size:18px;font-weight:900;margin-bottom:6px;">未知的回聲獎勵</h3>
                    <p class="text-xs text-muted" style="margin-bottom:12px; line-height:1.4;">完成「${esc(task.title)}」的專屬語音獎勵！</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-weight:900; color:#10b981; font-size:15px; background:rgba(16, 185, 129, 0.1); padding:4px 12px; border-radius:10px; border:1px solid rgba(16,185,129,0.2);">免費兌換</div>
                        <button class="btn" style="padding:6px 16px; font-size:14px; border-radius:12px; font-weight:800; background: #F59E0B; color:white; border:none; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">開啟寶箱 ✨</button>
                    </div>
                </div>
            </div>`;
        }
    });

    // Render Featured
    if (featured) {
        const canAffordF = a.points >= featured.cost;
        const htmlF = echoBoxesHtml + `
        <div class="card" style="padding: 20px; display:flex; flex-direction:row; align-items:center; border: 1px solid ${canAffordF ? 'rgba(99, 102, 241, 0.3)' : 'rgba(0,0,0,0.06)'}; background: #ffffff; box-shadow: ${canAffordF ? '0 8px 24px rgba(99, 102, 241, 0.15)' : '0 4px 12px rgba(0,0,0,0.05)'}; position:relative; overflow:hidden;">
            <div style="font-size:72px; filter:drop-shadow(0 4px 12px rgba(99, 102, 241, 0.2)); transform: scale(1.1); margin-right: 16px; animation: charFloat 3s ease-in-out infinite;">${featured.icon}</div>
            <div style="flex:1;">
                <div style="font-size:11px; font-weight:900; color:var(--primary); margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">終極大獎</div>
                <h3 style="font-size:18px;font-weight:900;margin-bottom:6px;">${esc(featured.title)}</h3>
                <p class="text-xs text-muted" style="margin-bottom:12px; line-height:1.4;">${esc(featured.desc)}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:900; color:var(--primary); font-size:18px; font-family:monospace; background:rgba(99, 102, 241, 0.08); padding:4px 12px; border-radius:20px; display:flex; align-items:center; gap:4px;"><i class="ph-bold ph-coin"></i> ${featured.cost}</div>
                    <button class="btn ${canAffordF ? 'btn-magic' : 'btn-secondary'}" style="padding:6px 16px; font-size:14px; border-radius:12px; font-weight:800;" onclick="redeemReward('${featured.sku}')" ${!canAffordF ? 'disabled style="opacity:.5"' : ''}>${canAffordF ? '兌換！' : '點數不足'}</button>
                </div>
            </div>
        </div>`;
        document.getElementById('rewards-featured').innerHTML = htmlF;
    }

    // Render Regular List (Refined 2-Column Equal Height Layout)
    document.getElementById('rewards-list').innerHTML = `<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px; width:100%;">` + regular.map(r => {
        const canAfford = a.points >= r.cost;
        return `
    <div class="card" style="padding: 16px; display:flex; flex-direction:column; justify-content:space-between; background: #ffffff; border: 1px solid ${canAfford ? 'var(--border)' : 'rgba(0,0,0,0.06)'}; border-radius: 20px; ${!canAfford ? 'opacity: 0.6; filter: grayscale(0.5);' : 'box-shadow: 0 8px 24px rgba(0,0,0,0.04); cursor:pointer;'}" ${canAfford ? `onclick="redeemReward('${r.sku}')"` : ''}>
        
        <!-- Top content: icon + text (fixed structure) -->
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px;">
            <div style="width:56px; height:56px; border-radius:50%; background:${canAfford ? 'radial-gradient(circle at top left, rgba(99,102,241,0.15), rgba(99,102,241,0.05))' : 'rgba(0,0,0,0.04)'}; display:flex; justify-content:center; align-items:center; border:1px solid ${canAfford ? 'rgba(99,102,241,0.1)' : 'transparent'};">
                <span style="font-size:32px; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${r.icon}</span>
            </div>
            <h3 style="font-size:14px; font-weight:900; color:var(--text); line-height:1.3; width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0; height:18px;">${esc(r.title)}</h3>
            <p style="font-size:12px; color:var(--text2); line-height:1.4; margin:0; height:34px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${esc(r.desc)}</p>
        </div>

        <!-- Footer (always at bottom) -->
        <div style="padding-top:12px; border-top:1px dashed rgba(0,0,0,0.08); display:flex; justify-content:space-between; align-items:center; width:100%; margin-top:12px;">
            <div style="font-weight:900; color:${canAfford ? 'var(--primary)' : 'var(--text3)'}; font-size:15px; font-family:monospace; display:flex; align-items:center; gap:4px;">
                <i class="ph-bold ph-coin" style="font-size:16px;"></i> ${r.cost}
            </div>
            <button class="btn" style="padding:4px 12px; font-size:13px; font-weight:800; border-radius:10px; border:none; background:${canAfford ? 'var(--primary)' : 'var(--surface)'}; color:${canAfford ? '#fff' : 'var(--text3)'}; pointer-events:none;">
                ${canAfford ? '兌換' : '<i class="ph-bold ph-lock"></i>'}
            </button>
        </div>
    </div>
  `;
    }).join('') + `</div>`;
}

let pendingPurchaseSku = null;

function redeemReward(sku) {
    const a = me(); if (!a) return;
    const r = globalData.rewards.find(x => x.sku === sku);
    if (!r || a.points < r.cost) { showToast('點數不足！'); return; }

    pendingPurchaseSku = sku;
    // Strip HTML from title/icon for clean display if needed, but innerHTML supports emojis
    document.getElementById('pur-icon').innerHTML = r.icon;
    document.getElementById('pur-title').innerHTML = `兌換「${r.title}」？`;
    document.getElementById('pur-desc').innerHTML = r.desc;
    document.getElementById('pur-cost').innerHTML = r.cost;

    document.getElementById('purchase-modal').style.display = 'flex';
}

function closePurchaseModal() {
    document.getElementById('purchase-modal').style.display = 'none';
    pendingPurchaseSku = null;
}

function confirmPurchase() {
    if (!pendingPurchaseSku) return;
    const sku = pendingPurchaseSku;
    closePurchaseModal();

    const a = me(); if (!a) return;
    const r = globalData.rewards.find(x => x.sku === sku);
    if (!r || a.points < r.cost) { showToast('點數不足！'); return; }

    // Deduct points first
    a.points -= r.cost;

    // Potions go into inventory instead of immediate use
    if (r.type === 'POTION' || sku === 'R0') {
        a.potions = (a.potions || 0) + 1;
        SoundManager.play('heal');
        showCelebration('<i class="ph-bold ph-flask"></i>', '獲得治療藥水！', '藥水已放入背包，可在戰鬥中使用！');
    }
    // Equipment goes into inventory
    else if (r.type === 'EQUIP') {
        const hasEquip = (a.equipment || []).find(x => x.sku === sku);
        if (hasEquip) { showToast('你已經擁有這個裝備了！'); return; }

        a.points -= r.cost;
        if (!a.equipment) a.equipment = [];
        a.equipment.push({ sku: r.sku, name: r.title, emoji: r.icon, atk: r.atk, def: r.def });
        saveGlobal();
        SoundManager.play('win');
        showCelebration(r.icon, '裝備獲得！', `成功裝備 ${r.title}！`);
        setTimeout(() => renderRewards(), 2600);
        return;
    }

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
function closePaywall() { document.getElementById('paywall-modal').classList.remove('active'); }
function openPaywall() { document.getElementById('paywall-modal').classList.add('active'); }

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

function playEchoReward(tid) {
    const echo = globalData.echoes[tid]; if (!echo || !echo.audio) { showToast('回聲未載入'); return; }
    if (curAudio) { curAudio.pause(); curAudio = null; }
    curAudio = new Audio(echo.audio);
    showCelebration('🔊', '播放回聲中...', '專屬於你的神秘語音獎勵！');
    curAudio.play().catch(e => console.error(e));
    curAudio.onended = () => {
        curAudio = null;
        globalData.echoes[tid].listened = true; // Mark as opened
        saveGlobal();
        renderRewards(); // Refresh to hide the box
        showToast('神秘寶箱已聆聽完畢！');
    };
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

// ===== ENDLESS BOSS BATTLE SYSTEM =====
let battleState = null;

function getCurrentBoss(layer) {
    const baseM = MONSTERS[(layer - 1) % MONSTERS.length];
    const modifier = 1 + (layer - 1) * 0.25; // 25% stronger per layer
    return {
        name: baseM.name,
        emoji: baseM.emoji,
        hp: Math.floor(baseM.hp * modifier),
        atk: Math.floor(baseM.atk * modifier),
        xp: Math.floor(baseM.xp * (1 + (layer - 1) * 0.1)),
        pts: Math.floor(baseM.pts * (1 + (layer - 1) * 0.1)),
    };
}

function refreshDailyBanner() {
    const a = me(); if (!a) return;
    const layer = (a.battlesWon || 0) + 1;
    const m = getCurrentBoss(layer);
    document.getElementById('daily-monster-name').textContent = `第 ${layer} 層 - ${m.name}`;
    document.getElementById('daily-monster-emoji').textContent = m.emoji;
    document.getElementById('daily-battle-hint').textContent = `強力魔王等著你！`;
    document.getElementById('battle-banner').style.opacity = '1';
}

function startDailyBattle() {
    const a = me(); if (!a) return;
    const layer = (a.battlesWon || 0) + 1;
    const m = getCurrentBoss(layer);
    const c = a.character;

    const pStats = getPlayerStats(a);
    const pMaxHp = 100 + a.level * 10 + (pStats.def * 2);

    // Initialize or clamp HP
    if (a.currentHp === undefined || a.currentHp <= 0) {
        if (a.currentHp <= 0) {
            showToast('血量不足！請升級或前往商城購買藥水恢復 HP。');
            return;
        }
        a.currentHp = pMaxHp;
    }
    if (a.currentHp > pMaxHp) a.currentHp = pMaxHp;

    if (!a.bossHp || a.bossHp <= 0) a.bossHp = m.hp; // Reset boss hp if new layer

    battleState = {
        layer,
        monster: { ...m, curHp: a.bossHp },
        player: { hp: a.currentHp, maxHp: pMaxHp, atk: pStats.atk, def: pStats.def, skillUsed: false, healsLeft: 2 },
        log: [`⚔️ 第 ${layer} 層：${m.name} 咆哮著出現了！`],
        done: false
    };
    saveGlobal();

    // Render battle screen
    document.getElementById('bm-sprite').textContent = m.emoji;
    document.getElementById('bm-name').textContent = `Lv.${layer} ${m.name}`;
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
    const a = me();

    // Attack Button
    const btnAttack = document.getElementById('btn-attack');
    btnAttack.className = `btn btn-primary`;
    btnAttack.disabled = bs.done;
    btnAttack.style.opacity = bs.done ? '0.4' : '1';

    // Skill Button
    const btnSkill = document.getElementById('btn-skill');
    btnSkill.innerHTML = `🌟 技能 (${bs.player.skillUsed ? '0' : '1'})`;
    if (bs.done || bs.player.skillUsed) {
        btnSkill.className = `btn`;
        btnSkill.style.background = 'var(--bg)';
        btnSkill.style.color = 'var(--text3)';
        btnSkill.style.borderColor = 'var(--border)';
        btnSkill.disabled = true;
        btnSkill.style.opacity = bs.done ? '0.4' : '0.8';
    } else {
        btnSkill.className = `btn btn-magic`;
        btnSkill.style.background = ''; // reset to class css
        btnSkill.style.color = '';
        btnSkill.style.borderColor = '';
        btnSkill.disabled = false;
        btnSkill.style.opacity = '1';
    }

    // Heal Button
    const btnHeal = document.getElementById('btn-heal');
    const pots = a.potions || 0;
    btnHeal.innerHTML = `<i class="ph-bold ph-flask"></i> 治療 (${pots})`;
    if (bs.done || pots <= 0) {
        btnHeal.className = `btn`;
        btnHeal.style.background = 'var(--bg)';
        btnHeal.style.color = 'var(--text3)';
        btnHeal.style.borderColor = 'var(--border)';
        btnHeal.disabled = true;
        btnHeal.style.opacity = bs.done ? '0.4' : '0.8';
    } else {
        btnHeal.className = `btn btn-green`;
        btnHeal.style.background = '';
        btnHeal.style.color = '';
        btnHeal.style.borderColor = '';
        btnHeal.disabled = false;
        btnHeal.style.opacity = '1';
    }
}

function updatePersistentHp() {
    const a = me();
    if (!a || !battleState) return;
    a.currentHp = Math.max(0, battleState.player.hp);
    a.bossHp = Math.max(0, battleState.monster.curHp);
    saveGlobal();
}

function battleAttack() {
    if (!battleState || battleState.done) return;
    SoundManager.play('attack');
    const bs = battleState;
    const dmg = Math.floor(bs.player.atk * (0.8 + Math.random() * 0.4));
    bs.monster.curHp -= dmg;
    bs.log.push(`<span class="log-atk">⚔️ 你攻擊了 ${bs.monster.name}，造成 ${dmg} 傷害！</span>`);
    updatePersistentHp();
    rushAnim('bp-sprite');
    shakeElement('bm-sprite');
    hurtFlash('bm-sprite');
    spawnDmgFloat('monster-area', `-${dmg}`, 'atk');
    if (bs.monster.curHp <= 0) { battleWin(); } else { setTimeout(() => { monsterTurn(); updateBattleUI(); }, 600); }
    updateBattleUI();
}

function getFunnySkillName(charId) {
    const classSkills = {
        'char0': ['💥 鍵盤重擊', '💥 咖啡因爆發', '💥 無情複製貼上', '💥 Deadline死線閃電'], // 冒險者
        'char1': ['💥 隨便念個咒語', '💥 好像是火球術', '💥 把怪物變冰紅茶', '💥 鴿子封包召喚'], // 法師
        'char2': ['💥 瞎貓死耗子劍法', '💥 旋風斬(會頭暈)', '💥 大聲咆哮', '💥 拿劍柄打臉'], // 戰士
        'char3': ['💥 閉著眼睛亂射', '💥 射中怪物膝蓋', '💥 萬劍歸宗(純特效)', '💥 撒石灰粉'], // 弓箭手
        'char-cat': ['💥 喵喵無影拳', '💥 抓花了臉', '💥 推倒桌上水杯', '💥 半夜跑酷撞擊'], // 喵殺手
        'char-dog': ['💥 終極拆家旋風', '💥 死咬拖鞋不放', '💥 無辜眼神攻擊', '💥 快樂搖尾巴拍擊'], // 汪騎士
        'char-slime': ['💥 祖傳黏液束縛', '💥 彈性肉彈衝撞', '💥 分裂再分裂', '💥 亂噴酸液'] // 史萊姆
    };
    const defaultSkills = ['💥 認真的一擊', '💥 閉眼亂打', '💥 大喊救命', '💥 華麗的摔倒'];
    const pool = classSkills[charId] || defaultSkills;
    return pool[Math.floor(Math.random() * pool.length)];
}

function battleSkill() {
    if (!battleState || battleState.done || battleState.player.skillUsed) return;
    const a = me();
    SoundManager.play('skill');
    const bs = battleState;
    bs.player.skillUsed = true;
    const dmg = Math.floor(bs.player.atk * 2.5);
    bs.monster.curHp -= dmg;

    const skillName = getFunnySkillName(a ? a.charId : 'char0');
    bs.log.push(`<span class="log-skill">${skillName}！造成 ${dmg} 暴擊傷害！</span>`);

    updatePersistentHp();
    rushAnim('bp-sprite');
    shakeElement('bm-sprite');
    hurtFlash('bm-sprite');
    spawnDmgFloat('monster-area', `-${dmg}`, 'crit');
    if (bs.monster.curHp <= 0) { battleWin(); } else { setTimeout(() => { monsterTurn(); updateBattleUI(); }, 600); }
    updateBattleUI();
}

function battleHeal() {
    const a = me();
    if (!battleState || battleState.done || !a || (a.potions || 0) <= 0) {
        if (!a || (a.potions || 0) <= 0) showToast('沒有治療藥水了！請去幸運轉盤或寶庫獲取。');
        return;
    }
    SoundManager.play('heal');
    const bs = battleState;
    a.potions--;
    saveGlobal();

    // Potion heals 100%
    const heal = bs.player.maxHp - bs.player.hp;
    bs.player.hp = bs.player.maxHp;
    bs.log.push(`<span class="log-heal">💚 使用治療藥水！恢復 ${heal} 生命值！(剩餘 ${a.potions} 瓶)</span>`);
    updatePersistentHp();
    spawnDmgFloat('player-area', `+${heal}`, 'heal');
    setTimeout(() => { monsterTurn(); updateBattleUI(); }, 400);
    updateBattleUI();
}

function monsterTurn() {
    if (!battleState || battleState.done) return;
    const bs = battleState;

    // 30% chance to use Boss Skill if layer >= 3
    if (bs.layer >= 3 && Math.random() < 0.3) {
        SoundManager.play('skill');
        let dmg = Math.floor(bs.monster.atk * 1.8);
        dmg = Math.max(1, dmg - Math.floor(bs.player.def / 2));
        bs.player.hp -= dmg;
        bs.log.push(`<span class="log-enemy" style="color:var(--red);">🔥 ${bs.monster.name} 使出致命打擊！造成 ${dmg} 傷害！</span>`);
        hurtFlash('bp-sprite');
        shakeElement('bp-sprite');
        spawnDmgFloat('player-area', `-${dmg}`, 'crit');
    } else {
        SoundManager.play('attack');
        let dmg = Math.floor(bs.monster.atk * (0.8 + Math.random() * 0.4));
        dmg = Math.max(1, dmg - Math.floor(bs.player.def / 2)); // Player Defense mitigates damage
        bs.player.hp -= dmg;
        bs.log.push(`<span class="log-enemy">👹 ${bs.monster.name} 反擊！造成 ${dmg} 傷害！</span>`);
        shakeElement('bp-sprite');
        spawnDmgFloat('player-area', `-${dmg}`, 'atk');
    }

    updatePersistentHp();
    if (bs.player.hp <= 0) { battleLose(); }
}

function battleWin() {
    const bs = battleState;
    bs.done = true;
    bs.monster.curHp = 0;
    const a = me();
    const xpGain = bs.monster.xp;
    const ptsGain = bs.monster.pts + 10; // User request: +10 pts per boss win
    a.totalXP += xpGain;
    a.points += ptsGain;
    a.battlesWon = (a.battlesWon || 0) + 1;
    a.bossHp = 0; // Clear boss HP so next layer generates full
    updatePersistentHp();
    const oldLvl = a.level;
    a.level = calcLevel(a.totalXP);
    if (a.level > oldLvl) a.currentHp = 100 + a.level * 10 + (bs.player.def * 2); // Free heal on level up
    saveGlobal(); checkAchievements();

    bs.log.push(`<span class="log-win">🎉 擊敗了第 ${bs.layer} 層魔王！獲得 +${xpGain} XP · +${ptsGain} 點！</span>`);
    if (a.level > oldLvl) {
        const newClass = getClassName(a.level, a.character);
        bs.log.push(`<span class="log-win">🎊 升級！→ Lv.${a.level} ${newClass}，血量全滿！</span>`);
    }

    bs.log.push(`<span class="log-win" style="color:var(--orange)">⚠️ 通往下一層的門開啟中...</span>`);
    setTimeout(() => { showCelebration('🏆', '戰鬥勝利！', `前進下一層...`); }, 500);
    setTimeout(() => {
        if (document.getElementById('screen-battle') && !document.getElementById('screen-battle').classList.contains('hidden')) {
            startDailyBattle();
        }
    }, 2500);
}

function battleLose() {
    const bs = battleState;
    bs.done = true;
    bs.player.hp = 0;
    updatePersistentHp();
    const a = me();
    checkAchievements();
    bs.log.push(`<span class="log-enemy">💔 戰敗了…你的血量歸零了。</span>`);
    bs.log.push(`<span class="log-enemy">請至獎勵商城使用點數購買「治療藥水」，或透過完成任務升級來恢復血量！</span>`);
}

function exitBattle() {
    battleState = null;
    refreshHUD();
    refreshDailyBanner();
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
    { label: '+1 治療藥水', icon: '🧪', action: a => { a.potions = (a.potions || 0) + 1; } },
    { label: '+5 點數', icon: '🪙', action: a => { a.points += 5; } },
    { label: '+30 XP', icon: '🔥', action: a => { a.totalXP += 30; a.level = calcLevel(a.totalXP); } },
    { label: '再轉一次', icon: '🌀', action: () => { } },
    { label: '+2 治療藥水', icon: '🧪', action: a => { a.potions = (a.potions || 0) + 2; } },
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
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 8;
    const n = WHEEL_PRIZES.length;
    const arc = (2 * Math.PI) / n;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer glow/shadow for the premium wheel feel
    ctx.save();
    ctx.translate(cx, cy);
    ctx.shadowColor = 'rgba(99, 102, 241, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    // Draw Slices
    for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, i * arc, (i + 1) * arc);

        // Add subtle radial gradient to each slice
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, WHEEL_COLORS[i % WHEEL_COLORS.length]);
        grad.addColorStop(1, WHEEL_COLORS[i % WHEEL_COLORS.length]);

        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Text and Icons
        ctx.save();
        ctx.rotate(i * arc + arc / 2);
        ctx.textAlign = 'center';

        // Large Icon
        ctx.font = '24px "Segoe UI Emoji", "Apple Color Emoji", NotoColorEmoji, sans-serif';
        // Add text shadow for legibility
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        ctx.fillText(WHEEL_PRIZES[i].icon, r * 0.70, 8);

        // Large Text
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 15px Nunito, PingFang TC, sans-serif';
        // Stroke for text legibility against colors
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.strokeText(WHEEL_PRIZES[i].label, r * 0.40, 6);
        ctx.fillText(WHEEL_PRIZES[i].label, r * 0.40, 6);
        ctx.restore();
    }

    // Center Pin (Premium Dot)
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366F1';
    ctx.fill();

    ctx.restore();
}

function openLuckyWheel() {
    const a = me(); if (!a) return;
    const today = new Date().toDateString();
    showScreen('screen-wheel');
    initWheel();

    // Disable button if already spun today
    const btn = document.getElementById('wheel-spin-btn');
    if (btn) {
        if (a.lastWheelDate === today) {
            btn.disabled = true;
            btn.textContent = '今日已領取';
        } else {
            btn.disabled = false;
            btn.innerHTML = `<span style="font-size:20px;margin-right:8px">💫</span>開始轉動 (免費)`;
        }
    }
}

function spinWheel() {
    if (wheelSpinning) return;
    const a = me(); if (!a) return;
    const today = new Date().toDateString();
    if (a.lastWheelDate === today) { showToast('今天已轉過了！'); return; }

    SoundManager.play('click');
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
    // Bonus for specific types (Identify the most common type)
    let bestType = null;
    let highestCount = 0;
    Object.entries(typeCount).forEach(([k, v]) => {
        if (v > highestCount) {
            highestCount = v;
            bestType = k;
        }
    });

    if (bestType === 'KINDNESS') {
        mixed.push(`✨ 善良值 MAX！你做了 ${highestCount} 個善行任務，這世界的發電機都是靠你發電的吧？🌈`);
    } else if (bestType === 'ADVENTURE') {
        mixed.push(`✨ 出門冒險了 ${highestCount} 次！我看連Google Map都要來找你更新圖資了 🗺️🚶`);
    } else if (bestType === 'LEARNING') {
        mixed.push(`✨ 學了 ${highestCount} 個知識挑戰！這個腦容量，台積電人資正在看你的履歷 📶🧠`);
    } else if (bestType === 'CHORE') {
        mixed.push(`✨ 挖！完成了 ${highestCount} 個家事任務！家裡乾淨到蟑螂都要滑倒了🧹✨`);
    } else if (bestType === 'CREATIVE') {
        mixed.push(`✨ 發揮了 ${highestCount} 次創意！達文西都要認你做乾爹了 🎨💡`);
    }

    return mixed[Math.floor(Math.random() * mixed.length)];
}

// ===== GUILD SYSTEM =====
const GUILD_ICONS = ['🏰', '⚔️', '🛡️', '🐉', '🦁', '🐺', '🌟', '🔥', '🌈', '🎯', '🏴‍☠️', '👑', '🦅', '🐻', '💎', '🗡️', '🏹', '🧙'];
let selectedGuildIcon = '🏰';

function getGuilds() {
    if (!globalData.guilds) globalData.guilds = {};
    return globalData.guilds;
}

function getMyGuild() {
    const a = me(); if (!a || !a.guildId) return null;
    const guilds = getGuilds();
    return guilds[a.guildId] || null;
}

function isGuildOwner() {
    const g = getMyGuild();
    return g && g.ownerId === myId();
}

// --- Guild Gate: check before claiming tasks or redeeming rewards ---
function requireGuild(actionLabel) {
    const a = me();
    if (!a) return false;
    if (a.guildId && getMyGuild()) return true;
    // Show guild prompt modal
    document.getElementById('modal-guild-prompt').style.display = 'flex';
    return false;
}

function closeGuildPrompt() {
    document.getElementById('modal-guild-prompt').style.display = 'none';
}

// --- Navigation helpers ---
function openGuildJoinScreen() {
    closeGuildPrompt();
    document.getElementById('guild-join-section').style.display = '';
    document.getElementById('guild-create-section').style.display = 'none';
    showScreen('screen-guild-join');
}

function openGuildCreateScreen() {
    closeGuildPrompt();
    document.getElementById('guild-join-section').style.display = 'none';
    document.getElementById('guild-create-section').style.display = '';
    selectedGuildIcon = '🏰';
    document.getElementById('guild-create-icon-preview').textContent = '🏰';
    document.getElementById('guild-create-name').value = '';
    renderGuildIconGrid();
    showScreen('screen-guild-join');
}

function renderGuildIconGrid() {
    const grid = document.getElementById('guild-icon-grid');
    if (!grid) return;
    grid.innerHTML = GUILD_ICONS.map(icon => `
        <div class="guild-icon-option${icon === selectedGuildIcon ? ' selected' : ''}"
             onclick="selectGuildIcon('${icon}')">${icon}</div>
    `).join('');
}

function selectGuildIcon(icon) {
    selectedGuildIcon = icon;
    document.getElementById('guild-create-icon-preview').textContent = icon;
    renderGuildIconGrid();
}

// --- Create Guild ---
function doCreateGuild() {
    const a = me(); if (!a) return;
    const name = document.getElementById('guild-create-name').value.trim();
    if (!name) { showToast('請輸入公會名稱！'); return; }
    if (name.length < 2) { showToast('公會名稱至少需要 2 個字！'); return; }

    const guilds = getGuilds();
    const guildId = 'G' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit code

    guilds[guildId] = {
        id: guildId,
        name: name,
        icon: selectedGuildIcon,
        code: code,
        ownerId: myId(),
        createdAt: Date.now(),
        members: [
            { id: myId(), name: a.name, emoji: getCharEmojiForGuild(a), roleTitle: '會長' }
        ]
    };
    a.guildId = guildId;
    saveGlobal();

    SoundManager.play('levelUp');
    showCelebration('🏰', '公會建立成功！', `「${name}」已建立，邀請碼：${code}`);
    setTimeout(() => {
        openGuildDashboard();
    }, 2600);
}

// --- Join Guild ---
function doJoinGuild() {
    const a = me(); if (!a) return;
    const code = document.getElementById('guild-join-code').value.trim();
    if (!code || code.length !== 6) { showToast('請輸入 6 位數邀請碼！'); return; }

    const guilds = getGuilds();
    const found = Object.values(guilds).find(g => g.code === code);

    if (!found) {
        // POC: auto-create a mock guild if code doesn't exist
        const guildId = 'G' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
        guilds[guildId] = {
            id: guildId,
            name: '冒險小隊 #' + code,
            icon: '⚔️',
            code: code,
            ownerId: 'mock-parent',
            createdAt: Date.now(),
            members: [
                { id: 'mock-parent', name: '隊長（家長）', emoji: '👨‍👧', roleTitle: '會長' },
                { id: myId(), name: a.name, emoji: getCharEmojiForGuild(a), roleTitle: '成員' }
            ]
        };
        a.guildId = guildId;
    } else {
        // Already exists, join it
        if (found.members.some(m => m.id === myId())) {
            showToast('你已經是這個公會的成員了！');
            a.guildId = found.id;
            saveGlobal();
            openGuildDashboard();
            return;
        }
        found.members.push({
            id: myId(), name: a.name, emoji: getCharEmojiForGuild(a), roleTitle: '成員'
        });
        a.guildId = found.id;
    }

    saveGlobal();
    SoundManager.play('levelUp');
    showCelebration('🎉', '成功加入公會！', `歡迎加入「${getMyGuild().name}」`);
    setTimeout(() => {
        openGuildDashboard();
    }, 2600);
}

// --- Leave Guild ---
function doLeaveGuild() {
    const a = me(); if (!a || !a.guildId) return;
    const g = getMyGuild();
    if (!g) { a.guildId = null; saveGlobal(); return; }

    const isOwner = g.ownerId === myId();
    let msg = '確定要退出公會嗎？';
    if (isOwner && g.members.length > 1) {
        msg = '你是會長！退出公會將解散公會，所有成員都會被移除。確定嗎？';
    }

    if (!confirm(msg)) return;

    if (isOwner) {
        // Disband: remove guild from all members
        const guilds = getGuilds();
        g.members.forEach(m => {
            const acc = globalData.accounts[m.id];
            if (acc) acc.guildId = null;
        });
        delete guilds[g.id];
    } else {
        // Just remove self
        g.members = g.members.filter(m => m.id !== myId());
    }
    a.guildId = null;
    saveGlobal();
    showToast('已退出公會');
    showScreen('screen-character');
    refreshProfile();
}

// --- Guild Dashboard ---
function openGuildDashboard() {
    const a = me(); if (!a) return;
    if (!a.guildId || !getMyGuild()) {
        // No guild, open join screen
        openGuildJoinScreen();
        return;
    }
    renderGuildDashboard();
    showScreen('screen-guild');
}

function renderGuildDashboard() {
    const g = getMyGuild();
    if (!g) return;
    const isOwner = g.ownerId === myId();
    const container = document.getElementById('guild-dashboard-content');

    container.innerHTML = `
        <!-- Guild Header -->
        <div class="guild-header-card">
            <div class="guild-icon-big">${g.icon}</div>
            <div class="guild-name-big">${esc(g.name)}</div>
            <div style="color:var(--text2);font-size:12px;font-weight:700;margin-bottom:8px;">邀請碼（點擊複製）</div>
            <div class="guild-code-badge" onclick="copyGuildCode('${g.code}')">
                <i class="ph-bold ph-copy"></i> ${g.code}
            </div>
            <div class="guild-info-row">
                <div class="guild-info-chip"><i class="ph-bold ph-users"></i> ${g.members.length} 成員</div>
                <div class="guild-info-chip"><i class="ph-bold ph-calendar-blank"></i> ${new Date(g.createdAt).toLocaleDateString('zh-TW')}</div>
            </div>
        </div>

        ${isOwner ? `
        <!-- Owner Actions -->
        <div style="display:flex;gap:8px;margin-top:16px;">
            <button class="guild-action-btn" onclick="editGuildName()">
                <i class="ph-bold ph-pencil-simple"></i> 修改名稱
            </button>
            <button class="guild-action-btn" onclick="editGuildIcon()">
                <i class="ph-bold ph-image"></i> 更換圖示
            </button>
        </div>
        ` : ''}

        <!-- Members Section -->
        <div style="margin-top:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div style="font-size:15px;font-weight:900;color:var(--text);">👥 公會成員 (${g.members.length})</div>
            </div>
            <div id="guild-members-list">
                ${g.members.map(m => renderGuildMemberCard(m, isOwner, g)).join('')}
            </div>
        </div>

        <!-- Leave Guild -->
        <div style="margin-top:24px;">
            <button class="guild-action-btn danger" style="width:100%;" onclick="doLeaveGuild()">
                <i class="ph-bold ph-sign-out"></i> ${isOwner ? '解散公會' : '退出公會'}
            </button>
        </div>
    `;
}

function renderGuildMemberCard(member, isOwner, guild) {
    const isSelf = member.id === myId();
    const isThisOwner = member.id === guild.ownerId;
    let roleBadgeClass = 'member';
    let roleLabel = member.roleTitle || '成員';
    if (isThisOwner) { roleBadgeClass = 'owner'; roleLabel = member.roleTitle || '會長'; }
    else if (roleLabel === '副會長') { roleBadgeClass = 'vice'; }

    const editBtn = (isOwner && !isSelf) ? `
        <button style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:18px;padding:4px;"
                onclick="editMemberRole('${member.id}')">
            <i class="ph-bold ph-pencil-simple"></i>
        </button>
    ` : '';

    return `
        <div class="guild-member-card">
            <div class="guild-member-avatar">${member.emoji || '🧙'}</div>
            <div class="guild-member-info">
                <div class="guild-member-name">${esc(member.name)}${isSelf ? ' <span style="color:var(--primary);font-size:11px;">(你)</span>' : ''}</div>
                <div class="guild-member-role">
                    <span class="guild-role-badge ${roleBadgeClass}">${isThisOwner ? '👑' : ''} ${roleLabel}</span>
                </div>
            </div>
            ${editBtn}
        </div>
    `;
}

function copyGuildCode(code) {
    navigator.clipboard.writeText(code).then(() => showToast('邀請碼已複製！')).catch(() => showToast(`邀請碼：${code}`));
}

// --- Guild Editing (Owner only) ---
function closeGuildEditModal() {
    document.getElementById('modal-guild-edit').style.display = 'none';
}

function editGuildName() {
    if (!isGuildOwner()) return;
    const g = getMyGuild();
    document.getElementById('guild-edit-modal-title').textContent = '修改公會名稱';
    document.getElementById('guild-edit-modal-body').innerHTML = `
        <div class="form-group" style="margin-bottom:0;">
            <label>新名稱</label>
            <input id="guild-edit-name-input" value="${esc(g.name)}" maxlength="20" placeholder="輸入新的公會名稱">
        </div>
    `;
    const btn = document.getElementById('guild-edit-confirm-btn');
    btn.onclick = () => {
        const newName = document.getElementById('guild-edit-name-input').value.trim();
        if (!newName || newName.length < 2) { showToast('名稱至少需要 2 個字！'); return; }
        g.name = newName;
        saveGlobal();
        closeGuildEditModal();
        renderGuildDashboard();
        showToast('公會名稱已更新！');
    };
    document.getElementById('modal-guild-edit').style.display = 'flex';
}

function editGuildIcon() {
    if (!isGuildOwner()) return;
    const g = getMyGuild();
    selectedGuildIcon = g.icon;
    document.getElementById('guild-edit-modal-title').textContent = '更換公會圖示';
    document.getElementById('guild-edit-modal-body').innerHTML = `
        <div class="guild-icon-grid" id="guild-edit-icon-grid"></div>
    `;
    // Render icons in the edit modal
    const grid = document.getElementById('guild-edit-icon-grid');
    grid.innerHTML = GUILD_ICONS.map(icon => `
        <div class="guild-icon-option${icon === selectedGuildIcon ? ' selected' : ''}"
             onclick="selectEditGuildIcon('${icon}')">${icon}</div>
    `).join('');
    const btn = document.getElementById('guild-edit-confirm-btn');
    btn.onclick = () => {
        g.icon = selectedGuildIcon;
        saveGlobal();
        closeGuildEditModal();
        renderGuildDashboard();
        showToast('公會圖示已更新！');
    };
    document.getElementById('modal-guild-edit').style.display = 'flex';
}

function selectEditGuildIcon(icon) {
    selectedGuildIcon = icon;
    const grid = document.getElementById('guild-edit-icon-grid');
    if (grid) {
        grid.innerHTML = GUILD_ICONS.map(i => `
            <div class="guild-icon-option${i === selectedGuildIcon ? ' selected' : ''}"
                 onclick="selectEditGuildIcon('${i}')">${i}</div>
        `).join('');
    }
}

function editMemberRole(memberId) {
    if (!isGuildOwner()) return;
    const g = getMyGuild();
    const member = g.members.find(m => m.id === memberId);
    if (!member) return;

    document.getElementById('guild-edit-modal-title').textContent = `設定「${member.name}」的職稱`;
    document.getElementById('guild-edit-modal-body').innerHTML = `
        <div class="form-group" style="margin-bottom:8px;">
            <label>職稱</label>
            <input id="guild-edit-role-input" value="${esc(member.roleTitle || '成員')}" maxlength="10" placeholder="例：副會長、魔法顧問">
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
            <button class="btn btn-sm" style="background:rgba(99,102,241,0.1);color:var(--primary);border:1px solid rgba(99,102,241,0.2);border-radius:20px;font-size:11px;padding:4px 10px;"
                    onclick="document.getElementById('guild-edit-role-input').value='副會長'">副會長</button>
            <button class="btn btn-sm" style="background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.2);border-radius:20px;font-size:11px;padding:4px 10px;"
                    onclick="document.getElementById('guild-edit-role-input').value='魔法顧問'">魔法顧問</button>
            <button class="btn btn-sm" style="background:rgba(245,158,11,0.1);color:var(--orange);border:1px solid rgba(245,158,11,0.2);border-radius:20px;font-size:11px;padding:4px 10px;"
                    onclick="document.getElementById('guild-edit-role-input').value='戰鬥隊長'">戰鬥隊長</button>
            <button class="btn btn-sm" style="background:rgba(244,114,182,0.1);color:var(--pink);border:1px solid rgba(244,114,182,0.2);border-radius:20px;font-size:11px;padding:4px 10px;"
                    onclick="document.getElementById('guild-edit-role-input').value='任務專員'">任務專員</button>
        </div>
    `;
    const btn = document.getElementById('guild-edit-confirm-btn');
    btn.onclick = () => {
        const newRole = document.getElementById('guild-edit-role-input').value.trim();
        if (!newRole) { showToast('請輸入職稱！'); return; }
        member.roleTitle = newRole;
        saveGlobal();
        closeGuildEditModal();
        renderGuildDashboard();
        showToast(`已將「${member.name}」的職稱設為「${newRole}」`);
    };
    document.getElementById('modal-guild-edit').style.display = 'flex';
}

// --- Helper: get character emoji for guild display ---
function getCharEmojiForGuild(acc) {
    if (!acc || !acc.character) return '🧙';
    const c = CHARACTERS.find(x => x.id === acc.character);
    if (!c) return '🧙';
    const tier = c.tiers ? c.tiers.find(t => acc.level >= t.lvl) : null;
    return tier ? tier.emoji : c.emoji;
}

// --- Update refreshProfile to show guild info in menu ---
const _originalRefreshProfile = refreshProfile;
refreshProfile = function () {
    _originalRefreshProfile();
    const a = me(); if (!a) return;
    const label = document.getElementById('menu-guild-label');
    if (label) {
        const g = getMyGuild();
        if (g) {
            label.innerHTML = `<span style="color:var(--primary);font-weight:800;">${g.icon} ${esc(g.name)}</span> <i class="ph ph-caret-right"></i>`;
        } else {
            label.innerHTML = '尚未加入 <i class="ph ph-caret-right"></i>';
        }
    }
};

// --- Intercept claimTask to require guild ---
const _originalClaimTask = claimTask;
claimTask = function (id) {
    if (!requireGuild('接取任務')) return;
    _originalClaimTask(id);
};

// --- Intercept redeemReward to require guild ---
const _originalRedeemReward = redeemReward;
redeemReward = function (sku) {
    if (!requireGuild('兌換獎勵')) return;
    _originalRedeemReward(sku);
};
