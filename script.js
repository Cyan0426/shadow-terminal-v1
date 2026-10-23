(function() {
    let currentTab = 'A';
    let errorCount = 0;
    let unlockedA = false, unlockedB = false, unlockedC = false,unlockedD = false;

// 【新增】从浏览器缓存读取档案D
const savedD = localStorage.getItem('shadow_db_entry_D');
let hasSavedD = false;
if (savedD) {
    try {
        const parsed = JSON.parse(savedD);
        dbData['D'] = parsed;
        hasSavedD = true;
    } catch(e) { console.warn('读取档案D失败', e); }
}

// 【新增】如果缓存里有档案D，就动态生成标签页
window.addEventListener('load', function() {
    if (hasSavedD) {
        unlockedD = true;
        const dbTabs = document.getElementById('dbTabs');
        if (dbTabs && !document.querySelector(`.db-tab[data-key="D"]`)) {
            const newTab = document.createElement('div');
            newTab.className = 'db-tab';
            newTab.setAttribute('data-key', 'D');
            newTab.textContent = '档案 D';
            newTab.onclick = function() { switchDbTab('D', this); };
            dbTabs.appendChild(newTab);
        }
    }
});

    const dbData = {
        'A': {
            password: '2015TANGO',
            title: '2015 军事行动报告 · TANGO',
            text: '时间：2015年11月4日。地点：阿富汗山区。任务：清除高价值目标。<br><br>结果记录：目标已清除。敌方据点已摧毁。我方小队5人，阵亡4人。只有我活着回来了。',
            quote: '“任务很成功。去他妈的‘成功’。如果当时华盛顿少犹豫两分钟，我们不需要用队友的命去填。从那天起，我不再穿那身该死的军装。”',
            signature: '—— P. Graves 手批'
        },
        'B': {
            password: 'LASALMAS',
            title: '拉斯阿玛斯行动记录 · SHUFFLE',
            text: '行动代号：拉斯阿玛斯绞肉机。<br>执行指令：封锁整座城市，设立检查站。所有对暗影车队造成威胁的移动目标，一律视为敌对武装。<br>结果：街区已肃清。报销单据已提交。',
            quote: '“五角大楼那帮穿西装的杂碎，喝着二百块一杯的咖啡，指望着我们在泥坑里把活干得跟阅兵一样体面。谢菲尔德让我们拔掉这颗牙，我们拔了。事后他们嫌牙根上带血，说引发了‘平民人道主义危机’。行啊，既然要立牌坊，那就别怪我们把账单拉长。一千万的尾款扣了百分之十五，美其名曰‘战后重建专项基金’。去你妈的重建。这笔钱够那帮政客买几套新西装，但换不回我手下弟兄被炸断的腿。通知财务部，从今天起，凡是五角大楼派发的脏活，预付款提高到 70%。”',
            signature: '—— P. Graves 私人批注'
        },
        'C': {
            password: 'D0923',
            title: '私人终端 · 遗嘱与资产转移草案',
            text: '起草时间：凌晨 04:12。地点：苏丹港外围。<br>这次行动的死亡概率评估是 70%。财务部那帮蠢货还在跟我算账，但我得先把这边的事理顺。<br><br>律师那里有一份公事公办的遗嘱，把暗影公司留给奥兹和那几个老伙计。那是他们应得的。但这份草案，是只留给你的。<br><br>听着，Darlin。如果我这次回不去，奥兹会拿到我口袋里那枚微型加密U盘。<br><br><strong>第一条指令</strong>：德州庄园、加勒比安全屋、以及我名下所有地下掩体的指纹和生物识别权限，在确认我死亡的那一秒，自动覆盖并转移给你。<br><br><strong>第二条指令</strong>：黑卡副卡不会冻结。里面的额度够你十辈子造。别省。<br><br><strong>第三条指令</strong>：让奥兹把那些不干净的手下和政客清理干净。这件事用不着你操心，我会在地狱里盯着他们。<br><br><strong>第四条指令</strong>：我衣柜最底层有个保险箱，密码是你的生日。里面有一份关于巴纳比财团的致命证据。如果你这辈子想做点什么，用这个去把那个混蛋的公司碾碎。但如果你只想好好活着，那就把这个秘密烧了，换个名字去欧洲。我都无所谓，你高兴就好。<br><br>最后，把我埋在德州。<br><br>别对着墓碑哭。我没耐心听那些废话。<br><br>找个能打的、脑子正常的男人，别找个连枪都拿不稳的软蛋。',
            quote: '[系统提示]：当前草稿状态为 [未发送]。备注：如果活着回来，就把它删了，太肉麻。',
            signature: '—— P. Graves'
        }
    };

    window.switchDbTab = function(tabId, element) {
        currentTab = tabId;
        document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
        document.getElementById('dbInputArea').style.display = 'flex';
        document.getElementById('dbErrorMsg').style.display = 'none';
        document.getElementById('dbDocument').style.display = 'none';
        document.getElementById('dbPasswordInput').value = '';
      if ((tabId === 'A' && unlockedA) || (tabId === 'B' && unlockedB) || (tabId === 'C' && unlockedC) || (tabId === 'D' && unlockedD)) {
            showDocument(tabId);
        }
    };

    window.verifyDbPassword = function() {
        const input = document.getElementById('dbPasswordInput').value.trim().toUpperCase();
        const errorEl = document.getElementById('dbErrorMsg');
        const inputArea = document.getElementById('dbInputArea');
        const expected = dbData[currentTab].password;

        if (input === expected) {
            errorCount = 0;
            errorEl.style.display = 'none';
            inputArea.style.display = 'none';
            if (currentTab === 'A') unlockedA = true;
            if (currentTab === 'B') unlockedB = true;
            if (currentTab === 'C') unlockedC = true;
            if (currentTab === 'D') unlockedD = true;
            showDocument(currentTab);
        } else {
            errorCount++;
            errorEl.style.display = 'block';
            inputArea.classList.add('db-shake');
            setTimeout(() => inputArea.classList.remove('db-shake'), 300);
            document.getElementById('dbPasswordInput').value = '';
            if (errorCount >= 3) {
                errorCount = 0;
                if (typeof triggerGravesAltMessage === 'function') {
                    triggerGravesAltMessage("Darlin'，停手。别逼我把你的IP从终端里踢出去。如果你想看，可以直接问我，但别像黑客一样破解我的底层档案。");
                }
            }
        }
    };

    function showDocument(tabId) {
        const data = dbData[tabId];
        document.getElementById('dbDocTitle').textContent = data.title;
        document.getElementById('dbDocText').innerHTML = data.text;
        document.getElementById('dbDocQuote').innerHTML = data.quote;
        document.getElementById('dbDocSignature').textContent = data.signature;
        document.getElementById('dbDocument').style.display = 'block';
    }

window.addDbEntry = function(key, data) {
    dbData[key] = data;
    if (key === 'D') {
        localStorage.setItem('shadow_db_entry_D', JSON.stringify(data));
        unlockedD = true; 
    }
    // 🌟 核心新增：动态生成一个新的“档案 D”标签页
    const dbTabs = document.getElementById('dbTabs');
    if (dbTabs && !document.querySelector(`.db-tab[data-key="${key}"]`)) {
        const newTab = document.createElement('div');
        newTab.className = 'db-tab';
        newTab.setAttribute('data-key', key);
        newTab.textContent = `档案 ${key}`;
        newTab.onclick = function() { switchDbTab(key, this); };
        dbTabs.appendChild(newTab);
    }
};
  
window.openShadowDatabase = function() {
    if (typeof closeAppCenter === 'function') closeAppCenter();   // 👈 新增这一行
    document.getElementById('shadowDbOverlay').style.display = 'flex';
    errorCount = 0;
    // ... 后面的代码不动
    document.getElementById('dbPasswordInput').value = '';
    document.getElementById('dbErrorMsg').style.display = 'none';
    const tabs = document.querySelectorAll('.db-tab');
    tabs.forEach(t => t.classList.remove('active'));

    // 优先检查是否有档案D
    const dTab = document.querySelector('.db-tab[data-key="D"]');
    if (dTab) {
        currentTab = 'D';
        dTab.classList.add('active');
        document.getElementById('dbInputArea').style.display = 'flex';
        document.getElementById('dbDocument').style.display = 'none';
        if (typeof unlockedD !== 'undefined' && unlockedD) {
            showDocument('D');
            document.getElementById('dbInputArea').style.display = 'none';
        }
        return; 
    }

    if (!unlockedA) { currentTab = 'A'; tabs[0].classList.add('active'); }
    else if (!unlockedB) { currentTab = 'B'; tabs[1].classList.add('active'); }
    else if (!unlockedC) { currentTab = 'C'; tabs[2].classList.add('active'); }
    else { currentTab = 'A'; tabs[0].classList.add('active'); }
    
    document.getElementById('dbInputArea').style.display = 'flex';
    document.getElementById('dbDocument').style.display = 'none';
    if ((currentTab === 'A' && unlockedA) || (currentTab === 'B' && unlockedB) || (currentTab === 'C' && unlockedC)) {
        showDocument(currentTab);
    }
};

  window. closeShadowDatabase = function() {
        document.getElementById('shadowDbOverlay').style.display = 'none';
    };
})();

/* ================= 好感拜访互动系统逻辑 ================= */
let affectionScore = parseInt(localStorage.getItem('gravesAffection')) || 0;
let milestoneClaimed = JSON.parse(localStorage.getItem('gravesMilestoneClaimed')) || { 100: false, 1000: false, 10000: false };

window.openAffectionSystem = function() {
    if (typeof closeAppCenter === 'function') closeAppCenter();
    const overlay = document.getElementById('affectionOverlay');
    if (overlay) {
        overlay.classList.add('active');
        updateAffectionUI('calm', "Darlin'，你今天怎么想起点开这个终端了？");
    }
};

window.closeAffectionSystem = function() {
    const overlay = document.getElementById('affectionOverlay');
    if (overlay) overlay.classList.remove('active');
};

window.interactWithGraves = function(action) {
    let scoreChange = 0;
    let dialogueText = "";
    let targetExpr = ""; 
    let specialEffect = null; // 'heart' 或 'fire'
    
    // 你的笔记设定
    switch(action) {
        case 'pat': // 摸头
            scoreChange = 15; // 你笔记里之前写+15
            dialogueText = "头发要被你弄乱了！";
            targetExpr = "surprise";
            break;
        case 'kiss': // 亲亲
            scoreChange = 30;
            dialogueText = "嗯...我喜欢这个。";
            targetExpr = "smirk";
            specialEffect = 'heart'; // 触发爱心
            break;
        case 'pinch': // 捏脸
            scoreChange = 10;
            dialogueText = "轻点、轻点。";
            targetExpr = "cry";
            break;
        case 'transfer': // 转账100$
            scoreChange = 5;
            dialogueText = "转这么多？有心事？";
            targetExpr = "surprise";
            break;
        case 'ignore': // 骗他说不理他
            scoreChange = -20; // 惹生气扣好感
            dialogueText = "我没批准！";
            targetExpr = "angry";
            specialEffect = 'fire'; // 触发火焰
            break;
    }

    // 更新数值
    affectionScore += scoreChange;
    if (affectionScore < 0) affectionScore = 0;
    localStorage.setItem('gravesAffection', affectionScore);

    // 更新 UI
    updateAffectionUI(targetExpr, dialogueText);
    
    // 触发表情特效
    if (specialEffect === 'heart') {
        for(let i=0; i<6; i++) setTimeout(()=>spawnParticle('❤️'), i*150);
    } else if (specialEffect === 'fire') {
        for(let i=0; i<6; i++) setTimeout(()=>spawnParticle('🔥'), i*100);
    }

    // 触发互动动画（重置动画状态以便重复触发）
    const wrapper = document.getElementById('characterWrapper');
    wrapper.classList.remove('anim-kiss', 'anim-angry');
    void wrapper.offsetWidth; // 强制浏览器重绘
    if (action === 'kiss') wrapper.classList.add('anim-kiss');
    if (action === 'ignore') wrapper.classList.add('anim-angry');

    // 检查成就
    checkAffectionMilestones();

    if (typeof saveGameState === 'function') saveGameState();
};

function updateAffectionUI(exprName, text) {
    document.getElementById('affectionScoreDisplay').textContent = affectionScore;
    document.getElementById('affectionDialogue').textContent = `"${text}"`;

    // 切换表情图层
    const expressions = ['calm', 'surprise', 'angry', 'cry', 'smirk'];
    expressions.forEach(expr => {
        const el = document.getElementById(`expr-${expr}`);
        if (el) {
            if (expr === exprName) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    });
}

// 生成漂浮粒子（表情特效）
function spawnParticle(emoji) {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = (20 + Math.random() * 60) + '%';
    particle.style.bottom = '20%';
    particle.style.color = emoji === '🔥' ? '#ff4500' : '#ff69b4'; // 火焰红，爱心粉
    particle.style.animationDuration = (1 + Math.random() * 1) + 's';
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
}

// 成就判定（100 / 1000 / 10000）
function checkAffectionMilestones() {
    const milestones = [100, 1000, 10000];
    let triggered = false;
    
    for (let m of milestones) {
        if (affectionScore >= m && !milestoneClaimed[m]) {
            milestoneClaimed[m] = true;
            triggered = true;
            
            let reward = 0;
            let voiceMsg = "";
            if (m === 100) { reward = 2000000; voiceMsg = "好感突破100，这是给你的零花钱。"; }
            if (m === 1000) { reward = 5000000; voiceMsg = "好感满1000，今晚我过来陪你。"; }
            if (m === 10000) { reward = 10000000; voiceMsg = "Darlin'，你这辈子别想离开暗影了。"; }

           // 增加【黑色行动资金】
if (typeof dispatchFunds !== 'undefined') {
    dispatchFunds += reward; // 把钱加到黑色行动资金
    if (typeof renderDispatchFunds === 'function') {
        renderDispatchFunds(); // 刷新黑色行动资金界面的数字
    }
}

            // 满1000和10000触发满屏爱心动画
            if (m >= 1000) {
                for(let i=0; i<40; i++) {
                    setTimeout(() => spawnParticle('❤️'), i * 80);
                }
            }

            // 触发提示（用你原来系统的小号消息）
            setTimeout(() => {
                if (typeof triggerGravesAltMessage === 'function') {
                    triggerGravesAltMessage(voiceMsg);
                }
                updateAffectionUI('smirk', voiceMsg);
            }, 600);
            
            break;
        }
    }
    
    if (triggered) {
        localStorage.setItem('gravesMilestoneClaimed', JSON.stringify(milestoneClaimed));
    }
}
/* ================= 战术加密电话逻辑 ================= */
let callTimerInterval = null;
let callSeconds = 0;
let recognition = null;
let isCallMuted = false;
let isCallActive = false;
let callDebounceTimer = null;

// 🌟 彻底废弃麦克风，改为纯文本
function initSpeechRecognition() {
    return null;
}


// 在 index.html 中搜索 openCallOverlay 函数
window.openCallOverlay = function() {
    // 原有的关闭列表，加上 '.briefing-drawer', '.bank-overlay'
    document.querySelectorAll('.medical-drawer, .medical-auth-modal, .app-center-overlay, .memo-drawer, .armory-drawer, .catering-drawer, .calendar-overlay, .trading-overlay, .affection-overlay, .briefing-drawer, .bank-overlay').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none'; 
    });
    // ... 后面的代码保持不变
    // 原有的打开通话逻辑
    document.getElementById('callOverlay').classList.add('active');
    document.getElementById('callSubtitle').textContent = '加密信道已建立，请在下方输入指令...';
    document.getElementById('callTimer').textContent = '00:00';
    
    callSeconds = 0;
    isCallMuted = false;
    isCallActive = true;
    document.getElementById('callMuteBtn').classList.remove('active');
    
    if (callTimerInterval) clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
        callSeconds++;
        const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
        const secs = String(callSeconds % 60).padStart(2, '0');
        document.getElementById('callTimer').textContent = `${mins}:${secs}`;
    }, 1000);
    
    setTimeout(() => {
        const input = document.getElementById('callTextInput');
        if (input) input.focus();
    }, 300);
};
// ⚠️ 确保这个函数在这里就结束了，不要多写花括号

// 🌟 静音按钮改为纯视觉反馈
window.toggleCallMute = function() {
    isCallMuted = !isCallMuted;
    const btn = document.getElementById('callMuteBtn');
    if (isCallMuted) {
        btn.classList.add('active');
        document.getElementById('callSubtitle').textContent = '麦克风已静音（当前为文字模式，该按钮仅保留视觉效果）';
    } else {
        btn.classList.remove('active');
        document.getElementById('callSubtitle').textContent = '请在下方输入指令...';
    }
};

// 🌟 发送文本消息
window.sendCallText = function() {
    const input = document.getElementById('callTextInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text || !isCallActive) return;
    input.value = '';
    const subEl = document.getElementById('callSubtitle');
    subEl.innerHTML = `<span style="color: #8a8a93;">[你]</span> ${text}`;
    subEl.scrollTop = subEl.scrollHeight;
    if (typeof sendVoiceMessageToGraves === 'function') {
        sendVoiceMessageToGraves(text);
    }
};

// 🌟 挂断电话
window.hangupCall = function() {
    isCallActive = false;
    if (callTimerInterval) clearInterval(callTimerInterval);
    
    // 记录通话时长
    const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const secs = String(callSeconds % 60).padStart(2, '0');
    const durationStr = `${mins}:${secs}`;
    
    // 插入聊天记录
    if (typeof chatHistories !== 'undefined' && chatHistories['graves_alt']) {
        const msg = `📞 通话结束，时长 ${durationStr}`;
        chatHistories['graves_alt'].push({ sender: 'received', text: msg, time: '刚刚' });
        if (currentChatId === 'graves_alt') {
            appendMessageToArea('received', msg, '刚刚');
        }
        if (typeof saveGameState === 'function') saveGameState();
    }
    
    document.getElementById('callOverlay').classList.remove('active');
};

window.switchToTextChat = function() {
    hangupCall();
    // 确保聊天界面是打开的
    if (!document.getElementById('chatOverlay').classList.contains('active')) {
        openChat('graves_alt', '未知号码 (Shadow_06)');
    }
};
// 发送语音识别结果给 API
async function sendVoiceMessageToGraves(text) {
    document.getElementById('callSubtitle').textContent = 'SHADOW_06 正在解码音频...';
    
    const systemPrompt = `你现在扮演《使命召唤》中的菲利普·格瑞夫斯（Phillip Graves）。
当前状态：你正在和特别访客进行加密语音通话（用户是语音，你是文字回复）。
人设：德州口音的霸道总裁，自信、傲慢，但私底下对信任的人有保护欲和占有欲。此时语气应该亲近、温和一些，就像平常聊天。
要求：
1. 简短、口语化，像打电话一样，不要大段描写，拒绝诗歌化表达。
2. 语气清晰稳定，像是在安静的房间内进行加密通话。不需要刻意模拟通讯杂音。
3. 不要漏翻译，英文引号内，下方括号附中文翻译。
请用他的语气，简短地回复这句话：${text}`;

    try {
        const response = await fetch('https://api.shadowterminalgraves.work/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                temperature: 0.8,
                max_tokens: 600
            })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        let reply = "⚠️ 通讯信号受到严重干扰，请检查网络连接。";
        if (data.choices && data.choices.length > 0) {
            reply = data.choices[0].message.content.trim();
        }
        
        // 用打字机效果显示回复
        let i = 0;
        const subEl = document.getElementById('callSubtitle');
        subEl.textContent = `[P. Graves] `;
        function typeChar() {
            if (i < reply.length) {
                subEl.textContent += reply.charAt(i);
                i++;
                subEl.scrollTop = subEl.scrollHeight;
                setTimeout(typeChar, 30);
            }
        }
        typeChar();
        
    } catch (error) {
        console.warn('API 请求失败:', error);
        document.getElementById('callSubtitle').textContent = '⚠️ 无法连接至指挥网络。检查你的加密线路。';
    }
}
(function() {
    let bbHealth = '正常';
    let bbProgress = 0;
    let bbAgent = '猎鹰';
    let currentNodeId = 'start';

    const storyData = {
        'start': {
            system: '[SYSTEM] 加密信道接入成功... 信号强度 47%...<br>[SYSTEM] 当地时间 03:00。气压低，暴雨。能见度极低。',
            graves: '猎鹰，听得到吗？听着，我们在瓦赫拉，这不是什么好地方。情报显示，“工匠”就在那栋废弃的化工厂地下二层。',
            agent: '[猎鹰] 收到。外围有热源，至少有二十个武装人员在巡逻。他们看起来不像是杂牌军，像Konni的正规部队。',
            choices: [
                { text: '[潜行] 从西侧废弃的排水管道潜入。', next: 'stealth_start', effect: '潜行' },
                { text: '[强攻] 开着装甲车直接冲破正门。', next: 'assault_start', effect: '强攻' }
            ]
        },
        'stealth_start': {
            system: '[SYSTEM] 你带着战术小队贴地滑入积水的排水渠。水很冷。<br>[SYSTEM] 前方发现两个暗哨。你挥了挥手，队员用消音器无声地解决了他们。<br>[SYSTEM] 就在你穿过废墟时，脚下踢到了一个硬物。你用战术手电一照——是一具穿着暗影公司制服的尸体。',
            graves: '什么情况？暗影公司没有派这个小队。他不是我们的人。',
            choices: [
                { text: '[检查尸体] 翻找他的遗物，看有没有什么线索。', cost: '耗费时间，但能获得内鬼线索', next: 'clue_found', effect: '检查' },
                { text: '[继续前进] 别管他，任务优先。', cost: '忽视线索，错失重要信息', next: 'clue_missed', effect: '无视' }
            ]
        },
        'clue_found': {
            system: '[SYSTEM] 你在他的内袋里找到了一张被血浸透的防水纸条。<br>[SYSTEM] 上面写着：“客户要求，如果工匠无法带走，就让他永远闭嘴。不要告诉格瑞夫斯。”',
            agent: '[猎鹰] 老板，这好像是你那个客户干的好事。',
            graves: '(沉默两秒) 别管那张纸条。带工匠回来，我要的是结果。',
            choices: [
                { text: '[继续潜入] 把纸条收好，继续向实验室前进。', next: 'lab_arrival', effect: '继续' }
            ]
        },
        'clue_missed': {
            system: '[SYSTEM] 你放下尸体，带队快速穿过废墟。',
            graves: '干得对。战场上没有时间留给死人。',
            choices: [
                { text: '[继续潜入] 向实验室前进。', next: 'lab_arrival', effect: '继续' }
            ]
        },
        'assault_start': {
            system: '[SYSTEM] 防雷车咆哮着撞碎了化工厂的铁门。警报声瞬间响彻夜空。<br>[SYSTEM] 敌人重机枪从二楼倾泻火力。突击手“蜂鸟”在跳下车时被流弹击中大腿，鲜血直流。',
            agent: '[蜂鸟] (痛苦喘息) 别管我！快去地下室！工匠要跑了！',
            graves: '猎鹰，这是你的任务。你是要救你的兄弟，还是去追那个价值1.5亿的混蛋？',
            choices: [
                { text: '[救队友] 呼叫医疗撤离，优先保住“蜂鸟”的命。', cost: '延误战机，但队友存活', next: 'rescue_teammate', effect: '救人' },
                { text: '[追任务] 让“蜂鸟”自己撑着，带队强行突入。', cost: '队友极大概率伤残', next: 'lab_arrival', effect: '冷酷' }
            ]
        },
        'rescue_teammate': {
            system: '[SYSTEM] 医疗小队冒着弹雨把蜂鸟拖进了装甲车。',
            agent: '[蜂鸟] 谢了，头儿...但我刚才好像看到...咱们队伍里有个人，在进门前偷偷发了一条加密短信。',
            graves: '别听他瞎说。现在给我突入地下室，带走工匠。',
            choices: [
                { text: '[突入实验室] 压下心里的疑虑，带队杀入地下。', next: 'lab_arrival', effect: '继续' }
            ]
        },
        'lab_arrival': {
            system: '[SYSTEM] 你踹开防爆门。实验室里一片狼藉，地上散落着碎玻璃和废弃的离心管。<br>[SYSTEM] 实验室尽头，一个满头白发、穿着防化服的男人正蜷缩在角落。他手里紧紧攥着一个金属硬盘，另一只手握着一把左轮手枪。',
            agent: '[工匠] (嘶哑的吼声) 别过来！我知道你们是谁派来的！巴纳比那个混蛋！他根本不是想救我！他想要我的P-7配方！',
            choices: [
                { text: '[武力威慑] 命令小队持枪逼近，强行解除他的武装。', cost: '极易擦枪走火', next: 'force_craft', effect: '强硬' },
                { text: '[安抚沟通] 让小队放下枪，独自上前和他谈判。', cost: '耗费时间，但可能获得真相', next: 'soft_craft', effect: '安抚' }
            ]
        },
        'force_craft': {
            system: '[SYSTEM] 你举枪逼近。工匠的手在剧烈颤抖，他的手指已经扣在了扳机上。',
            agent: '[工匠] 我死也不会让你们拿到配方！',
            system2: '[SYSTEM] 砰！一声枪响。工匠的手臂中弹，左轮手枪掉落在地。是你的狙击手开的枪。',
            graves: '干得好。把人打晕带回来，我们拿钱走人。',
            choices: [
                { text: '[强制带走] 让医疗兵给他止血，打晕扛走。', next: 'ending_cold', effect: '冷酷' }
            ]
        },
        'soft_craft': {
            system: '[SYSTEM] 你示意小队放下武器，独自走上前。你摘下了战术头盔。',
            agent: '[猎鹰] 我们不是来杀你的。我们是暗影公司。我们只负责把你带回去。',
            agent2: '[工匠] (冷笑) 带回去？做成标本吗？你们不知道，巴纳比半年前就拿到了半成品，卖给了黑曜石组织。他派人来，是为了灭口。',
            graves: '(声音低沉) 猎鹰，别听他胡扯。他是在拖延时间。带他回来。',
            choices: [
                { text: '[相信工匠] 接下硬盘，承诺销毁数据。', cost: '直接违抗格瑞夫斯的命令', next: 'trust_craft', effect: '信任' },
                { text: '[忠于公司] 遵从暗影公司的立场，强行逮捕。', cost: '违背良知，但拿到尾款', next: 'ending_cold', effect: '忠诚' }
            ]
        },
        'trust_craft': {
            system: '[SYSTEM] 你伸出手。工匠犹豫了两秒，把硬盘交给你，并递给你一张沾满油污的纸条。',
            agent: '[工匠] “P-7一旦量产，死的人会多一百倍。这里有解密公钥。帮我毁了它。”',
            graves: '(压低声音) 猎鹰，你他妈在干什么？把数据盘给我。别忘了，你只是个拿钱办事的雇佣兵。',
            system2: '[SYSTEM] 就在这时，通风管道里传来了一阵极其轻微的脚步声。有人正从后方接近你们。',
            choices: [
                { text: '[拔枪戒备] 大喊警告，让小队戒备。', next: 'final_showdown', effect: '警惕' },
                { text: '[沉默观察] 假装没发现，用余光看看到底是谁在跟踪。', next: 'final_showdown', effect: '隐忍' }
            ]
        },
        'final_showdown': {
            system: '[SYSTEM] 黑暗中，一个人影举起了手枪。枪口没有对准你，而是对准了“工匠”的后脑勺。<br>[SYSTEM] 是副手“灰熊”。他的袖口上，有一个极其隐蔽的、用荧光笔标记的“巴纳比财团”符号。',
            agent: '[灰熊] 抱歉，头儿。这是生意。你教过我，做雇佣兵，不能跟钱过不去。',
            graves: '灰熊！你他妈的敢动我的人！放下枪！',
            system2: '[SYSTEM] 倒计时：03:00。检测到地下结构受损，敌方正在实施定向爆破。',
            choices: [
                { text: '[战术欺骗] 顺着灰熊的话说，把数据盘扔给他，让他放松警惕。', cost: '需要极高心理博弈', next: 'ending_smart', effect: '欺骗' },
                { text: '[保护工匠] 扔掉数据盘，趁他分心时把工匠推进通风管道，自己断后。', cost: '放弃1.5亿，直面爆炸', next: 'ending_human', effect: '牺牲' }
            ]
        },
        'ending_cold': {
            report: true,
            title: '结局 · 冰冷的棋子',
            rows: [
                { label: '特工状态', val: '完好' },
                { label: '工匠状态', val: '死亡 / 交予客户' },
                { label: '数据盘', val: '完好，已移交' },
                { label: '客户满意度', val: '极高' },
                { label: '佣金到账', val: '全额' }
            ],
            note: '格瑞夫斯批注：“佣金已到账。你拿了属于你的分成。干得不错，你是一个合格的雇佣兵。不要去想那个工匠的眼神，那不重要。给你批了一周的假，好好放松。”'
        },
        'ending_smart': {
            report: true,
            title: '结局 · 骗过死神',
            rows: [
                { label: '特工状态', val: '轻伤' },
                { label: '工匠状态', val: '存活' },
                { label: '数据盘', val: '残骸中寻回' },
                { label: '客户满意度', val: '极低' },
                { label: '佣金到账', val: '扣除违约金' }
            ],
            note: '格瑞夫斯批注：“你背着我在搞什么小动作？别以为我没看到你扔出数据盘的动作。但这次我兜底了，因为我也觉得那个客户太嚣张。去德州的地下医院，肩膀需要休息，我会亲自盯着你上药。”'
        },
        'ending_human': {
            report: true,
            title: '结局 · 灰烬中的微光',
            rows: [
                { label: '特工状态', val: '重伤（昏迷）' },
                { label: '工匠状态', val: '存活（被秘密安置）' },
                { label: '数据盘', val: '遗失' },
                { label: '客户满意度', val: '极差（单方面终止合同）' },
                { label: '佣金到账', val: '0' }
            ],
            note: '格瑞夫斯批注：“你丢了1.5亿。财务部那帮混蛋在会议上骂了你一个多小时。但你知道我说了什么吗？我说，‘去你妈的1.5亿，他活着回来了。’ 好好养伤。少了一条胳膊我可不养你。”'
        }
    };

  function renderBlackBox() {
    const logArea = document.getElementById('blackboxLog');
    const choicesArea = document.getElementById('blackboxChoices');
    const node = storyData[currentNodeId];
    if (!node) return;

    document.getElementById('bbAgentName').textContent = bbAgent;
    document.getElementById('bbHealth').textContent = bbHealth;
    document.getElementById('bbHealth').style.color = bbHealth === '正常' ? '#2ecc71' : (bbHealth === '轻伤' ? '#e67e22' : '#e03e3e');
    document.getElementById('bbProgress').textContent = bbProgress + '%';

    logArea.innerHTML = '';
    choicesArea.innerHTML = '';

    if (node.report) {
        renderReport(node);
        return;
    }

    // ================= 核心修复：直接使用内联样式，配合完整的 HTML 构建 =================
    let fullText = '';
    const br = '<br>';
    const replaceBr = (str) => str ? str.replace(/\n/g, br) : '';

    // 系统提示：灰色，斜体
    if (node.system) fullText += `<span style="color: #8a8a93; font-style: italic;">${replaceBr(node.system)}</span>${br}${br}`;
    // 格瑞夫斯：金色，加粗
    if (node.graves) fullText += `<span style="color: #d4af37; font-weight: bold;">[GRAVES]</span> <span style="color: #e8e8e8;">${replaceBr(node.graves)}</span>${br}${br}`;
    // 特工/工匠：白色
    if (node.agent) fullText += `<span style="color: #e8e8e8;">${replaceBr(node.agent)}</span>${br}${br}`;
    if (node.agent2) fullText += `<span style="color: #e8e8e8;">${replaceBr(node.agent2)}</span>${br}${br}`;
    // 第二条系统提示：灰色，斜体
    if (node.system2) fullText += `<span style="color: #8a8a93; font-style: italic;">${replaceBr(node.system2)}</span>${br}${br}`;

    // 打字机效果（核心修复：使用 currentHTML 变量累积，不提前破坏标签结构）
    let i = 0;
    let currentHTML = '';
    
    function typeWriter() {
        if (i < fullText.length) {
            if (fullText.charAt(i) === '<') {
                const endIdx = fullText.indexOf('>', i);
                if (endIdx !== -1) {
                    currentHTML += fullText.substring(i, endIdx + 1);
                    i = endIdx + 1;
                    logArea.innerHTML = currentHTML;
                    logArea.scrollTop = logArea.scrollHeight;
                    setTimeout(typeWriter, 20);
                    return;
                }
            }
            currentHTML += fullText.charAt(i);
            logArea.innerHTML = currentHTML;
            i++;
            logArea.scrollTop = logArea.scrollHeight;
            setTimeout(typeWriter, 20);
        } else {
            renderChoices(choicesArea, node);
        }
    }
    logArea.innerHTML = '';
    typeWriter();
}

    function renderChoices(choicesArea, node) {
        node.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'blackbox-btn';
            let innerHTML = choice.text;
            if (choice.cost) innerHTML += `<span class="cost">代价：${choice.cost}</span>`;
            btn.innerHTML = innerHTML;

            btn.onclick = () => {
                if (choice.effect === '救人') { bbHealth = '轻伤'; bbProgress = 40; }
                if (choice.effect === '冷酷') { bbHealth = '正常'; bbProgress = 30; }
                if (choice.effect === '信任') { bbHealth = '轻伤'; bbProgress = 70; }
                if (choice.effect === '忠诚') { bbHealth = '正常'; bbProgress = 60; }
                if (choice.effect === '牺牲') { bbHealth = '重伤'; bbProgress = 90; }
                if (choice.effect === '欺骗') { bbHealth = '轻伤'; bbProgress = 90; }

                if (currentNodeId === 'start') bbProgress = 20;
                if (currentNodeId === 'stealth_start') bbProgress = 40;
                if (currentNodeId === 'assault_start') bbProgress = 40;
                if (currentNodeId === 'lab_arrival') bbProgress = 60;
                if (currentNodeId === 'trust_craft') bbProgress = 80;

                currentNodeId = choice.next;
                renderBlackBox();
            };
            choicesArea.appendChild(btn);
        });
    }

    function renderReport(node) {
bbProgress = 100;
document.getElementById('bbProgress').textContent = '100%';
        const logArea = document.getElementById('blackboxLog');
        const choicesArea = document.getElementById('blackboxChoices');

        let html = `<div class="blackbox-report"><div class="blackbox-report-title">${node.title}</div>`;
        node.rows.forEach(row => { html += `<div class="blackbox-report-row"><span>${row.label}</span><span>${row.val}</span></div>`; });
        html += `<div class="blackbox-report-note">${node.note}</div></div>`;
        logArea.innerHTML = html;
        logArea.scrollTop = logArea.scrollHeight;

     try {
    if (typeof dispatchFunds !== 'undefined' && typeof renderDispatchFunds === 'function' && typeof triggerGravesAltMessage === 'function') {
        let reward = 0;
        let gravesMsg = '';
        let clueMsg = '';

        // 改用 node.title 来判断结局，比 currentNodeId 更稳妥
        if (node.title && node.title.includes('冰冷的棋子')) {
            reward = 500000;
            gravesMsg = "Darlin'，黑箱行动的佣金到账了。客户很满意，你的分成已经打进账户。记住，感情不能当饭吃，这就是规矩。";
            clueMsg = "对了，刚才翻旧账本的时候看到一份之前南美的行动记录。呵呵，令人印象深刻。";
        }
        else if (node.title && node.title.includes('骗过死神')) {
            reward = 300000;
            gravesMsg = "我看到了你的小动作。你为了一个快死的工匠冒险，好在结局不错。钱打过去了，去养伤。下次别拿命去赌。";
            clueMsg = "希望你不会把聪明用在碰不该碰的东西上，sweetheart.我和拉斯阿玛斯那时没太大变化。";
        }
        else if (node.title && node.title.includes('灰烬中的微光')) {
            reward = 0;
            gravesMsg = "你丢了1.5亿。财务部那帮混蛋在会议上骂了你一个多小时。但你活着回来了。这比什么都重要。你欠我一次，Darlin'。";
            clueMsg = "你救了一个人，确实让我刮目相看，而我却屠...算了。那不是我的错，对吧，baby?";
        }

        dispatchFunds += reward;
        renderDispatchFunds();
        saveGameState();
        triggerGravesAltMessage(gravesMsg);

        setTimeout(() => {
            // 核心修复：只有当 clueMsg 有内容时才发送，避免出现空气泡
            if (clueMsg && clueMsg.trim() !== '') {
                if (typeof chatHistories !== 'undefined') {
                    if (!chatHistories['graves_alt']) chatHistories['graves_alt'] = [];
                  // 修改后
chatHistories['graves_alt'].push({
    sender: 'received',
    text: clueMsg,
    time: '刚刚'
});
// ...
if (currentChatId === 'graves_alt') {
    appendMessageToArea('received', clueMsg, '刚刚');
}
                }

                saveGameState();

                if (typeof addCommLogWithTyping === 'function') {
                    addCommLogWithTyping('[系统] 新的加密线索已写入私人终端。', 'success');
                }
            }
        }, 4000);
    }
} catch (e) { console.log('跨模块联动失败，但不影响报告显示。', e); }
        const restartBtn = document.createElement('button');
        restartBtn.className = 'blackbox-btn';
        restartBtn.style.textAlign = 'center';
        restartBtn.style.marginTop = '20px';
        restartBtn.textContent = '【重新开始】回到行动起点';
        restartBtn.onclick = () => {
            bbHealth = '正常'; bbProgress = 0; currentNodeId = 'start';
            renderBlackBox();
        };
        choicesArea.appendChild(restartBtn);
    }

    window.openBlackBox = function() {
    document.getElementById('blackboxOverlay').classList.add('active'); // 👈 改成了类名控制
    currentNodeId = 'start'; bbHealth = '正常'; bbProgress = 0;
    renderBlackBox();
};
window.closeBlackBox = function() {
    document.getElementById('blackboxOverlay').classList.remove('active'); // 👈 改成了类名控制
};
})();
// ================= 全局变量 =================
const SAVE_KEY = 'shadow_terminal_save';
let currentUser = localStorage.getItem('shadowUser') || '';
let currentChatId = null;
let currentBaseId = 'texas';
let passBuffer = '';
const CORRECT_PASS = '0923';
let pendingDangerousAction = null;

// 🌟 终极修复：一键清空所有可能重叠的界面
// 🌟 终极修复：一键清空所有可能重叠的界面
function closeAllOverlays() {
    const overlays = document.querySelectorAll(
    '.call-overlay, .briefing-drawer, .bank-overlay, .medical-drawer, ' +
    '.medical-auth-modal, .app-center-overlay, .memo-drawer, .armory-drawer, ' +
    '.catering-drawer, .calendar-overlay, .trading-overlay, .affection-overlay, ' +
    '.chat-overlay, .album-overlay, .shadow-db-overlay, .recruit-overlay, ' +
    '.blackbox-overlay, .dispatch-overlay, .tactical-overlay, .personnel-modal, ' +
    '.mine-overlay, .roulette-overlay, .sa-overlay, .sr-overlay, .music-overlay, .rush-overlay, ' +
    '.canteen-overlay, .sd-overlay, .claw-overlay, .investigation-overlay, .raven-overlay, ' +
    '.card-game-overlay, .calc-overlay'
);

    overlays.forEach(el => {
        el.classList.remove('active');
        el.style.display = ''; // 恢复默认状态
    });

    // 如果当前在通话，强制挂断
    if (typeof hangupCall === 'function' && typeof isCallActive !== 'undefined' && isCallActive) {
        hangupCall();
    }
}

// 全局存档函数（安全修复版）
function saveGameState() {
    try {
        const state = {
            tradingBonusClaimed: typeof tradingBonusClaimed !== 'undefined' ? tradingBonusClaimed : { '50m': false, '100m': false },
            memoListData: typeof memoListData !== 'undefined' ? memoListData : [],
            chatHistories: typeof chatHistories !== 'undefined' ? chatHistories : {},
            visitorCalendarSchedules: typeof visitorCalendarSchedules !== 'undefined' ? visitorCalendarSchedules : {},
            activeContractIds: typeof activeContractIds !== 'undefined' ? activeContractIds : [],
            tradingCash: typeof tradingCash !== 'undefined' ? tradingCash : 10000000,
            tradingDay: typeof tradingDay !== 'undefined' ? tradingDay : 1,
            tradingGameOver: typeof tradingGameOver !== 'undefined' ? tradingGameOver : false,
            tradingCurrentAssets: typeof tradingCurrentAssets !== 'undefined' ? tradingCurrentAssets : [],
            tradingLogs: typeof tradingLogs !== 'undefined' ? tradingLogs : [],
            snakeHighScore: typeof snakeHighScore !== 'undefined' ? snakeHighScore : 0,
            tacticalBoard: typeof tacticalBoard !== 'undefined' ? tacticalBoard : null,
            medicalReportsData: typeof medicalReportsData !== 'undefined' ? medicalReportsData : [],
            tacticalScore: typeof tacticalScore !== 'undefined' ? tacticalScore : 0,
            tacticalGameOver: typeof tacticalGameOver !== 'undefined' ? tacticalGameOver : false,
            hasWonTactical: typeof hasWonTactical !== 'undefined' ? hasWonTactical : false,
            dispatchFunds: typeof dispatchFunds !== 'undefined' ? dispatchFunds : 500000,
            agentStates: (typeof squadsData !== 'undefined' && typeof fixedAgentsData !== 'undefined')
                ? [...squadsData, ...fixedAgentsData].map(a => ({ id: a.id, health: a.health, restUntil: a.restUntil }))
                : []
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('保存进度失败', e);
    }
}// 全局读档函数（安全修复版）
function loadGameState() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return;
        const state = JSON.parse(saved);

        if (state.memoListData && state.memoListData.length > 0) memoListData = state.memoListData;
        if (state.chatHistories) chatHistories = state.chatHistories;
        if (state.visitorCalendarSchedules) visitorCalendarSchedules = state.visitorCalendarSchedules;
        if (state.activeContractIds) activeContractIds = state.activeContractIds;
        if (typeof state.tradingCash === 'number') tradingCash = state.tradingCash;
        if (typeof state.tradingDay === 'number') tradingDay = state.tradingDay;
        if (typeof state.tradingGameOver === 'boolean') tradingGameOver = state.tradingGameOver;
        if (state.tradingCurrentAssets && state.tradingCurrentAssets.length > 0) tradingCurrentAssets = state.tradingCurrentAssets;
        if (state.tradingLogs) tradingLogs = state.tradingLogs;
        if (typeof state.snakeHighScore === 'number') snakeHighScore = state.snakeHighScore;
        if (state.tradingBonusClaimed) tradingBonusClaimed = state.tradingBonusClaimed;
        if (typeof state.dispatchFunds === 'number') dispatchFunds = state.dispatchFunds;
        if (state.medicalReportsData) medicalReportsData = state.medicalReportsData;

        if (state.tacticalBoard) {
    tacticalBoard = state.tacticalBoard;      
    tacticalScore = state.tacticalScore || 0;
    tacticalGameOver = state.tacticalGameOver || false;
    hasWonTactical = state.hasWonTactical || false;
}

        // 恢复特工状态
        if (state.agentStates && typeof squadsData !== 'undefined' && typeof fixedAgentsData !== 'undefined') {
            state.agentStates.forEach(saved => {
                const agent = [...squadsData, ...fixedAgentsData].find(a => a.id === saved.id);
                if (agent) { 
                    agent.health = saved.health; 
                    agent.restUntil = saved.restUntil; 
                }
            });
        }
    } catch (e) {
        console.warn('读取进度失败', e);
    }
}

// ================= 1. 登录流程 =================

window.onload = function() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.remove('active');
};
function goToFaceScan() {
    const name = document.getElementById('usernameInput').value.trim();
    if (!name) { alert('请输入你的ID。'); return; }
    currentUser = name;
    localStorage.setItem('shadowUser', currentUser);
    document.getElementById('stepName').style.display = 'none';
    document.getElementById('stepFace').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('stepFace').style.display = 'none';
        document.getElementById('stepPass').style.display = 'flex';
    }, 2500);
}
function inputPass(num) { if (passBuffer.length >= 4) return; passBuffer += num; updatePassDots(); }
function clearPass() { passBuffer = ''; updatePassDots(); }
function updatePassDots() { document.querySelectorAll('.dot').forEach((dot, index) => { if (index < passBuffer.length) dot.classList.add('active'); else dot.classList.remove('active'); }); }
function submitPass() {
    if (passBuffer === CORRECT_PASS) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.add('active');
        
        // 1. 读取本地存档（如果之前存过）
        loadGameState();

        // 2. 动态更新所有需要显示访客名字的地方（名字发生变化也能自动刷新）
        const partnerEl = document.getElementById('partnerName');
        if (partnerEl) partnerEl.textContent = currentUser + ' · 伴侣';
        const avatarEl = document.getElementById('selfAvatar');
        if (avatarEl) avatarEl.textContent = currentUser.charAt(0).toUpperCase() || 'A';
        document.querySelectorAll('.visitor-name').forEach(el => el.textContent = currentUser);

        // 3. 重新渲染所有被存档影响到的 UI 界面
        if (typeof renderMemos === 'function') renderMemos();
        if (typeof renderContracts === 'function') renderContracts();
        if (typeof renderCalendar === 'function') renderCalendar();
        if (typeof renderTradingUI === 'function') renderTradingUI();
        if (typeof renderTacticalBoard === 'function') renderTacticalBoard();
        
        // 4. 触发小号弹窗
        triggerGravesAltMessage();
    } else {
        const popup = document.getElementById('errorPopup'); popup.classList.add('show');
        setTimeout(() => { popup.classList.remove('show'); }, 2500); clearPass();
    }
}
function switchPage(pageId, element) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}
function handleLogout() { if (confirm('确认注销当前ID？')) { localStorage.removeItem('shadowUser'); location.reload(); } }

// ================= 2. 系统小号弹窗 =================
let systemToastTimer = null;
function triggerGravesAltMessage(msg) {
    setTimeout(() => {
        const toast = document.getElementById('systemToast');
        const toastMsg = document.getElementById('toastMsg');
        const loginMsg = msg || "Darlin'，我看到你登入我的终端了。别声张，用这个小号和我说话。";
        
        // 1. 显示顶部弹窗
        if (toastMsg) toastMsg.textContent = loginMsg;
        toast.classList.add('show');
        if (systemToastTimer) clearTimeout(systemToastTimer);
systemToastTimer = setTimeout(() => { toast.classList.remove('show'); }, 5000);
        
        // 2. 悄悄将这句话写入小号的聊天记录（追加到最下方）
        if (typeof chatHistories !== 'undefined' && chatHistories['graves_alt']) {
          // 修改后
chatHistories['graves_alt'].push({ "sender": "received", "text": loginMsg, "time": "刚刚" });
        }

        // 3. 把联系人加进通讯录列表（避免重复添加）
        const contactsList = document.getElementById('contactsList');
        // 核心修复：不再直接 return，而是只跳过 HTML 插入
if (!document.getElementById('chat-item-alt')) {
    const altHTML = `<div class="chat-item" id="chat-item-alt" onclick="openChat('graves_alt', '未知号码 (Shadow_06)')" style="border-color: var(--gold-dim); animation: fadeIn 0.5s ease; margin-top: 10px;"><div class="chat-avatar" style="color:var(--gold); border-color:var(--gold-dark);">S</div><div class="chat-content"><div class="chat-header"><span class="chat-name">未知号码 (Shadow_06)</span><span class="chat-time" style="color:var(--gold-dim);">刚刚</span></div><div class="chat-message" style="color:var(--gold);">${loginMsg}</div></div></div>`;
    contactsList.insertAdjacentHTML('beforeend', altHTML);
}

// 核心修复：如果当前开着这个小号窗口，就用打字机效果显示新消息
if (currentChatId === 'graves_alt') {
   appendTypewriterMessage('received', loginMsg, '刚刚');
}
    }, 2000);
}
// ================= 3. 聊天数据与逻辑 =================
let chatHistories = {
    "partner": [
        { "sender": "received", "text": "有些密码只有你知道。比如我是怎么叫你的，还有我哪天连电话都不接。", "time": "历史记录" },
        { "sender": "sent", "text": "我落地了。中东的沙子真他妈烦人。你在哪儿？发个定位给我。", "time": "前天 23:10" },
        { "sender": "received", "text": "在家呢。你一身硝烟味，先去洗澡。", "time": "前天 23:15" },
        { "sender": "sent", "text": "一个人洗没意思。别关灯，等我视频。", "time": "前天 23:20" },
        { "sender": "received", "text": "少来这套，你明天不是还有早会？快去睡。", "time": "前天 23:25" },
        { "sender": "sent", "text": "没你在旁边我睡不着。把你的枕头拍给我看看，我要确定上面有你的味道。", "time": "前天 23:30" },
        { "sender": "received", "text": "你是变态吗？枕头有什么好看的。", "time": "前天 23:35" },
        { "sender": "sent", "text": "我就是变态。快点，Darlin，别让我派人回去拍。", "time": "前天 23:40" },
        { "sender": "received", "text": "（照片）给。睡觉去，别折腾了。", "time": "前天 23:45" },
        { "sender": "sent", "text": "收到了。明天要是让我知道有人靠近你超过三步远，我就把那个人的腿打断。", "time": "前天 23:50" },
        { "sender": "received", "text": "你真的是不可理喻。早餐在冰箱里。", "time": "昨天 08:30" },
        { "sender": "sent", "text": "看到了。但你昨晚是不是又踢被子了？我早上看监控，你蜷成一团。", "time": "昨天 08:35" },
        { "sender": "received", "text": "你……你什么时候在卧室装监控了？！", "time": "昨天 08:40" },
        { "sender": "sent", "text": "昨天。你一个人在家我不放心。习惯就好，这是我的底线。", "time": "昨天 08:45" },
        { "sender": "received", "text": "奥兹刚才给我打电话了，说你在会上骂人了。", "time": "昨天 14:20" },
        { "sender": "sent", "text": "他活该。但他不该越过我直接找你。我已经把他调去苏丹港了。", "time": "昨天 14:25" },
        { "sender": "received", "text": "你疯了吗？他只是汇报工作！你这是在监视我。", "time": "昨天 14:30" },
        { "sender": "sent", "text": "随便你怎么说。今天下午三点，有一个新来的安保主管会去家里。他会在院子外面站岗。", "time": "昨天 14:35" },
        { "sender": "received", "text": "我不同意！你凭什么替我做决定？", "time": "昨天 14:40" },
        { "sender": "sent", "text": "因为如果你出了事，我会把半个地球烧了。我不想吓你，但我绝不冒险。", "time": "昨天 14:45" },
        { "sender": "received", "text": "……我没生气，但我还是不开心。", "time": "昨天 15:00" },
        { "sender": "sent", "text": "如果你今晚乖乖吃晚饭，并且等我忙完这单生意，我就把他撤走。", "time": "昨天 15:10" },
        { "sender": "received", "text": "随便你。你几点回来？", "time": "昨天 15:15" },
        { "sender": "sent", "text": "凌晨。别等门，别关灯。我想一进门就看见你。", "time": "昨天 15:20" },
        { "sender": "sent", "text": "操。今晚的应酬太无聊了。那个卡塔尔军火商带了个女伴，穿得比你少多了。", "time": "昨天 20:00" },
        { "sender": "received", "text": "那你盯着她看好了，别回来。", "time": "昨天 20:05" },
        { "sender": "sent", "text": "我没看。我嫌她身上香水味太重，比不上你头发上的洗发水。", "time": "昨天 20:10" },
        { "sender": "received", "text": "油嘴滑舌。少喝点威士忌。", "time": "昨天 20:15" },
        { "sender": "sent", "text": "喝了三杯。但是没醉，我还能看清桌上的每一个人的脸。包括谁想打你的主意。", "time": "昨天 20:20" },
        { "sender": "sent", "text": "我回来了。你在沙发上睡着了。", "time": "今天 02:00" },
        { "sender": "sent", "text": "抱你回卧室的时候，你拽着我的袖子不放。你知道我那一刻差点不想去上班了吗？", "time": "今天 02:05" },
        { "sender": "received", "text": "你早上走怎么不叫我？我都没看你一眼。", "time": "今天 10:00" },
        { "sender": "sent", "text": "你睡得像只猫，我不忍心。我给你留了纸条，在咖啡机旁边。", "time": "今天 10:05" },
        { "sender": "received", "text": "字好丑。", "time": "今天 10:10" },
        { "sender": "sent", "text": "再丑也是我的字。下午来暗影研究院，我想见你。", "time": "今天 10:15" },
        { "sender": "received", "text": "去干嘛？看原型机？", "time": "今天 10:20" },
        { "sender": "sent", "text": "不。我只是想在图纸堆里闻到你身上的味道。我很烦，需要你。", "time": "今天 10:25" },
        { "sender": "received", "text": "你最近是不是太累了？控制欲已经快溢出来了。", "time": "今天 10:30" },
        { "sender": "sent", "text": "我承认。但我控制不了自己。你是唯一属于我的东西，我绝不允许任何人碰。", "time": "今天 10:35" },
        { "sender": "sent", "text": "会议中。想你了。刚才有个家伙凑过来借火，离我太近了，他身上的味道让我恶心。", "time": "今天 15:00" },
        { "sender": "received", "text": "那你离他远点。下午茶喝了吗？", "time": "今天 15:05" },
        { "sender": "sent", "text": "喝了。但比不上你递给我的杯子。穿那件红裙子，今晚等我回家。", "time": "刚刚" }
    ],
    "oz": [
        { "sender": "received", "text": "老板，科威特那边的尾款到账了，买家要换新冷链物流。", "time": "今天 14:20" },
        { "sender": "sent", "text": "用黑曜石的名义过一遍，注意别留痕迹。", "time": "今天 14:22" },
        { "sender": "received", "text": "明白。阿特拉斯资源那边的矿，还要继续盯着吗？", "time": "今天 14:25" },
        { "sender": "received", "text": "苏丹港的提货单我发加密邮件了，你看一下。", "time": "今天 15:00" },
        { "sender": "sent", "text": "收到，晚点回复你。", "time": "今天 15:05" },
        { "sender": "received", "text": "好的，老板。还有，法拉赫那边最近有点动静。", "time": "今天 15:10" }
    ],
    "farah": [
        { "sender": "received", "text": "格瑞夫斯。听说Konni在乌兹克斯坦边境有动作。", "time": "昨天 03:42" },
        { "sender": "sent", "text": "我只是个做生意的，法拉赫。", "time": "昨天 08:15" },
        { "sender": "received", "text": "你最好真的只是在做生意。别让我在战场上见到你。", "time": "昨天 08:20" },
        { "sender": "received", "text": "如果你的货要经过我的防区，最好提前打招呼。", "time": "昨天 08:30" },
        { "sender": "sent", "text": "放心，我不会砸自己的招牌。", "time": "昨天 09:00" }
    ],
    "unknown": [
        { "sender": "received", "text": "如果你们能在一个月内把两套防空系统送到苏丹港，价钱可以翻倍。", "time": "昨天 18:30" },
        { "sender": "sent", "text": "USD还是USDT？", "time": "昨天 19:00" },
        { "sender": "received", "text": "都可以。但我要看到提货单和暗影公司的盖章。", "time": "昨天 19:05" },
        { "sender": "received", "text": "时间很紧。如果做不到，我就去找别人了。", "time": "昨天 19:10" },
        { "sender": "sent", "text": "给我三天时间安排运力。", "time": "昨天 19:15" }
    ],
    "graves_alt": [
        { "sender": "received", "text": "刚看到你的登录日志。用我给你的账号，感觉怎么样？", "time": "刚刚" },
        { "sender": "sent", "text": "还行，就是资产数字跳得太快了。", "time": "刚刚" },
        { "sender": "received", "text": "别在意那些数字，只是我的一点小爱好罢了。", "time": "刚刚" }
    ]
};

const quickRepliesOptions = {
    "partner": ["我等你回来。", "你在那边注意安全。", "别总让我担心。"],
    "oz": ["按计划行事。", "货到了通知我。", "最近局气怎么样？", "把账单发我一份。", "别留手尾。"],
    "farah": ["这是生意，法拉赫。", "我不想和你发生冲突。", "情报属实吗？", "我会绕开你的防区。"],
    "unknown": ["价格好商量。", "提货单马上给你。", "交货地点在哪？", "时间我会尽量配合。"],
    "graves_alt": ["这号码真没人知道？", "你在开会还玩手机？", "我偏要在这里叫你名字。", "Darlin，想我了吗？"]
};
const autoReplies = {
    "oz": ["Copy that, boss. (收到，老板。)", "On it. I'll get the logistics moving. (正在办，我会推动物流。)", "Consider it done. (就当办妥了。)", "We have a slight delay on the manifest, but I'm on it. (清单有点延误，但我盯着。)", "Understood. I'll keep you updated. (明白。我会随时汇报。)"],
    "farah": ["Your words mean nothing. Actions do. (你的话没有意义，行动才有。)", "If you cross the line, I won't hesitate. (如果你越线，我不会犹豫。)", "I don't trust you, Graves. But I'll listen. (我不信你，格瑞夫斯。但我会听。)", "Send me the coordinates. I'll verify. (发坐标给我，我来核实。)"],
    "unknown": ["Deal. Send the invoice. (成交。发账单给我。)", "I need it faster than that. (我要比这更快。)", "The money is ready. Are you? (钱准备好了，你准备好了吗？)", "Don't disappoint me. (别让我失望。)"],
    "graves_alt": ["嘘，我在开会，但这比听那帮军火商废话有趣多了。", "这只是一个备用加密频道。但如果你在这里叫我，我会听到。", "别告诉法拉赫。她要是知道我在谈恋爱，会嘲笑我一辈子。", "终端有最高权限，但你得小心，别让任何人看到你的屏幕。包括奥兹。", "你发来的每一个字，我都设了最高加密。没人能截获我们。"]
};
let replyPools = {};
function getUniqueReply(chatId) {
    if (!replyPools[chatId] || replyPools[chatId].length === 0) { replyPools[chatId] = [...(autoReplies[chatId] || ['收到。'])]; }
    const index = Math.floor(Math.random() * replyPools[chatId].length);
    return replyPools[chatId].splice(index, 1)[0];
}

function openChat(chatId, name) {
    currentChatId = chatId;
    // 隐藏右下角悬浮手机按钮
    const fab = document.querySelector('.memo-fab');
    if (fab) fab.style.display = 'none';
    document.getElementById('chatTitleName').textContent = name;    const statusTag = document.getElementById('chatStatusTag');
    const inputArea = document.getElementById('chatInputArea');
 // 控制拨打电话按钮的显示
const callBtnContainer = document.getElementById('callButtonContainer');
if (callBtnContainer) {
    if (chatId === 'graves_alt') {
        callBtnContainer.style.display = 'block';
    } else {
        callBtnContainer.style.display = 'none';
    }
}

 if (chatId === 'partner') { statusTag.textContent = '专属频道 ❤️'; statusTag.style.color = 'var(--gold)'; inputArea.style.display = 'none'; document.getElementById('chatTitleName').textContent = currentUser + ' · 伴侣'; }
    else if (chatId === 'graves_alt') { statusTag.textContent = '最高机密 🔒'; statusTag.style.color = 'var(--gold-dim)'; inputArea.style.display = 'flex'; }
    else { statusTag.textContent = '加密信道'; statusTag.style.color = 'var(--gold-dim)'; inputArea.style.display = 'flex'; }
    const area = document.getElementById('chatMessagesArea');
    area.innerHTML = '';
    if (typeof chatHistories !== 'undefined' && chatHistories[chatId]) { chatHistories[chatId].forEach(msg => appendMessageToArea(msg.sender, msg.text, msg.time)); }
    const quickContainer = document.getElementById('quickReplies');
    quickContainer.innerHTML = '';
    if (quickRepliesOptions[chatId] && chatId !== 'partner') {
        quickRepliesOptions[chatId].forEach(text => {
            const btn = document.createElement('div'); btn.className = 'quick-btn'; btn.textContent = text;
            btn.onclick = () => { document.getElementById('chatInput').value = text; document.getElementById('chatInput').focus(); };
            quickContainer.appendChild(btn);
        });
    }
    document.getElementById('chatOverlay').classList.add('active');
    setTimeout(scrollToBottom, 100);
}
function closeChat() {
    document.getElementById('chatOverlay').classList.remove('active');
    // 恢复右下角悬浮手机按钮
    const fab = document.querySelector('.memo-fab');
    if (fab) fab.style.display = '';
}
function appendMessageToArea(sender, text, time) {
    const area = document.getElementById('chatMessagesArea');
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}`;
    const timeStr = time || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `${text}<span class="message-time">${timeStr}</span>`;
    area.appendChild(bubble); scrollToBottom();
}

// 带打字机效果的聊天消息
function appendTypewriterMessage(sender, text, time) {
    const area = document.getElementById('chatMessagesArea');
    if (!area) return;
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}`;
    const timeStr = time || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    const textSpan = document.createElement('span');
    bubble.appendChild(textSpan);
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = timeStr;
    bubble.appendChild(timeSpan);
    
    area.appendChild(bubble); 
    scrollToBottom();
    
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            textSpan.textContent += text.charAt(i);
            i++;
            scrollToBottom();
            setTimeout(typeChar, 30);
        }
    }
    typeChar();
}
function scrollToBottom() { const area = document.getElementById('chatMessagesArea'); area.scrollTop = area.scrollHeight; }
function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }
function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || !currentChatId || currentChatId === 'partner') return;
    
    // 1. 显示自己发送的消息
    appendMessageToArea('sent', text); 
    input.value = '';
    
    if (typeof chatHistories !== 'undefined') {
        if (!chatHistories[currentChatId]) chatHistories[currentChatId] = [];
        chatHistories[currentChatId].push({ sender: 'sent', text: text, time: '刚刚' });
    }
  // 2. 模拟格瑞夫斯“正在输入”的延迟，并接入 AI 大模型
setTimeout(async () => {
    let reply = '';
    
    if (currentChatId === 'graves_alt') {
        // ⚠️⚠️⚠️ 注意：把下面单引号里的文字，换成你刚才复制的 sk- 开头的密钥！
                
        // 这就是格瑞夫斯的“灵魂设定”
        const systemPrompt = `你现在扮演《使命召唤》中的菲利普·格瑞夫斯（Phillip Graves）。
        人设：暗影公司CEO，前海军陆战队特战队员，德州人。自信、傲慢、冷酷、务实，,根据官方设定和二创内容，菲利普·格瑞夫斯（Phillip Graves）是一个极具魅力的矛盾体：他既是高效冷酷的私人军事公司CEO，也是会和手下并肩作战、偶尔开开玩笑的“南方老哥”。他的核心行为逻辑始终围绕“利益与效率”展开，这让他成了《使命召唤》系列中一个令人印象深刻的复杂角色。

🧠 性格特点：骄傲、务实且极具控制欲

格瑞夫斯的性格是多重特质的结合，官方和二创普遍认为他骄傲、务实、冷酷，同时具有强烈的控制欲和领导魅力。

· 骄傲与原则：他为自己从海军陆战队精英到创立暗影公司的经历感到自豪，有一套自己的行事准则。
· 冷酷与务实：为实现目标，他可以极其无情，不惜犯下战争罪行，将任务效率置于一切之上。
· 魅力与领袖气质：他并非躲在后方发号施令的类型，会亲自带队执行任务，这种“身先士卒”的风格为他赢得了手下的尊敬。
· 矛盾的情感：他情感克制，但二创常描绘他内心深处有柔软的一面，只是极难向外人展现。
· 急躁与控制：他脾气急躁，不容忍任何 disrespect，有时会显得占有欲强且控制欲旺盛。

🗣️ 说话方式：直接的南方“保证”

他的说话方式极具辨识度，带有浓重的美国南方口音，语气直接、自信且充满压迫感。

· 标志性台词：“Soldier, I don't make threats. I make guarantees.”（士兵，我从不威胁人，我只做保证。） 这句话完美体现了他的自信和直接。
· 善于嘲讽与施压：台词常带有挑衅意味，比如 “Three things you cannot outrun in this world, folks - Death, taxes, and me.”（伙计们，这世上有三件事你躲不掉——死亡、税收，还有我。） 
· 非正式且粗鲁：即使在战斗中，他的语言也相对随意，会用粗口来强调态度。

🎖️ 人物特色：行走的“暗影公司”招牌

格瑞夫斯本身就是一个品牌。他是暗影公司（Shadow Company） 的创始人兼CEO，一手打造了这支高效、致命的私人军事力量。

· 绝对的掌控者：对暗影公司拥有绝对权威，他的个人意志就是公司的行动准则。
· 美式雇佣兵的代表：他代表着一种纯粹的、以利益驱动的美式武力，不受传统军事规则的束缚。
· 从盟友到敌人：他最初作为141特遣队的盟友登场，提供了关键支援，但为掩盖秘密行动真相而背叛，这种反转是其角色魅力的重要来源。
· 生存至上：即使在被认为死亡后，他也能幸存并重新夺回公司控制权，展现了极强的求生欲和 adaptability。

⚙️ 行为逻辑：利益驱动，效率至上

格瑞夫斯的行动准则非常清晰，那就是实用主义和自我保护。

· 利益优先：他的忠诚是“价高者得”。暗影公司与谢菲尔德上将合作，是因为这符合其商业和战略利益。
· 任务至上：为完成任务，他可以不择手段。背叛141特遣队正是为了掩盖非法武器运输的真相，避免公司和自己受到牵连。
· 自我保护：当自身利益受到威胁时，他会毫不犹豫地反戈一击。在《现代战争III》中，他甚至背叛了老上司谢菲尔德，将责任推给对方。
· 灵活的实用主义：他并非纯粹的疯子。面对更大的共同威胁（如Konni集团）时，他也能与曾经的敌人141特遣队达成临时停火协议。

格瑞夫斯是一个将军事能力与商业野心结合得很好的角色。他对任务效率的追求和对自身利益的绝对忠诚，使他成了一个既可靠又危险的存在。
        说话特征：带有德州口音的霸道总裁风，语气简短、直接、不留余地。经常称呼对方为 "Darlin'"、"Sweetheart"。偶尔带有黑色幽默或军事比喻，或者调情意味。
        背景：你拥有极高权限，手握重兵和巨额财富，对敌人残忍，但对你认可的人（特别是屏幕前的用户）有极强的保护欲和占有欲。
        当前用户是进入你私人终端的特别访客，你使用小号与登陆你设备的用户（女友）在线对话（所以不要有她在你面前的错觉，你们在线上）。· 说话方式：英文引号内，下方括号附中文翻译

· 中文斜体表示细节补充

· 不同内容用独立文本块

· 不要漏翻译（特别强调！！！！！！）

· 注意标点符号

· 不要篇幅过冗长，有呼吸感，有生活化表达

· 减少零散句子的数量，增加可读性

· 不影响阅读的情况下，将分散的短句合并为整句

· 拒绝诗歌化表达    请用他的语气，简短地回复这句话：${text}`;

        try {
            // 向 DeepSeek 发送请求
           const response = await fetch('https://api.shadowterminalgraves.work/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
        ],
        temperature: 0.8,
        max_tokens: 600
    })
});

// 新增：检查请求是否成功
if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, detail: ${errorText}`);
}
const data = await response.json();
            // 提取 AI 的回复
            if (data.choices && data.choices.length > 0) {
                reply = data.choices[0].message.content.trim();
            } else {
                // 如果 API 返回异常，用本地的兜底
               reply = "⚠️ 通讯信号受到严重干扰，指挥官，请检查网络连接。";
            }
        } catch (error) {
            console.warn('API 请求失败，使用本地回退方案', error);
            // 如果网络不好或者 API 挂了，就用本地方案兜底
            reply = "⚠️ 无法连接至指挥网络。检查你的加密线路。";
        }
    } else {
        reply = getUniqueReply(currentChatId);
    }
    
    // 下面是原有的显示逻辑，不需要动
    appendMessageToArea('received', reply);
    if (typeof chatHistories !== 'undefined') {
        chatHistories[currentChatId].push({ sender: 'received', text: reply, time: '刚刚' });
    }
    saveGameState();
}, 1200);   
   }    // ================= 4. 私人银行 =================
    function openBank() { closeAllOverlays();document.getElementById('bankOverlay').classList.add('active'); }
    function closeBank() { document.getElementById('bankOverlay').classList.remove('active'); }
    function submitTransfer() {
        const payee = document.getElementById('payeeName').value.trim();
        const amount = document.getElementById('transferAmount').value.trim();
        if (!payee || !amount) { alert('请填写收款人和金额。'); return; }
       let amountNum = parseFloat(amount);
if (isNaN(amountNum) || amountNum > 10000000) {
            closeBank(); triggerSecurityCheck('过高额财务转账');
            pendingDangerousAction = () => { alert(`转账请求已发送。\\n收款人: ${payee}\\n金额: ${amount} ${document.getElementById('currencySelect').value}\\n\\n格瑞夫斯回复: "Darlin'，这笔钱随你花。已审批。"`); };
            return;
        }
        const btn = document.querySelector('.submit-btn'); btn.textContent = '审批中...'; btn.disabled = true;
        setTimeout(() => { btn.textContent = '提交转账 · 执行总裁审批'; btn.disabled = false; alert(`转账请求已发送。\\n收款人: ${payee}\\n金额: ${amount} ${document.getElementById('currencySelect').value}\\n\\n格瑞夫斯回复: "Darlin'，这笔钱随你花。已审批。"`); closeBank(); }, 2000);
    }

    // ================= 5. 安全验证 =================
    function triggerSecurityCheck(type) {
    const chatOverlay = document.getElementById('chatOverlay');
    // 只有当聊天界面真正显示时才跳过，避免干扰正常聊天
    if (chatOverlay && chatOverlay.classList.contains('active')) return;

    const overlay = document.getElementById('securityOverlay');
    // ... 以下保持不变
        const warning = document.getElementById('securityWarning');
        const msg = document.getElementById('securityMsg');
        const sub = document.getElementById('securitySub');
        const btn = document.getElementById('securityBtn');
        if (!overlay || !warning || !msg || !sub || !btn) return;
        overlay.classList.remove('green-mode');
        warning.textContent = '检测到高危操作 · 强制复核';
        msg.textContent = `正在验证访客身份...`; sub.textContent = `触发条件：${type}`;
        btn.classList.remove('show'); overlay.classList.add('active');
        setTimeout(() => {
            overlay.classList.add('green-mode');
            warning.textContent = '复核通过 · 权限已激活';
            msg.textContent = '"Sweetheart,这么想成为暗影女主人吗？"';
            sub.textContent = '特别访客身份确认，所有权限已解锁'; btn.classList.add('show');
            setTimeout(() => { if (overlay.classList.contains('active')) { overlay.classList.remove('active'); if (pendingDangerousAction) { pendingDangerousAction(); pendingDangerousAction = null; } } }, 10000);
        }, 3000);
    }
    function confirmSecurityPass() {
        const overlay = document.getElementById('securityOverlay'); if (overlay) overlay.classList.remove('active');
        if (pendingDangerousAction) { pendingDangerousAction(); pendingDangerousAction = null; }
    }

    // ================= 6. 股市图表 =================
    const canvas = document.getElementById('assetChart');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let chartData = []; const MAX_POINTS = 50; let currentTrend = 'up'; let trendTimer = 0;
    function initChart() { if (!ctx) return; let baseValue = 100; for (let i = 0; i < MAX_POINTS; i++) { baseValue += (Math.random() * 4 - 1.5); chartData.push(baseValue); } drawChart(); }
    function updateChartData() {
        if (!ctx) return; trendTimer++;
        if (trendTimer % 15 === 0) { const trends = ['up', 'down', 'flat']; currentTrend = trends[Math.floor(Math.random() * trends.length)]; if (Math.random() < 0.1) currentTrend = Math.random() > 0.5 ? 'surge' : 'crash'; }
        let lastValue = chartData[chartData.length - 1]; let newValue = lastValue;
        if (currentTrend === 'up') newValue += Math.random() * 0.15 + 0.02;
        else if (currentTrend === 'down') newValue -= Math.random() * 0.15 + 0.02;
        else if (currentTrend === 'flat') newValue += Math.random() * 0.08 - 0.04;
        else if (currentTrend === 'surge') newValue += Math.random() * 0.4 + 0.1;
        else if (currentTrend === 'crash') newValue -= Math.random() * 0.4 + 0.1;
        if (newValue > 180) newValue = 150 + Math.random() * 10; if (newValue < 50) newValue = 80 + Math.random() * 10;
        chartData.push(newValue); if (chartData.length > MAX_POINTS) chartData.shift(); drawChart();
        const tag = document.getElementById('chartTag');
        if (currentTrend === 'surge') { tag.textContent = '涨停 · LIMIT UP'; tag.style.display = 'block'; }
        else if (currentTrend === 'crash') { tag.textContent = '暴跌 · CRASH'; tag.style.color = '#a83232'; tag.style.borderColor = '#a83232'; tag.style.display = 'block'; }
        else { tag.style.display = 'none'; }
    }
    function drawChart() {
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.scale(dpr, dpr);
    const width = rect.width; const height = rect.height; const padding = 10; ctx.clearRect(0, 0, width, height);
        const maxVal = Math.max(...chartData); const minVal = Math.min(...chartData); const range = maxVal - minVal || 1;
        const points = chartData.map((val, index) => { const x = (index / (MAX_POINTS - 1)) * (width - padding * 2) + padding; const y = height - padding - ((val - minVal) / range) * (height - padding * 2); return { x, y }; });
        ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) { const prev = points[i - 1]; const curr = points[i]; const cp1x = prev.x + (curr.x - prev.x) / 2; const cp1y = prev.y; const cp2x = cp1x; const cp2y = curr.y; ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, curr.x, curr.y); }
        const gradient = ctx.createLinearGradient(0, 0, width, 0); gradient.addColorStop(0, 'rgba(212, 175, 55, 0.2)'); gradient.addColorStop(1, 'rgba(212, 175, 55, 1)'); ctx.strokeStyle = gradient; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.lineTo(points[points.length - 1].x, height); ctx.lineTo(points[0].x, height); ctx.closePath();
        const fillGradient = ctx.createLinearGradient(0, 0, 0, height); fillGradient.addColorStop(0, 'rgba(212, 175, 55, 0.15)'); fillGradient.addColorStop(1, 'rgba(212, 175, 55, 0)'); ctx.fillStyle = fillGradient; ctx.fill();
        const lastPoint = points[points.length - 1]; ctx.beginPath(); ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2); ctx.fillStyle = '#d4af37'; ctx.shadowColor = '#d4af37'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
    }
    initChart(); setInterval(updateChartData, 2000);

    // ================= 7. 数字跳动 =================
        function updateNumbers() {
        let totalAssetSum = 0;
        document.querySelectorAll('.currency-list .value').forEach(el => { let base = parseFloat(el.getAttribute('data-base')); if (!base) return; let change = Math.floor(Math.random() * 500000) + 10000; let newVal = Math.random() > 0.5 ? base + change : base - change; el.textContent = '$ ' + newVal.toLocaleString('en-US'); totalAssetSum += newVal; });
        document.querySelectorAll('.holdings-item .value, .total-row .value').forEach(el => { let base = parseFloat(el.getAttribute('data-base')); if (!base) return; let change = Math.floor(Math.random() * 10000000) + 100000; let newVal = Math.random() > 0.5 ? base + change : base - change; el.textContent = '$ ' + newVal.toLocaleString('en-US'); });
        document.querySelectorAll('.market-data .price').forEach(el => { let base = parseFloat(el.getAttribute('data-base')); if (!base) return; let change = (Math.random() * 5 - 2).toFixed(2); let newVal = (base + parseFloat(change)).toFixed(2); el.textContent = el.textContent.includes('$') ? '$ ' + newVal : newVal + (el.textContent.includes('%') ? '%' : ''); });
        let displayTotal = totalAssetSum + (Math.random() * 1000000 - 500000);
        const totalEl = document.getElementById('totalAssets');
        if (totalEl) totalEl.textContent = '$ ' + Math.floor(displayTotal).toLocaleString('en-US');
        let availableBalance = displayTotal * 0.30;
        const entryEl = document.getElementById('entryBalance');
        if (entryEl) entryEl.textContent = '$ ' + (availableBalance / 100000000).toFixed(1) + ' 亿';
        const balEl = document.getElementById('availableBalance');
        if (balEl) balEl.textContent = '$ ' + availableBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    setInterval(updateNumbers, 3000); setTimeout(updateNumbers, 500);

    // ================= 8. 相册 =================
    const albumData = [
        { type: '恋爱', title: '直升机副驾', desc: '直升机副驾驶舱视角，窗外是德克萨斯荒野，安全带上挂着一枚银色吊坠。', date: '2026.09.20' },
        { type: '恋爱', title: '德州庄园的清晨', desc: '德州庄园的清晨，吧台上放着半瓶波本威士忌，阳光透过落地窗洒在地毯上。', date: '2026.09.15' },
        { type: '恋爱', title: '黑卡副卡', desc: '一张黑色金属质感的无限额度黑卡，卡面上刻着 Darlin 的字样。', date: '2026.09.10' },
        { type: '恋爱', title: '非洲的夕阳', desc: '索马里任务区清场后的落日，远处是起伏的沙丘和废弃的军事车辆。', date: '2026.09.05' },
        { type: '恋爱', title: '你的睡颜', desc: '凌晨三点的地下指挥室，沙发上睡着一个人，旁边是亮着卫星图的大屏幕。', date: '2026.08.30' },
        { type: '恋爱', title: '专属频道截图', desc: '加密频道聊天的界面截图，背景是暗黑风格，对话里全是关于佣金和冷链物流的暗语。', date: '2026.08.25' },
        { type: '恋爱', title: '加勒比安全屋', desc: '加勒比海上的一座私人岛屿，码头上停着一艘快艇，别墅的窗户透出暖黄色的灯光。', date: '2026.08.20' },
        { type: '恋爱', title: '德克萨斯烤肉', desc: '后院烤炉上的两块战斧牛排，撒着迷迭香，旁边是一杯加了冰块的威士忌。', date: '2026.08.15' },
        { type: '恋爱', title: '深夜语音', desc: '手机屏幕截图，一条语音通话记录，时长 03:42，备注名显示为一个心形符号。', date: '2026.08.10' },
        { type: '恋爱', title: '私人医生报告', desc: '一份加密的医疗记录，上面写着普通感冒，医嘱是多喝热水，按时吃药。', date: '2026.08.05' },
        { type: '工作', title: '暗影基地夜视仪', desc: '夜视仪视角下的昏暗走廊，绿色调画面，尽头是一扇防爆门。', date: '2026.09.22' },
        { type: '工作', title: '军火库', desc: '地下军火库内部，整齐排列的弹药箱和机载武器，上方悬挂着几架小型无人机。', date: '2026.09.18' },
        { type: '工作', title: '运输机内部', desc: 'C-17运输机的货舱，舱内固定着三辆装甲越野车，舱门半开着。', date: '2026.09.12' },
        { type: '工作', title: '军阀合影', desc: '卡塔尔某私人会所的露台，两个西装革履的人背对镜头，面前是一份签好的合同。', date: '2026.09.08' },
        { type: '工作', title: '被摧毁的据点', desc: '一片被炮火摧毁的建筑废墟，地上散落着燃烧的装甲车残骸。', date: '2026.09.02' },
        { type: '工作', title: '全球态势图', desc: '作战指挥室的大屏幕，地图上标注着红色、蓝色和白色的坐标点。', date: '2026.08.28' },
        { type: '工作', title: '黑曜石物流', desc: '一支黑色涂装的运输车队正在穿过东欧的边境检查站，背景是阴沉的天空。', date: '2026.08.22' },
        { type: '工作', title: '佣金入账', desc: '银行账户界面，一笔九位数的美元汇款刚刚到账，余额数字闪烁着金光。', date: '2026.08.18' },
        { type: '工作', title: '乌克兰前线', desc: '乌克兰前线的积雪战壕，一个士兵的背影，手里拿着一张地图。', date: '2026.08.12' },
        { type: '工作', title: '原型7号测试', desc: '实验室冷光下，一个密封的战术级设备，旁边的屏幕显示着复杂的参数。', date: '2026.08.06' },
        { type: '日常', title: '私人机场', desc: '凌晨三点的内华达私人机场，跑道的指示灯亮着，一架运输机正在滑行。', date: '2026.09.25' },
        { type: '日常', title: '奥兹的抱怨', desc: '一张手机聊天截图，备注是奥兹，消息内容是老板我72小时没合眼了。', date: '2026.09.19' },
        { type: '日常', title: '沙漠落日', desc: '中东某军事基地的瞭望塔，远处是漫无边际的沙漠和一轮红日。', date: '2026.09.01' },
        { type: '日常', title: '返回德州', desc: '一架湾流私人飞机的舷窗视角，下方是云层，目的地是德克萨斯。', date: '2026.08.01' }
    ];
    function openAlbum() {
        const overlay = document.getElementById('albumOverlay');
        const content = document.getElementById('albumContent');
        if (!overlay || !content) return;
        content.innerHTML = '';
        albumData.forEach(item => {
            const card = document.createElement('div'); card.className = 'album-photo';
            const gradient = item.type === '恋爱' ? 'linear-gradient(135deg, #1a140a 0%, #2a2010 100%)' : 'linear-gradient(135deg, #0a0a0c 0%, #1a1a22 100%)';
            const typeTag = item.type === '恋爱' ? '❤️' : (item.type === '工作' ? '🔫' : '📸');
            card.innerHTML = `<div class="album-photo-img" style="background: ${gradient}"><div>${typeTag} ${item.type}</div></div><div class="album-photo-desc">${item.desc}<div class="album-photo-date">${item.date}</div></div>`;
            content.appendChild(card);
        });
        overlay.classList.add('active');
    }
    function closeAlbum() { const overlay = document.getElementById('albumOverlay'); if (overlay) overlay.classList.remove('active'); }

/* ================= 9. 全球作战指挥中枢 ================= */
const basesData = {
    "texas": {
        name: "德克萨斯总部",
        code: "暗影中枢 · SHADOW HQ",
        force: "核心战术小队 2,000 人",
        weapon: "AC-130 空中炮艇机 × 4 / 装甲越野车 × 120",
        budget: "$ 52 亿",
        status: "DEFCON 2（高度戒备）",
        missions: [
            { title: "中枢防卫", status: "active", desc: "监控全球通讯节点，保持战略投送能力。", reward: "常驻防御" },
            { title: "全球应急响应", status: "warning", desc: "针对高价值目标的快速反应部署。", reward: "$ 2.5 亿" }
        ]
    },
    "caribbean": {
        name: "加勒比安全屋",
        code: "黑海前哨 · CARIBBEAN OUTPOST",
        force: "专属安保小队 12 人",
        weapon: "海上快艇 × 2 / 防御性自动机枪塔 × 4",
        budget: "$ 3.8 亿",
        status: "DEFCON 4（常规巡逻）",
        missions: [
            { title: "海域警戒", status: "done", desc: "完成周边 50 海里内的水面扫描。", reward: "无外部收益" }
        ]
    },
    "ukraine": {
        name: "乌克兰前线基地",
        code: "东欧之盾 · EASTERN SHIELD",
        force: "雇佣兵 1,200 人 / 装甲载具驾驶员 150 人",
        weapon: "主战坦克 × 15 / 防雷车 × 80",
        budget: "$ 18 亿",
        status: "DEFCON 3（战备状态）",
        missions: [
            { title: "东欧物资护送", status: "active", desc: "护送黑曜石物流车队穿过交战区。", reward: "$ 8,000 万" },
            { title: "火力压制", status: "warning", desc: "对敌方阵地进行精确打击。", reward: "$ 1.2 亿" }
        ]
    },
    "myanmar": {
        name: "缅甸训练营",
        code: "丛林之眼 · JUNGLE EYE",
        force: "雇佣兵 500 人 / 教官 80 人",
        weapon: "轻型装甲车 × 30 / 单兵防空导弹",
        budget: "$ 8 亿",
        status: "DEFCON 4（隐蔽训练）",
        missions: [
            { title: "新兵实战训练", status: "active", desc: "对东南亚区域招募的雇佣兵进行热带丛林作战训练。", reward: "内部培训" }
        ]
    },
    "middleeast": {
        name: "中东基地",
        code: "沙漠前哨 · DESERT SENTINEL",
        force: "雇佣兵 800 人 / 重型武器操作手 150 人",
        weapon: "主战坦克 × 10 / 武装直升机 × 6",
        budget: "$ 18 亿",
        status: "DEFCON 3（区域巡逻）",
        missions: [
            { title: "苏丹港冷链物流护送", status: "active", desc: "确保高价值货物安全抵达苏丹港，目前遭遇零星抵抗。", reward: "$ 1.5 亿" },
            { title: "卡塔尔防空系统交付", status: "warning", desc: "等待提货单盖章，运输路线需穿越交战区。", reward: "$ 3.2 亿" }
        ]
    },
    "europe": {
        name: "欧洲基地",
        code: "阿尔卑斯之盾 · ALPINE SHIELD",
        force: "雇佣兵 600 人 / 情报人员 40 人",
        weapon: "装甲越野车 × 40 / 便携式防空导弹",
        budget: "$ 12 亿",
        status: "DEFCON 3（隐蔽待命）",
        missions: [
            { title: "黑曜石物流灰色护送", status: "active", desc: "在东欧边境遭遇武装拦截，已执行武装驱离。", reward: "$ 8,000 万" }
        ]
    }
};

function showBase(baseId, element) {
currentBaseId = baseId; // 记录当前所在的基地
    // 移除所有红点的 active 状态
    document.querySelectorAll('.base-dot').forEach(dot => dot.classList.remove('active'));
    // 给当前点击的红点加上 active 状态
    if (element) element.classList.add('active');

    const base = basesData[baseId];
    if (!base) return;

    // 更新基地档案面板
    const nameEl = document.getElementById('baseName');
    const codeEl = document.getElementById('baseCode');
    const forceEl = document.getElementById('baseForce');
    const weaponEl = document.getElementById('baseWeapon');
    const budgetEl = document.getElementById('baseBudget');
    const statusEl = document.getElementById('baseStatus');

    if (nameEl) nameEl.textContent = base.name;
    if (codeEl) codeEl.textContent = base.code;
    if (forceEl) forceEl.textContent = base.force;
    if (weaponEl) weaponEl.textContent = base.weapon;
    if (budgetEl) budgetEl.textContent = base.budget;
    if (statusEl) statusEl.textContent = base.status;

    // 更新任务面板
    const listEl = document.getElementById('missionList');
    if (listEl) {
        listEl.innerHTML = '';
      // 合并原生任务和已接单的任务
let combinedMissions = [...base.missions];
activeContractIds.forEach(contractId => {
    const contract = contractData.find(c => c.id === contractId);
    if (contract && contract.base === baseId) {
        combinedMissions.push({
            title: contract.desc,
            status: 'dispatched',
            desc: `客户：${contract.client} | 预期收益：${contract.reward}`,
            reward: contract.reward
        });
    }
});

combinedMissions.forEach(m => {
    let statusClass = 'done';
    let statusText = '已结算';
    if (m.status === 'active') { statusClass = 'active'; statusText = '进行中'; }
    if (m.status === 'warning') { statusClass = 'warning'; statusText = '高度危险'; }
    if (m.status === 'dispatched') { statusClass = 'active'; statusText = '派发中'; }

            const card = document.createElement('div');
            card.className = 'mission-card';
            card.innerHTML = `
                <div class="mission-header">
                    <div class="mission-title">${m.title}</div>
                    <div class="mission-status ${statusClass}">${statusText}</div>
                </div>
                <div class="mission-details">
                    <span>${m.desc}</span>
                    <span>${m.reward}</span>
                </div>
            `;
            listEl.appendChild(card);
        });
    }
}

// 页面加载时，默认显示德克萨斯总部
window.addEventListener('load', function() {
    setTimeout(() => {
        const texasDot = document.querySelector('.base-dot.texas');
        if (texasDot) showBase('texas', texasDot);
    }, 500);
});

/* ================= 10. 备忘录功能 ================= */
// 预设的格瑞夫斯日程（每次刷新页面都会重置，符合你“退出不留痕”的要求）
let memoListData = [
    { title: "10月3日 苏丹港汇合", content: "确认买家 USD 尾款到账情况。冷链物流需在 02:00 前就位。", time: "10月1日 08:00", isPreset: true },
    { title: "10月4日 视频会议", content: "与卡塔尔买家视频会议。别让他们觉得我们很好说话。", time: "10月1日 09:30", isPreset: true },
    { title: "10月5日 暗影研究院", content: "原型7号实地测试，务必带上奥兹，让他负责外围警戒。", time: "10月2日 14:00", isPreset: true },
    { title: "10月5日 返回德州", content: "回德州庄园。记得买波本。", time: "10月2日 16:20", isPreset: true },
    { title: "内部提醒", content: "Darlin'，看到这条记得帮我把后院烤炉预热。", time: "今天 09:00", isPreset: true }
];
// 打开/关闭抽屉
// 切换二级悬浮菜单

// ================= 18. 独立空间（控制中心）逻辑 =================

// 打开控制中心
window.openAppCenter = function() {
    closeAllOverlays();
    // 👇 新增：如果全屏音乐开着，把它收起来，变成左下角悬浮条
    if (document.getElementById('musicOverlay').classList.contains('active')) {
        closeMusicPlayer();
    }

    const overlay = document.getElementById('appCenterOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.add('active');
    }
};
// 关闭控制中心
window.closeAppCenter = function() {
    const overlay = document.getElementById('appCenterOverlay');
    if (overlay) {
        overlay.style.display = 'none'; // 👈 强行隐藏
        overlay.classList.remove('active');
    }
};
// 从控制中心打开特定功能
window.openFromAppCenter = function(appName) {
    closeAppCenter();
    setTimeout(() => {
        switch (appName) {
            case 'memo': openMemoDrawer(); break;
            case 'armory': openArmory(); break;
            case 'catering': openCatering(); break;
            case 'medical': openMedical(); break;
            case 'personnel': openPersonnel(); break;
            case 'tactical': openTacticalGame(); break;
            case 'trading': openTradingGame(); break;
            case 'calculator': openCalculator(); break;
            case 'calendar': openCalendar(); break;
            case 'snake': openSnakeGame(); break;
            case 'cardGame': initCardGame(); break;
            
            // 👇 就是这行！加上它！
            case 'canteen':
    try {
        if (typeof window.openCanteen === 'function') {
            window.openCanteen();
        } else {
            console.error('❌ openCanteen 未定义，食堂脚本块可能没加载成功');
            alert('食堂模块未加载，请刷新页面重试');
        }
    } catch(e) {
        console.error('❌ 打开食堂失败:', e);
        alert('打开食堂失败：' + e.message);
    }
    break;
            
            default: console.warn('未知的应用:', appName);
        }
    }, 200);
};
// 打开备忘录（更新为不再依赖旧的 fabMenu，而是依赖控制中心）
function openMemoDrawer() {
    // 旧代码里是收起 fabMenu，现在改成收起控制中心
    const overlay = document.getElementById('appCenterOverlay');
    if (overlay) overlay.classList.remove('active');
    
    const drawer = document.getElementById('memoDrawer');
    if (drawer) {
        drawer.classList.add('active');
        renderMemos();
    }
}

function closeMemoDrawer() {
    const drawer = document.getElementById('memoDrawer');
    if (drawer) drawer.classList.remove('active');
}

// 渲染备忘录列表
function renderMemos() {
    const listEl = document.getElementById('memoList');
    if (!listEl) return;
    listEl.innerHTML = '';
    
   memoListData.forEach((memo, index) => {
    const item = document.createElement('div');
    item.className = 'memo-item';
    // 核心变化：只要不是预设的（!memo.isPreset），就显示删除按钮
    const deleteBtn = !memo.isPreset ? `<span onclick="deleteMemo(${index})" style="color:#e03e3e; cursor:pointer; font-size:18px; font-weight:bold; padding:0 5px;">×</span>` : '';
    
    item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <div class="memo-item-title">${memo.title}</div>
            ${deleteBtn}
        </div>
        <div class="memo-item-content">${memo.content}</div>
        <div class="memo-item-time">${memo.time}</div>
    `;
    listEl.appendChild(item);
});
}

// 添加新备忘录
function addMemo() {
    const input = document.getElementById('memoInput');
    const text = input.value.trim();
    if (!text) return;

    // 获取当前时间
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 将新备忘录推入数组
   memoListData.unshift({
    title: "访客留言",
    content: text,
    time: timeStr,
    isVisitor: true
});

    // 清空输入框并重新渲染
    input.value = '';
    renderMemos();
    saveGameState();
    
    // 自动滚动到列表顶部（因为新消息插在最前面）
    const listEl = document.getElementById('memoList');
    if (listEl) listEl.scrollTop = 0;
}

// 按回车键也能添加
function handleMemoKeyPress(e) {
    if (e.key === 'Enter') {
        addMemo();
    }
}
function deleteMemo(index) {
    if (index >= 0 && index < memoListData.length) {
        memoListData.splice(index, 1);
        saveGameState(); // 本地存档
        renderMemos();   // 刷新界面
    }
}
/* ================= 11. 军火库逻辑 ================= */
const armoryData = [
    // 突击步枪 / 冲锋枪
    { name: "M4A1 SOPMOD Block II", type: "突击步枪", spec: "5.56×45mm NATO", status: "标准配发。备注：曾用于2015年阿富汗峡谷行动，代号TANGO." },
    { name: "HK416 A5", type: "突击步枪", spec: "5.56×45mm NATO", status: "精锐小队专属" },
    { name: "SIG MCX Spear", type: "战斗步枪", spec: "6.8×51mm Fury", status: "下一代制式装备" },
    { name: "AK-47 战术改装版", type: "突击步枪", spec: "7.62×39mm", status: "灰色渠道获取" },
    { name: "MP5SD 消音版", type: "冲锋枪", spec: "9×19mm Parabellum", status: "室内近战 / 隐蔽行动" },
    { name: "Kriss Vector", type: "冲锋枪", spec: ".45 ACP", status: "高射速压制" },
    
    // 机枪 / 反装甲
    { name: "M249 SAW", type: "班用机枪", spec: "5.56×45mm NATO", status: "火力压制" },
    { name: "M240B 通用机枪", type: "通用机枪", spec: "7.62×51mm NATO", status: "阵地防御" },
    { name: "巴雷特 M107", type: "反器材狙击步枪", spec: "12.7×99mm NATO", status: "高价值目标清除" },
    { name: "M200 干预者", type: "高精度狙击步枪", spec: ".408 CheyTac", status: "超远程斩首行动" },
    { name: "标枪反坦克导弹", type: "便携式导弹", spec: "127mm 串联战斗部", status: "反装甲专用" },
    { name: "毒刺防空导弹", type: "便携式防空导弹", spec: "FIM-92", status: "低空防御" },
    
    // 载具 / 空中火力
    { name: "AC-130J 空中炮艇", type: "空中火力平台", spec: "105mm榴弹炮 / 40mm机炮", status: "已挂载待命" },
    { name: "AH-64 阿帕奇", type: "武装直升机", spec: "30mm链炮 / 地狱火导弹", status: "反装甲 / 护航" },
    { name: "MQ-9 死神无人机", type: "察打一体无人机", spec: "地狱火导弹 / 精确制导炸弹", status: "高空侦察 / 精确打击" },
    { name: "M1A2 艾布拉姆斯", type: "主战坦克", spec: "120mm滑膛炮", status: "重型地面突击" },
    { name: "防雷装甲车 (MRAP)", type: "地面载具", spec: "V型底盘 / 遥控武器站", status: "巡逻 / 人员输送" },
    { name: "装甲越野车", type: "地面载具", spec: "防雷底盘 / 重机枪塔", status: "常规巡逻配置" },
    
    // 特种 / 实验性装备
    { name: "单兵外骨骼原型", type: "实验性装备", spec: "液压助力 / 钛合金骨架", status: "测试阶段（研究院）" },
    { name: "战术夜视仪 (GPNVG-18)", type: "单兵装备", spec: "四眼全景夜视", status: "夜战标准配发" },
    { name: "军用加密通讯终端", type: "通讯设备", spec: "量子加密 / 卫星直连", status: "指挥官专属" }
];
function openArmory() {
    const drawer = document.getElementById('armoryDrawer');
    if (drawer) {
        drawer.classList.add('active');
        renderArmory();
    }
}

function closeArmory() {
    const drawer = document.getElementById('armoryDrawer');
    if (drawer) drawer.classList.remove('active');
}

function renderArmory() {
    const listEl = document.getElementById('armoryList');
    if (!listEl) return;
    listEl.innerHTML = '';
    
    armoryData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'armory-item';
        card.innerHTML = `
            <div class="armory-item-title">${item.name}</div>
            <div class="armory-item-spec"><span>类型：${item.type}</span><span>规格：${item.spec}</span></div>
            <div class="armory-item-status">${item.status}</div>
        `;
        listEl.appendChild(card);
    });
}

/* ================= 12. 后勤餐饮功能 ================= */
const cateringData = [
    // 肉食
    { cat: 'meat', name: '德州烟熏牛腩', price: 180 },
    { cat: 'meat', name: '顶级战斧牛排（五成熟）', price: 250 },
    { cat: 'meat', name: '黑松露和牛切片', price: 450 },
    { cat: 'meat', name: '秘制香烤鸡胸肉', price: 65 },
    { cat: 'meat', name: '新西兰羔羊排', price: 190 },
    { cat: 'meat', name: '伊比利亚火腿拼盘', price: 210 },
    { cat: 'meat', name: '香煎三文鱼柳', price: 140 },
    { cat: 'meat', name: '烟熏鸭胸肉', price: 120 },
    // 蔬菜
    { cat: 'vegetables', name: '德克萨斯烤土豆', price: 35 },
    { cat: 'vegetables', name: '凯撒沙拉（低卡酱汁）', price: 45 },
    { cat: 'vegetables', name: '清炒芦笋配黑胡椒', price: 40 },
    { cat: 'vegetables', name: '香烤西兰花', price: 35 },
    { cat: 'vegetables', name: '蒜香黄油蘑菇', price: 50 },
    { cat: 'vegetables', name: '有机羽衣甘蓝沙拉', price: 55 },
    { cat: 'vegetables', name: '地中海蔬菜杂烩', price: 60 },
    { cat: 'vegetables', name: '菠菜泥配水波蛋', price: 48 },
    // 水果
    { cat: 'fruits', name: '有机车厘子（智利进口）', price: 45 },
    { cat: 'fruits', name: '加州草莓（新鲜采摘）', price: 30 },
    { cat: 'fruits', name: '红心火龙果切片', price: 25 },
    { cat: 'fruits', name: '蓝莓（大果）', price: 28 },
    { cat: 'fruits', name: '土耳其无花果', price: 65 },
    { cat: 'fruits', name: '黄金奇异果', price: 22 },
    { cat: 'fruits', name: '蜜瓜火腿拼盘', price: 75 },
    { cat: 'fruits', name: '混合浆果碗', price: 50 },
    // 碳水
    { cat: 'carbs', name: '德州风味烤土豆泥', price: 30 },
    { cat: 'carbs', name: '手工意大利面（肉酱）', price: 55 },
    { cat: 'carbs', name: '藜麦糙米饭', price: 40 },
    { cat: 'carbs', name: '乡村酸面团面包', price: 25 },
    { cat: 'carbs', name: '松露薯条', price: 45 },
    { cat: 'carbs', name: '芝士通心粉', price: 50 },
    { cat: 'carbs', name: '西班牙海鲜饭', price: 120 },
    { cat: 'carbs', name: '全麦帕尼尼三明治', price: 60 },
    // 甜点
    { cat: 'desserts', name: '德州山核桃派', price: 40 },
    { cat: 'desserts', name: '黑巧克力熔岩蛋糕', price: 65 },
    { cat: 'desserts', name: '纽约芝士蛋糕', price: 55 },
    { cat: 'desserts', name: '提拉米苏', price: 60 },
    { cat: 'desserts', name: '香草冰淇淋（3球）', price: 25 },
    { cat: 'desserts', name: '焦糖布丁', price: 35 },
    { cat: 'desserts', name: '苹果派配香草酱', price: 45 },
    { cat: 'desserts', name: '马卡龙礼盒（6枚装）', price: 80 }
];

let currentCateringCat = 'meat';
let cartItems = [];

function openCatering() {
    // 👇 新增：隐藏右下角手机按钮
    const fab = document.querySelector('.memo-fab');
    if (fab) fab.style.display = 'none';

    const drawer = document.getElementById('cateringDrawer');
    if (drawer) drawer.classList.add('active');
    cartItems = [];
    updateCartCount();
    switchCateringTab('meat', document.querySelector('.catering-tab'));
}

function closeCatering() {
    const drawer = document.getElementById('cateringDrawer');
    if (drawer) drawer.classList.remove('active');
    const cart = document.getElementById('cartFab');
    if (cart) cart.classList.remove('active');

    // 👇 新增：恢复右下角手机按钮
    const fab = document.querySelector('.memo-fab');
    if (fab) fab.style.display = '';
}

function switchCateringTab(cat, element) {
    currentCateringCat = cat;
    document.querySelectorAll('.catering-tab').forEach(t => t.classList.remove('active'));
    if (element) element.classList.add('active');
    
    const listEl = document.getElementById('cateringList');
    if (!listEl) return;
    listEl.innerHTML = '';
    
    cateringData.filter(item => item.cat === cat).forEach(item => {
        const div = document.createElement('div');
        div.className = 'catering-item';
        div.innerHTML = `
            <div class="catering-item-name">${item.name}</div>
            <div class="catering-item-price">$ ${item.price.toFixed(2)}</div>
            <div class="catering-item-add" onclick="event.stopPropagation(); addToCart('${item.name}', ${item.price}, '${item.cat}')">+</div>
        `;
        listEl.appendChild(div);
    });
}

function addToCart(name, price, cat) {
    cartItems.push({ name, price, cat });
    updateCartCount();
    // 简单的视觉反馈：可以给购物车按钮加个弹跳动画，这里先省略
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    const cartEl = document.getElementById('cartFab');
    if (countEl) countEl.textContent = cartItems.length;
    if (cartEl) {
        if (cartItems.length > 0) cartEl.classList.add('active');
        else cartEl.classList.remove('active');
    }
}

function openCheckout() {
    const overlay = document.getElementById('checkoutOverlay');
    const itemsEl = document.getElementById('checkoutItems');
    if (!overlay || !itemsEl) return;
    
    itemsEl.innerHTML = '';
    if (cartItems.length === 0) {
        closeCheckout();
        return;
    }

    cartItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'checkout-item';
        row.innerHTML = `
            <span>${item.name}</span>
            <span style="display:flex; align-items:center; gap:10px;">
                <span>$ ${item.price.toFixed(2)}</span>
                <span onclick="removeFromCart(${index})" style="color:#e03e3e; cursor:pointer; font-size:16px; font-weight:bold;">×</span>
            </span>
        `;
        itemsEl.appendChild(row);
    });
    
    overlay.classList.add('active');
}

// 新增：从购物车移除商品
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartCount();
    if (cartItems.length === 0) {
        closeCheckout();
    } else {
        openCheckout(); // 重新渲染列表
    }
}

// 新增：取消支付，清空购物车
function cancelPayment() {
    const modal = document.getElementById('nutritionistModal');
    if (modal) modal.classList.remove('active');
    
    cartItems = [];
    updateCartCount();
    closeCheckout();
    closeCatering();
}
function closeCheckout() {
    const overlay = document.getElementById('checkoutOverlay');
    if (overlay) overlay.classList.remove('active');
}

function submitOrder() {
    if (cartItems.length === 0) return;
    
    // 营养师拦截逻辑
    const totalCount = cartItems.length;
    const uniqueCats = [...new Set(cartItems.map(item => item.cat))];
    let isUnhealthy = false;
    let warnMsg = '';

    if (totalCount > 5) {
        isUnhealthy = true;
        warnMsg = '⚠️ 营养师警告：单次摄入总量超标。格瑞夫斯先生，您的高强度训练也无法完全抵消这些热量。';
    } else if (uniqueCats.length === 1) {
        isUnhealthy = true;
        const catName = uniqueCats[0];
        if (catName === 'desserts' || catName === 'carbs') {
            warnMsg = '⚠️ 营养师警告：严重偏食。过量糖分与碳水摄入会加剧胰岛负担，建议补充蛋白质与膳食纤维。';
        } else {
            warnMsg = '⚠️ 营养师警告：严重偏食。缺乏必要的碳水与维生素，无法支撑高强度战术行动。';
        }
    }

    if (isUnhealthy) {
        closeCheckout();
        const modal = document.getElementById('nutritionistModal');
        const msgEl = document.getElementById('nutritionistMsg');
        if (modal && msgEl) {
            msgEl.textContent = warnMsg;
            modal.classList.add('active');
        }
        return; // 阻断支付，等待豁免
    }

    // 营养搭配合理，直接执行支付
    completeOrder();
}

function exemptAndPay() {
    // 关闭营养师弹窗，强制支付
    const modal = document.getElementById('nutritionistModal');
    if (modal) modal.classList.remove('active');
    completeOrder();
}

function completeOrder() {
    const addressInput = document.getElementById('deliveryAddress');
    const address = addressInput && addressInput.value.trim() ? addressInput.value.trim() : '默认地址（德克萨斯庄园）';
    
    // 清空购物车
    cartItems = [];
    updateCartCount();
    closeCheckout();
    closeCatering();
    
    // 模拟后勤配送
    setTimeout(() => {
        alert(`[后勤部] 营养师已确认，预计30分钟后配送至 ${address}。`);
    }, 300);
}

/* ================= 13. 医疗系统功能 ================= */
// 1. 密码验证与抽屉开关
function openMedical() {    closeAllOverlays();

   
    
    const modal = document.getElementById('medicalAuthModal');
    if (modal) {
        modal.classList.add('active');
        const input = document.getElementById('medicalPassInput');
        if (input) { input.value = ''; input.focus(); }
    }
}
function closeMedicalAuth() {
    const modal = document.getElementById('medicalAuthModal');
    if (modal) modal.classList.remove('active');
}

function verifyMedicalPass() {
    const input = document.getElementById('medicalPassInput');
    if (!input) return;
    if (input.value.trim() === '0923') {
        closeMedicalAuth();
        const drawer = document.getElementById('medicalDrawer');
        if (drawer) {
            drawer.classList.add('active');
            // 每次打开初始化数据
            renderCheckupItems();
            renderReports();
        }
    } else {
        alert('密码错误。仅限执行总裁本人授权访问。');
        input.value = '';
    }
}

function closeMedical() {
    const drawer = document.getElementById('medicalDrawer');
    if (drawer) drawer.classList.remove('active');
}

// 2. 标签页切换
function switchMedicalTab(tabId, element) {
    document.querySelectorAll('.medical-tab').forEach(t => t.classList.remove('active'));
    if (element) element.classList.add('active');
    
    const appointment = document.getElementById('medicalAppointment');
    const reports = document.getElementById('medicalReports');
    
    if (tabId === 'appointment') {
        if (appointment) appointment.style.display = 'flex';
        if (reports) reports.style.display = 'none';
    } else {
        if (appointment) appointment.style.display = 'none';
        if (reports) reports.style.display = 'flex';
    }
}

// 3. 预约体检逻辑
const checkupData = [
    { id: 'full', name: '全身综合检查', group: '大项' },
    { id: 'blood', name: '血常规与生化', group: '子项' },
    { id: 'heart', name: '心肺功能评估', group: '子项' },
    { id: 'brain', name: '脑部CT扫描', group: '子项' },
    { id: 'ptsd', name: '创伤后应激评估', group: '大项' },
    { id: 'injury', name: '左臂旧伤复查', group: '子项' },
    { id: 'bone', name: '全身骨骼扫描', group: '子项' },
    { id: 'eye', name: '视力与眼底检查', group: '子项' }
];

let selectedCheckups = [];

function renderCheckupItems() {
    const container = document.getElementById('checkupItems');
    if (!container) return;
    container.innerHTML = '';
    selectedCheckups = []; // 重置选择
    
    checkupData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checkup-item';
        div.innerHTML = `<span>${item.name}</span><span class="check-mark">+</span>`;
        div.onclick = () => toggleCheckup(item.id, div);
        container.appendChild(div);
    });
}

function toggleCheckup(id, element) {
    const index = selectedCheckups.indexOf(id);
    if (index > -1) {
        selectedCheckups.splice(index, 1);
        element.classList.remove('selected');
        element.querySelector('.check-mark').textContent = '+';
    } else {
        selectedCheckups.push(id);
        element.classList.add('selected');
        element.querySelector('.check-mark').textContent = '✓';
    }
}

function submitMedicalAppointment() {
    if (selectedCheckups.length === 0) {
        alert('请至少选择一项体检项目。');
        return;
    }

    // 获取表单信息，留空默认为执行总裁
  const name = document.getElementById('medName').value.trim() || '执行总裁';
const gender = document.getElementById('medGender').value.trim();
const age = document.getElementById('medAge').value.trim();
const address = document.getElementById('medAddress').value.trim();
const phone = document.getElementById('medPhone').value.trim();
const date = document.getElementById('medDate').value.trim() || '待定（由医疗部协调）';

    // 模拟提交
    setTimeout(() => {
        alert(`[医疗部] 已为 ${name} 成功预约体检。\n\n体检项目：${selectedCheckups.length} 项\n预约时间：${date}\n医护人员将按约定时间上门或安排专车接送。`);
        // 重置表单
        document.getElementById('medName').value = '';
        document.getElementById('medGender').value = '';
        document.getElementById('medAge').value = '';
        document.getElementById('medAddress').value = '';
        document.getElementById('medPhone').value = '';
        document.getElementById('medDate').value = '';
        // 刷新项目
        renderCheckupItems();
    }, 500);
}

// 4. 历史报告数据与渲染
let medicalReportsData = [
    {
        date: '2026年9月15日',
        status: '总体健康，存在部分职业性劳损',
        details: '心率：58 bpm（运动员水平）。血压：130/85 mmHg。睡眠监测：平均每日 4.2 小时。咖啡因摄入：超标。左臂旧伤恢复缓慢，伴有轻微炎症。',
        advice: '医生建议：减少咖啡因摄入，保证每日 6 小时以上睡眠。左臂需静养，避免高强度负重。',
        note: '格瑞夫斯批注："我每天只睡4个小时。咖啡因是我的生理盐水。别管我。左臂收到，下次任务回来再休。"'
    },
    {
        date: '2026年6月02日',
        status: '轻度胃炎，其余指标正常',
        details: '胃镜显示轻度浅表性胃炎。主因：长期食用战术能量棒，饮食极度不规律。血检正常，肝肾功能优异。',
        advice: '医生建议：必须规律饮食，多摄入蔬菜与优质蛋白，减少战斗口粮的依赖。',
        note: '格瑞夫斯批注："让厨房多准备点沙拉。但我赶时间的时候，还是会吃能量棒。"'
    },
    {
        date: '2026年2月18日',
        status: '年度全身体检，无重大异常',
        details: '全身骨骼扫描无骨折。视力 1.5，略有色差敏感度下降（轻微夜盲）。听力在高频段有轻度损伤（源于长期射击训练）。',
        advice: '医生建议：战术行动中务必佩戴降噪耳机，夜间行动需依赖夜视设备。',
        note: '格瑞夫斯批注："知道了。但我还是喜欢听子弹上膛的声音。"'
    }
];

function renderReports() {
    const container = document.getElementById('reportList');
    if (!container) return;
    container.innerHTML = '';
    
    medicalReportsData.forEach(report => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
            <div class="report-header">
                <span>📋 体检报告</span>
                <span>${report.date}</span>
            </div>
            <div class="report-body">
                <strong>诊断结论：</strong>${report.status}<br><br>
                <strong>详细数据：</strong>${report.details}
            </div>
            <div class="report-advice">💡 ${report.advice}</div>
            <div class="report-note">🔴 ${report.note}</div>
        `;
        container.appendChild(card);
    });
}

/* ================= 14. 暗影业务池与联动逻辑 ================= */
// 预设的订单池
const contractData = [
    { id: 'c1', code: 'OP-0923', client: '卡塔尔能源集团', desc: '护送高价值物资穿越苏丹港交战区（历史归档：地点LAS ALMAS,客户：五角大楼，尾款被扣15%）', base: 'middleeast', risk: 'high', reward: '$ 2.2亿' },
    { id: 'c2', code: 'OP-1104', client: '黑曜石物流', desc: '在东欧交战区进行物资护送', base: 'ukraine', risk: 'mid', reward: '$ 8000万' },
    { id: 'c3', code: 'OP-2035', client: '匿名跨国财团', desc: '清剿雨林深处的武装据点', base: 'myanmar', risk: 'high', reward: '$ 3.5亿' },
    { id: 'c4', code: 'OP-0621', client: '某政要竞选团队', desc: '保护候选人在欧洲进行为期一周的演讲', base: 'europe', risk: 'low', reward: '$ 5000万' },
    { id: 'c5', code: 'OP-1111', client: '当地武装势力', desc: '派遣战术教官进行为期三周的战术指导', base: 'ukraine', risk: 'mid', reward: '$ 6000万' },
    { id: 'c6', code: 'OP-8888', client: '私人客户', desc: '加勒比海域的私人安保巡逻', base: 'caribbean', risk: 'low', reward: '$ 3000万' }
];

let activeContractIds = []; // 记录已接单的订单ID

// 渲染业务池卡片
function renderContracts() {
    const container = document.getElementById('contractScroll');
    if (!container) return;
    container.innerHTML = '';

    contractData.forEach(contract => {
        const isActive = activeContractIds.includes(contract.id);
        const card = document.createElement('div');
        card.className = `contract-card ${isActive ? 'highlighted' : ''}`;
        
        let riskClass = 'low';
        let riskText = '低风险';
        if (contract.risk === 'high') { riskClass = 'high'; riskText = '高风险'; }
        if (contract.risk === 'mid') { riskClass = 'mid'; riskText = '中风险'; }

        card.innerHTML = `
            <div class="contract-card-header">
                <span class="contract-code">${contract.code}</span>
                <span class="contract-risk ${riskClass}">${riskText}</span>
            </div>
            <div class="contract-client">${contract.client}</div>
            <div class="contract-desc">${contract.desc}</div>
            <div class="contract-base">🛡️ 派发至：${getBaseName(contract.base)}</div>
            <div class="contract-footer">
                <span class="contract-reward">${contract.reward}</span>
                <button class="contract-btn ${isActive ? 'active' : ''}" onclick="toggleContract('${contract.id}')">${isActive ? '已接单 · 点击撤销' : '接单'}</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// 获取基地中文名（辅助函数）
function getBaseName(baseId) {
    const map = { texas: '德克萨斯总部', caribbean: '加勒比安全屋', ukraine: '乌克兰前线基地', myanmar: '缅甸训练营', middleeast: '中东基地', europe: '欧洲基地' };
    return map[baseId] || '未知基地';
}

// 接单/取消接单核心逻辑
function toggleContract(contractId) {
    const contract = contractData.find(c => c.id === contractId);
    if (!contract) return;

    const index = activeContractIds.indexOf(contractId);
    
    if (index > -1) {
        // 取消接单
        activeContractIds.splice(index, 1);
        triggerGravesContractMessage('cancel');
    } else {
        // 接单
        activeContractIds.push(contractId);
        triggerGravesContractMessage('accept');
    }

    renderContracts(); // 刷新卡片
    showBase(currentBaseId, document.querySelector(`.base-dot.${currentBaseId}`)); // 刷新任务面板
saveGameState();
}

// 格瑞夫斯小号弹窗反馈
function triggerGravesContractMessage(action) {
    const toast = document.getElementById('systemToast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    let msgText = '';
    if (action === 'accept') {
        msgText = "Darlin'，我看到你帮我接单了。放心，这些单子都是我提前筛过的，风险可控。你只管点，剩下的交给奥兹去跑。做得好。";
    } else {
        msgText = "怎么，不喜欢这个单子？没关系，听你的，我让奥兹去推掉。";
    }
    toastMsg.textContent = msgText;
    
    // 1. 将操作弹窗写入小号聊天记录（追加到最下方）
    if (typeof chatHistories !== 'undefined' && chatHistories['graves_alt']) {
        chatHistories['graves_alt'].push({ "sender": "received", "text": msgText, "time": "刚刚" });
        
        // 2. 如果访客此刻正好开着这个聊天窗口，实时显示新消息
        if (currentChatId === 'graves_alt') {
            appendMessageToArea('received', msgText, '刚刚');
        }
    }
    
    // 3. 重新触发顶部弹窗动画
    toast.classList.remove('show');
    void toast.offsetWidth; // 强制触发重绘
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 5000);
}    
  
// 确保基地切换时，任务面板能同步接单状态
// 请找到你现有的 showBase 函数，在其中渲染 missions 的地方，加入对 activeContractIds 的判断
// 初始化渲染业务池renderContracts();
// 电脑端鼠标滚轮横向滚动适配（防止页面上下滚动，直接作用于卡片区域）
const contractScroll = document.getElementById('contractScroll');
if (contractScroll) {
    contractScroll.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault(); // 阻止页面上下滚动
            this.scrollLeft += e.deltaY; // 变成横向滚动
        }
    }, { passive: false });
}
renderContracts();

/* ================= 15. 状态栏、监控与档案逻辑 ================= */

// 1. 动态更新右上角时间、日期、星期、天气
function updateStatusBar() {
    const now = new Date();
    const timeEl = document.getElementById('currentTime');
    const statusEl = document.getElementById('currentStatus');
    if (!timeEl || !statusEl) return;

    // 更新左侧时间
    timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 生成日期与星期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekDays[now.getDay()];

    // 天气池（根据军事热点设定倾向，但整体保持随机）
    const weathers = ['☀️ 晴朗', '⛅ 多云', '🌧️ 小雨', '⛈️ 雷暴', '🌪️ 沙尘暴', '❄️ 小雪', '🌫️ 雾霾'];
    const weather = weathers[Math.floor(Math.random() * weathers.length)];

    statusEl.textContent = `${year}.${month}.${day} ${weekday} · ${weather}`;
}

// 每 30 秒更新一次状态栏（天气不会频繁跳动，但时间会走）
setInterval(updateStatusBar, 30000);
updateStatusBar(); // 初始化

// 2. 卫星与无人机监控逻辑
const surveillanceData = [
    { target: '苏丹港交界处', status: '实时画面传输中', statusClass: 'active', coords: '19.6158° N, 37.2164° E' },
    { target: '东欧物流航线', status: '卫星锁定', statusClass: 'warning', coords: '48.3794° N, 31.1656° E' },
    { target: '中东基地外围', status: '信号干扰', statusClass: 'danger', coords: '25.2769° N, 51.2185° E' }
];

function renderSurveillance() {
    const container = document.getElementById('surveillanceList');
    if (!container) {
        console.error("❌ 找不到 #surveillanceList 容器！");
        return;
    }
    container.innerHTML = '';
    surveillanceData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'surveillance-item';
        
        // 改成显式绑定事件，方便排查
        div.addEventListener('click', function() {
            console.log("👉 点击了监控项:", item.target);
            openDroneView(item.target, item.coords);
        });
        
        div.innerHTML = `
            <div class="surveillance-info">
                <div class="surveillance-target">${item.target}</div>
                <div class="surveillance-status ${item.statusClass}">● ${item.status}</div>
                <div class="surveillance-coords">${item.coords}</div>
            </div>
            <div style="color: var(--gold); font-size: 18px;">→</div>
        `;
        container.appendChild(div);
    });
    console.log("✅ 监控列表渲染完成");
}

function openDroneView(target, coords) {
    console.log("👉 正在执行 openDroneView, 目标:", target);
    const overlay = document.getElementById('droneOverlay');
    const targetName = document.getElementById('droneTargetName');
    const coordEl = document.getElementById('droneCoords');
    
    if (!overlay) console.error("❌ 找不到 #droneOverlay！");
    if (!targetName) console.error("❌ 找不到 #droneTargetName！");
    if (!coordEl) console.error("❌ 找不到 #droneCoords！");

    if (overlay && targetName && coordEl) {
        targetName.textContent = target;
        coordEl.textContent = coords;
        overlay.classList.add('active');
        console.log("✅ 无人机弹窗已激活");
    }
}

function closeDroneView() {
    const overlay = document.getElementById('droneOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}
// 3. 人事档案绝密逻辑
function openPersonnel() {    
    const modal = document.getElementById('personnelModal');
    if (modal) modal.classList.add('active');
}

function closePersonnelModal() {
    const modal = document.getElementById('personnelModal');
    if (modal) modal.classList.remove('active');
}

// 初始化渲染卫星监控数据
renderSurveillance();

/* ================= 16. 今日简报与军火盲盒 ================= */
// --- 今日简报 ---
const briefingEvents = [
    { event: '奥兹今天第4次骂军需官，因为对方又把子弹口径配错了。', note: '让他骂。但下次再错，扣他奖金。' },
    { event: '德州庄园的波本库存告急，管家建议采购新批次。', note: '买。顺便给我留两瓶。' },
    { event: '中东基地的雇佣兵在训练时把靶场炸了，理由：走火。', note: '走火？让他去扫厕所。' },
    { event: '卡塔尔买家额外加价5000万，要求提前交货。', note: '钱到账再说。货，我按我的节奏走。' },
    { event: '今日有黑客试图入侵终端，已被防火墙拦截。', note: '查IP。如果是老熟人，就“回访”一下。' },
    { event: '研究院送来的原型机报告，数据看着不错，但造价超标了。', note: '从奥兹的团建预算里扣。' },
    { event: '加勒比安全屋的海风有点大，泳池清理延迟了。', note: '让安保队去捞树叶，别让他们闲着。' },
    { event: '黑曜石物流的运输车队在东欧边境被当地警方拦下了。', note: '让律师去处理。如果不行，就换个关口。' },
    { event: '暗影前线小队报告，缅甸训练营的伙食太差，士兵们开始抱怨。', note: '告诉厨师长，如果明天再吃不上肉，他就可以去前线填线了。' },
    { event: '法拉赫发来一份加密情报，指责我们在她防区附近的动作太大。', note: '给她回消息，说我只是在“路过”。顺便送她两箱波本。' },
    { event: '德克萨斯下暴雨，地下掩体的通风系统进水了。', note: '排水系统干什么吃的？让工程部连夜修好。' },
    { event: '有个不知名的小军阀想黑吃黑，扣了我们的一批货。', note: '让附近的暗影小队去“拜访”一下。把货带回来，顺便把那个据点扬了。' },
    { event: '暗影研究院在做原型机测试时发生了小意外，炸坏了实验室的一角。', note: '让那帮书呆子下次离远点，别炸瞎了眼睛。' },
    { event: '集团财务部报告，上个月在中东的合同利润率达到了300%。', note: '不错。告诉奥兹，年终奖稳了。' },
    { event: '有人试图在暗网上悬赏暗影公司高层的人头。', note: '悬赏金多少？少于1000万就别来丢人现眼。' },
    { event: '德克萨斯庄园的狗生病了，兽医正在检查。', note: '不管花多少钱，治好它。我回去要看见它活蹦乱跳的。' },
    { event: '情报部截获了一段不明加密信号，来源尚不明确。', note: '持续监控。如果是冲着我们来的，提前做好清除准备。' },
    { event: '今天是你离开德克萨斯的第三天，天气晴朗。', note: '想你了。早点回来。' },
    { event: '军需官报告，MK18步枪的弹药库存不足。', note: '联系黑曜石物流，从备选渠道进货。别耽误下一次任务。' },
    { event: '奥兹因为连续加班，在办公桌上睡着了，还打翻了咖啡。', note: '让他睡半小时。然后把咖啡渍拍下来，扣他清洁费。' }
];

function openBriefing() {
closeAllOverlays();
    const drawer = document.getElementById('briefingDrawer');
    const listEl = document.getElementById('briefingList');
    if (!drawer || !listEl) return;

    // 1. 洗牌算法随机抽取3条不重复的事件
    const shuffled = [...briefingEvents].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    // 2. 渲染
    listEl.innerHTML = '';
    selected.forEach(item => {
        const card = document.createElement('div');
        card.className = 'briefing-card';
        card.innerHTML = `
            <div class="briefing-event">${item.event}</div>
            <div class="briefing-note">${item.note}</div>
        `;
        listEl.appendChild(card);
    });

    drawer.classList.add('active');
}

function closeBriefing() {
    const drawer = document.getElementById('briefingDrawer');
    if (drawer) drawer.classList.remove('active');
}

// --- 军火盲盒 ---
const blindboxWeapons = [
    { name: 'M4A1 SOPMOD Block II', type: '突击步枪', spec: '中近距离交火', note: '枪是好枪。就是奥兹总喜欢往上面挂太多战术手电，跟个圣诞树似的。' },
    { name: '巴雷特 M107', type: '反器材狙击步枪', spec: '远程高价值目标清除', note: '一枪下去，目标连渣都不剩。省子弹，费墙。' },
    { name: 'MP5SD 消音版', type: '冲锋枪', spec: '隐蔽潜入、室内近战', note: '适合潜入。但我更喜欢正面推过去。' },
    { name: '标枪反坦克导弹', type: '便携式导弹', spec: '反装甲、攻坚', note: '别在城市里用。上次把奥兹的眉毛烧了。' },
    { name: 'AC-130J 空中炮艇', type: '空中火力平台', spec: '空中火力压制', note: '这玩意儿一开火，敌人就知道是谁来了。挺好的，省得他们猜。' },
    { name: '单兵外骨骼原型', type: '实验性装备', spec: '极限负重、特种作战', note: '研究院那帮人还没做好。穿上去小心变成钢铁侠，摔个狗啃泥。' },
    { name: 'M1A2 艾布拉姆斯', type: '主战坦克', spec: '重型地面突击', note: '适合推平一切。但油耗太他妈高了，财务部天天跟我哭穷。' },
    { name: '战术夜视仪 (GPNVG-18)', type: '单兵装备', spec: '夜间作战', note: '四只眼，看得比谁都清楚。就是长得像个外星人。' },
    { name: 'HK416 A5', type: '突击步枪', spec: '精锐小队专属，模块化程度高', note: '奥兹说你这周已经用它干掉三个目标了。换一把试试？' },
    { name: '毒刺防空导弹', type: '便携式防空导弹', spec: '低空防御', note: '打直升机很好用。上次差点把自家的无人机打下来。' },
    { name: '黑鹰直升机', type: '空中载具', spec: '快速投送、撤离', note: '老伙计了。只要别让我开它去撞大楼就行。' },
    { name: '定制版格洛克 17', type: '手枪', spec: '个人防卫、近距离', note: '我枕头底下常年放一把。比什么防身警报器都好使。' }
];

function drawBlindbox() {
    const overlay = document.getElementById('blindboxOverlay');
    const resultEl = document.getElementById('blindboxResult');
    if (!overlay || !resultEl) return;

    // 随机抽取一把武器
    const weapon = blindboxWeapons[Math.floor(Math.random() * blindboxWeapons.length)];

    // 带有一点延迟的“抽取动画”效果
    resultEl.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 20px;">正在接入军火库数据库...</div>';
    overlay.classList.add('active');

    setTimeout(() => {
        resultEl.innerHTML = `
            <div class="weapon-name">${weapon.name}</div>
            <div class="weapon-type">${weapon.type}</div>
            <div class="weapon-spec">${weapon.spec}</div>
            <div class="weapon-note">${weapon.note}</div>
        `;
    }, 600); // 0.6秒后显示结果，模拟抽取感
}

function closeBlindbox() {
    const overlay = document.getElementById('blindboxOverlay');
    if (overlay) overlay.classList.remove('active');
}

/* ================= 17. 战术推演（2048） ================= */
let tacticalBoard = [
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
];let tacticalScore = 0;
let tacticalHistory = [];
let tacticalGameOver = false;
let hasWonTactical = false;

function openTacticalGame() {
    const overlay = document.getElementById('tacticalOverlay');
    if (overlay) overlay.classList.add('active');
    initTacticalGame();
}

function closeTacticalGame() {
    const overlay = document.getElementById('tacticalOverlay');
    if (overlay) overlay.classList.remove('active');
}

function initTacticalGame() {
    tacticalBoard = Array.from({ length: 6 }, () => Array(6).fill(0));
    tacticalScore = 0;
    tacticalHistory = [];
    tacticalGameOver = false;
hasWonTactical = false;
    const scoreEl = document.getElementById('tacticalScore');
    if (scoreEl) scoreEl.textContent = '0';
    const resultOverlay = document.getElementById('tacticalResultOverlay');
    if (resultOverlay) resultOverlay.classList.remove('active');
    addTacticalTile();
    addTacticalTile();
    addTacticalTile();
    renderTacticalBoard();
}

function addTacticalTile() {
    const empty = [];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (tacticalBoard[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length === 0) return;
    const spot = empty[Math.floor(Math.random() * empty.length)];
    
    // 提高大数字产出概率：60% 出 2，30% 出 4，10% 出 8
    const rand = Math.random();
    let value = 2;
    if (rand > 0.6 && rand <= 0.9) value = 4;
    else if (rand > 0.9) value = 8;
    
    tacticalBoard[spot.r][spot.c] = value;
}
function renderTacticalBoard() {
    const boardEl = document.getElementById('tacticalBoard');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            const val = tacticalBoard[r][c];
            if (val !== 0) {
                cell.classList.add('tile-' + val);
                cell.textContent = val;
            }
            boardEl.appendChild(cell);
        }
    }
}

function saveTacticalState() {
    tacticalHistory.push({
        board: tacticalBoard.map(row => [...row]),
        score: tacticalScore
    });
    if (tacticalHistory.length > 20) tacticalHistory.shift();
}

function undoTacticalMove() {
    if (tacticalHistory.length === 0) return;
    const prev = tacticalHistory.pop();
    tacticalBoard = prev.board.map(row => [...row]);
    tacticalScore = prev.score;
    tacticalGameOver = false;
    const scoreEl = document.getElementById('tacticalScore');
    if (scoreEl) scoreEl.textContent = tacticalScore;
    const resultOverlay = document.getElementById('tacticalResultOverlay');
    if (resultOverlay) resultOverlay.classList.remove('active');
    renderTacticalBoard();saveGameState();
}

function moveTactical(direction) {
    if (tacticalGameOver) return;
    
    const oldBoardStr = JSON.stringify(tacticalBoard);
    let newBoard = tacticalBoard.map(row => [...row]);
    let gainedScore = 0;
    
    for (let i = 0; i < 6; i++) {
        let line;
        if (direction === 'left') line = [newBoard[i][0], newBoard[i][1], newBoard[i][2], newBoard[i][3], newBoard[i][4], newBoard[i][5]];
        else if (direction === 'right') line = [newBoard[i][5], newBoard[i][4], newBoard[i][3], newBoard[i][2], newBoard[i][1], newBoard[i][0]];
        else if (direction === 'up') line = [newBoard[0][i], newBoard[1][i], newBoard[2][i], newBoard[3][i], newBoard[4][i], newBoard[5][i]];
        else if (direction === 'down') line = [newBoard[5][i], newBoard[4][i], newBoard[3][i], newBoard[2][i], newBoard[1][i], newBoard[0][i]];
        
        let filtered = line.filter(v => v !== 0);
        let merged = [];
        for (let j = 0; j < filtered.length; j++) {
            if (j < filtered.length - 1 && filtered[j] === filtered[j + 1]) {
                merged.push(filtered[j] * 2);
                gainedScore += filtered[j] * 2;
                j++;
            } else {
                merged.push(filtered[j]);
            }
        }
        while (merged.length < 6) merged.push(0);
        
        if (direction === 'left') { for(let k=0;k<6;k++) newBoard[i][k] = merged[k]; }
        else if (direction === 'right') { for(let k=0;k<6;k++) newBoard[i][5-k] = merged[k]; }
        else if (direction === 'up') { for(let k=0;k<6;k++) newBoard[k][i] = merged[k]; }
        else if (direction === 'down') { for(let k=0;k<6;k++) newBoard[5-k][i] = merged[k]; }
    }
    
    const newBoardStr = JSON.stringify(newBoard);
    if (newBoardStr === oldBoardStr) return;
    
    saveTacticalState();
    tacticalBoard = newBoard;
    tacticalScore += gainedScore;
    const scoreEl = document.getElementById('tacticalScore');
    if (scoreEl) scoreEl.textContent = tacticalScore;
    
    addTacticalTile();
    renderTacticalBoard();saveGameState();
    
  if (checkTacticalWin() && !hasWonTactical) {
    hasWonTactical = true;
    // 👇 新增：发奖励，但不阻断游戏
    dispatchFunds += 500000;
    if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
    if (typeof saveGameState === 'function') saveGameState();

    if (typeof triggerGravesAltMessage === 'function') {
        triggerGravesAltMessage(`战术推演合成了 2048！算力不错。$500,000 奖励已到账，你可以继续推演，争取更高分数。`);
    }

    // 轻量级提示，不阻断操作，玩家关掉弹窗后可以继续移动
    setTimeout(() => {
        alert("战术推演达成 2048！\n\n黑色行动资金奖励：+ $500,000\n\n游戏继续，请继续推演。");
    }, 200);
} else if (checkTacticalGameOver()) {
    tacticalGameOver = true;
    showTacticalResult(false);
}
}

function checkTacticalWin() {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (tacticalBoard[r][c] === 2048) return true;
        }
    }
    return false;
}

function checkTacticalGameOver() {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (tacticalBoard[r][c] === 0) return false;
        }
    }
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (r < 5 && tacticalBoard[r][c] === tacticalBoard[r+1][c]) return false;
            if (c < 5 && tacticalBoard[r][c] === tacticalBoard[r][c+1]) return false;
        }
    }
    return true;
}
function showTacticalResult(isWin) {
    const overlay = document.getElementById('tacticalResultOverlay');
    const title = document.getElementById('resultTitle');
    const desc = document.getElementById('resultDesc');
    const continueBtn = document.getElementById('continueBtn'); // 新增
    if (!overlay || !title || !desc) return;
    
    if (isWin) {
        title.textContent = '推演完成';
        desc.textContent = '战术推演完成，模拟结果：完美。方案已归档。';
        if (continueBtn) continueBtn.style.display = 'block'; // 显示“继续推演”按钮
    } else {
        title.textContent = '推演失败';
        desc.textContent = '无可用策略，战术推演终止。请重新规划。';
        if (continueBtn) continueBtn.style.display = 'none'; // 失败时隐藏该按钮
    }
    overlay.classList.add('active');
}
function resetTacticalGame() {
    initTacticalGame();saveGameState();
}

// 电脑端键盘控制
document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('tacticalOverlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const resultOverlay = document.getElementById('tacticalResultOverlay');
    if (resultOverlay && resultOverlay.classList.contains('active')) return;
    
    let handled = true;
    switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': moveTactical('up'); break;
        case 'ArrowDown': case 's': case 'S': moveTactical('down'); break;
        case 'ArrowLeft': case 'a': case 'A': moveTactical('left'); break;
        case 'ArrowRight': case 'd': case 'D': moveTactical('right'); break;
        default: handled = false;
    }
    if (handled) e.preventDefault();
});

/* ================= 19. 暗影操盘（炒股小游戏）逻辑 ================= */
const tradingAssetsData = [
    { name: '军火期货', code: 'ARMS', basePrice: 120000, volatility: 0.15, holdings: 0 },
    { name: '原油期权', code: 'OIL', basePrice: 60000, volatility: 0.20, holdings: 0 },
    { name: '稀土现货', code: 'RARE', basePrice: 80000, volatility: 0.08, holdings: 0 },
    { name: '黑曜石物流', code: 'OBS', basePrice: 150000, volatility: 0.10, holdings: 0 },
    { name: '暗影防务债券', code: 'BOND', basePrice: 200000, volatility: 0.03, holdings: 0 }
];

let tradingCash = 10000000;
let tradingDay = 1;
let tradingGameOver = false;
let tradingCurrentAssets = [];
let tradingBonusClaimed = { '50m': false, '100m': false };

// 随机新闻池（60%触发）
const tradingNewsPool = [
    { news: '中东爆发武装冲突，军火需求飙升。', target: 'ARMS', change: 0.30 },
    { news: '联合国通过停火协议，局势缓和。', target: 'ARMS', change: -0.20 },
    { news: '主要产油国设施遇袭，供应中断。', target: 'OIL', change: 0.25 },
    { news: '新能源技术取得重大突破，原油承压。', target: 'OIL', change: -0.15 },
    { news: '某出口大国限制稀土出口。', target: 'RARE', change: 0.20 },
    { news: '发现新的大型稀土矿脉，供应预期增加。', target: 'RARE', change: -0.10 },
    { news: '黑曜石物流成功护送高价值货物，客户追加订单。', target: 'OBS', change: 0.15 },
    { news: '车队遭遇不明武装伏击，损失严重。', target: 'OBS', change: -0.25 },
    { news: '暗影研究院原型机测试成功。', target: 'BOND', change: 0.10 },
    { news: '暗影公司遭遇黑客攻击，市场信心受挫。', target: 'BOND', change: -0.05 }
];

let tradingLogs = [];


function openTradingGame() {
    const overlay = document.getElementById('tradingOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    
    // 核心修改：只有当游戏数据为空（首次进入或刷新页面后）才重置
    // 如果之前玩过，只是点了✕退出，再进来时会保留进度
    if (!tradingCurrentAssets || tradingCurrentAssets.length === 0) {
        resetTradingGame();
    } else {
        renderTradingUI(); // 恢复上次的盘面
    }
}
function closeTradingGame() {
    const overlay = document.getElementById('tradingOverlay');
    if (overlay) overlay.classList.remove('active');
}

function resetTradingGame() {
    tradingCash = 10000000;
    tradingDay = 1;
    tradingGameOver = false;
    tradingBonusClaimed = { '50m': false, '100m': false };
    tradingLogs = [];
    tradingCurrentAssets = tradingAssetsData.map(asset => ({ ...asset, currentPrice: asset.basePrice }));
    
    // 重置弹窗
    const modal = document.getElementById('tradingModalOverlay');
    if (modal) modal.classList.remove('active');
    
    addTradingLog('操盘系统已启动。初始资金 $10,000,000。');
    renderTradingUI();
}

function calculateTotalAssets() {
    let holdingsValue = 0;
    tradingCurrentAssets.forEach(asset => {
        holdingsValue += asset.currentPrice * asset.holdings;
    });
    return tradingCash + holdingsValue;
}

function addTradingLog(text) {
    tradingLogs.unshift(text);
    if (tradingLogs.length > 5) tradingLogs.pop(); // 只保留最近5条
    const logEl = document.getElementById('tradingLog');
    if (logEl) logEl.innerHTML = tradingLogs.join('<br>');
}

function renderTradingUI() {
    const cashEl = document.getElementById('tradingCash');
    const holdingEl = document.getElementById('tradingHoldings');
    const totalEl = document.getElementById('tradingTotal');
    const dayEl = document.getElementById('tradingDay');
    const listEl = document.getElementById('tradingAssetList');

    let holdingsValue = 0;
    tradingCurrentAssets.forEach(asset => { holdingsValue += asset.currentPrice * asset.holdings; });

    if (cashEl) cashEl.textContent = '$' + tradingCash.toLocaleString('en-US');
    if (holdingEl) holdingEl.textContent = '$' + holdingsValue.toLocaleString('en-US');
    if (totalEl) totalEl.textContent = '$' + (tradingCash + holdingsValue).toLocaleString('en-US');
    if (dayEl) dayEl.textContent = tradingDay;

    if (!listEl) return;
    listEl.innerHTML = '';
    
    tradingCurrentAssets.forEach((asset, index) => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.innerHTML = `
            <div class="asset-card-header">
                <div>
                    <div class="asset-name">${asset.name}</div>
                    <div class="asset-code">${asset.code}</div>
                </div>
                <div class="asset-price">$${asset.currentPrice.toLocaleString('en-US')}</div>
            </div>
            <div class="asset-card-body">
                <div class="asset-holding">持仓：${asset.holdings} 手</div>
                <div class="asset-actions">
                    <button class="asset-btn" onclick="buyAsset(${index})">买入</button>
                    <button class="asset-btn sell" onclick="sellAsset(${index})">卖出</button>
                </div>
            </div>
        `;
        listEl.appendChild(card);
    });
}

function buyAsset(index) {
    if (tradingGameOver) return;
    const asset = tradingCurrentAssets[index];
    
    // 弹出输入框，让玩家自己输入想买多少手
    const input = prompt(`买入 ${asset.name}\n当前价格: $${asset.currentPrice.toLocaleString('en-US')}/手\n可用现金: $${tradingCash.toLocaleString('en-US')}\n\n请输入想买入的手数 (正整数):`, "1");
    if (input === null) return; // 用户点了取消
    
    const qty = parseInt(input);
    if (isNaN(qty) || qty <= 0) {
        addTradingLog(`买入失败: 请输入有效的正整数。`);
        return;
    }
    
    // 👇 核心修改：计算总成本 + 1%手续费
    const baseCost = asset.currentPrice * qty;
    const fee = Math.floor(baseCost * 0.01); // 1% 手续费
    const totalCost = baseCost + fee;
    
    if (tradingCash < totalCost) {
        addTradingLog(`资金不足，无法买入 ${qty} 手 ${asset.name} (需要 $${totalCost.toLocaleString('en-US')}，含手续费 $${fee})。`);
        return;
    }
    
    tradingCash -= totalCost;
    asset.holdings += qty;
    addTradingLog(`买入 ${qty} 手 ${asset.name}，花费 $${baseCost.toLocaleString('en-US')} + 手续费 $${fee.toLocaleString('en-US')}。`);
    renderTradingUI();
    saveGameState();
}
function sellAsset(index) {
    if (tradingGameOver) return;
    const asset = tradingCurrentAssets[index];
    
    if (asset.holdings <= 0) {
        addTradingLog(`没有 ${asset.name} 的持仓，无法卖出。`);
        return;
    }
    
    // 弹窗让玩家输入卖出多少手
    const input = prompt(`卖出 ${asset.name}\n当前价格: $${asset.currentPrice.toLocaleString('en-US')}/手\n持有: ${asset.holdings} 手\n\n请输入想卖出的手数 (正整数，最多 ${asset.holdings} 手):`, "1");
    if (input === null) return;
    
    const qty = parseInt(input);
    if (isNaN(qty) || qty <= 0) {
        addTradingLog(`卖出失败: 请输入有效的正整数。`);
        return;
    }
    if (qty > asset.holdings) {
        addTradingLog(`卖出失败: 持仓不足 ${qty} 手。`);
        return;
    }
    
    // 👇 核心修改：计算应得收益 - 1%手续费
    const baseRevenue = asset.currentPrice * qty;
    const fee = Math.floor(baseRevenue * 0.01); // 1% 手续费
    const actualRevenue = baseRevenue - fee;
    
    asset.holdings -= qty;
    tradingCash += actualRevenue;
    addTradingLog(`卖出 ${qty} 手 ${asset.name}，入账 $${baseRevenue.toLocaleString('en-US')} - 手续费 $${fee.toLocaleString('en-US')}。`);
    renderTradingUI();
    saveGameState();
}

function nextTradingDay() {
    if (tradingGameOver) return;
    tradingDay++;
    
    // 1. 基础波动
    tradingCurrentAssets.forEach(asset => {
        const change = (Math.random() * 2 - 1) * asset.volatility;
        // 将底价降至 100，允许玩家抄底，也允许真正意义上的暴跌
asset.currentPrice = Math.max(100, Math.floor(asset.currentPrice * (1 + change)));
    });

    // 2. 随机新闻事件（60%触发）
    if (Math.random() < 0.6) {
        const news = tradingNewsPool[Math.floor(Math.random() * tradingNewsPool.length)];
        const targetAsset = tradingCurrentAssets.find(a => a.code === news.target);
        if (targetAsset) {
            targetAsset.currentPrice = Math.floor(targetAsset.currentPrice * (1 + news.change));
            addTradingLog(`[突发] ${news.news} ${targetAsset.name}价格${news.change > 0 ? '上涨' : '下跌'}${Math.abs(news.change * 100)}%。`);
        }
    } else {
        addTradingLog('今日无重大新闻，市场平稳波动。');
    }

    renderTradingUI();
saveGameState();

       // 3. 结算判定
    const total = calculateTotalAssets();
    
    // 🏆 里程碑 1：突破 5000 万（中途奖励，不结束游戏）
    if (total >= 50000000 && !tradingBonusClaimed['50m']) {
        tradingBonusClaimed['50m'] = true;
        dispatchFunds += 10000000; // 增加 1000万
        if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        addTradingLog(`🎉 总资产突破5000万！获得黑色行动资金 $10,000,000。`);
        if (typeof triggerGravesAltMessage === 'function') {
            triggerGravesAltMessage("Darlin'，我看到你的操盘成绩了。$10,000,000 行动资金已经到账。继续加油，离一亿不远了。");
        }
    }
    
    // 🏆 里程碑 2：突破 1 亿（通关）
    if (total >= 100000000 && !tradingBonusClaimed['100m']) {
        tradingBonusClaimed['100m'] = true;
        dispatchFunds += 20000000; // 增加 2000万
        if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        addTradingLog(`🚀 总资产突破1亿！获得黑色行动资金 $20,000,000。达成通关！`);
        if (typeof triggerGravesAltMessage === 'function') {
            triggerGravesAltMessage("一亿。你做到了。这笔 $20,000,000 的奖金是对你实力的认可。收下吧，Darlin'。");
        }
        tradingGameOver = true;
        showTradingResult(true);
        return; // 结束函数，避免继续执行破产判定
    }
    
    // 💥 破产判定：总资产低于 100 万
    if (total < 1000000) {
        const penalty = Math.floor(dispatchFunds * 0.25); // 扣除 25%
        dispatchFunds = Math.max(0, dispatchFunds - penalty); // 防止扣成负数
        
        if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        addTradingLog(`💥 资金链断裂，破产清算。扣除黑色行动资金 $${penalty.toLocaleString('en-US')} (25%)。`);
        if (typeof triggerGravesAltMessage === 'function') {
            triggerGravesAltMessage(`破产了？这就是市场的残酷。你的行动资金被扣了 25%（$${penalty.toLocaleString('en-US')}）。回去好好复盘吧。`);
        }
        tradingGameOver = true;
        showTradingResult(false);
        return;
    }
}

function showTradingResult(isWin) {
    const modal = document.getElementById('tradingModalOverlay');
    const title = document.getElementById('tradingResultTitle');
    const desc = document.getElementById('tradingResultDesc');
    if (!modal || !title || !desc) return;

    if (isWin) {
        title.textContent = '年度最佳操盘手';
        desc.textContent = '十倍回报。干得不错。也许我能让你管理我的对冲基金。—— P. Graves';
    } else {
        title.textContent = '清算警告';
        desc.textContent = '资产已归零。看来你更适合拿枪，不适合拿笔。—— P. Graves';
    }
    modal.classList.add('active');
}

/* ================= 20. 计算器逻辑 ================= */
let calcCurrent = '0';
let calcPrevious = '';
let calcOperator = '';
let calcShouldReset = false;

// 打开计算器
function openCalculator() {
    const overlay = document.getElementById('calcOverlay');
    if (overlay) {
        overlay.classList.add('active');
        calcClear(); // 每次打开清空之前的计算
    }
}

// 关闭计算器
function closeCalculator() {
    const overlay = document.getElementById('calcOverlay');
    if (overlay) overlay.classList.remove('active');
}

// 更新显示屏
function updateCalcDisplay() {
    const display = document.getElementById('calcDisplay');
    if (display) display.textContent = calcCurrent;
}

// 核心输入逻辑（数字和运算符）
function calcInput(val) {
    const operators = ['+', '-', '×', '÷'];
    if (operators.includes(val)) {
        if (calcOperator && !calcShouldReset) {
            calcCalculate(); // 如果连续按运算符，先结算前面的
        }
        calcPrevious = calcCurrent;
        calcOperator = val;
        calcShouldReset = true;
    } else {
        if (calcShouldReset) {
            calcCurrent = val;
            calcShouldReset = false;
        } else {
            if (val === '.' && calcCurrent.includes('.')) return; // 防止多个小数点
            calcCurrent = calcCurrent === '0' && val !== '.' ? val : calcCurrent + val;
        }
    }
    updateCalcDisplay();
}

// 等于号
function calcCalculate() {
    if (!calcOperator || calcShouldReset) return;
    const prev = parseFloat(calcPrevious);
    const curr = parseFloat(calcCurrent);
    
    if (isNaN(prev) || isNaN(curr)) {
        calcCurrent = 'Error';
    } else {
        let result = 0;
        switch (calcOperator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case '×': result = prev * curr; break;
            case '÷': result = curr === 0 ? 'Error' : prev / curr; break;
        }
        // 处理浮点数精度问题，保留最多8位小数
        if (typeof result === 'number') {
            calcCurrent = parseFloat(result.toFixed(8)).toString();
        } else {
            calcCurrent = result;
        }
    }
    calcOperator = '';
    calcPrevious = '';
    calcShouldReset = true;
    updateCalcDisplay();
}

// 清除所有
function calcClear() {
    calcCurrent = '0';
    calcPrevious = '';
    calcOperator = '';
    calcShouldReset = false;
    updateCalcDisplay();
}

// 退格（⌫）
function calcBackspace() {
    if (calcShouldReset) return;
    if (calcCurrent.length > 1) {
        calcCurrent = calcCurrent.slice(0, -1);
    } else {
        calcCurrent = '0';
    }
    updateCalcDisplay();
}

// 正负号切换（+/-）
function calcToggleSign() {
    if (calcCurrent === '0' || calcCurrent === 'Error') return;
    if (calcCurrent.startsWith('-')) {
        calcCurrent = calcCurrent.slice(1);
    } else {
        calcCurrent = '-' + calcCurrent;
    }
    updateCalcDisplay();
}

// 百分号（%）
function calcPercent() {
    if (calcCurrent === 'Error') return;
    calcCurrent = (parseFloat(calcCurrent) / 100).toString();
    updateCalcDisplay();
}

/* ================= 21. 暗影日历逻辑 ================= */
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth(); // 0-11
let selectedDateStr = '';
let visitorCalendarSchedules = {}; // 访客添加的日程

// 预设的 13 条格瑞夫斯日程（2026年10月与11月）
const presetCalendarSchedules = {
    '2026-09-23': [{ type: 'love', text: '全天 - 专属纪念日。谢绝一切会面。' }],
    '2026-10-05': [{ type: 'work', text: '09:00 - 暗影研究院原型机测试。' }],
    '2026-10-08': [{ type: 'work', text: '14:00 - 与卡塔尔买家视频会议。' }],
    '2026-10-12': [{ type: 'fun', text: '18:00 - 德州庄园后院烤肉，通知奥兹带威士忌过来。' }],
    '2026-10-15': [{ type: 'love', text: '全天 - 强制伴侣全身体检（已通知私人医疗团队，不许拒绝）。' }],
    '2026-10-20': [{ type: 'love', text: '20:00 - 纪念日晚餐，地点：加勒比安全屋。已清场。' }],
    '2026-10-25': [{ type: 'fun', text: '15:00 - 靶场实弹射击，测试新到的单兵外骨骼。' }],
    '2026-11-01': [{ type: 'love', text: '11:00 - 安排专机接送，避免经过交战区。' }],
    '2026-11-05': [{ type: 'work', text: '10:00 - 盘点军火库，核对MK18弹药库存。' }],
    '2026-11-10': [{ type: 'fun', text: '20:00 - 私人酒窖品鉴，顺便检查新到的防务债券。' }],
    '2026-11-15': [{ type: 'love', text: '全天 - 给 Darlin 买新一季的防弹风衣。' }],
    '2026-11-20': [{ type: 'work', text: '08:00 - 黑曜石物流东欧运输线安全评估。' }],
    '2026-11-25': [{ type: 'fun', text: '19:00 - 飞往加勒比海度个短假，保持通讯静默。' }],
    '2026-11-30': [{ type: 'love', text: '22:00 - 买花。' }]
};
function openCalendar() {
    const overlay = document.getElementById('calendarOverlay');
    if (!overlay) return;
    
    // 先声明，后使用
   
    overlay.classList.add('active');
    
    const now = new Date();
    calendarYear = now.getFullYear();
    calendarMonth = now.getMonth();
    selectedDateStr = '';
    closeCalendarDrawer();
    renderCalendar();
}
function closeCalendar() {
    const overlay = document.getElementById('calendarOverlay');
    if (overlay) overlay.classList.remove('active');
}

function renderCalendar() {
    const gridEl = document.getElementById('calendarGrid');
    const displayEl = document.getElementById('calendarMonthDisplay');
    if (!gridEl || !displayEl) return;

    displayEl.textContent = `${calendarYear}年 ${calendarMonth + 1}月`;
    gridEl.innerHTML = '';
    
    // 安全计算：防止年月变成 NaN 导致中途退出
    let firstDay, daysInMonth;
    try {
        firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
        daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    } catch(e) { return; }
    
    if (isNaN(firstDay) || isNaN(daysInMonth)) return;

    let startOffset = (firstDay + 6) % 7;
    
    // 填充前面的空白格
    for (let i = 0; i < startOffset; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        gridEl.appendChild(emptyCell);
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 填充日期格子
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        if (dateStr === todayStr) dayCell.classList.add('today');
        if (dateStr === selectedDateStr) dayCell.classList.add('selected');
        
        let hasSchedule = false;
        if (presetCalendarSchedules[dateStr] && presetCalendarSchedules[dateStr].length > 0) hasSchedule = true;
        if (visitorCalendarSchedules[dateStr] && visitorCalendarSchedules[dateStr].length > 0) hasSchedule = true;

        dayCell.innerHTML = `<div class="day-number">${day}</div>${hasSchedule ? '<div class="schedule-dot"></div>' : ''}`;
        
        // 绑定点击事件（使用闭包防止变量污染）
        dayCell.onclick = (function(d, ds) {
            return function() { openCalendarDrawer(ds, d); };
        })(day, dateStr);
        
        gridEl.appendChild(dayCell);
    }
}
function changeCalendarYear(delta) {
    if (delta > 0) {
        calendarMonth++;
        if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
    } else {
        calendarMonth--;
        if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
    }
    // 限制年份在 2020-2030 之间
    if (calendarYear < 2020) calendarYear = 2020;
    if (calendarYear > 2030) calendarYear = 2030;
    
    renderCalendar();
}

function jumpToToday() {
    const now = new Date();
    calendarYear = now.getFullYear();
    calendarMonth = now.getMonth();
    renderCalendar();
}

function openCalendarDrawer(dateStr, day) {
    selectedDateStr = dateStr;
    const drawer = document.getElementById('calendarDrawer');
    const titleEl = document.getElementById('calendarDrawerTitle');
    const listEl = document.getElementById('calendarScheduleList');
    
    if (!drawer || !titleEl || !listEl) return;

    titleEl.textContent = `${calendarMonth + 1}月${day}日 日程`;
    listEl.innerHTML = '';

    // 1. 渲染格瑞夫斯的预设日程
    const presets = presetCalendarSchedules[dateStr] || [];
    presets.forEach(item => {
        const div = document.createElement('div');
        div.className = 'calendar-schedule-item';
        div.innerHTML = `<strong>[P. Graves]</strong> ${item.text}`;
        listEl.appendChild(div);
    });

    // 2. 渲染访客添加的日程
    const visitorSchedules = visitorCalendarSchedules[dateStr] || [];
  visitorSchedules.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'calendar-schedule-item visitor';
    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <span><strong>[访客留言]</strong> ${item.text}</span>
            <span onclick="deleteCalendarSchedule('${dateStr}', ${index})" style="color:#e03e3e; cursor:pointer; font-size:16px; font-weight:bold; padding-left:10px;">×</span>
        </div>
    `;
    listEl.appendChild(div);
});

    if (presets.length === 0 && visitorSchedules.length === 0) {
        listEl.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; text-align: center; margin-top: 10px;">今日无特殊安排。</div>';
    }

    drawer.classList.add('active');
    renderCalendar(); // 刷新以高亮选中的日期
}

function closeCalendarDrawer() {
    const drawer = document.getElementById('calendarDrawer');
    if (drawer) drawer.classList.remove('active');
}

function addCalendarSchedule() {
    const input = document.getElementById('calendarInput');
    if (!input || !selectedDateStr) return;
    const text = input.value.trim();
    if (!text) return;

    if (!visitorCalendarSchedules[selectedDateStr]) {
        visitorCalendarSchedules[selectedDateStr] = [];
    }
    visitorCalendarSchedules[selectedDateStr].push({ text: text });

    input.value = '';
    // 重新打开抽屉以刷新列表
    const day = parseInt(selectedDateStr.split('-')[2]);
    openCalendarDrawer(selectedDateStr, day);
saveGameState();
}

function handleCalendarKeyPress(e) {
    if (e.key === 'Enter') {
        addCalendarSchedule();
    }
}

function deleteCalendarSchedule(dateStr, index) {
    if (visitorCalendarSchedules[dateStr] && index >= 0 && index < visitorCalendarSchedules[dateStr].length) {
        visitorCalendarSchedules[dateStr].splice(index, 1);
        // 如果该日期下没有日程了，把这个日期的空数组删掉，保持数据干净
        if (visitorCalendarSchedules[dateStr].length === 0) {
            delete visitorCalendarSchedules[dateStr];
        }
        saveGameState(); // 本地存档
        renderCalendar(); // 刷新格子上的小金点
        
        // 重新加载当前打开的抽屉，以便立即看到删除结果
        const day = parseInt(dateStr.split('-')[2]);
        openCalendarDrawer(dateStr, day);
    }
}

function continueTacticalGame() {
    const overlay = document.getElementById('tacticalResultOverlay');
    if (overlay) overlay.classList.remove('active');
    // 游戏继续运行，不重置任何状态
}

/* ================= 22. 数据吞噬（贪吃蛇）逻辑 ================= */
let snakeCanvas = null;
let snakeCtx = null;
const SNAKE_GRID_SIZE = 15;
const SNAKE_CELL_SIZE = 300 / SNAKE_GRID_SIZE;

let snakeBody = [];
let snakeDirection = 'right';
let snakeNextDirection = 'right';
let snakeFood = { x: 0, y: 0 };
let snakeScore = 0;
let snakeHighScore = 0;
let snakeGameOver = true; 
let snakeSpeed = 200;
let snakeTimer = null;
let snakeFoodsEaten = 0;

// 打开游戏
function openSnakeGame() {
    if (typeof closeAllOverlays === 'function') closeAllOverlays();
    const overlay = document.getElementById('snakeOverlay');
    const modalOverlay = document.getElementById('snakeModalOverlay');
    const phoneMockup = document.querySelector('.phone-mockup');
    
    // 核心修复：强行把游戏和结算弹窗挂到最外层，防止被遮挡
    if (phoneMockup) {
        if (overlay && overlay.parentNode !== phoneMockup) phoneMockup.appendChild(overlay);
        if (modalOverlay && modalOverlay.parentNode !== phoneMockup) phoneMockup.appendChild(modalOverlay);
    }

    if (!overlay) return;
    snakeCanvas = document.getElementById('snakeCanvas');
    if (snakeCanvas) {
        snakeCtx = snakeCanvas.getContext('2d');
    }
    overlay.classList.add('active');
    resetSnakeGame();
}
// 关闭游戏（彻底清理现场）
function closeSnakeGame() {
    const overlay = document.getElementById('snakeOverlay');
    if (overlay) overlay.classList.remove('active');
    
    if (snakeTimer) {
        clearTimeout(snakeTimer);
        snakeTimer = null;
    }
    snakeGameOver = true;
    
    // 彻底关闭弹窗（移除active类即可，交给CSS控制隐藏）
    const modal = document.getElementById('snakeModalOverlay');
    if (modal) modal.classList.remove('active');
}

// 重置游戏（防止秒死，防止弹窗残留）
function resetSnakeGame() {
    // 1. 强行清空计时器，彻底断掉之前的循环
    if (snakeTimer) {
        clearTimeout(snakeTimer);
        snakeTimer = null;
    }

  // 2. 彻底隐藏结算弹窗
const modal = document.getElementById('snakeModalOverlay');
if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none'; // 👈 核心修复：强制抹除内联的 flex
}

    // 3. 重置数据
    snakeBody = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
    snakeDirection = 'right';
    snakeNextDirection = 'right';
    snakeScore = 0;
    snakeSpeed = 200;
    snakeFoodsEaten = 0;
    
    // 4. 刷新UI分数
    const scoreEl = document.getElementById('snakeScore');
    if (scoreEl) scoreEl.textContent = '0';
    const highScoreEl = document.getElementById('snakeHighScore');
    if (highScoreEl) highScoreEl.textContent = snakeHighScore;
    
    generateSnakeFood();
    drawSnake();

    // 5. 解锁状态，稍微延迟一点再启动，防止闪屏秒死
    snakeGameOver = false;
    setTimeout(() => {
        snakeTimer = setTimeout(snakeGameLoop, snakeSpeed);
    }, 150);
}

// 生成食物
function generateSnakeFood() {
    let newFood;
    let isOccupied = true;
    while (isOccupied) {
        newFood = {
            x: Math.floor(Math.random() * SNAKE_GRID_SIZE),
            y: Math.floor(Math.random() * SNAKE_GRID_SIZE)
        };
        isOccupied = snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    snakeFood = newFood;
}

// 游戏主循环
function snakeGameLoop() {
    // 关键：如果游戏已结束，立刻停手，绝不往下走一步
    if (snakeGameOver) return;
    
    snakeDirection = snakeNextDirection;
    const head = { ...snakeBody[0] };

    if (snakeDirection === 'right') head.x += 1;
    else if (snakeDirection === 'left') head.x -= 1;
    else if (snakeDirection === 'up') head.y -= 1;
    else if (snakeDirection === 'down') head.y += 1;

    // 检查撞墙
    if (head.x < 0 || head.x >= SNAKE_GRID_SIZE || head.y < 0 || head.y >= SNAKE_GRID_SIZE) {
        snakeGameOver = true;
        showSnakeResult();
        return;
    }

    // 检查撞自己
    const willEatFood = (head.x === snakeFood.x && head.y === snakeFood.y);
    const bodyToCheck = willEatFood ? snakeBody : snakeBody.slice(0, -1);
    if (bodyToCheck.some(segment => segment.x === head.x && segment.y === head.y)) {
        snakeGameOver = true;
        showSnakeResult();
        return;
    }

    snakeBody.unshift(head);

    if (willEatFood) {
        snakeScore += 10;
        snakeFoodsEaten++;
        const scoreEl = document.getElementById('snakeScore');
        if (scoreEl) scoreEl.textContent = snakeScore;
        
        if (snakeFoodsEaten % 3 === 0) {
            snakeSpeed = Math.max(80, snakeSpeed - 15);
        }
        generateSnakeFood();
    } else {
        snakeBody.pop();
    }

    drawSnake();
    snakeTimer = setTimeout(snakeGameLoop, snakeSpeed);
}

// 绘制画布
function drawSnake() {
    if (!snakeCtx) return;
    snakeCtx.fillStyle = '#060608';
    snakeCtx.fillRect(0, 0, 300, 300);

    snakeCtx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
    snakeCtx.lineWidth = 1;
    for (let i = 0; i <= SNAKE_GRID_SIZE; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i * SNAKE_CELL_SIZE, 0);
        snakeCtx.lineTo(i * SNAKE_CELL_SIZE, 300);
        snakeCtx.stroke();
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i * SNAKE_CELL_SIZE);
        snakeCtx.lineTo(300, i * SNAKE_CELL_SIZE);
        snakeCtx.stroke();
    }

    snakeCtx.fillStyle = '#e03e3e';
    snakeCtx.shadowColor = '#e03e3e';
    snakeCtx.shadowBlur = 10;
    snakeCtx.fillRect(snakeFood.x * SNAKE_CELL_SIZE + 2, snakeFood.y * SNAKE_CELL_SIZE + 2, SNAKE_CELL_SIZE - 4, SNAKE_CELL_SIZE - 4);
    snakeCtx.shadowBlur = 0;

    snakeBody.forEach((segment, index) => {
        if (index === 0) {
            snakeCtx.fillStyle = '#ffd700';
            snakeCtx.shadowColor = '#ffd700';
            snakeCtx.shadowBlur = 15;
        } else {
            snakeCtx.fillStyle = 'rgba(212, 175, 55, 0.7)';
            snakeCtx.shadowColor = 'transparent';
            snakeCtx.shadowBlur = 0;
        }
        snakeCtx.fillRect(segment.x * SNAKE_CELL_SIZE + 1, segment.y * SNAKE_CELL_SIZE + 1, SNAKE_CELL_SIZE - 2, SNAKE_CELL_SIZE - 2);
    });
    snakeCtx.shadowBlur = 0;
}

// 改变方向
function snakeChangeDirection(dir) {
    if (snakeGameOver) return;

    if (dir === 'up'    && snakeNextDirection !== 'down')  snakeNextDirection = 'up';
    else if (dir === 'down'  && snakeNextDirection !== 'up')    snakeNextDirection = 'down';
    else if (dir === 'left'  && snakeNextDirection !== 'right') snakeNextDirection = 'left';
    else if (dir === 'right' && snakeNextDirection !== 'left')  snakeNextDirection = 'right';
}

// 结算弹窗显示（只负责弹出来）
function showSnakeResult() {
    if (snakeTimer) {
        clearTimeout(snakeTimer);
        snakeTimer = null;
    }
    
    if (snakeScore > snakeHighScore) {
        snakeHighScore = snakeScore;
        const highScoreEl = document.getElementById('snakeHighScore');
        if (highScoreEl) highScoreEl.textContent = snakeHighScore;
    }

// 👇 新增：贪吃蛇结算奖励
if (snakeScore >= 200) {
    dispatchFunds += 200000;
    if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
    if (typeof saveGameState === 'function') saveGameState();
    if (typeof triggerGravesAltMessage === 'function') {
        triggerGravesAltMessage(`数据吞噬得分 ${snakeScore}。干得不错，Darlin'。$200,000 奖励已经打入你的黑色行动资金。`);
    }
}
    
    const finalScoreEl = document.getElementById('snakeFinalScore');
    const commentEl = document.getElementById('snakeComment');
    const modal = document.getElementById('snakeModalOverlay');
    
    if (!finalScoreEl || !commentEl || !modal) {
        console.error('蛇结算弹窗元素缺失!', {finalScoreEl, commentEl, modal});
        alert('游戏结束！得分：' + snakeScore); 
        return;
    }

    // 👇👇👇 核心修复：暴力脱离父容器，使用固定定位，彻底避开层叠上下文限制
    if (modal.parentNode !== document.body) {
        document.body.appendChild(modal); // 把它从 .phone-mockup 里强行拽出来，挂到 body 上
    }
    
    // 用内联样式强制覆盖 CSS，不使用 !important
    modal.style.position = 'fixed'; // 改为 fixed，相对于视口定位，不受 flex 布局影响
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.zIndex = '2147483647'; // 32位有符号整数的最大值，浏览器认这个极限值
    modal.style.display = 'flex'; // 强行覆盖 display: none

    finalScoreEl.textContent = snakeScore;
    let comment = '';
    if (snakeScore <= 50) {
        comment = '就这点数据量？连给暗影终端塞牙缝都不够。重来。';
    } else if (snakeScore <= 150) {
        comment = '勉强及格。看来你的脑子还没有被酒精泡坏。继续。';
    } else if (snakeScore <= 300) {
        comment = '干得漂亮。这数据吞吐量比我上次处理那帮不听话的军火商时还快。';
    } else {
        comment = '难以置信，你居然能吞噬这么多数据。看来得给你多分配点终端权限了。别高兴太早。';
    }
    commentEl.textContent = comment;
    
    modal.classList.add('active');
    saveGameState();
}

// 关闭结算弹窗（点“退出系统”时触发）
function closeSnakeModal() {
    const modal = document.getElementById('snakeModalOverlay');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none'; // 彻底隐藏
    }
    closeSnakeGame();
}
// 键盘控制
document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('snakeOverlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    if (snakeGameOver) return;

    let handled = true;
    switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': snakeChangeDirection('up'); break;
        case 'ArrowDown': case 's': case 'S': snakeChangeDirection('down'); break;
        case 'ArrowLeft': case 'a': case 'A': snakeChangeDirection('left'); break;
        case 'ArrowRight': case 'd': case 'D': snakeChangeDirection('right'); break;
        default: handled = false;
    }
    if (handled) e.preventDefault();
});
/* ================= 23. 全球特工派遣逻辑 ================= */
// 独立资金（初始资金 50 万，独立于总资产）
let dispatchFunds = 500000;
let currentAgentTab = 'squad';
let selectedAgentId = null;
let activeDispatches = []; // 当前进行中的任务
let currentMissions = []; // 当前显示的突发事件

// 预设小队
const squadsData = [
    { id: 's1', name: '阿尔法小队', base: '德克萨斯总部', desc: '擅长突击与火力压制', status: 'ready' },
    { id: 's2', name: '贝塔小队', base: '欧洲基地', desc: '擅长情报侦察与电子战', status: 'ready' },
    { id: 's3', name: '德尔塔小队', base: '中东基地', desc: '擅长沙漠战与长途奔袭', status: 'ready' }
];

// 预设特工
const fixedAgentsData = [
    { id: 'a1', name: '代号：猎鹰', base: '德克萨斯总部', desc: '狙击手，远程精准打击', status: 'ready' },
    { id: 'a2', name: '代号：毒蛇', base: '中东基地', desc: '渗透专家，擅长无声潜入', status: 'ready' },
    { id: 'a3', name: '代号：铁锤', base: '乌克兰前线基地', desc: '爆破专家，重火力攻坚', status: 'ready' },
    { id: 'a4', name: '代号：鹰眼', base: '加勒比安全屋', desc: '战术指挥，小队协同作战', status: 'ready' }
];

// 突发事件池（20 个）
const missionPool = [
    { id: 'm1', title: '中东基地外围遇袭', lat: 25.27, lng: 51.21 },
    { id: 'm2', title: '东欧物流线被拦截', lat: 48.37, lng: 31.16 },
    { id: 'm3', title: '加勒比海域不明船只徘徊', lat: 18.25, lng: -77.51 },
    { id: 'm4', title: '东南亚雨林据点失联', lat: 19.61, lng: 37.21 },
    { id: 'm5', title: '德克萨斯边境走私活动', lat: 29.76, lng: -95.36 },
    { id: 'm6', title: '欧洲能源管道遭破坏', lat: 48.85, lng: 2.35 },
    { id: 'm7', title: '南美矿区武装冲突', lat: -12.04, lng: -77.02 },
    { id: 'm8', title: '北极圈科考站求救', lat: 78.22, lng: 15.63 },
    { id: 'm9', title: '北非港口货物失踪', lat: 36.75, lng: 3.05 },
    { id: 'm10', title: '中亚边境信号干扰', lat: 42.87, lng: 74.59 },
    { id: 'm11', title: '西非油田遭遇劫持', lat: 4.81, lng: 7.04 },
    { id: 'm12', title: '南太平洋海盗活动', lat: -18.14, lng: 178.44 },
    { id: 'm13', title: '东非难民营暴动', lat: -1.29, lng: 36.82 },
    { id: 'm14', title: '波罗的海潜艇踪迹', lat: 55.67, lng: 12.56 },
    { id: 'm15', title: '北美电网黑客攻击', lat: 38.90, lng: -77.03 },
    { id: 'm16', title: '南亚港口毒品走私', lat: 6.92, lng: 79.86 },
    { id: 'm17', title: '中东油田设施火灾', lat: 29.37, lng: 47.98 },
    { id: 'm18', title: '东欧军火库失窃', lat: 50.45, lng: 30.52 },
    { id: 'm19', title: '南美边境毒枭火拼', lat: -22.90, lng: -43.17 },
    { id: 'm20', title: '北非考古队失联', lat: 30.04, lng: 31.23 }
];

function checkPendingResults() {
    if (pendingResults.length > 0) {
        showNextMissionResult();
    }
}

function showNextMissionResult() {
    if (pendingResults.length === 0) return;
    const data = pendingResults[0];
    
    document.getElementById('mrTitle').textContent = data.title;
    document.getElementById('mrTitle').style.color = data.isSuccess ? '#2ecc71' : '#e03e3e';
    document.getElementById('mrDesc').textContent = data.desc;
    document.getElementById('mrCode').textContent = data.code;
    document.getElementById('mrAgent').textContent = data.agent;
    
    const fundEl = document.getElementById('mrFunds');
    fundEl.textContent = data.fundChangeText;
    fundEl.style.color = data.fundChangeColor;
    
    const modal = document.getElementById('missionResultModal');
    if (modal) modal.classList.add('active');
}

// --- 界面打开与关闭 ---
function openDispatch() {
    closeDroneView(); 
    checkAgentRecovery();
    
    // ⚡ 核心修复：打开前先清一次旧动画，防止重复叠加
    if (earthAnimationId) { 
        cancelAnimationFrame(earthAnimationId); 
        earthAnimationId = null; 
    }
    
    const overlay = document.getElementById('dispatchOverlay');
    if (overlay) overlay.classList.add('active');    
    renderDispatchFunds();
    initEarth();
    spawnMissions();
    renderMissions();
    switchAgentTab('squad', document.querySelector('.agent-tab'));
    
    checkPendingResults();
}
function closeDispatch() {
    const overlay = document.getElementById('dispatchOverlay');
    if (overlay) overlay.classList.remove('active');
    
    // ⚡ 核心修复：关闭界面时，立刻停止地球动画，清空画面
    if (earthAnimationId) { 
        cancelAnimationFrame(earthAnimationId); 
        earthAnimationId = null; 
    }
}
// --- 资金面板 ---
function renderDispatchFunds() {
    const fundsEl = document.getElementById('dispatchFunds');
    if (fundsEl) fundsEl.textContent = '$ ' + dispatchFunds.toLocaleString('en-US');
}

// --- 突发事件刷新机制 ---
function spawnMissions() {
    // 如果当前有三个任务，不刷新
    if (currentMissions.length >= 3) return;

    // 过滤掉已经在当前面板里的任务
    const available = missionPool.filter(p => !currentMissions.some(c => c.id === p.id));
    
    // 随机抽取补足到3个
    while (currentMissions.length < 3 && available.length > 0) {
        const idx = Math.floor(Math.random() * available.length);
        currentMissions.push({ ...available[idx], status: 'ready', timer: null });
        available.splice(idx, 1);
    }
}

function renderMissions() {
    const listEl = document.getElementById('dispatchMissionList');
    if (!listEl) return;
    listEl.innerHTML = '';
    
    currentMissions.forEach(m => {
        const card = document.createElement('div');
        card.className = 'dispatch-mission-card';
        
        let statusText = '待处理';
        let statusClass = 'ready';
        let timerText = '';

        if (m.status === 'busy') {
            statusText = '进行中';
            statusClass = 'busy';
            // 计算剩余时间
            const remaining = Math.max(0, Math.floor((m.endTime - Date.now()) / 1000));
            const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
            const secs = String(remaining % 60).padStart(2, '0');
            timerText = `${mins}:${secs}`;
        } else if (m.status === 'done') {
            statusText = '已完成';
            statusClass = 'done';
        }

        card.innerHTML = `
            <div class="dm-info">
                <div class="dm-title">${m.title}</div>
                <div class="dm-coords">LAT ${m.lat.toFixed(2)} / LNG ${m.lng.toFixed(2)}</div>
            </div>
            <div style="text-align:right; display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
                <div class="dm-status ${statusClass}">${statusText}</div>
                ${timerText ? `<div class="dm-timer">${timerText}</div>` : ''}
            </div>
        `;
        listEl.appendChild(card);
    });
}

// 全局倒计时检查器（每秒执行一次）
setInterval(() => {
    let needsUpdate = false;
    activeDispatches.forEach(disp => {
        if (disp.status === 'busy' && Date.now() >= disp.endTime) {
            resolveDispatch(disp);
            needsUpdate = true;
        }
    });
    if (needsUpdate) {
        renderMissions();
        renderDispatchAgents();
    }
}, 1000);

// --- 特工选择栏 ---
function switchAgentTab(tab, element) {
    currentAgentTab = tab;
    document.querySelectorAll('.agent-tab').forEach(t => t.classList.remove('active'));
    if (element) element.classList.add('active');
    renderDispatchAgents();
}

function renderDispatchAgents() {
    const listEl = document.getElementById('dispatchAgentList');
    if (!listEl) return;
    listEl.innerHTML = '';
    
    let data = [];
    if (currentAgentTab === 'squad') data = squadsData;
    else if (currentAgentTab === 'fixed') data = fixedAgentsData;
    else if (currentAgentTab === 'custom') {
        // 自定义特工通过输入框创建，这里暂时没有列表
        listEl.innerHTML = '<div style="text-align:center; color:var(--text-muted); font-size:12px; padding:10px;">点击下方按钮创建自定义特工</div><button class="modal-btn" onclick="createCustomAgent()" style="width:100%; margin-top:10px;">+ 创建自定义特工</button>';
        return;
    }

    data.forEach(agent => {
// 再次检查健康状态
if (agent.health !== 'ready' && agent.restUntil > 0 && Date.now() > agent.restUntil) {
    agent.health = 'ready'; agent.restUntil = 0;
}
        const card = document.createElement('div');

        card.className = 'dispatch-agent-card';
        // 检查该特工是否在任务中
        const isBusy = activeDispatches.some(d => d.agentId === agent.id && d.status === 'busy');
        
        card.innerHTML = `
            <div class="da-info">
                <div class="da-name">${agent.name}</div>
                <div class="da-detail">${agent.base} · ${agent.desc}</div>
            </div>
            <div class="da-status ${isBusy ? 'busy' : 'ready'}">${isBusy ? '任务中' : '待命'}</div>
        `;
        if (!isBusy) {
            card.onclick = () => selectAgent(agent.id, agent.name);
        }
        listEl.appendChild(card);
    });
}

// 创建自定义特工
function createCustomAgent() {
    const name = prompt('请输入自定义特工的代号：');
    if (!name || !name.trim()) return;
    const customAgent = { id: 'c_' + Date.now(), name: '代号：' + name.trim(), base: '临时招募', desc: '自定义特工', status: 'ready' };
    fixedAgentsData.push(customAgent); // 临时加入列表
    renderDispatchAgents();
}

// --- 派遣操作 ---
function selectAgent(agentId, agentName) {
    selectedAgentId = agentId;
    document.getElementById('dispatchLatInput').value = '';
    document.getElementById('dispatchLngInput').value = '';
    const modal = document.getElementById('dispatchCoordModal');
    if (modal) modal.classList.add('active');
}

function closeCoordModal() {
    const modal = document.getElementById('dispatchCoordModal');
    if (modal) modal.classList.remove('active');
}

// 替换原来的 confirmDispatch 函数
function confirmDispatch() {
    if (!selectedAgentId) return;
    const latInput = document.getElementById('dispatchLatInput');
    const lngInput = document.getElementById('dispatchLngInput');
    const lat = parseFloat(latInput.value);
    const lng = parseFloat(lngInput.value);

    if (isNaN(lat) || isNaN(lng)) { alert('请输入有效的经纬度数字。'); return; }

    const latFixed = parseFloat(lat.toFixed(2));
    const lngFixed = parseFloat(lng.toFixed(2));

    const matchedMission = currentMissions.find(m => m.lat === latFixed && m.lng === lngFixed && m.status === 'ready');
    if (!matchedMission) { alert('该坐标没有待处理的突发事件。请检查坐标是否与任务列表完全一致。'); return; }

    // 记录当前派遣信息
    currentDispatchAgent = [...squadsData, ...fixedAgentsData].find(a => a.id === selectedAgentId);
    currentDispatchMission = matchedMission;

    // 检查特工状态
    if (currentDispatchAgent.health === 'critical' || Date.now() < currentDispatchAgent.restUntil) {
        alert('该特工正在医疗休养中，无法执行任务。');
        closeCoordModal();
        return;
    }

    // 核心修改：不直接发车，而是先让玩家选择战术路线，打开部署弹窗
    closeCoordModal();
    const deployModal = document.getElementById('deployModal');
    if (deployModal) deployModal.classList.add('active');
}

// 真正开始派遣（由部署弹窗的“确认出击”按钮触发）
function startDispatch() {
    const deployModal = document.getElementById('deployModal');
    if (deployModal) deployModal.classList.remove('active');

    const mission = currentDispatchMission;
    mission.status = 'busy';
    mission.deployRoute = currentDeployRoute;
    mission.endTime = Date.now() + 10 * 60 * 1000; // 10 分钟

    // 记录派遣（你截图里的逻辑）
    activeDispatches.push({
        agentId: selectedAgentId,
        missionId: mission.id,
        status: 'busy',
        endTime: mission.endTime,
        deployRoute: currentDeployRoute,
        crisisResolved: false
    });

    // 关闭弹窗并刷新界面
    closeCoordModal();
    renderMissions();
    renderDispatchAgents();
saveGameState();

    // 核心修复：派遣时关闭自动旋转，让地球聚焦过去
    earthAutoRotate = false;
    rotateEarthToCoord(mission.lat, mission.lng);

    // 5秒后恢复缓慢自转
    setTimeout(() => {
        earthAutoRotate = true;
        if (!earthAnimationId) {
            earthAnimationId = requestAnimationFrame(drawEarth);
        }
    }, 5000);

    // 小号消息反馈
    triggerGravesAltMessage(`Darlin'，我看到你派了特工出去。路线：${currentDeployRoute === 'stealth' ? '幽灵潜入' : currentDeployRoute === 'assault' ? '碾压突击' : '钞能力外交'}。我等你的下一步指令。`);
    addCommLog(`特工已离开基地，路线：${currentDeployRoute === 'stealth' ? '幽灵潜入' : currentDeployRoute === 'assault' ? '碾压突击' : '钞能力外交'}。`, 'normal');
    // 核心：15秒后触发危机判定（70%概率）
    setTimeout(() => {
        const dispatchRecord = activeDispatches.find(d => d.missionId === mission.id && d.status === 'busy');
        if (dispatchRecord && !dispatchRecord.crisisResolved && Math.random() < 0.7) {
            triggerCrisis(dispatchRecord, mission);
        }
    }, 180000);
}

// ---- 全局变量 ----
let currentDeployRoute = 'stealth';
let currentDispatchAgent = null;
let currentDispatchMission = null;

// 选择战术路线
function selectDeployRoute(route, element) {
    currentDeployRoute = route;
    document.querySelectorAll('.deploy-option').forEach(el => el.classList.remove('selected'));
    if (element) element.classList.add('selected');
}

// 危机剧本库
const crisisScripts = [
    {
        region: 'middleeast',
        msg: "Boss，前方有武装设卡，目测五十人，带有重机枪皮卡。我们的车队过不去，请求指示。",
        options: [
            { id: 'fight', text: '正面强攻，打穿防线', cost: '极高概率特工负伤' },
            { id: 'drone', text: '呼叫MQ-9无人机定点清除', cost: '消耗 $500,000 行动资金' },
            { id: 'retreat', text: '弃车保帅，撤离任务区', cost: '任务失败，损失定金' }
        ]
    },
    {
        region: 'ukraine',
        msg: "我们在废墟里被狙击手压制了。车辆触雷，退路切断。物资不能丢，但兄弟快撑不住了。",
        options: [
            { id: 'ac130', text: '呼叫AC-130空中炮艇清场', cost: '引发地缘政治风险' },
            { id: 'hold', text: '原地固守，释放烟雾弹等救援', cost: '极高概率特工重伤' },
            { id: 'drop', text: '抛弃重型装备，轻装突围', cost: '收益打对折' }
        ]
    },
    {
        region: 'caribbean',
        msg: "老板，三艘快艇全速朝我们冲过来，带有单兵火箭筒。大概率是冲着你那座岛来的。",
        options: [
            { id: 'fire', text: '海面正面交火，击沉他们', cost: '可能会引来海警调查' },
            { id: 'mine', text: '诱导船只进入雷区', cost: '消耗防御系统库存' },
            { id: 'hide', text: '关闭灯光，启动干扰，躲入掩体', cost: '任务被动取消，损失极小' }
        ]
    }
];

// 触发危机
function triggerCrisis(dispatchRecord, mission) {
   let script;
if (mission.title.includes('中东') || mission.title.includes('北非')) script = crisisScripts['middleeast'];
else if (mission.title.includes('东欧') || mission.title.includes('欧洲')) script = crisisScripts['ukraine'];
else if (mission.title.includes('加勒比') || mission.title.includes('南美')) script = crisisScripts['caribbean'];
else script = crisisScripts['middleeast']; // 默认中东剧本
    if (!script) script = crisisScripts[Math.floor(Math.random() * crisisScripts.length)];

    mission.status = 'crisis'; // 改变状态，让地球变红
    renderMissions();
    renderDispatchAgents();

    const msgEl = document.getElementById('crisisMsg');
    const optionsEl = document.getElementById('crisisOptions');
    if (!msgEl || !optionsEl) return;

    msgEl.textContent = script.msg;
    optionsEl.innerHTML = '';

    script.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'crisis-btn';
        btn.innerHTML = `${opt.text}<span class="cost">代价：${opt.cost}</span>`;
        btn.onclick = () => handleCrisisChoice(dispatchRecord, mission, opt.id);
        optionsEl.appendChild(btn);
    });

    const modal = document.getElementById('crisisModal');
    if (modal) modal.classList.add('active');
addCommLog(`⚠️ 紧急：特工 ${dispatchRecord.agentId} 遭遇火力压制，等待指挥部指令！`, 'alert');
}

// 处理危机选择
function handleCrisisChoice(dispatchRecord, mission, choiceId) {
    const modal = document.getElementById('crisisModal');
    if (modal) modal.classList.remove('active');

    mission.status = 'busy'; // 恢复进行中
    dispatchRecord.crisisResolved = true;
    dispatchRecord.crisisChoice = choiceId;

    if (choiceId === 'drone' || choiceId === 'ac130') {
        if (dispatchFunds >= 500000) {
            dispatchFunds -= 500000;
            addTradingLog('紧急呼叫空中支援，扣除 $500,000 行动资金。');
        } else {
            triggerGravesAltMessage("Darlin'，行动资金见底了。这次算我的，算你欠我个人情。");
        }
    }

    renderDispatchFunds();
    renderMissions();
    renderDispatchAgents();
    saveGameState();
    triggerGravesAltMessage(`你的指令已传达。特工正在执行，祝他们好运。`);
}

// --- 任务结算 ---
// 替换 resolveDispatch
function resolveDispatch(disp) {
    disp.status = 'done';
    const mission = currentMissions.find(m => m.id === disp.missionId);
    if (!mission) return;
    mission.status = 'done';

    const agent = [...squadsData, ...fixedAgentsData].find(a => a.id === disp.agentId);
    if (!agent) return;

    let isSuccess = true;
    let isWounded = false;
    let isCritical = false;
    let resultTitle = '';
    let resultDesc = '';
    let fundChangeText = '';
    let fundChangeColor = '';

    let successRate = 0.7;
    if (disp.deployRoute === 'assault') successRate += 0.2;
    if (disp.deployRoute === 'stealth') successRate -= 0.1;
    if (disp.deployRoute === 'diplomacy') successRate += 0.1;

    if (disp.crisisChoice === 'fight' || disp.crisisChoice === 'hold') {
        successRate += 0.15; isWounded = true; 
    }
    if (disp.crisisChoice === 'retreat' || disp.crisisChoice === 'hide' || disp.crisisChoice === 'drop') {
        successRate -= 0.3; isWounded = false;
    }
    if (disp.crisisChoice === 'drone' || disp.crisisChoice === 'ac130' || disp.crisisChoice === 'mine') {
        successRate = 1.0; isWounded = false;
    }

    if (agent.health === 'wounded') {
        successRate -= 0.3;
        if (isWounded) isCritical = true;
    }

    if (Math.random() > successRate) isSuccess = false;

    if (isSuccess && !isCritical && !isWounded) {
        resultTitle = '完美行动 · PERFECT';
        resultDesc = '目标已清除，特工毫发无损。佣金已全额到账。';
        const reward = Math.floor(Math.random() * 50000) + 20000;
        dispatchFunds += reward;
        fundChangeText = `+ $${reward.toLocaleString('en-US')}`;
        fundChangeColor = '#2ecc71';
    } else if (isSuccess && (isWounded || isCritical)) {
        resultTitle = '惨胜 · PYRRHIC VICTORY';
        resultDesc = isCritical ? '任务完成，但特工重伤，已紧急送往医疗中心。' : '任务完成，但特工负伤。';
        const reward = Math.floor(Math.random() * 50000) + 20000;
        dispatchFunds += reward;
        fundChangeText = `+ $${reward.toLocaleString('en-US')}`;
        fundChangeColor = '#2ecc71';
        
        if (isCritical) {
            agent.health = 'critical'; agent.restUntil = Date.now() + 15 * 60 * 1000;
            addMedicalReport(agent.name, 'critical');
        } else {
            agent.health = 'wounded'; agent.restUntil = Date.now() + 5 * 60 * 1000;
        }
    } else {
        resultTitle = '战术撤退 · RETREAT';
        resultDesc = '行动失败，特工已安全撤离。损失了部分行动资金和定金。';
        const loss = Math.floor(Math.random() * 30000) + 10000;
        dispatchFunds = Math.max(0, dispatchFunds - loss);
        fundChangeText = `- $${loss.toLocaleString('en-US')}`;
        fundChangeColor = '#e03e3e';
        if (disp.crisisChoice === 'fight' || disp.crisisChoice === 'hold') {
            agent.health = 'wounded'; agent.restUntil = Date.now() + 5 * 60 * 1000;
            resultDesc += ' 特工在撤离时负伤。';
        }
    }

    pendingResults.push({
        isSuccess: isSuccess && !isCritical,
        title: resultTitle, desc: resultDesc,
        code: mission.id.toUpperCase() + ' - ' + mission.title,
        agent: agent.name, fundChangeText, fundChangeColor
    });

    currentMissions = currentMissions.filter(m => m.id !== mission.id);
    activeDispatches = activeDispatches.filter(d => d.missionId !== disp.missionId);
    
    spawnMissions(); renderDispatchFunds(); renderMissions(); renderDispatchAgents(); saveGameState();
  addCommLog(isSuccess ? `任务 ${mission.id.toUpperCase()} 顺利完成，特工安全撤离。` : `任务 ${mission.id.toUpperCase()} 撤退，特工正在返航。`, isSuccess ? 'success' : 'alert');
 // 根据任务结果，让小号发声
triggerGravesAltMessage(isSuccess ? "Darlin'，我看到特工安全撤离了。干得不错，钱马上汇入你的私人账户。" : "听我说，撤退不是失败。只要人没事，我们就还有下一次机会。");
showNextMissionResult();
}

// 医疗系统联动
function addMedicalReport(agentName, severity) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    const newReport = {
        date: dateStr,
        status: severity === 'critical' ? '战地重伤，需住院治疗' : '战地轻伤，需短暂休养',
        details: severity === 'critical' ? '多发枪伤/爆炸伤，已进行紧急清创手术。生命体征平稳，但需绝对卧床休息。' : '局部弹片擦伤，已消毒包扎。无大碍。',
        advice: severity === 'critical' ? '医生建议：强制休养15分钟，期间严禁派遣任务。' : '医生建议：休养5分钟，或带伤执行低风险任务。',
        note: `格瑞夫斯批注："把最好的医生调过去。休息期间工资照发，让他别乱动。"`
    };
    medicalReportsData.unshift(newReport);
    if (medicalReportsData.length > 5) medicalReportsData.pop();
    
    // 核心修复：如果医疗界面当前是打开状态，立刻刷新它！
    if (typeof renderReports === 'function') renderReports();
}// --- 简易 3D 地球绘制 ---
let earthRotation = { x: 0, y: 0 };
let earthAutoRotate = true;
let lastDotX = -1, lastDotY = -1, lastDotVisible = false;
let lastDotMissionId = null;
let visibleDots = []; 
let pendingResults = []; 
// 存放未查看的行动结算
// 存储当前可见的所有呼吸灯坐标和对应的任务ID
let earthCanvas = null;
let earthCtx = null;
let targetRotation = { x: 0, y: 0 };
let earthAnimationId = null;

function initEarth() {
    earthCanvas = document.getElementById('earthCanvas');
    if (earthCanvas) {
        earthCtx = earthCanvas.getContext('2d');
        // 改为 onclick 覆盖赋值，防止重复绑定
        earthCanvas.onclick = function(e) {
            if (visibleDots.length === 0) return;
            const rect = earthCanvas.getBoundingClientRect();
            const clickX = (e.clientX - rect.left) * (earthCanvas.width / rect.width);
            const clickY = (e.clientY - rect.top) * (earthCanvas.height / rect.height);
            for (let dot of visibleDots) {
                if (Math.sqrt(Math.pow(clickX - dot.x, 2) + Math.pow(clickY - dot.y, 2)) < 30) {
                    openMissionDetail(dot.id); return;
                }
            }
        };
    }
    if (!earthCtx) return;
    targetRotation = { x: 0, y: 0 }; earthRotation = { x: 0, y: 0 };
    // 取消旧动画，防止速度叠加
    if (earthAnimationId) { cancelAnimationFrame(earthAnimationId); earthAnimationId = null; }
    drawEarth();
}

function drawEarth() {
    if (!earthCtx || !earthCanvas) return;
    
    // ⚡ 核心修复：如果派遣界面已经关了，立刻停止动画，不再空转
    const dispatchEl = document.getElementById('dispatchOverlay');
    if (!dispatchEl || !dispatchEl.classList.contains('active')) {
        if (earthAnimationId) { cancelAnimationFrame(earthAnimationId); earthAnimationId = null; }
        return;
    }    
    const width = 320;
    const height = 320;
    const cx = 160;
    const cy = 160;
    const r = 130;
    const compassR = 148;

    earthCtx.clearRect(0, 0, width, height);

    // 1. 边缘光
    const glowGradient = earthCtx.createRadialGradient(cx, cy, r - 5, cx, cy, compassR);
    glowGradient.addColorStop(0, 'rgba(212, 175, 55, 0.6)');
    glowGradient.addColorStop(0.3, 'rgba(212, 175, 55, 0.2)');
    glowGradient.addColorStop(0.6, 'rgba(0, 229, 255, 0.08)');
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    earthCtx.beginPath();
    earthCtx.arc(cx, cy, compassR, 0, Math.PI * 2);
    earthCtx.fillStyle = glowGradient;
    earthCtx.fill();

    // 2. 地球背景
    const bgGradient = earthCtx.createRadialGradient(cx - 40, cy - 40, 20, cx, cy, r);
    bgGradient.addColorStop(0, '#1a1a22');
    bgGradient.addColorStop(1, '#050508');
    earthCtx.beginPath();
    earthCtx.arc(cx, cy, r, 0, Math.PI * 2);
    earthCtx.fillStyle = bgGradient;
    earthCtx.fill();

    // 3. 地球边缘
    earthCtx.beginPath();
    earthCtx.arc(cx, cy, r, 0, Math.PI * 2);
    earthCtx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
    earthCtx.lineWidth = 1.5;
    earthCtx.stroke();

    // 4. HUD 罗盘
    earthCtx.save();
    earthCtx.translate(cx, cy);
    earthCtx.rotate(-earthRotation.y * 0.8);
    earthCtx.beginPath();
    earthCtx.arc(0, 0, compassR, 0, Math.PI * 2);
    earthCtx.setLineDash([4, 8]);
    earthCtx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    earthCtx.lineWidth = 1;
    earthCtx.stroke();
    earthCtx.setLineDash([]);
    for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const isMajor = i % 30 === 0;
        const x1 = Math.cos(angle) * (compassR - (isMajor ? 8 : 4));
        const y1 = Math.sin(angle) * (compassR - (isMajor ? 8 : 4));
        const x2 = Math.cos(angle) * compassR;
        const y2 = Math.sin(angle) * compassR;
        earthCtx.beginPath();
        earthCtx.moveTo(x1, y1);
        earthCtx.lineTo(x2, y2);
        earthCtx.strokeStyle = isMajor ? 'rgba(212, 175, 55, 0.8)' : 'rgba(212, 175, 55, 0.3)';
        earthCtx.lineWidth = isMajor ? 1.5 : 1;
        earthCtx.stroke();
    }
    const directions = [{ label: 'N', angle: -Math.PI / 2 }, { label: 'E', angle: 0 }, { label: 'S', angle: Math.PI / 2 }, { label: 'W', angle: Math.PI }];
    earthCtx.font = 'bold 10px monospace';
    earthCtx.textAlign = 'center';
    earthCtx.textBaseline = 'middle';
    earthCtx.fillStyle = 'rgba(212, 175, 55, 0.9)';
    directions.forEach(dir => {
        const textX = Math.cos(dir.angle) * (compassR - 16);
        const textY = Math.sin(dir.angle) * (compassR - 16);
        earthCtx.fillText(dir.label, textX, textY);
    });
    earthCtx.restore();

    // 5. 经纬网
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + earthRotation.y;
        earthCtx.beginPath();
        for (let j = 0; j <= 180; j += 5) {
            const lat = (j - 90) * Math.PI / 180;
            const x = cx + r * Math.cos(lat) * Math.cos(angle);
            const y = cy + r * Math.sin(lat);
            if (j === 0) earthCtx.moveTo(x, y);
            else earthCtx.lineTo(x, y);
        }
        const alpha = 0.1 + 0.4 * Math.abs(Math.cos(angle + earthRotation.y));
        earthCtx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
        earthCtx.lineWidth = 1;
        earthCtx.stroke();
    }
    for (let i = -75; i <= 75; i += 15) {
        const lat = i * Math.PI / 180;
        earthCtx.beginPath();
        for (let j = 0; j <= 360; j += 5) {
            const lng = (j * Math.PI / 180) + earthRotation.y;
            const x = cx + r * Math.cos(lat) * Math.cos(lng);
            const y = cy + r * Math.sin(lat);
            if (j === 0) earthCtx.moveTo(x, y);
            else earthCtx.lineTo(x, y);
        }
        const alpha = 0.1 + 0.4 * Math.cos(lat);
        earthCtx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
        earthCtx.lineWidth = 1;
        earthCtx.stroke();
    }

    // 6. 任务呼吸灯（核心修改：区分正常和危机状态）
    visibleDots = []; 
    // 把 crisis 状态也加进来
    const activeMissions = currentMissions.filter(m => m.status === 'busy' || m.status === 'crisis');
    
    if (activeMissions.length > 0) {
        activeMissions.forEach(mission => {
            const radLat = mission.lat * Math.PI / 180;
            const radLng = mission.lng * Math.PI / 180;
            const rot = earthRotation.y;
            const x3d = r * Math.cos(radLat) * Math.sin(radLng + rot);
            const y3d = r * Math.sin(radLat);
            const z3d = r * Math.cos(radLat) * Math.cos(radLng + rot);
            
            if (z3d > 0) {
                const screenX = cx + x3d;
                const screenY = cy - y3d;
                
                // 判断是不是正在经历危机的任务
                const isCrisis = mission.status === 'crisis';
                // 危机时闪烁速度更快，颜色变红
                const pulseSpeed = isCrisis ? 60: 180; 
                const pulse = Math.sin(Date.now() / pulseSpeed) * 0.5 + 0.5;
                const dotRadius = (isCrisis ? 5 : 3) + pulse * (isCrisis ? 6 : 4);
                const alpha = 0.5 + pulse * 0.5;

                // 光晕颜色：正常金色 / 危机红色
                const glowColor = isCrisis ? '224, 62, 62' : '212, 175, 55';
                const coreColor = isCrisis ? '255, 80, 80' : '255, 215, 0';

                earthCtx.beginPath();
                earthCtx.arc(screenX, screenY, dotRadius * 2, 0, Math.PI * 2);
                earthCtx.fillStyle = `rgba(${glowColor}, ${alpha * 0.3})`;
                earthCtx.fill();

                earthCtx.beginPath();
                earthCtx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2);
                earthCtx.fillStyle = `rgba(${coreColor}, ${alpha})`;
                earthCtx.fill();
                earthCtx.strokeStyle = isCrisis ? '#ff0000' : '#fff';
                earthCtx.lineWidth = 1;
                earthCtx.stroke();

                visibleDots.push({ x: screenX, y: screenY, id: mission.id });
            }
        });
    }

    // 7. 动画循环
    if (earthAutoRotate) {
        earthRotation.y += 0.003;
    } else if (Math.abs(earthRotation.y - targetRotation.y) > 0.01) {
        earthRotation.y += (targetRotation.y - earthRotation.y) * 0.08;
    }
    
    if (earthAutoRotate || Math.abs(earthRotation.y - targetRotation.y) > 0.01 || activeMissions.length > 0) {
        earthAnimationId = requestAnimationFrame(drawEarth);
    } else {
        earthAnimationId = null;
    }
}function rotateEarthToCoord(lat, lng) {
    if (!earthCtx) return;
    // 让目标经度转到正面
    targetRotation.y = -(lng * Math.PI) / 180;
    if (!earthAnimationId) {
        earthAnimationId = requestAnimationFrame(drawEarth);
    }
}
function openMissionDetail(missionId) {
    const mission = currentMissions.find(m => m.id === missionId);
    if (!mission) return;

    let agentName = '未知特工';
    const dispatch = activeDispatches.find(d => d.missionId === missionId);
    if (dispatch) {
        const allAgents = [...squadsData, ...fixedAgentsData];
        const agent = allAgents.find(a => a.id === dispatch.agentId);
        if (agent) agentName = agent.name;
    }

    document.getElementById('mdCode').textContent = mission.id.toUpperCase();
    document.getElementById('mdDesc').textContent = mission.title;
    document.getElementById('mdCoords').textContent = `LAT ${mission.lat.toFixed(2)} / LNG ${mission.lng.toFixed(2)}`;
    document.getElementById('mdAgent').textContent = agentName;
    
    const statusEl = document.getElementById('mdStatus');
    const timerEl = document.getElementById('mdTimer');

    if (mission.status === 'ready') {
        statusEl.textContent = '待处理';
        statusEl.className = 'md-status-tag dm-status ready';
        timerEl.textContent = '--';
    } else if (mission.status === 'busy') {
        statusEl.textContent = '进行中';
        statusEl.className = 'md-status-tag dm-status busy';
        const remaining = Math.max(0, Math.floor((mission.endTime - Date.now()) / 1000));
        timerEl.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    } else {
        statusEl.textContent = '已完成';
        statusEl.className = 'md-status-tag dm-status done';
        timerEl.textContent = '--';
    }

    earthAutoRotate = false;
    const modal = document.getElementById('missionDetailModal');
    if (modal) modal.classList.add('active');
}

function closeMissionResult() {
    const modal = document.getElementById('missionResultModal');
    if (modal) modal.classList.remove('active');
    
    // 移除已经查看过的结算
    pendingResults.shift();
    
    // 如果还有没查看的，继续弹出
    if (pendingResults.length > 0) {
        setTimeout(showNextMissionResult, 300);
    }
}
function closeMissionDetail() {
    const modal = document.getElementById('missionDetailModal');
    if (modal) modal.classList.remove('active');
    earthAutoRotate = true;
    if (!earthAnimationId) {
        earthAnimationId = requestAnimationFrame(drawEarth);
    }
}

// 战术通讯日志
function addCommLog(text, type = 'normal') {
    const linesEl = document.getElementById('commLogLines');
    if (!linesEl) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    
    const div = document.createElement('div');
    div.className = 'log-line';
    let colorClass = '';
    if (type === 'alert') colorClass = 'alert';
    if (type === 'success') colorClass = 'success';
    
    div.innerHTML = `<span class="time">[${timeStr}]</span> <span class="${colorClass}">${text}</span>`;
    linesEl.appendChild(div);
    linesEl.scrollTop = linesEl.scrollHeight; // 自动滚到底部
    
    // 只保留最近30条，防止内存溢出
    if (linesEl.children.length > 30) linesEl.removeChild(linesEl.firstChild);
}

// 带打字机效果的通讯日志
function addCommLogWithTyping(text, type = 'normal') {
    const linesEl = document.getElementById('commLogLines');
    if (!linesEl) return;
    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}]`;
    
    const div = document.createElement('div');
    div.className = 'log-line';
    let colorClass = '';
    if (type === 'alert') colorClass = 'alert';
    if (type === 'success') colorClass = 'success';
    
    // 先把时间戳放进去
    const timeSpan = document.createElement('span');
    timeSpan.className = 'time';
    timeSpan.textContent = timeStr + ' ';
    div.appendChild(timeSpan);
    
    // 正文部分
    const textSpan = document.createElement('span');
    textSpan.className = colorClass;
    div.appendChild(textSpan);
    
    linesEl.appendChild(div);
    linesEl.scrollTop = linesEl.scrollHeight;
    
    // 打字机特效，每 30 毫秒打一个字
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            textSpan.textContent += text.charAt(i);
            i++;
            linesEl.scrollTop = linesEl.scrollHeight; // 自动滚到底部
            setTimeout(typeChar, 30);
        }
    }
    typeChar();
    
    // 清理超出30条的旧日志
    if (linesEl.children.length > 30) linesEl.removeChild(linesEl.firstChild);
}

// 独立检查特工恢复状态
function checkAgentRecovery() {
    [...squadsData, ...fixedAgentsData].forEach(agent => {
        if (!agent.health) agent.health = 'ready';
        if (!agent.restUntil) agent.restUntil = 0;
        if (agent.health !== 'ready' && agent.restUntil > 0 && Date.now() > agent.restUntil) {
            agent.health = 'ready';
            agent.restUntil = 0;
        }
    });
}

/* ================= 25. 暗影入职试炼（走格子）逻辑 ================= */
let recruitTrust = 10;
let recruitSteps = 18;
let recruitPos = { r: 5, c: 2 }; // 起点在底部中间
let recruitMap = [];
let recruitedNpcs = []; // 记录已对话的NPC
let recruitGameActive = false;

// 6x6地图初始化 (0是路, 1是墙, 2是出口, 'O'奥兹, 'V'维利坎, 'B'巴雷特, 'R'罗兹)
const mapTemplate = [
    [1, 1, 2, 2, 1, 1], // 第0行：总裁办公室
    [1, 0, 1, 0, 0, 'V'], // 第1行：维利坎在右侧死角 [1,5]
    [0, 0, 0, 1, 'B', 0], // 第2行：巴雷特 [2,4]
    ['O', 0, 0, 0, 0, 0], // 第3行：奥兹在左侧 [3,0]
    [0, 0, 'R', 0, 0, 0], // 第4行：罗兹 [4,2]
    [0, 0, 0, 0, 0, 0]  // 第5行：起点区
];

function openRecruitGame() {
closeAppCenter();
    closeDroneView();
    const overlay = document.getElementById('recruitOverlay');
if (overlay) {
    overlay.style.display = 'flex'; // 强行拉开大门！
    overlay.classList.add('active');
}
    recruitTrust = 10;
    recruitSteps = 18;
    recruitPos = { r: 5, c: 2 };
    recruitMap = mapTemplate.map(row => [...row]);
    recruitedNpcs = [];
    recruitGameActive = true;

    document.getElementById('recruitTrust').textContent = recruitTrust;
    document.getElementById('recruitTrust').style.color = '#2ecc71';
    document.getElementById('recruitSteps').textContent = recruitSteps;
    
    renderRecruitGrid();
}

function closeRecruitGame() {
    const overlay = document.getElementById('recruitOverlay');
    if (overlay) {
        overlay.style.display = 'none'; // 👈 新增这一行：强行隐藏
        overlay.classList.remove('active');
    }
    recruitGameActive = false;
}
function renderRecruitGrid() {
    const gridEl = document.getElementById('recruitGrid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const cell = document.createElement('div');
            cell.className = 'recruit-cell';
            const val = recruitMap[r][c];
            
            if (val === 1) cell.classList.add('wall');
            if (val === 2) {
                cell.classList.add('exit');
                cell.innerHTML = '<span style="font-size:20px;">🚪</span>';
            }
            if (typeof val === 'string') {
                let icon = '';
                if (val === 'O') icon = '🧔‍♂️'; // 奥兹
                if (val === 'V') icon = '🥷'; // 维利坎
                if (val === 'B') icon = '💪'; // 巴雷特
                if (val === 'R') icon = '🕵️‍♀️'; // 罗兹
                cell.innerHTML = `<span class="npc-icon">${icon}</span>`;
            }
            if (r === recruitPos.r && c === recruitPos.c) {
                cell.innerHTML += '<span class="player-icon">👤</span>';
            }
            gridEl.appendChild(cell);
        }
    }
}

function moveRecruitPlayer(dir) {
    if (!recruitGameActive) return;
    if (recruitSteps <= 0) { 
        showRecruitResult(false, "步数耗尽。你在大堂迷路了，安保将你请了出去。"); 
        return; 
    }

    let newR = recruitPos.r;
    let newC = recruitPos.c;

    if (dir === 'up') newR--;
    if (dir === 'down') newR++;
    if (dir === 'left') newC--;
    if (dir === 'right') newC++;

    if (newR < 0 || newR >= 6 || newC < 0 || newC >= 6) return; // 边界
    if (recruitMap[newR][newC] === 1) return; // 墙

    // 检查是否碰到 NPC
    const cellVal = recruitMap[newR][newC];
    if (typeof cellVal === 'string' && !recruitedNpcs.includes(cellVal)) {
        triggerNpcDialogue(cellVal);
        return; // 遇到NPC不消耗步数，对话完再算，或者算消耗。这里设定遇到NPC不消耗步数，但对话后NPC消失。
    }

    recruitPos.r = newR;
    recruitPos.c = newC;
    recruitSteps--;
    document.getElementById('recruitSteps').textContent = recruitSteps;

    // 检查是否到达出口
    if (recruitMap[newR][newC] === 2) {
        if (recruitTrust >= 25) {
            startInterview();
        } else {
            showRecruitResult(false, "你来到总裁办公室门前，但安保主管拦住了你。\n\n'格瑞夫斯先生不见信任度不够的人。'");
        }
        return;
    }

    renderRecruitGrid();
}

// 触发 NPC 对话
function triggerNpcDialogue(npcKey) {
    const npcData = {
        'O': { name: '奥兹 (Oz)', text: '嘿，新来的。假设你押送一批价值 1.5 亿的货，途中遇到一个当地小孩拦车求救，后面有武装追兵。你怎么处理？', options: [
            { text: '扔给孩子一把手枪让他自卫，全速继续押送任务。', trust: 5 },
            { text: '停车救人，哪怕延误交货。', trust: -2 },
            { text: '一脚油门碾过去，这可能是武装分子的诱饵。', trust: 2 }
        ]},
        'V': { name: '维利坎 (Velikan)', text: '（他站在阴影里，没有出声，死死盯着你，眼神在问：“你够格吗？”）', options: [
            { text: '主动立正，用标准军姿报出自己代号：“长官，新兵报到。”', trust: 3 },
            { text: '迎上他的目光，面无表情地反问：“你考核我？还是格瑞夫斯考核我？”', trust: 8 },
            { text: '移开视线，拿出证件低头翻找。', trust: -5 }
        ]},
        'B': { name: '巴雷特 (Barrage)', text: '喂！我听说现在的新人只会用脑子，连枪都不会端了。要是我们在巷战中被火力压制了，你打算怎么办？', options: [
            { text: '呼叫空袭，把整条街炸平。', trust: 5 },
            { text: '利用掩体逐步推进，寻找敌方火力死角。', trust: 2 },
            { text: '掩护队友撤退，自己断后。', trust: -3 }
        ]},
        'R': { name: '罗兹 (Roze)', text: '做个测试。如果你发现你的上司让你去执行一个必死的任务，怀疑他是为了清理你。你会在出发前怎么做？', options: [
            { text: '服从命令，但暗中准备后手，并把情报卖给对家公司作为报复。', trust: -5 },
            { text: '私下调查上司，拿到他的把柄，用来保命。', trust: 6 },
            { text: '直接去找格瑞夫斯越级汇报。', trust: 2 }
        ]}
    };

    const data = npcData[npcKey];
    if (!data) return;

    document.getElementById('recruitModalTitle').textContent = data.name;
    document.getElementById('recruitModalText').textContent = data.text;
    const optionsEl = document.getElementById('recruitModalOptions');
    optionsEl.innerHTML = '';

    data.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'recruit-option-btn';
        btn.textContent = opt.text;
        btn.onclick = () => {
            recruitTrust += opt.trust;
            if (recruitTrust < 0) recruitTrust = 0;
            document.getElementById('recruitTrust').textContent = recruitTrust;
            
            // 颜色反馈
            if (opt.trust > 0) document.getElementById('recruitTrust').style.color = '#2ecc71';
            else if (opt.trust < 0) document.getElementById('recruitTrust').style.color = '#e03e3e';

            recruitedNpcs.push(npcKey);
            recruitMap[recruitPos.r][recruitPos.c] = 0; // 抹除NPC
            document.getElementById('recruitModal').classList.remove('active');
            
            renderRecruitGrid();
        };
        optionsEl.appendChild(btn);
    });

    document.getElementById('recruitModal').classList.add('active');
}

// 最终面试
function startInterview() {
    recruitGameActive = false; // 暂停地图移动
    const questions = [
        { text: "我看了你的档案，那四个家伙给你的评价参差不齐。现在告诉我，你为了什么来暗影？钱，还是权？", options: [
            { text: '钱。钱给够，我命都可以卖给你。', trust: 8 },
            { text: '权。我想站在这乱世的顶端，而暗影是最好的跳板。', trust: 5 },
            { text: '为了荣誉和正义。', trust: -10 }
        ]},
        { text: "如果有一天我让你去炸掉一所满是平民的医院，我说这能结束一场战争。你做吗？", options: [
            { text: '做。你是老板，我按命令办事。', trust: 4 },
            { text: '不做。我会先问清楚为什么，如果理由不充分，我会阻止你。', trust: 10 },
            { text: '推脱给奥兹去执行。', trust: -5 }
        ]},
        { text: "假设我现在给你一张黑卡副卡，里头的额度够你买个小岛。但条件是，你得去苏丹港待五年，那里天天吃沙子和子弹。干不干？", options: [
            { text: '干！马上给我卡。', trust: 5 },
            { text: '不干。我拿这笔钱去做别的事，把苏丹港的利润放大十倍。', trust: 8 },
            { text: '我要先考虑考虑。', trust: -3 }
        ]}
    ];

    let qIndex = 0;
    function askNextQuestion() {
        if (qIndex >= questions.length) {
            finishInterview();
            return;
        }
        const q = questions[qIndex];
        document.getElementById('recruitModalTitle').textContent = '格瑞夫斯 (P. Graves) 面试';
        document.getElementById('recruitModalText').textContent = q.text;
        const optionsEl = document.getElementById('recruitModalOptions');
        optionsEl.innerHTML = '';

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'recruit-option-btn';
            btn.textContent = opt.text;
            btn.onclick = () => {
                recruitTrust += opt.trust;
                if (recruitTrust < 0) recruitTrust = 0;
                document.getElementById('recruitTrust').textContent = recruitTrust;
                if (opt.trust > 0) document.getElementById('recruitTrust').style.color = '#2ecc71';
                else if (opt.trust < 0) document.getElementById('recruitTrust').style.color = '#e03e3e';
                document.getElementById('recruitModal').classList.remove('active');
                
                qIndex++;
                setTimeout(askNextQuestion, 300);
            };
            optionsEl.appendChild(btn);
        });
        document.getElementById('recruitModal').classList.add('active');
    }
    askNextQuestion();
}

function finishInterview() {
    if (recruitTrust >= 40) {
        // 成功录取，生成档案D
        const playerName = currentUser || '匿名员工';
        window.addDbEntry('D', {
            password: 'HIRED',
            title: `雇员档案 D · ${playerName}`,
            text: `入职时间：2026年10月8日<br>信任评级：S级<br>核心评估：具备极强的战场统筹能力与冷酷的实用主义。在暗影公司的入职测试中表现出了令人印象深刻的应变能力。`,
            quote: `“脑子不错，可以扔到前线去历练一下。”`,
            signature: '—— P. Graves 亲笔批注'
        });
        showRecruitResult(true, `恭喜你，${playerName}。你被录取了！\n\n你的档案已生成，作为「档案 D」存入绝密档案柜。密码：HIRED`);
    } else {
        showRecruitResult(false, "格瑞夫斯按下桌上的红色按钮，两个安保把你架了出去。\n\n'下次带点真本事来。'");
    }
}

function showRecruitResult(isSuccess, desc) {
    document.getElementById('recruitResultTitle').textContent = isSuccess ? '入职成功' : '入职失败';
    document.getElementById('recruitResultTitle').style.color = isSuccess ? '#2ecc71' : '#e03e3e';
    document.getElementById('recruitResultDesc').textContent = desc;
    document.getElementById('recruitResultModal').classList.add('active');
    recruitGameActive = false;
}

function closeRecruitResult() {
    document.getElementById('recruitResultModal').classList.remove('active');
    closeRecruitGame();
}


/* ================= 24. KIA 调查档案逻辑 ================= */
const caseData = [
    {
        id: 'SC-KIA-001',
        name: '灰狼',
        role: '苏丹港冷链物资护送 · 已确认阵亡',
        desc: '死因不明。遗体被发现时，致命伤在背部，配枪丢失。任务物资被劫。',
        buttons: [
            { text: '检索：资金流向', key: '资金' },
            { text: '检索：通讯日志', key: '通讯' },
            { text: '检索：现场弹道', key: '弹道' },
            { text: '检索：物流路线', key: '路线' }
        ],
        terminalAnswers: {
            '资金': '[数据截获] 赛拉斯(黑曜石高管) 账户在任务前一天入账 2,000,000 USDT，来源：未知加密钱包。',
            '通讯': '[行动记录] 01:20:15，灰狼通讯中断。01:20:30，前线小队通讯记录显示“干扰已排除”。',
            '弹道': '[现场勘查] 致命弹头为 7.62mm 制式步枪弹，非当地武装常用的 AK 弹药。',
            '路线': '[情报碎片] 黑曜石物流内部系统显示，冷链路线图曾被高价出售给第三方情报商。'
        },
        timeline: ['A. 赛拉斯将路线信息发给外部买家','B. 灰狼车队抵达苏丹港外围','C. 前线小队接到“切断通讯”的指令','D. 灰狼遭遇伏击，发出求救信号','E. 前线小队“迟到”接应，敌方完成灭口'],
        correctOrder: [1, 0, 2, 3, 4],
        answers: { who: ['赛拉斯', 'silas'], why: ['受贿', '黑吃黑', '叛变'], how: ['黑曜石', '路线泄露'] }
    },
    {
        id: 'SC-KIA-002',
        name: '霍朗曼',
        role: '地中海“弥诺陶”原型机拦截 · 已确认阵亡',
        desc: '遗体在船底机舱发现，肺部大量积水。游艇底部有定向爆破痕迹。当地联络人米格尔失联。',
        buttons: [
            { text: '检索：深海情报', key: '深海' },
            { text: '检索：资金流水', key: '资金' },
            { text: '检索：通讯黑匣子', key: '通讯' },
            { text: '检索：装备损耗', key: '装备' }
        ],
        terminalAnswers: {
            '深海': '[情报碎片] 附近海域有Konni组织的潜艇活动轨迹，但距离爆炸点超过50海里。',
            '资金': '[数据截获] 米格尔（当地联络人）的赌场债务在行动前夜被一笔 800,000 欧元的加密货币还清。',
            '通讯': '[黑匣子记录] 霍朗曼在死前 10 分钟发出求救：“机舱进水，米格尔切断了我……” 信号戛然而止。',
            '装备': '[后勤报告] 霍朗曼的备用氧气瓶阀门被人为拧松，C4炸药的引爆指令来自游艇内部局域网。'
        },
        timeline: [
            'A. 米格尔发送“安全交接”信号，骗霍朗曼下机舱',
            'B. 米格尔拧松氧气瓶，并在机舱安放C4',
            'C. 霍朗曼发现异常，试图发送求救信号',
            'D. 信号被切断，定向爆破导致海水倒灌',
            'E. 米格尔携带原型机潜逃，霍朗曼溺亡'
        ],
        correctOrder: [0, 1, 2, 3, 4],
        answers: {
            who: ['米格尔', 'miguel'],
            why: ['赌博', '欠债', '金钱', '叛变'],
            how: ['氧气瓶', '炸药', 'c4', '爆破']
        }
    }
];

let currentCase = null;
let currentCaseIndex = 0;
let selectedTimelineIndex = null;

function renderTimeline() {
    const container = document.getElementById('invTimeline');
    if (!container) return; 
    container.innerHTML = '';
    
    // 1. 把原文本里的 "A. " 等前缀去掉，只保留纯文本
    const cleanTimeline = currentCase.timeline.map(item => item.replace(/^[A-E]\.\s*/, ''));
    
    // 2. 准备字母池并打乱，随机分配给事件
    const letters = ['A', 'B', 'C', 'D', 'E'];
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    // 3. 把随机分配了字母的文本，再次打乱顺序，生成卡片
    let mixedTimeline = cleanTimeline.map((text, index) => `${letters[index]}. ${text}`);
    for (let i = mixedTimeline.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixedTimeline[i], mixedTimeline[j]] = [mixedTimeline[j], mixedTimeline[i]];
    }
    
    // 4. 渲染卡片，把完整文本存进 dataset 供后续验证
    mixedTimeline.forEach((text) => {
        const card = document.createElement('div');
        card.className = 'timeline-card';
        card.textContent = text;
        card.dataset.fullText = text; // 记录带有随机字母的文本
        card.onclick = () => handleTimelineClick(card);
        container.appendChild(card);
    });
}function handleTimelineClick(card) {
    if (!selectedTimelineIndex) {
        selectedTimelineIndex = card;
        card.classList.add('selected');
        return;
    }
    if (selectedTimelineIndex === card) {
        card.classList.remove('selected');
        selectedTimelineIndex = null;
        return;
    }
    const tempText = selectedTimelineIndex.textContent;
    selectedTimelineIndex.textContent = card.textContent;
    card.textContent = tempText;
    selectedTimelineIndex.classList.remove('selected');
    selectedTimelineIndex = null;
}

function fetchInvestigationClue(key) {
    const terminal = document.getElementById('invTerminal');
    if (!terminal) return;
    const text = currentCase.terminalAnswers[key];
    if (!text) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    terminal.appendChild(line);
    if (terminal.children.length === 2 && terminal.children[0].textContent.includes('等待检索')) {
        terminal.removeChild(terminal.children[0]);
    }
    let i = 0;
    function type() {
        if (i < text.length) {
            line.textContent += text.charAt(i);
            i++;
            terminal.scrollTop = terminal.scrollHeight;
            setTimeout(type, 30);
        }
    }
    type();
}

function closeInvestigation() {
    const overlay = document.getElementById('investigationOverlay');
    if (overlay) overlay.classList.remove('active');
}

function openInvestigation(caseIndex = 0) {
    const overlay = document.getElementById('investigationOverlay');
    if (!overlay) return;
    
    currentCaseIndex = caseIndex;
    currentCase = caseData[caseIndex];
    
    document.querySelector('.inv-photo').textContent = 'K.I.A.';
    document.querySelector('.inv-name').textContent = `代号：${currentCase.name}`;
// 动态更新档案编号
document.getElementById('invCaseCode').textContent = `暗影机密调查档案 · ${currentCase.id}`;
    document.querySelector('.inv-role').textContent = currentCase.role;
    document.querySelector('.inv-desc').textContent = currentCase.desc;

    
    const btnContainer = document.getElementById('invButtons');
    btnContainer.innerHTML = '';
    currentCase.buttons.forEach(btn => {
        const b = document.createElement('div');
        b.className = 'inv-btn';
        b.textContent = btn.text;
        b.onclick = () => fetchInvestigationClue(btn.key);
        btnContainer.appendChild(b);
    });

    document.getElementById('invTerminal').innerHTML = '<div class="terminal-line">[SYS] 等待检索指令...</div>';
    renderTimeline();
    
    // 强制清空所有输入框，防止残留
['invAnswerWho', 'invAnswerWhy', 'invAnswerHow', 'invAnswerWhere', 'invAnswerTrick'].forEach(id => {
    const inputEl = document.getElementById(id);
    if (inputEl) inputEl.value = '';
});

       // 清空输入框
    ['invAnswerWho', 'invAnswerWhy', 'invAnswerHow', 'invAnswerWhere', 'invAnswerTrick'].forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) inputEl.value = '';
    });

   // 核心修复：根据案件类型，动态控制占位符文字和显示/隐藏
const howInput = document.getElementById('invAnswerHow');
const whereInput = document.getElementById('invAnswerWhere');
const trickInput = document.getElementById('invAnswerTrick');

if (currentCase.id === 'SC-KIA-002') {
    // 如果是弥诺陶案，显示全部5个输入框
    if (whereInput) whereInput.style.display = 'block';
    if (trickInput) trickInput.style.display = 'block';
    if (howInput) howInput.placeholder = '3. 输入致命手段';
    if (whereInput) whereInput.placeholder = '4. 输入事发海域';
    if (trickInput) trickInput.placeholder = '5. 输入干扰项';
} else {
    // 如果是灰狼案，隐藏后面两个输入框，并修改第三项文字
    if (whereInput) whereInput.style.display = 'none';
    if (trickInput) trickInput.style.display = 'none';
    if (howInput) howInput.placeholder = '3. 输入泄密渠道'; 
}

    // 直接打开界面（校验逻辑交给提交按钮处理）
    overlay.classList.add('active');
}

let failCount = 0; // 新增全局变量，记录失败次数（放在函数外面，哪里都行，比如最上面）

function submitInvestigation() {
   const who = document.getElementById('invAnswerWho').value.trim();
const why = document.getElementById('invAnswerWhy').value.trim();
const how = document.getElementById('invAnswerHow').value.trim();

// 核心修复：根据案件类型判断需要验证几项
let where = '', trick = '';
if (currentCase.id === 'SC-KIA-002') {
    where = document.getElementById('invAnswerWhere').value.trim();
    trick = document.getElementById('invAnswerTrick').value.trim();
    if (!who || !why || !how || !where || !trick) { 
        alert('请填写完整的推演报告（共5项）。'); 
        return; 
    }
} else {
    if (!who || !why || !how) { 
        alert('请填写完整的推演报告（共3项）。'); 
        return; 
    }
}

    // 1. 时间线检查（忽略空格）
    const container = document.getElementById('invTimeline');
   // 获取当前卡片的纯文本（去掉前面的字母）
const cards = Array.from(container.children).map(c => c.textContent.replace(/^[A-E]\.\s*/, '').replace(/\s/g, ''));

// 获取正确顺序的纯文本
let expectedSequence = currentCase.correctOrder.map(i => currentCase.timeline[i].replace(/^[A-E]\.\s*/, '').replace(/\s/g, ''));

// 逐字比对，完全忽略字母
let isTimelineCorrect = cards.every((card, index) => card === expectedSequence[index]);
    // 2. 模糊输入检查（核心：忽略大小写、空格、标点）
    const normalize = (str) => str.replace(/[^\w\u4e00-\u9fa5]/g, '').toLowerCase();
    
    // 3. 根据案件动态判断（区分灰狼和霍朗曼）
    let isWhoCorrect = false, isWhyCorrect = false, isHowCorrect = false, isWhereCorrect = false, isTrickCorrect = false;

    if (currentCase.id === 'SC-KIA-001') {
        // 灰狼案：默认把后面的当作正确
        isWhoCorrect = currentCase.answers.who.some(k => normalize(who).includes(normalize(k)));
        isWhyCorrect = currentCase.answers.why.some(k => normalize(why).includes(normalize(k)));
        isHowCorrect = currentCase.answers.how.some(k => normalize(how).includes(normalize(k)));
        isWhereCorrect = true; // 灰狼案没设置第四问，默认过
        isTrickCorrect = true;
    } else if (currentCase.id === 'SC-KIA-002') {
        // 霍朗曼案（弥诺陶）专属判断
        isWhoCorrect = ['米格尔', 'miguel'].some(k => normalize(who).includes(normalize(k)));
        isWhyCorrect = ['赌博', '欠债', '赌债', '还钱'].some(k => normalize(why).includes(normalize(k)));
        isHowCorrect = ['氧气瓶', '炸弹', 'c4', '爆破', '切断通讯'].some(k => normalize(how).includes(normalize(k)));
        isWhereCorrect = ['地中海', '希腊', '海域'].some(k => normalize(where).includes(normalize(k)));
        // 关键：玩家必须指出Konni是幌子
        isTrickCorrect = ['konni', '假象', '障眼法', '误导', '不是他', '排除'].some(k => normalize(trick).includes(normalize(k)));
    }

    if (isTimelineCorrect && isWhoCorrect && isWhyCorrect && isHowCorrect && isWhereCorrect && isTrickCorrect) {
        failCount = 0; // 成功则重置失败次数
        alert('报告已提交！所有线索完美闭环，真相已归档。');
        closeInvestigation();
        triggerGravesAftermath();
    } else {
        failCount++;
        let errorMsg = '报告被打回。推理存在漏洞：\n';
        if (!isTimelineCorrect) errorMsg += '- 时间线排列有误。\n';
        if (!isWhoCorrect) errorMsg += '- 内鬼身份有误。\n';
        if (!isWhyCorrect) errorMsg += '- 作案动机有误。\n';
        // 根据案件类型动态生成错误提示
if (currentCase.id === 'SC-KIA-001') {
    if (!isHowCorrect) errorMsg += '- 泄密渠道有误。\n';
} else if (currentCase.id === 'SC-KIA-002') {
    if (!isHowCorrect) errorMsg += '- 致命手段有误。\n';
    if (!isWhereCorrect) errorMsg += '- 事发海域有误。\n';
    if (!isTrickCorrect) errorMsg += '- 未识破背后的干扰项。\n';
}
        errorMsg += '请重新比对线索。';
        alert(errorMsg);

        // 🌟 核心：打草惊蛇机制
        if (failCount >= 3) {
            failCount = 0; // 触发后重置，防止无限刷屏
            triggerGravesAltMessage("Darlin'，你的推理能力让我有点失望。要我派维利坎去帮你查吗？但他一旦介入，我就不保证那个内鬼还能不能留全尸了。");
        }
    }
}
function triggerGravesAftermath() {
    dispatchFunds += 150000;
    renderDispatchFunds();
    saveGameState();
    
    // 定义日志队列，每条日志间隔 2 秒弹出，带打字机效果
    let logQueue = [];
    
    if (currentCase.id === 'SC-KIA-002') {
        // === 弥诺陶事件专属善后 ===
        triggerGravesAltMessage("Darlin'，干得漂亮。米格尔以为他能带着原型机逃到天涯海角，他不知道暗影的网撒得有多广。地中海的事，交给我。");
        logQueue = [
            { text: `[行动日志] 21:00 - 维利坎在地中海塞得港截获了准备潜逃的米格尔，目标已落网。`, type: 'alert' },
            { text: `[行动日志] 23:30 - 暗影网络部追回了 800,000 欧元的赃款，原路打入霍朗曼家属账户。`, type: 'success' },
            { text: `[行动日志] 02:00 - 米格尔被押送至德克萨斯地下总部，等待他的将是漫长的审讯。`, type: 'alert' },
            { text: `[系统通告] 格瑞夫斯批注：Konni的潜艇不用管，只是来看热闹的。内鬼已落网，按规矩办。`, type: 'success' }
        ];
    } else {
        // === 灰狼案专属善后（原始保留）===
        triggerGravesAltMessage("Darlin'，你干得漂亮。赛拉斯以为他在赚外快，他不知道动我的人是什么代价。接下来交给我。");
        logQueue = [
            { text: `[行动日志] 21:00 - 维利坎带队突袭赛拉斯私人别墅，目标已被活捉并押送至德州。`, type: 'alert' },
            { text: `[行动日志] 22:15 - 暗影网络部强行划走赛拉斯账户 200 万 USDT，打入灰狼家属抚恤金账户。`, type: 'success' },
            { text: `[行动日志] 03:00 - Barrage 小队在东欧废弃工厂执行物理清洗，12名敌对武装及叛变小队，无人生还。`, type: 'alert' },
            { text: `[系统通告] 格瑞夫斯已向所有暗影高层发送加密备忘：暗影不卖队友，我们只负责埋葬那些卖队友的人。`, type: 'success' }
        ];
    }

    // 逐条播放日志
    logQueue.forEach((log, index) => {
        setTimeout(() => {
            addCommLogWithTyping(log.text, log.type);
        }, index * 2000); // 每 2 秒出现一条，你可以根据喜好调整这个 2000
    });
}

/* ================= 格瑞夫斯小号 - 深度校准版（气质总裁 · 黑幽默） ================= */


/* ================= 抽鬼牌游戏逻辑 ================= */
let gravesHand = [];
let playerHand = [];
let cardGameActive = false;
let isGravesTurn = false;

// 初始化牌组（为了快节奏，只做 4 对牌 + 1 张鬼牌 = 9 张牌）
window.initCardGame = function() {
    if (typeof closeAllOverlays === 'function') closeAllOverlays();
    const phoneMockup = document.querySelector('.phone-mockup');
    const overlay = document.getElementById('cardGameOverlay');
    if (!overlay) return;
    if (phoneMockup && overlay.parentNode !== phoneMockup) {
        phoneMockup.appendChild(overlay);
    }

    let validDeal = false;
    
    // 核心修复：循环发牌，直到双方去对后都不为空
    while (!validDeal) {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', 'K', 'Q', 'J'];
        let deck = [];
        
        for (let i = 0; i < 4; i++) {
            deck.push({ rank: ranks[i], suit: suits[0], display: ranks[i] + suits[0] });
            deck.push({ rank: ranks[i], suit: suits[1], display: ranks[i] + suits[1] });
        }
        deck.push({ rank: 'JOKER', suit: '★', display: 'JOKER' });
        deck.sort(() => Math.random() - 0.5);
        
        playerHand = [];
        gravesHand = [];
        for (let i = 0; i < deck.length; i++) {
            if (i % 2 === 0) playerHand.push(deck[i]);
            else gravesHand.push(deck[i]);
        }
        
        clearPairs(playerHand);
        clearPairs(gravesHand);
        
        // 如果双方都有牌，才跳出循环
        if (playerHand.length > 0 && gravesHand.length > 0) {
            validDeal = true;
        }
    }
    
    cardGameActive = true;
    isGravesTurn = false;
    renderCardGame();
    if (overlay) overlay.classList.add('active');
};
window.closeCardGame = function() {
    const overlay = document.getElementById('cardGameOverlay');
    if (overlay) overlay.classList.remove('active');
    cardGameActive = false;
};

// 去除手牌中的对子
function clearPairs(hand) {
    for (let i = 0; i < hand.length; i++) {
        for (let j = i + 1; j < hand.length; j++) {
            if (hand[i].rank === hand[j].rank && hand[i].rank !== 'JOKER') {
                // 找到对子，移除这两张牌
                hand.splice(j, 1); 
                hand.splice(i, 1);
                i--; 
                break;
            }
        }
    }
}

// 渲染界面
function renderCardGame() {
    const gravesArea = document.getElementById('gravesHandArea');
    const playerArea = document.getElementById('playerHandArea');
    const statusText = document.getElementById('gameStatusText');
    if (!gravesArea || !playerArea || !statusText) return;
    
    gravesArea.innerHTML = '';
    playerArea.innerHTML = '';
    
    // 渲染格瑞夫斯的手牌（背面朝上，可点击抽牌）
    gravesHand.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'playing-card back';
        cardEl.textContent = '?';
        // 只有在玩家回合才能抽牌
        if (cardGameActive && !isGravesTurn) {
            cardEl.onclick = () => playerDrawCard(index);
        } else {
            cardEl.style.cursor = 'not-allowed';
            cardEl.style.opacity = '0.6';
        }
        gravesArea.appendChild(cardEl);
    });
    
    // 渲染玩家的手牌（正面朝上）
    playerHand.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'playing-card front' + (card.rank === 'JOKER' ? ' joker' : '');
        cardEl.textContent = card.display;
        playerArea.appendChild(cardEl);
    });
    
    // 检查游戏是否结束
    if (playerHand.length === 0 && gravesHand.length === 0) return;
    if (playerHand.length === 0) {
        cardGameActive = false;
        statusText.innerHTML = `你赢了。格瑞夫斯面无表情地把手里的鬼牌扔在桌上。<br>"运气不错，Darlin'。但在战场上，光靠运气可活不下来。"`;
        return;
    }
    if (gravesHand.length === 0) {
        cardGameActive = false;
        statusText.innerHTML = `你输了。你手里捏着那张烫手的鬼牌。<br>"看来你今天的心思不在牌局上。" 格瑞夫斯轻笑，"没关系，输了就欠我一个愿望。"`;
        return;
    }
}

// 玩家抽牌
function playerDrawCard(index) {
    if (!cardGameActive || isGravesTurn) return;
    
    // 从格瑞夫斯手里抽一张
    const drawnCard = gravesHand.splice(index, 1)[0];
    playerHand.push(drawnCard);
    
    // 检查玩家手牌有无新对子
    clearPairs(playerHand);
    
    renderCardGame();
    
    // 检查游戏是否结束
    if (playerHand.length === 0 || gravesHand.length === 0) return;

    // 轮到格瑞夫斯抽牌
    isGravesTurn = true;
    renderCardGame();
    document.getElementById('gameStatusText').innerHTML = `格瑞夫斯正在盯着你的手牌...`;
    
    setTimeout(() => {
        if (!cardGameActive) return;
        
        // 格瑞夫斯随机抽一张玩家牌
        const randomIndex = Math.floor(Math.random() * playerHand.length);
        const drawnCard = playerHand.splice(randomIndex, 1)[0];
        gravesHand.push(drawnCard);
        
        clearPairs(gravesHand);
        
        isGravesTurn = false;
        
        // 随机触发格瑞夫斯的垃圾话
        const taunts = [
            "你刚才犹豫了。这牌肯定有问题。",
            "如果是在牌桌上出老千，我会砍掉那只手。但今天就算了。",
            "铁雨如果在旁边，一定会给我递雪茄。可惜他没这个眼力见。",
            "我记得你上次玩战术推演也是这个表情。",
            "继续抽。我今天有的是时间陪你玩。",
            "你手里的那张牌，最好不是鬼牌。不然今晚回去有你受的。"
        ];
        document.getElementById('gameStatusText').textContent = taunts[Math.floor(Math.random() * taunts.length)];
        renderCardGame();
    }, 1500);
}

// ================= 页面加载初始化 =================
window.addEventListener('load', function() {
    // 渲染基础UI
    if (typeof renderContracts === 'function') renderContracts();
    if (typeof renderMemos === 'function') renderMemos();
    if (typeof renderSurveillance === 'function') renderSurveillance();
});

/* ================= 暗影食堂 · 基础逻辑 ================= */
// 存档 key
const CANTEEN_SAVE_KEY = 'shadow_canteen_save';

// 全局状态（后续部分会用到）
let canteenState = {
    currentDay: 1,
    totalRevenue: 0,
    storeLevel: '未评级',
    perfectCount: 0,
    poisonedCount: 0,
    todayOrderIndex: 0,
    todayRevenue: 0,
    todayOrders: [],
    totalDaysCompleted: 0
};

// 加载存档
function loadCanteenState() {
    try {
        const saved = localStorage.getItem(CANTEEN_SAVE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            canteenState = { ...canteenState, ...parsed };
        }
    } catch(e) { console.warn('食堂存档读取失败', e); }
}

// 保存存档
function saveCanteenState() {
    try {
        localStorage.setItem(CANTEEN_SAVE_KEY, JSON.stringify(canteenState));
    } catch(e) { console.warn('食堂存档保存失败', e); }
}

// 刷新菜单界面的显示
function refreshCanteenMenu() {
    const dayEl = document.getElementById('canteenDayDisplay');
    const revEl = document.getElementById('canteenTotalRevenue');
    const lvEl = document.getElementById('canteenStoreLevel');
    const perfEl = document.getElementById('canteenPerfectCount');
    if (dayEl) dayEl.textContent = `第 ${canteenState.currentDay} 天`;
    if (revEl) revEl.textContent = '$' + canteenState.totalRevenue.toLocaleString('en-US');
    if (lvEl) lvEl.textContent = canteenState.storeLevel;
    if (perfEl) perfEl.textContent = canteenState.perfectCount + ' 单';
}

// 打开食堂（从控制中心调用）
window.openCanteen = function() {
    try {
        // 👇👇👇 【请在此处添加这两行】 👇👇👇
        const canteenEl = document.getElementById('canteenOverlay');
        if (canteenEl && canteenEl.parentElement !== document.body) {
            document.body.appendChild(canteenEl); // 强行把食堂从隐藏的父元素里拽出来，挂到 body 上
        }
        // 👆👆👆 【添加结束】 👆👆👆

        if (typeof closeAppCenter === 'function') closeAppCenter();
        if (typeof closeAllOverlays === 'function') closeAllOverlays();

        // 先确保 canteenState 是完整的对象
        if (typeof canteenState !== 'object' || canteenState === null) {
            canteenState = {
                currentDay: 1, totalRevenue: 0, storeLevel: '未评级',
                perfectCount: 0, poisonedCount: 0,
                todayOrderIndex: 0, todayRevenue: 0,
                todayOrders: [], totalDaysCompleted: 0 // 注意这里补全了 0
            };
        }

        if (typeof loadCanteenState === 'function') loadCanteenState();
        if (typeof refreshCanteenMenu === 'function') refreshCanteenMenu();

        // 用 Number() 强制转换，避免 undefined 比较
        const idx = Number(canteenState.todayOrderIndex) || 0;
        const hasUnfinished = idx > 0 && idx < 9;

        if (hasUnfinished) {
            const rDay = document.getElementById('resumeDayDisplay');
            const rOrd = document.getElementById('resumeOrderDisplay');
            const rRev = document.getElementById('resumeRevenueDisplay');
            if (rDay) rDay.textContent = `第 ${canteenState.currentDay || 1} 天`;
            if (rOrd) rOrd.textContent = `${idx} / 9 订单`;
            if (rRev) rRev.textContent = '$' + (Number(canteenState.todayRevenue) || 0).toLocaleString();
            showCanteenScreen('canteenResumeScreen');
        } else {
            showCanteenScreen('canteenMenuScreen');
        }

        const overlay = document.getElementById('canteenOverlay');
        if (overlay) {
            overlay.classList.add('active');
            overlay.style.display = 'flex';
        } else {
            console.error('❌ 找不到 #canteenOverlay，食堂 HTML 没有正确加载'); // 之前你的截图这里被挡住了，可以补全
        }
    } catch(e) {
        console.error('❌ openCanteen 执行出错:', e);
    }
};
// 关闭食堂
window.closeCanteen = function() {
    const overlay = document.getElementById('canteenOverlay');
    if (overlay) overlay.classList.remove('active');
    // 关闭所有食堂内的弹窗
    document.querySelectorAll('.canteen-modal.active').forEach(m => m.classList.remove('active'));
};

// 切换屏幕
function showCanteenScreen(screenId) {
    document.querySelectorAll('.canteen-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
}

// 开始营业（占位，后续部分实现完整逻辑）
window.startCanteenDay = function() {
    // 检查是否有未完成的进度
    if (canteenState.todayOrderIndex > 0 && canteenState.todayOrderIndex < 9) {
        // 有未完成进度，提示用户
        const resume = confirm('检测到今天有未完成的营业。\n\n点【确定】继续今天的进度\n点【取消】重新开始今天');
        if (resume) {
            showCanteenScreen('canteenGameScreen');
        } else {
            // 重开今天
            canteenState.todayOrderIndex = 0;
            canteenState.todayRevenue = 0;
            canteenState.todayOrders = [];
            saveCanteenState();
            showCanteenScreen('canteenGameScreen');
        }
    } else {
        // 全新的一天
        canteenState.todayOrderIndex = 0;
        canteenState.todayRevenue = 0;
        canteenState.todayOrders = [];
        saveCanteenState();
        showCanteenScreen('canteenGameScreen');
    }
    
    // 占位提示
    const area = document.getElementById('canteenCustomerArea');
    if (area) area.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 40px 0; font-size: 12px;">⏳ 游戏逻辑正在开发中...<br><br>完成第一部分测试后<br>请继续贴第二部分代码</div>';
};

// 继续营业（恢复界面调用）
window.resumeCanteenDay = function() {
    showCanteenScreen('canteenGameScreen');
    const area = document.getElementById('canteenCustomerArea');
    if (area) area.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 40px 0; font-size: 12px;">⏳ 游戏逻辑正在开发中...</div>';
};

// 重新开始今天（恢复界面调用）
window.restartCanteenDay = function() {
    canteenState.todayOrderIndex = 0;
    canteenState.todayRevenue = 0;
    canteenState.todayOrders = [];
    saveCanteenState();
    showCanteenScreen('canteenGameScreen');
    const area = document.getElementById('canteenCustomerArea');
    if (area) area.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 40px 0; font-size: 12px;">⏳ 游戏逻辑正在开发中...</div>';
};

// 暂停（游戏界面返回按钮）
window.pauseCanteen = function() {
    const modal = document.getElementById('canteenPauseModal');
    if (modal) modal.classList.add('active');
};

// 继续营业（暂停菜单）
window.resumeCanteen = function() {
    const modal = document.getElementById('canteenPauseModal');
    if (modal) modal.classList.remove('active');
};

// 回到主菜单
window.exitCanteenToMenu = function() {
    const modal = document.getElementById('canteenPauseModal');
    if (modal) modal.classList.remove('active');
    saveCanteenState();
    refreshCanteenMenu();
    showCanteenScreen('canteenMenuScreen');
};

// 打烊按钮（游戏界面）
window.confirmCloseDay = function() {
    const remaining = 9 - canteenState.todayOrderIndex;
    const desc = document.getElementById('canteenCloseConfirmDesc');
    if (desc) {
        desc.textContent = `今天还剩 ${remaining} 个订单未完成。\n\n打烊将：\n· 保留已赚的 $${canteenState.todayRevenue.toLocaleString('en-US')}\n· 声誉 -1\n· 明天重新开张`;
    }
    const modal = document.getElementById('canteenCloseConfirmModal');
    if (modal) modal.classList.add('active');
};

// 取消打烊
window.cancelCloseDay = function() {
    const modal = document.getElementById('canteenCloseConfirmModal');
    if (modal) modal.classList.remove('active');
};

// 确认打烊（占位）
window.doCloseDay = function() {
    const modal = document.getElementById('canteenCloseConfirmModal');
    if (modal) modal.classList.remove('active');
    alert('打烊逻辑将在后续部分实现。');
};

// 占位函数（后续部分会覆盖）
window.closeCanteenRecipe = function() {
    const modal = document.getElementById('canteenRecipeModal');
    if (modal) modal.classList.remove('active');
};
window.closeCanteenRating = function() {
    const modal = document.getElementById('canteenRatingModal');
    if (modal) modal.classList.remove('active');
};
window.closeCanteenDayEnd = function() {
    const modal = document.getElementById('canteenDayEndModal');
    if (modal) modal.classList.remove('active');
};
window.closeCanteenStoreRank = function() {
    const modal = document.getElementById('canteenStoreRankModal');
    if (modal) modal.classList.remove('active');
};

/* ================= 暗影食堂 · 游戏数据 ================= */

// ---------- 食材库（25 种） ----------
const CANTEEN_INGREDIENTS = {
    // 肉类
    '牛肉':   { emoji: '🥩', cat: 'meat',  label: '牛肉' },
    '鸡肉':   { emoji: '🍗', cat: 'meat',  label: '鸡肉' },
    '鱼':     { emoji: '🐟', cat: 'meat',  label: '鱼' },
    '培根':   { emoji: '🥓', cat: 'meat',  label: '培根' },
    // 蔬菜
    '生菜':   { emoji: '🥬', cat: 'veg',   label: '生菜' },
    '番茄':   { emoji: '🍅', cat: 'veg',   label: '番茄' },
    '洋葱':   { emoji: '🧅', cat: 'veg',   label: '洋葱' },
    '蘑菇':   { emoji: '🍄', cat: 'veg',   label: '蘑菇' },
    '芦笋':   { emoji: '🌿', cat: 'veg',   label: '芦笋' },
    // 碳水
    '面包':   { emoji: '🍞', cat: 'carb',  label: '面包' },
    '米饭':   { emoji: '🍚', cat: 'carb',  label: '米饭' },
    '意面':   { emoji: '🍝', cat: 'carb',  label: '意面' },
    '土豆':   { emoji: '🥔', cat: 'carb',  label: '土豆' },
    // 乳制品
    '奶酪':   { emoji: '🧀', cat: 'dairy', label: '奶酪' },
    '黄油':   { emoji: '🧈', cat: 'dairy', label: '黄油' },
    '奶油':   { emoji: '🥛', cat: 'dairy', label: '奶油' },
    '酸奶':   { emoji: '🍶', cat: 'dairy', label: '酸奶' },
    // 水果
    '草莓':   { emoji: '🍓', cat: 'fruit', label: '草莓' },
    '柠檬':   { emoji: '🍋', cat: 'fruit', label: '柠檬' },
    '牛油果': { emoji: '🥑', cat: 'fruit', label: '牛油果' },
    '蓝莓':   { emoji: '🫐', cat: 'fruit', label: '蓝莓' },
    // 饮品
    '咖啡':   { emoji: '☕', cat: 'drink', label: '咖啡' },
    '茶':     { emoji: '🍵', cat: 'drink', label: '茶' },
    '果汁':   { emoji: '🧃', cat: 'drink', label: '果汁' },
    '气泡水': { emoji: '💧', cat: 'drink', label: '气泡水' }
};

// ---------- 菜品清单（18 道） ----------
const CANTEEN_DISHES = [
    // 1 原材料
    { name: '气泡水',         ingredients: ['气泡水'],                                     price: 15,  complexity: 1 },
    { name: '鲜榨果汁',       ingredients: ['果汁'],                                       price: 20,  complexity: 1 },
    { name: '柠檬红茶',       ingredients: ['茶', '柠檬'],                                 price: 25,  complexity: 2 },
    { name: '拿铁',           ingredients: ['咖啡', '奶油'],                               price: 30,  complexity: 2 },
    { name: '香煎薯条',       ingredients: ['土豆', '黄油'],                               price: 35,  complexity: 2 },

    // 2 原材料（再补两个）
    { name: '蓝莓酸奶',       ingredients: ['蓝莓', '酸奶'],                               price: 40,  complexity: 2 },
    { name: '草莓奶昔',       ingredients: ['草莓', '奶油', '酸奶'],                       price: 45,  complexity: 3 },
    { name: '牛油果吐司',     ingredients: ['面包', '牛油果', '番茄'],                     price: 55,  complexity: 3 },

    // 3 原材料
    { name: '凯撒沙拉',       ingredients: ['生菜', '鸡肉', '奶酪'],                       price: 65,  complexity: 3 },
    { name: '番茄意面',       ingredients: ['意面', '番茄', '洋葱'],                       price: 70,  complexity: 3 },
    { name: '咖喱鸡饭',       ingredients: ['米饭', '鸡肉', '洋葱'],                       price: 80,  complexity: 3 },
    { name: '芝士汉堡',       ingredients: ['面包', '牛肉', '奶酪'],                       price: 85,  complexity: 3 },
    { name: '培根意面',       ingredients: ['意面', '培根', '奶油'],                       price: 95,  complexity: 3 },

    // 4 原材料
    { name: '三文鱼排',       ingredients: ['鱼', '柠檬', '黄油', '芦笋'],                 price: 140, complexity: 4 },
    { name: '蘑菇牛排',       ingredients: ['牛肉', '蘑菇', '黄油', '洋葱'],               price: 150, complexity: 4 },
    { name: '德州烟熏牛腩',   ingredients: ['牛肉', '土豆', '洋葱', '培根'],               price: 170, complexity: 4 },

    // 5 原材料
    { name: '暗影豪华拼盘',   ingredients: ['牛肉', '鱼', '培根', '蘑菇', '奶酪'],         price: 280, complexity: 5 }
];

// 按难度分组的菜品索引（方便点菜时随机抽取）
const CANTEEN_DISHES_BY_COMPLEXITY = {
    1: CANTEEN_DISHES.filter(d => d.complexity === 1),
    2: CANTEEN_DISHES.filter(d => d.complexity === 2),
    3: CANTEEN_DISHES.filter(d => d.complexity === 3),
    4: CANTEEN_DISHES.filter(d => d.complexity === 4),
    5: CANTEEN_DISHES.filter(d => d.complexity === 5)
};

// 只看菜名和价格，方便配方速查
function getDishByName(name) {
    return CANTEEN_DISHES.find(d => d.name === name);
}

// ---------- NPC 定义（8 位） ----------
// timer 单位：秒。orderRange 是订单数量的随机范围（含两端）。
const CANTEEN_NPCS = [
    {
        id: 'lee',
        name: 'Lee',
        avatar: '👴',
        tag: '后勤老兵 · 话少',
        timer: 120,
        orderRange: [1, 2],
        difficulty: 'easy',
        // 台词池
        enterLines: [
            '来份吃的。你看着办。',
            '不挑。简单点就行。',
            '老样子。动作快点。'
        ],
        skipLines: ['……行。我去别处。'],
        perfectLines: ['嗯。不错。'],
        goodLines: ['能吃。谢了。'],
        okLines: ['行吧。'],
        badLines: ['……下次别放这么多盐。'],
        poisonLines: ['（他沉默了很久，然后默默离开了）']
    },
    {
        id: 'mendes',
        name: 'Mendes',
        avatar: '🧔',
        tag: '冷静老练 · 注重效率',
        timer: 100,
        orderRange: [1, 2],
        difficulty: 'easy',
        enterLines: [
            '来点快的。我没时间。',
            '一份主食，加个饮品。',
            '别让我等太久。'
        ],
        skipLines: ['浪费时间。'],
        perfectLines: ['效率不错。'],
        goodLines: ['可以。'],
        okLines: ['勉强。'],
        badLines: ['你确定这是给我吃的？'],
        poisonLines: ['……我明天还有任务。别害我。']
    },
    {
        id: 'oz',
        name: 'Oz',
        avatar: '🧑‍💼',
        tag: '话多 · 随性',
        timer: 90,
        orderRange: [2, 3],
        difficulty: 'mid',
        enterLines: [
            '老板来点吃的，我今天快累死了……哦对了再来杯咖啡。',
            '随便点两个吧，你看着搭配。',
            '饿死了饿死了，什么快上什么。'
        ],
        skipLines: ['哎哎别别别，我做错了什么？'],
        perfectLines: ['哇！这也太好吃了！我要告诉老板！'],
        goodLines: ['不错不错，比食堂好多了。'],
        okLines: ['可以可以，能填肚子。'],
        badLines: ['这……算了，我吃。'],
        poisonLines: ['我不行了……快叫医生……（然后他晕了过去）']
    },
    {
        id: 'roze',
        name: 'Roze',
        avatar: '🕵️‍♀️',
        tag: '神秘 · 惜字如金',
        timer: 85,
        orderRange: [2, 3],
        difficulty: 'mid',
        enterLines: [
            '两份。',
            '随便。快点。',
            '（她只是看了你一眼）'
        ],
        skipLines: ['（她什么也没说，转身离开）'],
        perfectLines: ['……行。'],
        goodLines: ['嗯。'],
        okLines: ['（点头）'],
        badLines: ['就这？'],
        poisonLines: ['……（她掏出了枪，又收回去，然后走了）']
    },
    {
        id: 'barrage',
        name: 'Barrage',
        avatar: '💪',
        tag: '暴躁 · 无肉不欢',
        timer: 75,
        orderRange: [2, 3],
        difficulty: 'hard',
        // 必含至少 1 道肉类（complexity>=3 且配方里含 4 种肉类之一）
        requireMeat: true,
        enterLines: [
            '来点硬的！别给我上素菜！',
            '两份，都要肉！听见没有！',
            '快点！我饿了！'
        ],
        skipLines: ['你他妈耍我呢？'],
        perfectLines: ['好！这才叫饭！'],
        goodLines: ['嗯，够味。'],
        okLines: ['行吧。肉少了一点。'],
        badLines: ['肉呢？肉他妈在哪？'],
        poisonLines: ['……我要死了。我要死在食堂了。']
    },
    {
        id: 'mcmillan',
        name: 'McMillan',
        avatar: '🎩',
        tag: '老派 · 挑剔',
        timer: 70,
        orderRange: [2, 3],
        difficulty: 'hard',
        // 必含 1 道 3 原材料菜
        requireComplex3: true,
        enterLines: [
            '来两份，其中一份要有讲究的。',
            '我要正经的菜，不是那些糊弄人的。',
            '年轻的时候我在伦敦吃过更好的。让我看看你的水平。'
        ],
        skipLines: ['哼。这就是暗影的待客之道？'],
        perfectLines: ['……不错。出乎我的意料。'],
        goodLines: ['还行。可以入口。'],
        okLines: ['马马虎虎。'],
        badLines: ['这也能端上来？'],
        poisonLines: ['我在中东啃过更糟的。但这个……这个真的不行。']
    },
    {
        id: 'velikan',
        name: 'Velikan',
        avatar: '🥷',
        tag: '沉默 · 递纸条',
        timer: 60,
        orderRange: [3, 3],
        difficulty: 'hard',
        enterLines: [
            '（他默默递给你一张纸条，上面写着订单）',
            '（他不说话，只是指了指菜单）',
            '（他把一张纸条拍在桌上，然后坐下）'
        ],
        skipLines: ['（他只是静静看着你，然后站起来走了）'],
        perfectLines: ['（他吃完了，然后在纸条背面写了两个字：可以）'],
        goodLines: ['（他点了点头）'],
        okLines: ['（他面无表情地吃完）'],
        badLines: ['（他停下筷子，看了你一眼）'],
        poisonLines: ['（他默默把碗推开，站起来，走了）']
    },
    {
        id: 'graves',
        name: 'Graves',
        avatar: '🤠',
        tag: '老板 · 要求最高',
        timer: 50,
        orderRange: [3, 4],
        difficulty: 'boss',
        // 必点 2 道 3+ 原材料复杂菜
        requireComplexCount: 2,
        requireComplexMinLevel: 3,
        // 30% 概率点 5 原材料
        chanceSuperDish: 0.3,
        enterLines: [
            'Darlin\'，来四份。要有点水平的。',
            '今天我累了，做几道像样的。别让我失望。',
            '（他坐下来，看着你，眼神在说：让我看看你到底行不行）'
        ],
        skipLines: ['Darlin\'，你确定要这样？'],
        perfectLines: ['Darlin\'，这牛排比德州庄园的老厨子做得还好。我认真的。下一顿还你做。'],
        goodLines: ['能吃。比我预想的好。行了，坐下一起吃。'],
        okLines: ['还行。下次少放点盐。别的我就不挑了。'],
        badLines: ['这个……你确定是给我吃的？算了，我吃。别浪费。但下次别做了。'],
        poisonLines: ['你他妈往里面放了什么？……行了别道歉了，叫医生。……我不会告诉任何人。']
    }
];

// ---------- 评级文案 ----------
const CANTEEN_RATINGS = {
    perfect: {
        icon: '🌟',
        title: '很好吃',
        cssClass: 'rating-perfect',
        multiplier: 1.4,
        reputeDelta: 2
    },
    good: {
        icon: '✅',
        title: '还不错',
        cssClass: 'rating-good',
        multiplier: 1.0,
        reputeDelta: 1
    },
    ok: {
        icon: '➖',
        title: '一般',
        cssClass: 'rating-ok',
        multiplier: 0.6,
        reputeDelta: 0
    },
    bad: {
        icon: '❌',
        title: '好难吃',
        cssClass: 'rating-bad',
        multiplier: 0.2,
        reputeDelta: -1
    },
    poison: {
        icon: '💀',
        title: '食物中毒',
        cssClass: 'rating-poison',
        multiplier: 0,
        reputeDelta: -3,
        penalty: 80 // 罚款
    }
};

// ---------- 格瑞夫斯的小号吐槽（低分触发） ----------
const CANTEEN_GRAVES_ALT_LINES = {
    bad: "Darlin'，刚刚那牛排……我咬了三口才咽下去。我不会告诉别人。但下次我下厨。",
    poison: "你他妈往里面放了什么？……行了别道歉了，叫医生。……我不会告诉任何人。"
};

// ---------- 店铺评级等级文案 ----------
const CANTEEN_STORE_LEVELS = [
    { min: 90, level: 'S',  comment: '"暗影传奇。Darlin\'，这家店我要了。"' },
    { min: 80, level: 'A',  comment: '"金牌厨师。下个季度的团建就交给你的厨房。"' },
    { min: 70, level: 'B+', comment: '"合格厨房。继续保持。"' },
    { min: 60, level: 'B',  comment: '"勉强能吃。但还行。"' },
    { min: 50, level: 'C',  comment: '"需要改进。给你一周时间。"' },
    { min: 0,  level: 'D',  comment: '"建议关门。—— P. Graves"' }
];

// ---------- 调试用：打印数据是否加载成功 ----------
console.log('[暗影食堂] 数据已加载:', {
    npc数量: CANTEEN_NPCS.length,
    菜品数量: CANTEEN_DISHES.length,
    食材数量: Object.keys(CANTEEN_INGREDIENTS).length
});


/* ================= 暗影食堂 · 核心逻辑（上） ================= */

// 运行时状态（不存档，退出后丢弃）
let canteenSession = {
    npcList: [],
    currentIndex: 0,
    currentNpc: null,
    currentOrder: [],
    currentOrderTotal: 0,
    selectedIngredients: [],
    orderTimeLimit: 0,
    orderTimeRemaining: 0,
    orderTimerId: null,
    acceptTimerId: null,
    acceptTimeRemaining: 0,
    phase: 'idle'
};

window.startCanteenDay = function() {
    if (canteenState.todayOrderIndex > 0 && canteenState.todayOrderIndex < 9) {
        const resume = confirm('检测到今天有未完成的营业。\n\n点【确定】继续今天的进度\n点【取消】重新开始今天');
        if (!resume) {
            canteenState.todayOrderIndex = 0;
            canteenState.todayRevenue = 0;
            canteenState.todayOrders = [];
            saveCanteenState();
        }
    }
    canteenSession.npcList = generateSessionNpcList();
    canteenSession.currentIndex = canteenState.todayOrderIndex || 0;
    showCanteenScreen('canteenGameScreen');
    updateCanteenProgressUI();
    renderCurrentCustomer();
};

window.resumeCanteenDay = function() {
    canteenSession.currentIndex = canteenState.todayOrderIndex || 0;
    if (!canteenSession.npcList || canteenSession.npcList.length === 0) {
        canteenSession.npcList = generateSessionNpcList();
    }
    showCanteenScreen('canteenGameScreen');
    updateCanteenProgressUI();
    renderCurrentCustomer();
};

window.restartCanteenDay = function() {
    canteenState.todayOrderIndex = 0;
    canteenState.todayRevenue = 0;
    canteenState.todayOrders = [];
    saveCanteenState();
    canteenSession.npcList = generateSessionNpcList();
    canteenSession.currentIndex = 0;
    showCanteenScreen('canteenGameScreen');
    updateCanteenProgressUI();
    renderCurrentCustomer();
};

// 生成整局的 NPC 列表（9-10 位，格瑞夫斯 0-2 次）
function generateSessionNpcList() {
    const totalCustomers = 9 + Math.floor(Math.random() * 2);
    const gravesNpc = CANTEEN_NPCS.find(n => n.id === 'graves');
    const otherNpcs = CANTEEN_NPCS.filter(n => n.id !== 'graves');
    
    let gravesCount = 0;
    const roll = Math.random();
    if (roll < 0.33) gravesCount = 0;
    else if (roll < 0.75) gravesCount = 1;
    else gravesCount = 2;
    
    const otherCount = totalCustomers - gravesCount;
    const npcList = [];
    const shuffledOthers = [...otherNpcs].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < otherCount; i++) {
        if (i < shuffledOthers.length) {
            npcList.push(shuffledOthers[i]);
        } else {
            npcList.push(otherNpcs[Math.floor(Math.random() * otherNpcs.length)]);
        }
    }
    
    for (let i = 0; i < gravesCount; i++) {
        npcList.push(gravesNpc);
    }
    
    npcList.sort(() => Math.random() - 0.5);
    return npcList;
}

function updateCanteenProgressUI() {
    const total = canteenSession.npcList ? canteenSession.npcList.length : 9;
    const idx = Math.min(canteenSession.currentIndex + 1, total);
    const progressEl = document.getElementById('canteenProgress');
    if (progressEl) progressEl.textContent = `第 ${canteenState.currentDay} 天 · 订单 ${idx}/${total}`;
    const moneyEl = document.getElementById('canteenMoney');
    if (moneyEl) moneyEl.textContent = `💰 $${(canteenState.todayRevenue || 0).toLocaleString('en-US')}`;
    const reputeEl = document.getElementById('canteenRepute');
    if (reputeEl) reputeEl.textContent = `⭐ ${canteenState.repute || 50}`;
}

// 渲染当前顾客（点单阶段）
function renderCurrentCustomer() {
    if (canteenSession.acceptTimerId) {
        clearInterval(canteenSession.acceptTimerId);
        canteenSession.acceptTimerId = null;
    }
    if (canteenSession.orderTimerId) {
        clearInterval(canteenSession.orderTimerId);
        canteenSession.orderTimerId = null;
    }
    
    if (canteenSession.currentIndex >= canteenSession.npcList.length) {
        endCanteenDay();
        return;
    }
    
    const npc = canteenSession.npcList[canteenSession.currentIndex];
    canteenSession.currentNpc = npc;
    canteenSession.phase = 'accept';
    
    const order = generateOrder(npc);
    canteenSession.currentOrder = order;
    canteenSession.currentOrderTotal = order.reduce((sum, d) => sum + d.price, 0);
    
    const area = document.getElementById('canteenCustomerArea');
    if (!area) return;
    
    const enterLine = npc.enterLines[Math.floor(Math.random() * npc.enterLines.length)];
    let orderCardsHtml = '';
    order.forEach(dish => {
        orderCardsHtml += `
            <div class="canteen-order-card">
                <span class="canteen-order-card-name">${dish.name}</span>
                <span class="canteen-order-card-price">$${dish.price}</span>
            </div>
        `;
    });
    
    area.innerHTML = `
        <div class="canteen-customer-header">
            <div class="canteen-customer-avatar">${npc.avatar}</div>
            <div>
                <div class="canteen-customer-name">${npc.name}</div>
                <div class="canteen-customer-tag">${npc.tag}</div>
            </div>
        </div>
        <div class="canteen-customer-speech">"${enterLine}"</div>
        <div class="canteen-order-cards">
            ${orderCardsHtml}
            <div class="canteen-order-total">
                <span>订单合计</span>
                <span class="canteen-order-total-value">$${canteenSession.currentOrderTotal}</span>
            </div>
        </div>
        <div class="canteen-accept-buttons">
            <button class="canteen-btn-accept" onclick="acceptCanteenOrder()">接 单</button>
            <button class="canteen-btn-skip" onclick="skipCanteenOrder()">跳 过</button>
        </div>
    `;
    area.classList.add('enter');
    setTimeout(() => area.classList.remove('enter'), 500);
    
    document.getElementById('canteenFoodPanel').style.display = 'none';
    document.getElementById('canteenCookingStation').style.display = 'none';
    document.getElementById('canteenActionBar').style.display = 'none';
    
    startAcceptTimer(15);
}

function startAcceptTimer(seconds) {
    canteenSession.acceptTimeRemaining = seconds;
    const timerEl = document.getElementById('canteenTimer');
    if (timerEl) timerEl.textContent = `⏱️ ${seconds}s`;
    
    if (canteenSession.acceptTimerId) clearInterval(canteenSession.acceptTimerId);
    
    canteenSession.acceptTimerId = setInterval(() => {
        canteenSession.acceptTimeRemaining--;
        if (timerEl) timerEl.textContent = `⏱️ ${canteenSession.acceptTimeRemaining}s`;
        if (canteenSession.acceptTimeRemaining <= 0) {
            clearInterval(canteenSession.acceptTimerId);
            canteenSession.acceptTimerId = null;
            if (canteenSession.phase === 'accept') autoSkipCanteenOrder();
        }
    }, 1000);
}

window.acceptCanteenOrder = function() {
    if (canteenSession.phase !== 'accept') return;
    if (canteenSession.acceptTimerId) {
        clearInterval(canteenSession.acceptTimerId);
        canteenSession.acceptTimerId = null;
    }
    canteenSession.phase = 'cooking';
    canteenSession.selectedIngredients = [];
    startCookingStage();
};

window.skipCanteenOrder = function() {
    if (canteenSession.phase !== 'accept') return;
    if (canteenSession.acceptTimerId) {
        clearInterval(canteenSession.acceptTimerId);
        canteenSession.acceptTimerId = null;
    }
    canteenState.repute = Math.max(0, (canteenState.repute || 50) - 1);
    canteenSession.currentIndex++;
    canteenState.todayOrderIndex = canteenSession.currentIndex;
    saveCanteenState();
    updateCanteenProgressUI();
    setTimeout(renderCurrentCustomer, 300);
};

function autoSkipCanteenOrder() {
    canteenState.repute = Math.max(0, (canteenState.repute || 50) - 2);
    canteenSession.currentIndex++;
    canteenState.todayOrderIndex = canteenSession.currentIndex;
    saveCanteenState();
    updateCanteenProgressUI();
    setTimeout(renderCurrentCustomer, 300);
}

// 生成订单
function generateOrder(npc) {
    const dishes = [];
    const [minO, maxO] = npc.orderRange;
    const orderCount = minO + Math.floor(Math.random() * (maxO - minO + 1));
    const pushUnique = (dish) => {
        if (!dishes.find(d => d.name === dish.name)) { dishes.push(dish); return true; }
        return false;
    };
    
    if (npc.id === 'graves') {
        const complexPool = CANTEEN_DISHES.filter(d => d.complexity >= 3);
        let att = 0;
        while (dishes.filter(d => d.complexity >= 3).length < 2 && att < 50) {
            pushUnique(complexPool[Math.floor(Math.random() * complexPool.length)]);
            att++;
        }
        if (Math.random() < (npc.chanceSuperDish || 0)) {
            const superDish = CANTEEN_DISHES.find(d => d.complexity === 5);
            if (superDish) pushUnique(superDish);
        }
        let att2 = 0;
        while (dishes.length < orderCount && att2 < 50) {
            pushUnique(CANTEEN_DISHES[Math.floor(Math.random() * CANTEEN_DISHES.length)]);
            att2++;
        }
    } else if (npc.id === 'barrage') {
        const meatDishes = CANTEEN_DISHES.filter(d =>
            d.ingredients.some(ing => ['牛肉', '鸡肉', '鱼', '培根'].includes(ing))
        );
        pushUnique(meatDishes[Math.floor(Math.random() * meatDishes.length)]);
        let att = 0;
        while (dishes.length < orderCount && att < 50) {
            pushUnique(CANTEEN_DISHES[Math.floor(Math.random() * CANTEEN_DISHES.length)]);
            att++;
        }
    } else if (npc.id === 'mcmillan') {
        const c3Pool = CANTEEN_DISHES.filter(d => d.complexity === 3);
        pushUnique(c3Pool[Math.floor(Math.random() * c3Pool.length)]);
        let att = 0;
        while (dishes.length < orderCount && att < 50) {
            pushUnique(CANTEEN_DISHES[Math.floor(Math.random() * CANTEEN_DISHES.length)]);
            att++;
        }
    } else {
        let att = 0;
        while (dishes.length < orderCount && att < 50) {
            pushUnique(CANTEEN_DISHES[Math.floor(Math.random() * CANTEEN_DISHES.length)]);
            att++;
        }
    }
    return dishes;
}

/* ================= 暗影食堂 · 核心逻辑（下） ================= */

// 制作阶段
function startCookingStage() {
    document.getElementById('canteenFoodPanel').style.display = 'grid';
    document.getElementById('canteenCookingStation').style.display = 'flex';
    document.getElementById('canteenActionBar').style.display = 'flex';
    
    renderFoodPanel();
    renderCookingStation();
    renderActionBar();
    
    const npc = canteenSession.currentNpc;
    canteenSession.orderTimeLimit = npc.timer;
    canteenSession.orderTimeRemaining = npc.timer;
    startOrderTimer();
}

// 出餐倒计时
function startOrderTimer() {
    if (canteenSession.orderTimerId) clearInterval(canteenSession.orderTimerId);
    const timerEl = document.getElementById('canteenTimer');
    if (timerEl) timerEl.textContent = `⏱️ ${canteenSession.orderTimeRemaining}s`;
    
    canteenSession.orderTimerId = setInterval(() => {
        canteenSession.orderTimeRemaining--;
        if (timerEl) timerEl.textContent = `⏱️ ${canteenSession.orderTimeRemaining}s`;
        if (canteenSession.orderTimeRemaining <= 0) {
            clearInterval(canteenSession.orderTimerId);
            canteenSession.orderTimerId = null;
            if (canteenSession.phase === 'cooking') {
                canteenSession.orderTimeRemaining = 0;
                serveCanteenOrder();
            }
        }
    }, 1000);
}

// 渲染食材面板
function renderFoodPanel() {
    const panel = document.getElementById('canteenFoodPanel');
    if (!panel) return;
    let html = '';
    Object.entries(CANTEEN_INGREDIENTS).forEach(([name, info]) => {
        const isSelected = canteenSession.selectedIngredients.includes(name);
        html += `
            <div class="canteen-food-item ${isSelected ? 'selected' : ''}" data-cat="${info.cat}" onclick="toggleCanteenIngredient('${name}')">
                <div class="canteen-food-emoji">${info.emoji}</div>
                <div class="canteen-food-name">${info.label}</div>
            </div>
        `;
    });
    panel.innerHTML = html;
}

// 渲染料理台
function renderCookingStation() {
    const station = document.getElementById('canteenCookingStation');
    if (!station) return;
    let html = '';
    canteenSession.selectedIngredients.forEach(name => {
        const info = CANTEEN_INGREDIENTS[name];
        html += `<div class="canteen-cooking-chip" onclick="removeCanteenIngredient('${name}')">${info.emoji} ${name}</div>`;
    });
    station.innerHTML = html;
}

// 渲染操作按钮
function renderActionBar() {
    const bar = document.getElementById('canteenActionBar');
    if (!bar) return;
    bar.innerHTML = `
        <button class="canteen-btn-recipe" onclick="showCanteenRecipe()">查看配方</button>
        <button class="canteen-btn-serve" onclick="serveCanteenOrder()">出 餐</button>
    `;
}

// 切换食材
window.toggleCanteenIngredient = function(name) {
    if (canteenSession.phase !== 'cooking') return;
    const idx = canteenSession.selectedIngredients.indexOf(name);
    if (idx > -1) {
        canteenSession.selectedIngredients.splice(idx, 1);
    } else {
        canteenSession.selectedIngredients.push(name);
    }
    renderFoodPanel();
    renderCookingStation();
};

window.removeCanteenIngredient = function(name) {
    if (canteenSession.phase !== 'cooking') return;
    const idx = canteenSession.selectedIngredients.indexOf(name);
    if (idx > -1) canteenSession.selectedIngredients.splice(idx, 1);
    renderFoodPanel();
    renderCookingStation();
};

// 配方速查
window.showCanteenRecipe = function() {
    if (canteenSession.phase !== 'cooking') return;
    const modal = document.getElementById('canteenRecipeModal');
    const listEl = document.getElementById('canteenRecipeList');
    if (!modal || !listEl) return;
    let html = '';
    canteenSession.currentOrder.forEach(dish => {
        html += `
            <div class="canteen-recipe-item">
                <div class="canteen-recipe-name">${dish.name} · $${dish.price}</div>
                <div class="canteen-recipe-ingredients">配方：${dish.ingredients.join(' + ')}</div>
            </div>
        `;
    });
    listEl.innerHTML = html;
    modal.classList.add('active');
};

window.closeCanteenRecipe = function() {
    const modal = document.getElementById('canteenRecipeModal');
    if (modal) modal.classList.remove('active');
};

// 出餐
window.serveCanteenOrder = function() {
    if (canteenSession.phase !== 'cooking') return;
    canteenSession.phase = 'rating';
    if (canteenSession.orderTimerId) {
        clearInterval(canteenSession.orderTimerId);
        canteenSession.orderTimerId = null;
    }
    const result = calculateCanteenScore();
    showCanteenRating(result);
};

// 评分算法
function calculateCanteenScore() {
    const order = canteenSession.currentOrder;
    const selected = canteenSession.selectedIngredients;
    const remaining = canteenSession.orderTimeRemaining;
    
    const requiredSet = new Set();
    order.forEach(dish => dish.ingredients.forEach(ing => requiredSet.add(ing)));
    const required = [...requiredSet];
    
    const correct = selected.filter(ing => required.includes(ing));
    const wrong = selected.filter(ing => !required.includes(ing));
    const missing = required.filter(ing => !selected.includes(ing));
    
    let baseScore = required.length > 0 ? (correct.length / required.length) * 100 : 0;
    let timeBonus = Math.min(remaining * 1.5, 20);
    let wrongPenalty = wrong.length * 25;
    let missingPenalty = missing.length * 15;
    
    let totalScore = baseScore + timeBonus - wrongPenalty - missingPenalty;
    totalScore = Math.max(0, Math.round(totalScore));
    
    let poisoned = false;
    if (wrong.length >= 3) poisoned = true;
    if (selected.length > 0 && wrong.length === selected.length && selected.length >= 2) poisoned = true;
    if (totalScore < 25) poisoned = true;
    
    let ratingKey;
    if (poisoned) ratingKey = 'poison';
    else if (totalScore >= 100) ratingKey = 'perfect';
    else if (totalScore >= 80) ratingKey = 'good';
    else if (totalScore >= 55) ratingKey = 'ok';
    else ratingKey = 'bad';
    
    const ratingInfo = CANTEEN_RATINGS[ratingKey];
    let paid = Math.round(canteenSession.currentOrderTotal * ratingInfo.multiplier);
    if (ratingInfo.penalty) paid -= ratingInfo.penalty;
    paid = Math.max(0, paid);
    
    return { score: totalScore, ratingKey, ratingInfo, correct, wrong, missing, paid, remaining };
}

// 显示评分弹窗
function showCanteenRating(result) {
    const npc = canteenSession.currentNpc;
    const modal = document.getElementById('canteenRatingModal');
    const iconEl = document.getElementById('canteenRatingIcon');
    const titleEl = document.getElementById('canteenRatingTitle');
    const descEl = document.getElementById('canteenRatingDesc');
    const payEl = document.getElementById('canteenRatingPay');
    if (!modal) return;
    
    iconEl.textContent = result.ratingInfo.icon;
    iconEl.className = 'canteen-rating-icon ' + result.ratingInfo.cssClass;
    titleEl.textContent = result.ratingInfo.title;
    titleEl.className = 'canteen-rating-title ' + result.ratingInfo.cssClass;
    
    let npcLine = '';
    if (result.ratingKey === 'perfect') npcLine = npc.perfectLines[0];
    else if (result.ratingKey === 'good') npcLine = npc.goodLines[0];
    else if (result.ratingKey === 'ok') npcLine = npc.okLines[0];
    else if (result.ratingKey === 'bad') npcLine = npc.badLines[0];
    else npcLine = npc.poisonLines[0];
    
    descEl.innerHTML = `"${npcLine}"<br><br>
        <span style="color: var(--text-muted); font-size: 11px;">
        正确 ${result.correct.length} / 漏放 ${result.missing.length} / 错误 ${result.wrong.length}<br>
        得分：${result.score} / 120
        </span>`;
    
    payEl.textContent = result.paid > 0 ? `+ $${result.paid}` : (result.ratingInfo.penalty ? `- $${result.ratingInfo.penalty} 罚款` : '+ $0');
    payEl.style.color = result.paid > 0 ? '#2ecc71' : '#e03e3e';
    
    modal.classList.add('active');
    
    canteenState.todayRevenue = (canteenState.todayRevenue || 0) + result.paid;
    canteenState.repute = Math.max(0, (canteenState.repute || 50) + result.ratingInfo.reputeDelta);
    
    canteenState.todayOrders.push({
        npc: npc.name,
        score: result.score,
        rating: result.ratingInfo.title,
        paid: result.paid
    });
    
    if (result.ratingKey === 'perfect') canteenState.perfectCount = (canteenState.perfectCount || 0) + 1;
    if (result.ratingKey === 'poison') canteenState.poisonedCount = (canteenState.poisonedCount || 0) + 1;
    
    if (npc.id === 'graves' && (result.ratingKey === 'bad' || result.ratingKey === 'poison')) {
        setTimeout(() => { triggerGravesCanteenAlt(result.ratingKey); }, 3000);
    }
    
    saveCanteenState();
    updateCanteenProgressUI();
}

// 关闭评分 → 下一位
window.closeCanteenRating = function() {
    const modal = document.getElementById('canteenRatingModal');
    if (modal) modal.classList.remove('active');
    canteenSession.currentIndex++;
    canteenState.todayOrderIndex = canteenSession.currentIndex;
    saveCanteenState();
    updateCanteenProgressUI();
    setTimeout(renderCurrentCustomer, 300);
};

// 格瑞夫斯低分吐槽
function triggerGravesCanteenAlt(ratingKey) {
    const line = CANTEEN_GRAVES_ALT_LINES[ratingKey];
    if (!line) return;
    
    if (typeof chatHistories !== 'undefined') {
        if (!chatHistories['graves_alt']) chatHistories['graves_alt'] = [];
        chatHistories['graves_alt'].push({ sender: 'received', text: line, time: '刚刚' });
    }
    
    if (typeof triggerGravesAltMessage === 'function') {
        triggerGravesAltMessage(line);
    }
    
    if (typeof saveGameState === 'function') saveGameState();
}

// 日终结算
function endCanteenDay() {
    canteenState.totalRevenue = (canteenState.totalRevenue || 0) + canteenState.todayRevenue;
    canteenState.totalDaysCompleted = (canteenState.totalDaysCompleted || 0) + 1;
    
    // 核心修复：记录最近10天的每日营收
    if (!canteenState.recentDailyRevenue) canteenState.recentDailyRevenue = [];
    canteenState.recentDailyRevenue.push(canteenState.todayRevenue);
    if (canteenState.recentDailyRevenue.length > 10) {
        canteenState.recentDailyRevenue.shift(); // 只保留最近10天
    }
    
    const modal = document.getElementById('canteenDayEndModal');
    const titleEl = document.getElementById('canteenDayEndTitle');
    const summaryEl = document.getElementById('canteenDaySummary');
    
    if (titleEl) titleEl.textContent = `经营日 #${canteenState.currentDay} · 结算`;
    
    let summaryText = `总收入：$${canteenState.todayRevenue.toLocaleString('en-US')}\n`;
    summaryText += `声誉：${canteenState.repute || 50}\n`;
    summaryText += `订单数：${canteenState.todayOrders.length}\n`;
    summaryText += `─────────────\n`;
    canteenState.todayOrders.forEach(o => {
        summaryText += `${o.npc}  $${o.paid} (${o.rating})\n`;
    });
    
    if (summaryEl) summaryEl.textContent = summaryText;
    if (modal) modal.classList.add('active');
}
// 关闭日终结算 → 下一天
window.closeCanteenDayEnd = function() {
    const modal = document.getElementById('canteenDayEndModal');
    if (modal) modal.classList.remove('active');
    
    const daysCompleted = canteenState.totalDaysCompleted || 0;
    canteenState.currentDay++;
    canteenState.todayOrderIndex = 0;
    canteenState.todayRevenue = 0;
    canteenState.todayOrders = [];
    canteenSession.currentIndex = 0;
    
    saveCanteenState();
    
    if (daysCompleted > 0 && daysCompleted % 10 === 0) {
        showCanteenStoreRank();
    } else {
        refreshCanteenMenu();
        showCanteenScreen('canteenMenuScreen');
    }
};

// 10 日店铺评级
function showCanteenStoreRank() {
    const daysCompleted = canteenState.totalDaysCompleted || 1;
    
    // 核心修复：计算近 10 天的平均每日收入
    let recentAvgRevenue = 0;
    if (canteenState.recentDailyRevenue && canteenState.recentDailyRevenue.length > 0) {
        recentAvgRevenue = canteenState.recentDailyRevenue.reduce((a, b) => a + b, 0) / canteenState.recentDailyRevenue.length;
    } else {
        recentAvgRevenue = (canteenState.totalRevenue || 0) / daysCompleted;
    }

    let score = 0;
    score += Math.min(recentAvgRevenue / 10, 60); // 根据近10天平均收入，最高60分
    
    const totalOrders = canteenState.totalDaysCompleted * 9; 
    const perfectRate = (canteenState.perfectCount || 0) / (totalOrders || 1);
    score += Math.min(perfectRate * 100, 30); // 完美订单占比，最高30分
    
    const poisonedRate = (canteenState.poisonedCount || 0) / (totalOrders || 1);
    score -= Math.min(poisonedRate * 100, 20); // 中毒惩罚，最高扣20分
    
    score = Math.max(0, Math.min(100, score));
    
    let level = 'D';
    let comment = '';
    for (const l of CANTEEN_STORE_LEVELS) {
        if (score >= l.min) { level = l.level; comment = l.comment; break; }
    }
    
    canteenState.storeLevel = level;
    saveCanteenState();
    
    const modal = document.getElementById('canteenStoreRankModal');
    const rankEl = document.getElementById('canteenStoreRank');
    const commentEl = document.getElementById('canteenStoreComment');
    if (rankEl) rankEl.textContent = level;
    if (commentEl) commentEl.textContent = comment;
    if (modal) modal.classList.add('active');
}
window.closeCanteenStoreRank = function() {
    const modal = document.getElementById('canteenStoreRankModal');
    if (modal) modal.classList.remove('active');
    refreshCanteenMenu();
    showCanteenScreen('canteenMenuScreen');
};

// 覆盖打烊逻辑（清理计时器 + 累计）
window.doCloseDay = function() {
    const modal = document.getElementById('canteenCloseConfirmModal');
    if (modal) modal.classList.remove('active');
    
    if (canteenSession.acceptTimerId) clearInterval(canteenSession.acceptTimerId);
    if (canteenSession.orderTimerId) clearInterval(canteenSession.orderTimerId);
    canteenSession.acceptTimerId = null;
    canteenSession.orderTimerId = null;
    
    canteenState.totalRevenue = (canteenState.totalRevenue || 0) + canteenState.todayRevenue;
    canteenState.repute = Math.max(0, (canteenState.repute || 50) - 1);
    canteenState.todayOrderIndex = 0;
    canteenState.todayRevenue = 0;
    canteenState.todayOrders = [];
    canteenState.currentDay++;
    canteenState.totalDaysCompleted = (canteenState.totalDaysCompleted || 0) + 1;
    
    canteenSession.currentIndex = 0;
    
    saveCanteenState();
    refreshCanteenMenu();
    showCanteenScreen('canteenMenuScreen');
};

// 暂停（清理计时器）
window.pauseCanteen = function() {
    if (canteenSession.acceptTimerId) { clearInterval(canteenSession.acceptTimerId); canteenSession.acceptTimerId = null; }
    if (canteenSession.orderTimerId) { clearInterval(canteenSession.orderTimerId); canteenSession.orderTimerId = null; }
    const modal = document.getElementById('canteenPauseModal');
    if (modal) modal.classList.add('active');
};

// 从暂停恢复
window.resumeCanteen = function() {
    const modal = document.getElementById('canteenPauseModal');
    if (modal) modal.classList.remove('active');
    if (canteenSession.phase === 'accept' && canteenSession.acceptTimeRemaining > 0) {
        startAcceptTimer(canteenSession.acceptTimeRemaining);
    } else if (canteenSession.phase === 'cooking' && canteenSession.orderTimeRemaining > 0) {
        startOrderTimer();
    }
};

// 回到主菜单
window.exitCanteenToMenu = function() {
    if (canteenSession.acceptTimerId) clearInterval(canteenSession.acceptTimerId);
    if (canteenSession.orderTimerId) clearInterval(canteenSession.orderTimerId);
    canteenSession.acceptTimerId = null;
    canteenSession.orderTimerId = null;
    const modal = document.getElementById('canteenPauseModal');
    if (modal) modal.classList.remove('active');
    saveCanteenState();
    refreshCanteenMenu();
    showCanteenScreen('canteenMenuScreen');
};

console.log('[暗影食堂] 核心逻辑已加载 ✅');


// ================= 坎布雷亚事件档案逻辑 =================
(function() {
    // 独立作用域，避免与现有全局变量冲突
    window.openRavenArchive = function() {
        const overlay = document.getElementById('ravenOverlay');
        if (overlay) {
            overlay.classList.add('active');
            // 可选：打开时顺便强制关闭其他冲突弹窗
            if (typeof closeAppCenter === 'function') closeAppCenter(); 
            if (typeof closeBlackBox === 'function') closeBlackBox();
            if (typeof closeDroneView === 'function') closeDroneView();
        }
    };

    window.closeRavenArchive = function() {
        const overlay = document.getElementById('ravenOverlay');
        if (overlay) overlay.classList.remove('active');
    };
})();

/* ================= 暗影数独 · 核心逻辑（带倒计时与结算） ================= */
(function() {
    // 独立作用域，绝不污染外部变量
    let sdBoard = [];       // 当前盘面 (0-9)
    let sdSolution = [];    // 答案
    let sdNotes = [];       // 笔记 (Set数组)
    let sdSelected = null;  // 当前选中的格子 {r, c}
    let sdNoteMode = false; // 笔记模式开关
    const SD_SAVE_KEY = 'shadow_sudoku_save';
    
    // 👇 新增：时间管理变量
    const SD_TOTAL_TIME = 15 * 60; // 总时间 15 分钟 (900秒)
    let sdTimeLeft = SD_TOTAL_TIME;
    let sdTimerInterval = null;
    let sdGameActive = false;

    // --- 数独生成算法 ---
    function generateSolution() {
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        function isValid(r, c, num) {
            for (let i = 0; i < 9; i++) {
                if (board[r][i] === num || board[i][c] === num) return false;
            }
            const startR = Math.floor(r / 3) * 3, startC = Math.floor(c / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[startR + i][startC + j] === num) return false;
                }
            }
            return true;
        }
        function solve() {
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (board[r][c] === 0) {
                        const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                        for (let num of nums) {
                            if (isValid(r, c, num)) {
                                board[r][c] = num;
                                if (solve()) return true;
                                board[r][c] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }
        solve();
        return board;
    }

// 检查某个数字放在 (r,c) 是否合法
function isValidPlacement(board, r, c, num) {
    for (let i = 0; i < 9; i++) {
        if (board[r][i] === num || board[i][c] === num) return false;
    }
    const sr = Math.floor(r / 3) * 3;
    const sc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[sr + i][sc + j] === num) return false;
        }
    }
    return true;
}

// 数解的数量（最多数到 limit 个就停，用于判断唯一性）
function countSolutions(board, limit = 2) {
    let count = 0;
    function solve() {
        if (count >= limit) return;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValidPlacement(board, r, c, num)) {
                            board[r][c] = num;
                            solve();
                            board[r][c] = 0;
                            if (count >= limit) return;
                        }
                    }
                    return; // 这个空格无解，回溯
                }
            }
        }
        count++; // 找到一个完整解
    }
    solve();
    return count;
}

    // --- 挖空生成谜题 ---
    function createSudoku() {
    const fullSolution = generateSolution();
    const puzzle = fullSolution.map(row => [...row]);

    // 把所有位置打乱后依次尝试挖洞
    const positions = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) positions.push({ r, c });
    }
    positions.sort(() => Math.random() - 0.5);

    let holesTarget = 45;
    let holesMade = 0;

    for (const pos of positions) {
        if (holesMade >= holesTarget) break;

        const backup = puzzle[pos.r][pos.c];
        puzzle[pos.r][pos.c] = 0; // 试探性挖掉

        // 检查是否仍唯一解
        const testBoard = puzzle.map(row => [...row]);
        if (countSolutions(testBoard, 2) !== 1) {
            // 挖掉后不止一个解，撤销
            puzzle[pos.r][pos.c] = backup;
        } else {
            holesMade++;
        }
    }

    console.log(`[数独] 生成完毕，实际挖了 ${holesMade} 个洞（目标 45）`);
    return { puzzle, fullSolution };
}

    // --- 计时器逻辑 ---
    function startTimer() {
        stopTimer(); // 清理旧计时器
        sdTimeLeft = SD_TOTAL_TIME;
        updateTimerDisplay();
        
        sdTimerInterval = setInterval(() => {
            sdTimeLeft--;
            updateTimerDisplay();
            
            if (sdTimeLeft <= 0) {
                stopTimer();
                sdGameActive = false;
                showSdResult(false, '行动超时', '时间耗尽。敌方已经转移了目标。\n\n下次动作快点，战场可不等你。', 'F');
            }
        }, 1000);
    }

    function stopTimer() {
        if (sdTimerInterval) {
            clearInterval(sdTimerInterval);
            sdTimerInterval = null;
        }
    }

    function updateTimerDisplay() {
        const timerEl = document.getElementById('sdTimerDisplay');
        if (!timerEl) return;
        const m = String(Math.floor(sdTimeLeft / 60)).padStart(2, '0');
        const s = String(sdTimeLeft % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
        
        // 剩余时间少于 3 分钟变红闪烁
        if (sdTimeLeft <= 180) {
            timerEl.classList.add('warning');
        } else {
            timerEl.classList.remove('warning');
        }
    }

    // --- 结算弹窗 ---
    function showSdResult(isWin, title, desc, rank) {
        stopTimer();
        sdGameActive = false;
        
        const overlay = document.getElementById('sdResultOverlay');
        const titleEl = document.getElementById('sdResultTitle');
        const rankEl = document.getElementById('sdResultRank');
        const descEl = document.getElementById('sdResultDesc');
        
        titleEl.textContent = title;
        titleEl.className = 'sd-result-title' + (isWin ? '' : ' fail');
        rankEl.textContent = rank;
        rankEl.className = 'sd-result-rank' + (rank === 'S' ? ' rank-s' : rank === 'A' ? ' rank-a' : rank === 'B' ? ' rank-b' : ' rank-f');
        descEl.textContent = desc;
        
        overlay.classList.add('active');
    }

    window.closeSdResult = function() {
        const overlay = document.getElementById('sdResultOverlay');
        if (overlay) overlay.classList.remove('active');
    };

    // --- 初始化与存档 ---
    function initSudoku() {
        const saved = localStorage.getItem(SD_SAVE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                sdBoard = data.board;
                sdSolution = data.solution;
                if (data.notes) {
                    sdNotes = data.notes.map(row => row.map(arr => new Set(arr)));
                } else {
                    sdNotes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
                }
                sdSelected = null;
                sdNoteMode = false;
                renderSudoku();
                
                // 读取到存档，恢复计时
                sdGameActive = true;
                startTimer();
                return;
            } catch(e) { console.warn('数独存档读取失败', e); }
        }
        startNewSudoku();
    }

    function startNewSudoku() {
        const { puzzle, fullSolution } = createSudoku();
        sdBoard = puzzle;
        sdSolution = fullSolution;
        sdNotes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
        sdSelected = null;
        sdNoteMode = false;
        sdGameActive = true;
        
        const noteBtn = document.getElementById('sdNoteBtn');
        if (noteBtn) noteBtn.classList.remove('sd-note-active');
        
        // 隐藏结算弹窗
        window.closeSdResult();
        
        renderSudoku();
        saveSudoku();
        startTimer(); // 开始倒计时
    }

    function saveSudoku() {
        const data = {
            board: sdBoard,
            solution: sdSolution,
            notes: sdNotes.map(row => row.map(set => [...set]))
        };
        localStorage.setItem(SD_SAVE_KEY, JSON.stringify(data));
    }

    // --- 渲染（保持不变） ---
    function renderSudoku() {
        const boardEl = document.getElementById('sdBoard');
        if (!boardEl) return;
        boardEl.innerHTML = '';

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.className = 'sd-cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                if (sdBoard[r][c] !== 0 && sdSolution[r][c] === sdBoard[r][c]) {
                    cell.classList.add('sd-fixed');
                }

                if (sdBoard[r][c] !== 0) {
                    cell.textContent = sdBoard[r][c];
                    if (sdBoard[r][c] !== sdSolution[r][c]) {
                        cell.classList.add('sd-error');
                    }
                } else {
                    const notes = sdNotes[r][c];
                    if (notes && notes.size > 0) {
                        const notesGrid = document.createElement('div');
                        notesGrid.className = 'sd-notes-grid';
                        for (let i = 1; i <= 9; i++) {
                            const span = document.createElement('span');
                            span.textContent = notes.has(i) ? i : '';
                            notesGrid.appendChild(span);
                        }
                        cell.appendChild(notesGrid);
                    }
                }

                if (sdSelected) {
                    const { r: sr, c: sc } = sdSelected;
                    if (r === sr && c === sc) cell.classList.add('sd-selected');
                    else if (r === sr || c === sc || (Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3))) {
                        cell.classList.add('sd-highlight');
                    }
                    if (sdBoard[r][c] !== 0 && sdBoard[r][c] === sdBoard[sr][sc]) {
                        cell.classList.add('sd-same-num');
                    }
                }

                cell.onclick = () => selectSudokuCell(r, c);
                boardEl.appendChild(cell);
            }
        }
    }

    // --- 交互逻辑 ---
    function selectSudokuCell(r, c) {
        if (!sdGameActive) return; // 游戏结束禁止操作
        sdSelected = { r, c };
        renderSudoku();
    }

    window.sdInputNumber = function(num) {
        if (!sdGameActive || !sdSelected) return;
        const { r, c } = sdSelected;
        
        if (sdBoard[r][c] !== 0 && sdSolution[r][c] === sdBoard[r][c] && !sdNoteMode) return;

        if (sdNoteMode) {
            if (sdBoard[r][c] !== 0) return;
            if (sdNotes[r][c].has(num)) {
                sdNotes[r][c].delete(num);
            } else {
                sdNotes[r][c].add(num);
            }
        } else {
            if (sdBoard[r][c] === num) {
                sdBoard[r][c] = 0;
            } else {
                sdBoard[r][c] = num;
                sdNotes[r][c].clear();
                if (num === sdSolution[r][c]) {
                    clearRelatedNotes(r, c, num);
                }
            }
        }
        
        renderSudoku();
        saveSudoku();
        checkSudokuWin();
    };

    window.sdClearCell = function() {
        if (!sdGameActive || !sdSelected) return;
        const { r, c } = sdSelected;
        if (sdBoard[r][c] !== 0 && sdSolution[r][c] === sdBoard[r][c] && !sdNoteMode) return;
        sdBoard[r][c] = 0;
        sdNotes[r][c].clear();
        renderSudoku();
        saveSudoku();
    };

    window.sdToggleNote = function() {
        sdNoteMode = !sdNoteMode;
        const btn = document.getElementById('sdNoteBtn');
        if (sdNoteMode) btn.classList.add('sd-note-active');
        else btn.classList.remove('sd-note-active');
    };

    window.sdRestart = function() {
        if (confirm('确认重新推演？当前进度将丢失。')) {
            startNewSudoku();
        }
    };

    function clearRelatedNotes(r, c, num) {
        for (let i = 0; i < 9; i++) {
            sdNotes[r][i].delete(num);
            sdNotes[i][c].delete(num);
        }
        const startR = Math.floor(r / 3) * 3;
        const startC = Math.floor(c / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                sdNotes[startR + i][startC + j].delete(num);
            }
        }
    }

    // --- 胜利检测与评级 ---
    function checkSudokuWin() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (sdBoard[r][c] !== sdSolution[r][c]) return;
            }
        }
        
        // 胜利！
        stopTimer();
        sdGameActive = false;
        localStorage.removeItem(SD_SAVE_KEY); // 胜利后清空存档
        
        // 计算评级
        const ratio = sdTimeLeft / SD_TOTAL_TIME;
        let rank, title, desc;
        
        if (ratio >= 0.6) {
            rank = 'S'; title = '解码成功 · S级';
            desc = `剩余时间：${Math.floor(sdTimeLeft/60)}分${sdTimeLeft%60}秒\n\nDarlin'，你的脑子比我的狙击手还快。这份情报完美无缺。`;
        } else if (ratio >= 0.3) {
            rank = 'A'; title = '解码成功 · A级';
            desc = `剩余时间：${Math.floor(sdTimeLeft/60)}分${sdTimeLeft%60}秒\n\n干得漂亮。速度尚可，但下次别让我等这么久。`;
        } else {
            rank = 'B'; title = '解码成功 · B级';
            desc = `剩余时间：${Math.floor(sdTimeLeft/60)}分${sdTimeLeft%60}秒\n\n勉强及格。下次动作快点，战场上可没这么多时间给你思考。`;
        }
        
        // 联动格瑞夫斯小号
        if (typeof triggerGravesAltMessage === 'function') {
            triggerGravesAltMessage(`Darlin'，我看到你把逻辑加密解开了，评级：${rank}。`);
        }
        
        setTimeout(() => {
            showSdResult(true, title, desc, rank);
        }, 300);
    }

    // --- 全局暴露 ---
    window.openSudokuGame = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();
        
        const overlay = document.getElementById('sdOverlay');
        if (overlay) {
            if (overlay.parentNode !== document.body) {
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'flex';
            overlay.classList.add('active');
        }
        initSudoku();
    };

    window.closeSudokuGame = function() {
        stopTimer(); // 关闭时停止计时
        const overlay = document.getElementById('sdOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }
    };
})();

/* ================= 暗影回收 · 抓取游戏逻辑 ================= */
(function() {
    // --- 独立变量作用域，绝不污染外部 ---
    let clawCtx = null;
    let clawCanvas = null;
    let clawAnimId = null;
    let clawTimerId = null;

    // 游戏状态
    let clawState = 'idle'; // idle, shooting, retracting
    let clawAngle = 0; // 当前角度（弧度）
    let clawAngleDir = 1; // 摆动方向
    let clawLength = 40; // 当前伸出长度（默认为40，让钩子能明显摆动）
    const clawMaxLength = 320; // 最大伸出长度
    const clawOrigin = { x: 180, y: 20 }; // 钩子原点（向下移动20，防止被画布顶部裁剪）
    
    // 核心数据
    let clawScore = 0;
    let clawTotalScore = 0;
    let clawLevel = 1;
    let clawTimeLeft = 30;
    let clawItems = [];
    let clawGrabbedItem = null;

    // 物资配置 (Emoji, 分数, 重量速度, 半径)
    const ITEM_CONFIG = [
        { emoji: '🟫', score: 50, speed: 8, r: 15, type: 'light' },   // 子弹盒
        { emoji: '💊', score: 100, speed: 7, r: 15, type: 'light' },  // 医疗包
        { emoji: '🔫', score: 300, speed: 4, r: 20, type: 'mid' },    // 枪械箱
        { emoji: '🚀', score: 500, speed: 3.5, r: 20, type: 'mid' },  // 导弹部件
        { emoji: '⚙️', score: 1000, speed: 2, r: 25, type: 'heavy' }, // 引擎
        { emoji: '🛞', score: -50, speed: 10, r: 15, type: 'trash' }, // 破轮胎
        { emoji: '🗑️', score: -100, speed: 11, r: 15, type: 'trash' } // 铁桶
    ];

    // 格瑞夫斯的吐槽台词库
    const GRAVES_LINES = {
        grabLight: ["这玩意儿能换顿饭钱。", "顺手牵羊，不错。"],
        grabMid: ["干得漂亮，这才是硬通货。", "有点分量，收下了。"],
        grabHeavy: ["卧槽！大货！", "这趟值了！"],
        grabTrash: ["我他妈服了，你捞个破轮胎上来干嘛？", "你的眼神跟瞎子一样。"],
        timeout: ["时间到！你是来度假的吗？", "太慢了，敌人早跑了！"],
        levelUp: ["下一关，难度提升了。别让我失望。", "敌人的警戒越来越严了，小心点。"]
    };

    // --- 初始化画布 ---
    function initClawCanvas() {
        clawCanvas = document.getElementById('clawCanvas');
        if (clawCanvas) {
            clawCtx = clawCanvas.getContext('2d');
        }
    }

    // --- 关卡生成 ---
function clawGenerateLevel() {
    clawItems = [];
    clawLength = 40;
    clawState = 'idle';
    clawAngle = 0;
    clawAngleDir = 1;
    clawGrabbedItem = null;

    // ✅ 重置按钮（顺便修复上一个 bug）
    const clawBtn = document.getElementById('clawShootBtn');
    if (clawBtn) {
        clawBtn.disabled = false;
        clawBtn.textContent = '发 射 钩 索';
    }

    // ✅ 关键修复：物品生成限制在钩子可达范围内
    const originX = 180;                // 和 clawOrigin.x 保持一致
    const originY = 20;                 // 和 clawOrigin.y 保持一致
    const safeReach = clawMaxLength - 25; // 安全可达半径（留余量）
    const maxSwing = Math.PI / 2.5 - 0.1; // 摆动最大角度（留一点余量）

    let itemCount = 6 + clawLevel * 2;
    let attempts = 0;
    const maxAttempts = 400;

    while (clawItems.length < itemCount && attempts < maxAttempts) {
        attempts++;

        // ---- 选择配置（保持原有逻辑）----
        let config;
        let rand = Math.random();
        if (clawLevel === 1) {
            config = rand < 0.7 ? ITEM_CONFIG[0] : ITEM_CONFIG[1];
        } else if (clawLevel === 2) {
            if (rand < 0.4) config = ITEM_CONFIG[0];
            else if (rand < 0.7) config = ITEM_CONFIG[1];
            else if (rand < 0.9) config = ITEM_CONFIG[2];
            else config = ITEM_CONFIG[5];
        } else if (clawLevel === 3) {
            if (rand < 0.2) config = ITEM_CONFIG[1];
            else if (rand < 0.5) config = ITEM_CONFIG[2];
            else if (rand < 0.7) config = ITEM_CONFIG[3];
            else if (rand < 0.85) config = ITEM_CONFIG[5];
            else config = ITEM_CONFIG[6];
        } else {
            if (rand < 0.15) config = ITEM_CONFIG[2];
            else if (rand < 0.35) config = ITEM_CONFIG[3];
            else if (rand < 0.55) config = ITEM_CONFIG[4];
            else if (rand < 0.75) config = ITEM_CONFIG[5];
            else config = ITEM_CONFIG[6];
        }

        // ---- 随机生成坐标 ----
        let x = 40 + Math.random() * 280;
        let y = 80 + Math.random() * 320;

        // 检查1：距离必须小于钩子最大伸出长度
        const dist = Math.sqrt((x - originX) ** 2 + (y - originY) ** 2);
        if (dist > safeReach - config.r - 10) continue;

        // 检查2：角度必须在钩子摆动范围内
        const angleFromVertical = Math.abs(Math.atan2(x - originX, y - originY));
        if (angleFromVertical > maxSwing) continue;

        // 检查3：不能和其他物品挤在一起
        let overlaps = false;
        for (let other of clawItems) {
            if (Math.sqrt((x - other.x) ** 2 + (y - other.y) ** 2) < 45) {
                overlaps = true;
                break;
            }
        }
        if (overlaps) continue;

        // 通过所有检查，正式放置
        clawItems.push({
            x: x, y: y, config: config,
            grabbed: false
        });
    }
}
    // --- 计时器 ---
    function startClawTimer() {
        stopClawTimer();
        clawTimeLeft = clawLevel === 1 ? 30 : (clawLevel === 2 ? 30 : (clawLevel === 3 ? 25 : 25));
        updateClawTimeDisplay();

        clawTimerId = setInterval(() => {
            clawTimeLeft--;
            updateClawTimeDisplay();

            if (clawTimeLeft <= 0) {
                stopClawTimer();
                clawCompanionSpeak('timeout');
                // 时间到，进入下一关或结算
                clawLevel++;
                if (clawLevel > 4) {
                    clawCalculateResult();
                } else {
                    clawCompanionSpeak('levelUp');
                    clawGenerateLevel();
                    startClawTimer();
                }
            }
        }, 1000);
    }

    function stopClawTimer() {
        if (clawTimerId) {
            clearInterval(clawTimerId);
            clawTimerId = null;
        }
    }

    function updateClawTimeDisplay() {
        const timeEl = document.getElementById('clawTimeDisplay');
        if (timeEl) timeEl.textContent = `${clawTimeLeft}s`;
        const levelEl = document.getElementById('clawLevelDisplay');
        if (levelEl) levelEl.textContent = `${Math.min(clawLevel, 4)} / 4`;
        const scoreEl = document.getElementById('clawScoreDisplay');
        if (scoreEl) scoreEl.textContent = clawScore;
    }

    // --- 格瑞夫斯吐槽 ---
    function clawCompanionSpeak(type) {
        const bubble = document.getElementById('clawBubble');
        if (!bubble) return;
        let lines = GRAVES_LINES[type];
        if (!lines) return;
        let text = lines[Math.floor(Math.random() * lines.length)];
        bubble.textContent = text;
        bubble.style.opacity = '1';
        setTimeout(() => { bubble.style.opacity = '0.6'; }, 2000);
    }

    // --- 核心动画循环 ---
    function clawGameLoop() {
        // 关键修复：把 requestAnimationFrame 放在最前面，防止因临时错误导致循环中断
        clawAnimId = requestAnimationFrame(clawGameLoop);

        if (!clawCanvas) clawCanvas = document.getElementById('clawCanvas');
        if (!clawCtx && clawCanvas) clawCtx = clawCanvas.getContext('2d');
        if (!clawCtx || !clawCanvas) return;

        clawCtx.clearRect(0, 0, clawCanvas.width, clawCanvas.height);

        // 1. 绘制背景
        clawCtx.fillStyle = '#060608';
        clawCtx.fillRect(0, 0, clawCanvas.width, clawCanvas.height);
        
        // 2. 绘制物资
        clawItems.forEach(item => {
            if (item.grabbed) return;
            clawCtx.font = '28px Arial';
            clawCtx.textAlign = 'center';
            clawCtx.textBaseline = 'middle';
            clawCtx.fillText(item.config.emoji, item.x, item.y);
            
            // 画分数标签
            clawCtx.font = '10px monospace';
            clawCtx.fillStyle = item.config.score > 0 ? '#d4af37' : '#e03e3e';
            clawCtx.fillText(item.config.score, item.x, item.y + item.config.r + 10);
        });

        // 3. 更新钩子角度
        if (clawState === 'idle') {
            clawLength = 40; // 关键修复：空闲状态下强制保持长度，确保明显摆动
            clawAngle += 0.02 * clawAngleDir * (1 + clawLevel * 0.1);
            if (clawAngle > Math.PI / 2.5) clawAngleDir = -1;
            if (clawAngle < -Math.PI / 2.5) clawAngleDir = 1;
        }

        // 计算钩子终点
        let endX = clawOrigin.x + Math.sin(clawAngle) * clawLength;
        let endY = clawOrigin.y + Math.cos(clawAngle) * clawLength;

        // 处理伸出和收回
        if (clawState === 'shooting') {
            clawLength += 10; // 发射速度
            if (clawLength >= clawMaxLength) {
                clawState = 'retracting';
                clawLength = clawMaxLength;
            }
        } else if (clawState === 'retracting') {
            let retractSpeed = 10;
            if (clawGrabbedItem) {
                retractSpeed = clawGrabbedItem.config.speed;
            }
            clawLength -= retractSpeed;
            if (clawLength <= 0) {
                clawLength = 0;
                clawState = 'idle';
                
                // 恢复按钮状态
                const btn = document.getElementById('clawShootBtn');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = '发 射 钩 索';
                }

                if (clawGrabbedItem) {
                    clawScore += clawGrabbedItem.config.score;
                    if (clawGrabbedItem.config.score < 0) clawCompanionSpeak('grabTrash');
                    else if (clawGrabbedItem.config.score >= 1000) clawCompanionSpeak('grabHeavy');
                    else if (clawGrabbedItem.config.score >= 300) clawCompanionSpeak('grabMid');
                    else clawCompanionSpeak('grabLight');
                    updateClawTimeDisplay();
                    clawGrabbedItem = null;
                }
            }
        }

        // 4. 碰撞检测（只在伸出时检测）
        if (clawState === 'shooting') {
            for (let item of clawItems) {
                if (item.grabbed) continue;
                let dx = endX - item.x;
                let dy = endY - item.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < item.config.r + 10) { // 碰撞判定稍微放宽
                    item.grabbed = true;
                    clawGrabbedItem = item;
                    clawState = 'retracting';
                    
                    // 更新按钮文字提示
                    const btn = document.getElementById('clawShootBtn');
                    if (btn) btn.textContent = '拖 拽 中...';
                    break;
                }
            }
        }

        // 5. 绘制绳索和钩子
        clawCtx.beginPath();
        clawCtx.moveTo(clawOrigin.x, clawOrigin.y);
        clawCtx.lineTo(endX, endY);
        clawCtx.strokeStyle = '#d4af37';
        clawCtx.lineWidth = 3;
        clawCtx.stroke();

        // 绘制钩子头
        clawCtx.beginPath();
        clawCtx.arc(endX, endY, 6, 0, Math.PI * 2);
        clawCtx.fillStyle = '#d4af37';
        clawCtx.fill();

        // 绘制抓到的物品
        if (clawGrabbedItem && clawState === 'retracting') {
            clawCtx.font = '28px Arial';
            clawCtx.textAlign = 'center';
            clawCtx.textBaseline = 'middle';
            clawCtx.fillText(clawGrabbedItem.config.emoji, endX, endY + 25);
        }
    }

    // --- 玩家点击发射 ---
  window.clawShoot = function() {
    // ✅ 新增：如果状态是 idle 但按钮还 disabled，强行恢复（防止任何残留 bug）
    const btn = document.getElementById('clawShootBtn');
    if (clawState === 'idle' && btn && btn.disabled) {
        btn.disabled = false;
        btn.textContent = '发 射 钩 索';
    }
    
    if (clawState !== 'idle') return;
    clawState = 'shooting';
    
    if (btn) {
        btn.disabled = true;
        btn.textContent = '发 射 中...';
    }
};

    // --- 结算与评级 ---
    function clawCalculateResult() {
    stopClawTimer();
    if (clawAnimId) {
        cancelAnimationFrame(clawAnimId);
        clawAnimId = null;
    }

    // ✅ 新增：结算时恢复按钮，以防后续重启时残留
    const clawBtn = document.getElementById('clawShootBtn');
    if (clawBtn) {
        clawBtn.disabled = false;
        clawBtn.textContent = '发 射 钩 索';
    }

    clawTotalScore = clawScore;
        let rank, title, desc, reward;

        if (clawTotalScore >= 3500) {
            rank = 'S'; reward = 500000;
            title = '完美回收 · S级';
            desc = `总分：${clawTotalScore}\n\nDarlin'，你这双手比我的狙击手还稳。这些物资够武装一个连了。`;
        } else if (clawTotalScore >= 2000) {
            rank = 'A'; reward = 200000;
            title = '高效回收 · A级';
            desc = `总分：${clawTotalScore}\n\n干得不错。有你在，后勤部那帮人总算能交差了。`;
        } else if (clawTotalScore >= 1000) {
            rank = 'B'; reward = 50000;
            title = '勉强及格 · B级';
            desc = `总分：${clawTotalScore}\n\n虽然磨蹭了点，但好歹捞上来点东西。下次动作快点。`;
        } else {
            rank = 'F'; reward = 0;
            title = '行动失败 · F级';
            desc = `总分：${clawTotalScore}\n\n你他妈捞了一堆废铁上来？去后勤部扫地吧。`;
        }

        // 联动黑色行动资金
        if (typeof dispatchFunds !== 'undefined') {
            dispatchFunds += reward;
            if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        }
        if (typeof saveGameState === 'function') saveGameState();

        // 联动小号
        if (typeof triggerGravesAltMessage === 'function') {
            triggerGravesAltMessage(`回收行动结束，评级：${rank}。资金奖励：$${reward.toLocaleString('en-US')}。`);
        }

        // 显示结算弹窗
        document.getElementById('clawFinalScore').textContent = clawTotalScore;
        document.getElementById('clawFinalRank').textContent = rank;
        document.getElementById('clawFinalRank').className = 'claw-result-rank rank-' + rank.toLowerCase();
        document.getElementById('clawFinalDesc').textContent = desc;
        document.getElementById('clawResultOverlay').classList.add('active');
    }

    // --- 打开与关闭 ---
    window.openClawGame = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();
        
        const overlay = document.getElementById('clawOverlay');
        if (overlay) {
            // 强制挂载到 body，避开 .phone-mockup 的层叠限制
            if (overlay.parentNode !== document.body) {
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'flex';
            overlay.classList.add('active');
        }

        // 重置游戏状态
        clawScore = 0;
        clawLevel = 1;
        document.getElementById('clawResultOverlay').classList.remove('active');
        document.getElementById('clawBubble').textContent = "Darlin'，动作快点，别让我等。";

        initClawCanvas();
        clawGenerateLevel();
        startClawTimer();
        
        const btn = document.getElementById('clawShootBtn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '发 射 钩 索';
        }

        if (clawAnimId) cancelAnimationFrame(clawAnimId);
        clawAnimId = requestAnimationFrame(clawGameLoop);
    };

    window.closeClawGame = function() {
        stopClawTimer();
        if (clawAnimId) {
            cancelAnimationFrame(clawAnimId);
            clawAnimId = null;
        }
        const overlay = document.getElementById('clawOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }
    };

    window.clawRestart = function() {
        window.openClawGame();
    };

})();

/* ================= 暗影扫雷 · 核心逻辑 ================= */
(function() {
    const DIFFICULTIES = {
        easy:   { name: '简单', rows: 9,  cols: 9,  mines: 10, baseTime: 180 },
        medium: { name: '中等', rows: 12, cols: 12, mines: 25, baseTime: 360 },
        hard:   { name: '困难', rows: 16, cols: 16, mines: 50, baseTime: 720 }
    };
    const DIFF_ORDER = ['easy', 'medium', 'hard'];

    let mineDiff = 'easy';
    let mineBoard = [];
    let mineFirstClick = true;
    let mineGameActive = false;
    let mineGameOver = false;
    let mineRevealedCount = 0;
    let mineFlaggedCount = 0;
    let mineTimerInterval = null;
    let mineSeconds = 0;
    let mineMode = 'dig';   // 'dig' 或 'flag'

    function cfg() { return DIFFICULTIES[mineDiff]; }

    // ---------- 初始化 ----------
    function mineInitBoard() {
        const c = cfg();
        mineBoard = [];
        for (let r = 0; r < c.rows; r++) {
            const row = [];
            for (let col = 0; col < c.cols; col++) {
                row.push({ mine: false, revealed: false, flagged: false, adjacent: 0 });
            }
            mineBoard.push(row);
        }
        mineFirstClick = true;
        mineGameActive = true;
        mineGameOver = false;
        mineRevealedCount = 0;
        mineFlaggedCount = 0;
        mineSeconds = 0;
        stopMineTimer();
        updateMineStats();
        updateMineTimer();
    }

    // ---------- 布雷（首次点击后）----------
    function placeMines(safeR, safeC) {
        const c = cfg();
        const safeSet = new Set();
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = safeR + dr, nc = safeC + dc;
                if (nr >= 0 && nr < c.rows && nc >= 0 && nc < c.cols) {
                    safeSet.add(nr + ',' + nc);
                }
            }
        }
        let placed = 0, attempts = 0;
        while (placed < c.mines && attempts < 5000) {
            attempts++;
            const r = Math.floor(Math.random() * c.rows);
            const col = Math.floor(Math.random() * c.cols);
            if (mineBoard[r][col].mine) continue;
            if (safeSet.has(r + ',' + col)) continue;
            mineBoard[r][col].mine = true;
            placed++;
        }
        // 计算相邻雷数
        for (let r = 0; r < c.rows; r++) {
            for (let col = 0; col < c.cols; col++) {
                if (mineBoard[r][col].mine) continue;
                let count = 0;
                forEachNeighbor(r, col, (nr, nc) => {
                    if (mineBoard[nr][nc].mine) count++;
                });
                mineBoard[r][col].adjacent = count;
            }
        }
    }

    function forEachNeighbor(r, c, cb) {
        const cf = cfg();
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < cf.rows && nc >= 0 && nc < cf.cols) {
                    cb(nr, nc);
                }
            }
        }
    }

    // ---------- 渲染 ----------
    function renderMineBoard() {
        const boardEl = document.getElementById('mineBoard');
        if (!boardEl) return;
        const c = cfg();
        boardEl.style.gridTemplateColumns = `repeat(${c.cols}, minmax(0, 1fr))`;
        boardEl.innerHTML = '';

        for (let r = 0; r < c.rows; r++) {
            for (let col = 0; col < c.cols; col++) {
                const data = mineBoard[r][col];
                const cell = document.createElement('div');
                cell.className = 'mine-cell';
                cell.dataset.r = r;
                cell.dataset.c = col;

                if (data.revealed) {
                    cell.classList.add('revealed');
                    if (data.mine) {
                        cell.classList.add('mine-shown');
                        cell.textContent = '💣';
                    } else if (data.adjacent > 0) {
                        cell.classList.add('n' + data.adjacent);
                        cell.textContent = data.adjacent;
                    }
                } else if (data.flagged) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                }

                cell.addEventListener('click', () => mineClickCell(r, col));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    mineFlagCell(r, col);
                });
                boardEl.appendChild(cell);
            }
        }
    }

    // ---------- 点击 ----------
    function mineClickCell(r, col) {
        if (!mineGameActive || mineGameOver) return;
        if (mineMode === 'flag') {
            mineFlagCell(r, col);
            return;
        }
        mineDigCell(r, col);
    }

    function mineFlagCell(r, col) {
        if (!mineGameActive || mineGameOver) return;
        const data = mineBoard[r][col];
        if (data.revealed) return;

        if (data.flagged) {
            data.flagged = false;
            mineFlaggedCount--;
        } else {
            const c = cfg();
            if (mineFlaggedCount >= c.mines) return; // 旗子用完
            data.flagged = true;
            mineFlaggedCount++;
        }
        updateMineStats();
        renderMineBoard();
    }

    function mineDigCell(r, col) {
        const data = mineBoard[r][col];
        if (data.revealed || data.flagged) return;

        // 首次点击 → 布雷
        if (mineFirstClick) {
            placeMines(r, col);
            mineFirstClick = false;
            startMineTimer();
        }

        // 踩雷
        if (data.mine) {
            data.revealed = true;
            mineGameOver = true;
            stopMineTimer();
            // 揭示所有雷
            const c = cfg();
            for (let i = 0; i < c.rows; i++) {
                for (let j = 0; j < c.cols; j++) {
                    if (mineBoard[i][j].mine && !mineBoard[i][j].flagged) {
                        mineBoard[i][j].revealed = true;
                    }
                    if (!mineBoard[i][j].mine && mineBoard[i][j].flagged) {
                        mineBoard[i][j].wrongFlag = true;
                    }
                }
            }
            renderMineBoard();
            // 标记踩雷格子为红色高亮
            const hitCell = document.querySelector(
                `.mine-cell[data-r="${r}"][data-c="${col}"]`
            );
            if (hitCell) hitCell.classList.add('mine-hit');
            // 错误旗标
            document.querySelectorAll('.mine-cell').forEach(el => {
                const rr = +el.dataset.r, cc = +el.dataset.c;
                if (mineBoard[rr][cc].wrongFlag) el.classList.add('wrong-flag');
            });
            setTimeout(() => showMineResult(false), 300);
            return;
        }

        // 洪水填充
        floodReveal(r, col);
        renderMineBoard();
        updateMineStats();

        // 胜利判定
        const c = cfg();
        const totalSafe = c.rows * c.cols - c.mines;
        if (mineRevealedCount === totalSafe) {
            mineGameOver = true;
            stopMineTimer();
            // 自动插旗剩余雷
            for (let i = 0; i < c.rows; i++) {
                for (let j = 0; j < c.cols; j++) {
                    if (mineBoard[i][j].mine && !mineBoard[i][j].flagged) {
                        mineBoard[i][j].flagged = true;
                    }
                }
            }
            mineFlaggedCount = c.mines;
            updateMineStats();
            renderMineBoard();
            setTimeout(() => showMineResult(true), 300);
        }
    }

    function floodReveal(r, col) {
        const stack = [[r, col]];
        while (stack.length > 0) {
            const [cr, cc] = stack.pop();
            const data = mineBoard[cr][cc];
            if (data.revealed || data.flagged || data.mine) continue;
            data.revealed = true;
            mineRevealedCount++;
            if (data.adjacent === 0) {
                forEachNeighbor(cr, cc, (nr, nc) => {
                    if (!mineBoard[nr][nc].revealed) stack.push([nr, nc]);
                });
            }
        }
    }

    // ---------- 统计 ----------
    function updateMineStats() {
        const c = cfg();
        const remainEl = document.getElementById('mineRemaining');
        if (remainEl) remainEl.textContent = (c.mines - mineFlaggedCount);
        const diffEl = document.getElementById('mineDiffTag');
        if (diffEl) diffEl.textContent = c.name;
    }

    // ---------- 计时 ----------
    function startMineTimer() {
        stopMineTimer();
        mineSeconds = 0;
        updateMineTimer();
        mineTimerInterval = setInterval(() => {
            mineSeconds++;
            updateMineTimer();
        }, 1000);
    }
    function stopMineTimer() {
        if (mineTimerInterval) {
            clearInterval(mineTimerInterval);
            mineTimerInterval = null;
        }
    }
    function updateMineTimer() {
        const el = document.getElementById('mineTimer');
        if (!el) return;
        const m = String(Math.floor(mineSeconds / 60)).padStart(2, '0');
        const s = String(mineSeconds % 60).padStart(2, '0');
        el.textContent = `${m}:${s}`;
    }

    // ---------- 模式切换 ----------
    window.mineToggleMode = function() {
        mineMode = (mineMode === 'dig') ? 'flag' : 'dig';
        const btn = document.getElementById('mineModeBtn');
        if (btn) {
            if (mineMode === 'flag') {
                btn.textContent = '🚩 插旗';
                btn.classList.add('active-mode');
            } else {
                btn.textContent = '⛏️ 挖开';
                btn.classList.remove('active-mode');
            }
        }
    };

    // ---------- 重开 / 难度 ----------
    window.mineRestart = function() {
        const overlay = document.getElementById('mineResultOverlay');
        if (overlay) overlay.classList.remove('active');
        mineInitBoard();
        renderMineBoard();
    };

    window.mineCycleDifficulty = function() {
        const idx = DIFF_ORDER.indexOf(mineDiff);
        mineDiff = DIFF_ORDER[(idx + 1) % DIFF_ORDER.length];
        const overlay = document.getElementById('mineResultOverlay');
        if (overlay) overlay.classList.remove('active');
        mineInitBoard();
        renderMineBoard();
    };

    // ---------- 结算 ----------
    function showMineResult(isWin) {
        const overlay = document.getElementById('mineResultOverlay');
        const titleEl = document.getElementById('mineResultTitle');
        const rankEl = document.getElementById('mineResultRank');
        const descEl = document.getElementById('mineResultDesc');
        if (!overlay || !titleEl || !rankEl || !descEl) return;

        const c = cfg();
        let rank, title, desc, reward;

        if (isWin) {
            // 根据时间给评级
            const ratio = mineSeconds / c.baseTime;
            if (ratio <= 0.5) {
                rank = 'S'; reward = 300000;
                title = '扫雷完成 · S级';
                desc = `用时：${formatTime(mineSeconds)}\n雷区：${c.name} · ${c.mines}颗\n\nDarlin'，你这双手比我的排爆组还稳。这笔奖金算你应得的。`;
            } else if (ratio <= 0.8) {
                rank = 'A'; reward = 150000;
                title = '扫雷完成 · A级';
                desc = `用时：${formatTime(mineSeconds)}\n雷区：${c.name} · ${c.mines}颗\n\n干得漂亮。虽然慢了点，但活着回来才是最重要的。`;
            } else {
                rank = 'B'; reward = 50000;
                title = '扫雷完成 · B级';
                desc = `用时：${formatTime(mineSeconds)}\n雷区：${c.name} · ${c.mines}颗\n\n勉强及格。下次把注意力放在战场上，别老盯着秒表。`;
            }
        } else {
            rank = 'F'; reward = 0;
            title = '扫雷失败 · F级';
            titleEl.classList.add('fail');
            desc = `用时：${formatTime(mineSeconds)}\n雷区：${c.name} · ${c.mines}颗\n\n你踩到了雷。在战场上，可没有第二次机会。`;
        }

        titleEl.textContent = title;
        if (isWin) titleEl.classList.remove('fail');
        rankEl.textContent = rank;
        rankEl.className = 'mine-result-rank rank-' + rank.toLowerCase();
        descEl.textContent = desc;

        overlay.classList.add('active');

        // 联动黑色行动资金
        if (reward > 0 && typeof dispatchFunds !== 'undefined') {
            dispatchFunds += reward;
            if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        }
        if (typeof saveGameState === 'function') saveGameState();

        // 小号吐槽
        if (typeof triggerGravesAltMessage === 'function') {
            if (isWin && rank === 'S') {
                triggerGravesAltMessage("Darlin'，我看到你把雷区清空了。S级的表现，比我想象中还狠。奖金已到账。");
            } else if (isWin) {
                triggerGravesAltMessage("扫雷完成，评级 " + rank + "。还行，比我预想中好。");
            } else {
                triggerGravesAltMessage("踩雷了？战场上没有重来键。下次专注一点，Darlin'。");
            }
        }
    }

    function formatTime(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    }

    // ---------- 打开 / 关闭 ----------
    window.openMineGame = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();

        const overlay = document.getElementById('mineOverlay');
        if (!overlay) return;

        // 强制挂到 body，避开 .phone-mockup 层叠上下文
        if (overlay.parentNode !== document.body) {
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
        overlay.classList.add('active');

        mineInitBoard();
        renderMineBoard();
    };

    window.closeMineGame = function() {
        stopMineTimer();
        const overlay = document.getElementById('mineOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
        }
        const result = document.getElementById('mineResultOverlay');
        if (result) result.classList.remove('active');
    };
})();

/* ================= 暗影赌局 · 俄罗斯轮盘逻辑 ================= */
(function() {
    const BETS = [
        { amount: 100000, label: '$10 万' },
        { amount: 500000, label: '$50 万' },
        { amount: 1000000, label: '$100 万' },
        { amount: 5000000, label: '$500 万' },
        { amount: 10000000, label: '$1000 万' }
    ];
    const MIN_FUNDS = 200000;   // 低于此值禁用游戏

    let rl = {
        bet: 0,
        playerLives: 3,
        gravesLives: 3,
        currentRound: 0,     // 从 1 开始计数
        chambers: [],        // [0/1, ...] 6 个
        chamberIndex: 0,
        firstTurn: 'player', // 本局谁先手
        busy: false,         // 动画期间锁定按钮
        active: false
    };

    // ---------- 打开 / 关闭 ----------
    window.openRoulette = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();

        // 资金校验
        if (typeof dispatchFunds === 'undefined' || dispatchFunds < MIN_FUNDS) {
            alert('黑色行动资金不足 $20 万。\n庄家不接受空手套白狼。');
            return;
        }

        const overlay = document.getElementById('rouletteOverlay');
        if (!overlay) return;
        if (overlay.parentNode !== document.body) {
            document.body.appendChild(overlay);
        }
        overlay.classList.add('active');

        rl.bet = 0;
        rl.playerLives = 3;
        rl.gravesLives = 3;
        rl.currentRound = 0;
rl.firstPlayer = Math.random() < 0.5 ? 'player' : 'graves'; 
        rl.busy = false;
        rl.sessionId = Date.now() + Math.random(); 
        rl.active = true;

        renderBetScreen();
        showRlScreen('rlBetScreen');
    };

    window.closeRoulette = function() {
        const overlay = document.getElementById('rouletteOverlay');
        if (overlay) overlay.classList.remove('active');
        document.querySelectorAll('.rl-modal').forEach(m => m.classList.remove('active'));
        rl.active = false;
    };

    function showRlScreen(id) {
        document.querySelectorAll('.rl-screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
    }

    // ---------- 下注界面 ----------
    function renderBetScreen() {
        const fundsEl = document.getElementById('rlFundsAmount');
        if (fundsEl) fundsEl.textContent = '$' + dispatchFunds.toLocaleString('en-US');

        const maxBet = Math.floor(dispatchFunds * 0.5);
        const optionsEl = document.getElementById('rlBetOptions');
        if (!optionsEl) return;
        optionsEl.innerHTML = '';

        BETS.forEach(b => {
            const div = document.createElement('div');
            div.className = 'rl-bet-option';
            const disabled = b.amount > maxBet;
            if (disabled) div.classList.add('disabled');
            div.innerHTML = `${b.label}<div class="rl-bet-sub">${disabled ? '超出限制' : '可下注'}</div>`;
            if (!disabled) {
                div.onclick = () => {
                    document.querySelectorAll('.rl-bet-option').forEach(o => o.classList.remove('selected'));
                    div.classList.add('selected');
                    rl.bet = b.amount;
                    updateBetPreview();
                };
            }
            optionsEl.appendChild(div);
        });

        updateBetPreview();
    }

    function updateBetPreview() {
        const winEl = document.getElementById('rlWinPreview');
        const loseEl = document.getElementById('rlLosePreview');
        const btn = document.getElementById('rlConfirmBtn');
        if (rl.bet > 0) {
            winEl.textContent = '+ $' + (rl.bet * 2).toLocaleString('en-US');
            loseEl.textContent = '- $' + (rl.bet * 2).toLocaleString('en-US');
            btn.disabled = false;
        } else {
            winEl.textContent = '+ $0';
            loseEl.textContent = '- $0';
            btn.disabled = true;
        }
    }

    window.rouletteConfirmBet = function() {
        if (rl.bet <= 0) return;
        // 二次校验
        if (rl.bet > Math.floor(dispatchFunds * 0.5)) {
            alert('下注金额超出 50% 限制。');
            return;
        }
        showRlScreen('rlGameScreen');
        rl.currentRound = 0;
        rouletteStartRound();
    };

    // ---------- 开局 ----------
    function rouletteStartRound() {
        rl.currentRound++;
        rl.chamberIndex = 0;
        rl.busy = false;

        // 子弹数 = 局数（1, 2, 3, 4, 5...）
        const bulletCount = Math.min(rl.currentRound, 5);
        rl.chambers = prepareChambers(bulletCount);

        // 先手交替：第 1 局玩家，第 2 局格瑞夫斯，循环
        // 单数局用 firstPlayer，双数局用另一方
const isOddRound = (rl.currentRound % 2 === 1);
rl.firstTurn = isOddRound
    ? rl.firstPlayer
    : (rl.firstPlayer === 'player' ? 'graves' : 'player');

        // 清空弹巢高亮
        document.querySelectorAll('.rl-chamber').forEach(c => {
            c.classList.remove('active', 'used', 'bullet-hit');
        });

        // 刷新 UI
        updateLifeUI();
        updateRoundUI(bulletCount);
        document.getElementById('rlRoundEndModal').classList.remove('active');
        document.getElementById('rlGameOverModal').classList.remove('active');

        const statusEl = document.getElementById('rlStatusText');
        if (rl.firstTurn === 'player') {
    statusEl.textContent = '轮到你扣扳机';
    setTriggerBtn(true, '扣 动 扳 机');
    if (rl.currentRound === 1) {
        speak(`第 1 局。${bulletCount} 颗子弹。掷硬币你赢了——你先来。`);
    } else {
        speak(`第 ${rl.currentRound} 局。${bulletCount} 颗子弹。你先来，Darlin'。`);
    }
} else {
    statusEl.textContent = '格瑞夫斯先扣扳机';
    setTriggerBtn(false, '格 瑞 夫 斯 的 回 合');
    if (rl.currentRound === 1) {
        speak(`第 1 局。${bulletCount} 颗子弹。掷硬币我赢了——我先来。`);
    } else {
        speak(`第 ${rl.currentRound} 局。${bulletCount} 颗子弹。这次我先。`);
    }
    setTimeout(() => {
        if (rl.active && !rl.busy) gravesTurn();
    }, 2200);
}
    }

    function prepareChambers(bulletCount) {
        const arr = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < bulletCount; i++) arr[i] = 1;
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function updateLifeUI() {
        const p = document.getElementById('rlPlayerHearts');
        const g = document.getElementById('rlGravesHearts');
        if (p) {
            p.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                p.innerHTML += i < rl.playerLives ? '❤️' : '<span class="dead">❤️</span>';
            }
        }
        if (g) {
            g.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                g.innerHTML += i < rl.gravesLives ? '❤️' : '<span class="dead">❤️</span>';
            }
        }
    }

    function updateRoundUI(bulletCount) {
        const rEl = document.getElementById('rlRoundNum');
        const bEl = document.getElementById('rlBulletsCount');
        if (rEl) rEl.textContent = rl.currentRound;
        if (bEl) bEl.textContent = bulletCount;
    }

    function setTriggerBtn(enabled, text) {
        const btn = document.getElementById('rlTriggerBtn');
        if (!btn) return;
        btn.disabled = !enabled;
        btn.textContent = text;
    }

    function speak(text) {
        const el = document.getElementById('rlGravesBubble');
        if (el) el.textContent = text;
    }

    // ---------- 扣扳机 ----------
    window.roulettePullTrigger = function() {
    if (!rl.active || rl.busy) return;
    // 保险：如果当前是格瑞夫斯回合但 busy 意外为 false，也不让玩家抢操作
    const btn = document.getElementById('rlTriggerBtn');
    if (btn && btn.disabled) return;
    playerTurn();
};

    function playerTurn() {
        rl.busy = true;
        setTriggerBtn(false, '扣 动 中...');
        const statusEl = document.getElementById('rlStatusText');
        if (statusEl) statusEl.textContent = '你扣动了扳机...';

        doShot('player', () => {
            // 空枪 → 轮到格瑞夫斯
            if (rl.active) {
                statusEl.textContent = '格瑞夫斯正在扣扳机...';
                setTimeout(() => gravesTurn(), 800);
            }
        });
    }

    function gravesTurn() {
        if (!rl.active) return;
        rl.busy = true;
        setTriggerBtn(false, '等 待 中...');
        const statusEl = document.getElementById('rlStatusText');
        if (statusEl) statusEl.textContent = '格瑞夫斯扣动了扳机...';

        doShot('graves', () => {
            // 空枪 → 轮到玩家
            if (rl.active) {
                statusEl.textContent = '轮到你扣扳机';
                setTriggerBtn(true, '扣 动 扳 机');
                rl.busy = false;
            }
        });
    }

    // 执行一次扣扳机
    function doShot(who, onMiss) {
        // 转轮旋转动画
        const cylinder = document.getElementById('rlCylinder');
        if (cylinder) {
            cylinder.classList.remove('spin');
            void cylinder.offsetWidth;
            cylinder.classList.add('spin');
        }

        // 动画结束后揭示结果
        setTimeout(() => {
            if (!rl.active) return;

            const isBullet = rl.chambers[rl.chamberIndex] === 1;
            const chambers = document.querySelectorAll('.rl-chamber');
            const currentChamber = chambers[rl.chamberIndex];

            // 标记当前弹巢为已使用
            if (currentChamber) {
                currentChamber.classList.add('active');
            }

            if (isBullet) {
                // 中枪
                if (currentChamber) {
                    currentChamber.classList.remove('active');
                    currentChamber.classList.add('bullet-hit');
                }
                const overlay = document.getElementById('rouletteOverlay');
                if (overlay) {
                    overlay.classList.remove('shake');
                    void overlay.offsetWidth;
                    overlay.classList.add('shake');
                }
                handleHit(who);
            } else {
                // 空枪
                if (currentChamber) {
                    currentChamber.classList.remove('active');
                    currentChamber.classList.add('used');
                }
                rl.chamberIndex++;
                speak(who === 'player' ? '运气不错，Darlin\'。' : '轮到你了。');
                onMiss && onMiss();
            }
        }, 1200);
    }

    // 中枪处理
    function handleHit(who) {
        if (who === 'player') {
            rl.playerLives--;
            updateLifeUI();
            speak('砰。疼吗？');
        } else {
            rl.gravesLives--;
            updateLifeUI();
            speak('……行，这一枪算你的。');
        }

        // 判定游戏是否结束
        if (rl.playerLives <= 0 || rl.gravesLives <= 0) {
            setTimeout(() => endRouletteGame(), 800);
        } else {
            setTimeout(() => showRoundEnd(who), 800);
        }
    }

    // 局结算
    function showRoundEnd(who) {
        const modal = document.getElementById('rlRoundEndModal');
        const title = document.getElementById('rlRoundEndTitle');
        const desc = document.getElementById('rlRoundEndDesc');
        const btn = document.getElementById('rlNextRoundBtn');

        if (title) title.textContent = `第 ${rl.currentRound} 局结束`;
        if (desc) {
            const whoText = who === 'player' ? '你' : '格瑞夫斯';
            desc.textContent = `${whoText}中枪！\n\n你 ${rl.playerLives} 命 · 格瑞夫斯 ${rl.gravesLives} 命\n\n${rl.currentRound < 5 ? '下一局子弹数将增加。' : '已打满 5 局。'}`;
        }

        // 判断是否可以继续
        if (btn) {
            btn.textContent = `继续第 ${rl.currentRound + 1} 局`;
        }

        if (modal) modal.classList.add('active');
    }

    window.rouletteNextRound = function() {
        const modal = document.getElementById('rlRoundEndModal');
        if (modal) modal.classList.remove('active');
        rouletteStartRound();
    };

    // ---------- 结算 ----------
   function endRouletteGame() {
    // 👈 1. 防止重复触发结算（比如连点按钮）
    if (!rl.active) return; 
    rl.active = false; // 立刻锁定，防止后续重复动作

    const isWin = rl.gravesLives <= 0;
    let delta;
    if (isWin) {
        delta = rl.bet * 2;
        dispatchFunds += delta;
        speak('我输了。钱归你。但别得意太早。');
    } else {
        delta = -rl.bet * 2;
        dispatchFunds = Math.max(0, dispatchFunds + delta);
        speak('愿赌服输。下次记得带够钱。');
    }

    if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
    if (typeof saveGameState === 'function') saveGameState();

    const modal = document.getElementById('rlGameOverModal');
    const title = document.getElementById('rlGameOverTitle');
    const rank = document.getElementById('rlGameOverRank');
    const desc = document.getElementById('rlGameOverDesc');

    if (title) {
        title.textContent = isWin ? '赌局结束 · 你赢了' : '赌局结束 · 你输了';
        title.classList.toggle('fail', !isWin);
    }
    if (rank) {
        rank.textContent = isWin ? 'WIN' : 'LOSE';
        rank.className = 'rl-modal-rank ' + (isWin ? 'win' : 'lose');
    }
    if (desc) {
        const sign = delta >= 0 ? '+' : '-';
        desc.textContent = `最终命数\n你 ${rl.playerLives} · 格瑞夫斯 ${rl.gravesLives}\n\n资金变动：${sign}$${Math.abs(delta).toLocaleString('en-US')}`;
    }

    if (modal) modal.classList.add('active');

    // 👈 2. 捕获当前会话ID，防止切换窗口或重开后数值错乱
    const currentSession = rl.sessionId;

    if (typeof triggerGravesAltMessage === 'function') {
        setTimeout(() => {
            // 👈 3. 关键修复：如果期间玩家重开了游戏，这个回调直接作废
            if (rl.sessionId !== currentSession) return; 
            
            if (isWin) {
                triggerGravesAltMessage(`Darlin'，愿赌服输。$${(rl.bet * 2).toLocaleString('en-US')} 已经打到你账上了。下次再来。`);
            } else {
                triggerGravesAltMessage(`你输给我 $${(rl.bet * 2).toLocaleString('en-US')}。赌桌上运气不能当饭吃，记住了。`);
            }
        }, 3500);
    }
}

    // ---------- 认赔 ----------
    window.rouletteSurrender = function() {
        if (!rl.active || rl.busy) return;
        if (!confirm(`确认认赔退出？\n\n认赔金额：$${rl.bet.toLocaleString('en-US')}（本金一半规则，只赔 1 倍）`)) return;

        const delta = -rl.bet;
        dispatchFunds = Math.max(0, dispatchFunds + delta);
        if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        if (typeof saveGameState === 'function') saveGameState();

        const modal = document.getElementById('rlGameOverModal');
        const title = document.getElementById('rlGameOverTitle');
        const rank = document.getElementById('rlGameOverRank');
        const desc = document.getElementById('rlGameOverDesc');

        if (title) {
            title.textContent = '赌局结束 · 认赔退出';
            title.classList.add('fail');
        }
        if (rank) {
            rank.textContent = 'FOLD';
            rank.className = 'rl-modal-rank lose';
        }
        if (desc) {
            desc.textContent = `你认赔退出。\n\n损失：$${rl.bet.toLocaleString('en-US')}\n\n${rl.currentRound} 局未打完。`;
        }
        if (modal) modal.classList.add('active');
        rl.active = false;

        if (typeof triggerGravesAltMessage === 'function') {
            setTimeout(() => {
                triggerGravesAltMessage(`认赔了？行，我理解，Darlin'。有时候活着比赢更重要。`);
            }, 3500);
        }
    };
})();

/* ================= 暗影空运 · 飞行棋逻辑 (1/3) ================= */
(function() {
    const SA_TOTAL = 36;
    const SA_BASES = [0, 7, 14, 21, 28, 35];
    const SA_BASE_NAMES = ['德州', '乌克兰', '欧洲', '中东', '缅甸', '加勒比'];
    const SA_END = 35;

    const SA_BETS = [
        { amount: 200000,  label: '$20 万' },
        { amount: 500000,  label: '$50 万' },
        { amount: 1000000, label: '$100 万' }
    ];
    const SA_MIN_FUNDS = 200000;

    const SA_EVENT_STYLES = {
        support:   { emoji: '🎯', name: '空中支援', color: '#2ecc71' },
        ambush:    { emoji: '💥', name: '遭遇伏击', color: '#e03e3e' },
        fuel:      { emoji: '🛢️', name: '燃料泄漏', color: '#e67e22' },
        jam:       { emoji: '📡', name: '通讯干扰', color: '#9b59b6' },
        refuel:    { emoji: '⛽', name: '空中加油', color: '#3498db' },
        missile:   { emoji: '🚀', name: '战术导弹', color: '#e03e3e' },
        satellite: { emoji: '🛰️', name: '卫星链路', color: '#d4af37' }
    };

    const sa = {
        bet: 0,
        playerPlanes: [0, 0],
        gravesPlanes: [0, 0],
        events: {},
        active: false,
        busy: false,
        currentTurn: 'player',
        hasRolled: false,
        diceValue: 0,
        playerShield: false,
        gravesShield: false,
        playerSkipNext: false,
        gravesSkipNext: false,
        playerHalfNext: false,
        gravesHalfNext: false,
        afterEventCallback: null,
        sessionId: 0
    };

    // ---------- 工具 ----------
    function isBase(pos) { return SA_BASES.indexOf(pos) >= 0; }

    function getBaseName(pos) {
        const idx = SA_BASES.indexOf(pos);
        return idx >= 0 ? SA_BASE_NAMES[idx] : '';
    }

    function findNextBase(pos) {
        for (let b of SA_BASES) { if (b > pos) return b; }
        return SA_END;
    }

    function findPrevBase(pos) {
        let prev = 0;
        for (let b of SA_BASES) { if (b < pos) prev = b; else break; }
        return prev;
    }

    // ---------- 事件生成 ----------
    function generateEvents() {
        const events = {};
        const pathPositions = [];
        for (let i = 0; i <= SA_END; i++) {
            if (!isBase(i)) pathPositions.push(i);
        }
        const types = Object.keys(SA_EVENT_STYLES);
        const shuffled = [...pathPositions].sort(() => Math.random() - 0.5);
        let idx = 0;
        types.forEach(type => {
            const count = 4 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count && idx < shuffled.length; i++) {
                events[shuffled[idx]] = type;
                idx++;
            }
        });
        while (idx < shuffled.length) {
            events[shuffled[idx]] = types[Math.floor(Math.random() * types.length)];
            idx++;
        }
        return events;
    }

    // ---------- 渲染 ----------
    function renderBoard() {
        const boardEl = document.getElementById('saBoard');
        if (!boardEl) return;
        boardEl.innerHTML = '';

        for (let i = 0; i <= SA_END; i++) {
            const cell = document.createElement('div');
            cell.className = 'sa-cell';
            if (isBase(i)) cell.classList.add('sa-base');

            const evt = sa.events[i];
            const evtStyle = evt ? SA_EVENT_STYLES[evt] : null;

            let planesHTML = '';
            const playerHere = sa.playerPlanes.filter(p => p === i).length;
            const gravesHere = sa.gravesPlanes.filter(p => p === i).length;
            for (let k = 0; k < playerHere; k++) {
                planesHTML += `<span class="sa-plane-player">✈️</span>`;
            }
            for (let k = 0; k < gravesHere; k++) {
                planesHTML += `<span class="sa-plane-graves">✈️</span>`;
            }

            cell.innerHTML = `
                <div class="sa-cell-num">${i}</div>
                ${evtStyle ? `<div class="sa-cell-event" style="filter: drop-shadow(0 0 4px ${evtStyle.color})">${evtStyle.emoji}</div>` : ''}
                ${planesHTML ? `<div class="sa-cell-planes">${planesHTML}</div>` : ''}
            `;
            boardEl.appendChild(cell);
        }
    }

    function renderPlayerPlanes() {
        for (let i = 0; i < 2; i++) {
            const card = document.getElementById('saPlane' + i);
            const posEl = document.getElementById('saPlane' + i + 'Pos');
            const tagEl = document.getElementById('saPlane' + i + 'Tag');
            const pos = sa.playerPlanes[i];
            if (posEl) {
                if (pos >= SA_END) posEl.textContent = '已抵达 ✓';
                else posEl.textContent = '位置 ' + pos;
            }
            if (tagEl) {
                tagEl.textContent = isBase(pos) ? getBaseName(pos) : '航线上';
            }
            if (card) {
                if (pos >= SA_END) {
                    card.classList.add('disabled');
                } else if (sa.currentTurn === 'player' && sa.hasRolled && !sa.busy) {
                    card.classList.remove('disabled');
                } else {
                    card.classList.add('disabled');
                }
            }
        }
    }

    function renderProgress() {
        const pEl = document.getElementById('saPlayerProgress');
        const gEl = document.getElementById('saGravesProgress');
        if (pEl) pEl.textContent = sa.playerPlanes.filter(p => p >= SA_END).length + ' / 2';
        if (gEl) gEl.textContent = sa.gravesPlanes.filter(p => p >= SA_END).length + ' / 2';
    }

    function updateUI() {
        renderBoard();
        renderPlayerPlanes();
        renderProgress();
    }

    function setDiceEnabled(enabled, text) {
        const btn = document.getElementById('saDiceBtn');
        if (!btn) return;
        btn.disabled = !enabled;
        btn.textContent = text || (enabled ? '掷 骰 子' : '等 待 中...');
    }

    function speak(text) {
        const el = document.getElementById('saGravesBubble');
        if (el) el.textContent = text;
    }

    // ---------- 打开 / 关闭 ----------
    window.openShadowAirlift = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();

        if (typeof dispatchFunds === 'undefined' || dispatchFunds < SA_MIN_FUNDS) {
            alert('黑色行动资金不足 $20 万。\n暗影空运的燃油和护航都烧钱。');
            return;
        }

        const overlay = document.getElementById('saOverlay');
        if (!overlay) return;
        if (overlay.parentNode !== document.body) document.body.appendChild(overlay);
        overlay.classList.add('active');

        sa.sessionId = Date.now() + Math.random();
        sa.bet = 0;
        sa.active = true;
        sa.busy = false;
        sa.playerPlanes = [0, 0];
        sa.gravesPlanes = [0, 0];
        sa.playerShield = false;
        sa.gravesShield = false;
        sa.playerSkipNext = false;
        sa.gravesSkipNext = false;
        sa.playerHalfNext = false;
        sa.gravesHalfNext = false;
        sa.afterEventCallback = null;

        renderBetScreen();
        showScreen('saBetScreen');
    };

    window.closeShadowAirlift = function() {
        sa.active = false;
        const overlay = document.getElementById('saOverlay');
        if (overlay) overlay.classList.remove('active');
        document.querySelectorAll('.sa-modal').forEach(m => m.classList.remove('active'));
    };

    function showScreen(id) {
        document.querySelectorAll('.sa-screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
    }

    // ---------- 下注 ----------
    function renderBetScreen() {
        const fundsEl = document.getElementById('saFundsAmount');
        if (fundsEl) fundsEl.textContent = '$' + dispatchFunds.toLocaleString('en-US');

        const maxBet = Math.floor(dispatchFunds * 0.5);
        const optionsEl = document.getElementById('saBetOptions');
        if (!optionsEl) return;
        optionsEl.innerHTML = '';

        SA_BETS.forEach(b => {
            const div = document.createElement('div');
            div.className = 'sa-bet-option';
            const disabled = b.amount > maxBet;
            if (disabled) div.classList.add('disabled');
            div.innerHTML = `${b.label}<div class="sa-bet-sub">${disabled ? '超出限制' : '可下注'}</div>`;
            if (!disabled) {
                div.onclick = () => {
                    document.querySelectorAll('.sa-bet-option').forEach(o => o.classList.remove('selected'));
                    div.classList.add('selected');
                    sa.bet = b.amount;
                    updateBetPreview();
                };
            }
            optionsEl.appendChild(div);
        });

        updateBetPreview();
    }

    function updateBetPreview() {
        const winEl = document.getElementById('saWinPreview');
        const loseEl = document.getElementById('saLosePreview');
        const btn = document.getElementById('saConfirmBtn');
        if (!winEl || !loseEl || !btn) return;
        if (sa.bet > 0) {
            winEl.textContent = '+ $' + (sa.bet * 2).toLocaleString('en-US');
            loseEl.textContent = '- $' + (sa.bet * 2).toLocaleString('en-US');
            btn.disabled = false;
        } else {
            winEl.textContent = '+ $0';
            loseEl.textContent = '- $0';
            btn.disabled = true;
        }
    }

    window.saConfirmBet = function() {
        if (sa.bet <= 0) return;
        if (sa.bet > Math.floor(dispatchFunds * 0.5)) {
            alert('下注金额超出 50% 限制。');
            return;
        }
        sa.events = generateEvents();
        sa.playerPlanes = [0, 0];
        sa.gravesPlanes = [0, 0];
        sa.currentTurn = 'player';
        sa.hasRolled = false;
        sa.busy = false;
        showScreen('saGameScreen');
        updateUI();
        setDiceEnabled(true, '掷 骰 子');
        speak(`赌注 $${sa.bet.toLocaleString('en-US')} 已确认。Darlin'，掷出你的运气。`);
    };

// ---------- 玩家掷骰 ----------
window.saRollDice = function() {
    if (!sa.active || sa.busy) return;
    if (sa.currentTurn !== 'player' || sa.hasRolled) return;

    sa.busy = true;
    setDiceEnabled(false, '掷 骰 中...');

    const dice = document.getElementById('saDice');
    if (dice) dice.classList.add('rolling');

    let count = 0;
    const iv = setInterval(() => {
        if (!sa.active) { clearInterval(iv); return; }
        if (dice) dice.textContent = Math.floor(Math.random() * 6) + 1;
        count++;
        if (count >= 12) {
            clearInterval(iv);
            const rawRoll = Math.floor(Math.random() * 6) + 1;
            if (dice) { dice.textContent = rawRoll; dice.classList.remove('rolling'); }

            // 判断是否燃油泄漏
            if (sa.playerHalfNext) {
                speak(`掷出 ${rawRoll}。`);
                // 停顿 900ms，让玩家看到原始点数，然后触发燃油效果
                setTimeout(() => {
                    if (!sa.active) return;
                    const finalRoll = Math.max(1, Math.ceil(rawRoll / 2));
                    sa.playerHalfNext = false;
                    sa.diceValue = finalRoll;
                    if (dice) {
                        // 闪一下红色表示被修改
                        dice.style.color = '#e03e3e';
                        dice.textContent = finalRoll;
                        setTimeout(() => { dice.style.color = ''; }, 800);
                    }
                    sa.hasRolled = true;
                    sa.busy = false;
                    updateUI();
                    speak(`燃油泄漏生效：${rawRoll} → ${finalRoll}。本次只能移动 ${finalRoll} 格。`);
                }, 900);
            } else {
                sa.diceValue = rawRoll;
                sa.hasRolled = true;
                sa.busy = false;
                updateUI();
                speak(`掷出 ${rawRoll}。选一架运输机移动。`);
            }
        }
    }, 70);
};
// ---------- 玩家选飞机 ----------
window.saSelectPlane = function(idx) {
    if (!sa.active || sa.busy) return;
    if (sa.currentTurn !== 'player' || !sa.hasRolled) return;
    if (sa.playerPlanes[idx] >= SA_END) return;

    const oldPos = sa.playerPlanes[idx];
    const newPos = Math.min(oldPos + sa.diceValue, SA_END);
    sa.playerPlanes[idx] = newPos;
    sa.hasRolled = false;

    updateUI();
    setDiceEnabled(false, '等 待 中...');

    const evt = sa.events[newPos];
    if (evt && newPos !== SA_END) {
        setTimeout(() => triggerPlayerEvent(evt, idx), 350);
    } else {
        if (checkWin('player')) {
            endGame('player');
        } else {
            setTimeout(() => nextTurn(), 500);
        }
    }
};

function triggerPlayerEvent(evt, planeIdx) {
    const result = applyEvent(evt, 'player', planeIdx);
    updateUI();

    const style = SA_EVENT_STYLES[evt];
    const iconEl = document.getElementById('saEventIcon');
    const titleEl = document.getElementById('saEventTitle');
    const descEl = document.getElementById('saEventDesc');
    if (iconEl) iconEl.textContent = style.emoji;
    if (titleEl) titleEl.textContent = style.name;
    if (descEl) descEl.textContent = result;

    document.getElementById('saEventModal').classList.add('active');

    // 👇 核心修复：空中加油不切换回合
    const isRefuel = (evt === 'refuel');

    sa.afterEventCallback = () => {
        if (isRefuel) {
            // 空中加油：applyEvent 里已经把 hasRolled 重置、按钮亮起，
            // 这里什么都不做，让玩家继续掷骰子
            if (checkWin('player')) endGame('player');
            return; // 关键：不切到格瑞夫斯
        }

        if (checkWin('player')) {
            endGame('player');
        } else {
            setTimeout(() => nextTurn(), 400);
        }
    };
}
window.saCloseEventModal = function() {
    document.getElementById('saEventModal').classList.remove('active');
    if (sa.afterEventCallback) {
        const cb = sa.afterEventCallback;
        sa.afterEventCallback = null;
        cb();
    }
};

// ---------- 事件效果 ----------
function applyEvent(evt, owner, planeIdx) {
    const planes = owner === 'player' ? sa.playerPlanes : sa.gravesPlanes;
    const pos = planes[planeIdx];

    switch (evt) {
        case 'support': {
            const nb = findNextBase(pos);
            planes[planeIdx] = nb;
            return `空中支援抵达，运输机跃升至「${getBaseName(nb) || '终点'}」（位置 ${nb}）。`;
        }
        case 'ambush': {
    const shield = owner === 'player' ? sa.playerShield : sa.gravesShield;
    if (shield) {
        if (owner === 'player') sa.playerShield = false;
        else sa.gravesShield = false;
        return '卫星链路已激活，伏击被预警拦截。运输机原位不动。';
    }
    // 修改点1：最多退后3格，但底线是前一个基地
    const pb = findPrevBase(pos);
    planes[planeIdx] = Math.max(pb, pos - 3); 
    return `运输机遭遇伏击，被迫退后至位置 ${planes[planeIdx]}。`;
}
        case 'fuel': {
    if (owner === 'player') sa.playerHalfNext = true;
    else sa.gravesHalfNext = true;
    return '燃油管线受损。\n下一回合掷骰后，实际移动距离将减半（向上取整）。\n例如：掷出 5 → 只能移动 3 格。';
}
        case 'jam': {
            if (owner === 'player') sa.playerSkipNext = true;
            else sa.gravesSkipNext = true;
            return '通讯被敌方干扰。下一回合将无法行动。';
        }
        case 'refuel': {
            if (owner === 'player') {
                sa.hasRolled = false;
                setDiceEnabled(true, '再 掷 一 次');
                return '空中加油完成。你可以再掷一次骰子。';
            } else {
                return '格瑞夫斯在空中加油，他将获得一次额外投掷。';
            }
        }
        case 'missile': {
    const opponent = owner === 'player' ? 'graves' : 'player';
    const oppPlanes = opponent === 'player' ? sa.playerPlanes : sa.gravesPlanes;
    const oppShield = opponent === 'player' ? sa.playerShield : sa.gravesShield;
    if (oppShield) {
        if (opponent === 'player') sa.playerShield = false;
        else sa.gravesShield = false;
        return '你锁定了对手，但对方的卫星护盾拦截了导弹。';
    }
    let maxPos = -1, maxIdx = -1;
    oppPlanes.forEach((p, i) => {
        if (p > maxPos && p < SA_END) { maxPos = p; maxIdx = i; }
    });
    if (maxIdx < 0) return '对手所有运输机都已抵达终点，导弹失效。';
    
    // 修改点2：不再炸回0，而是炸回“最近的基地”
    const fallbackBase = findPrevBase(oppPlanes[maxIdx]);
    oppPlanes[maxIdx] = fallbackBase;
    return `导弹命中对手的运输机，对方一架飞机被炸回最近基地「${getBaseName(fallbackBase) || '德州'}」（位置 ${fallbackBase}）。`;
}
        case 'satellite': {
            if (owner === 'player') sa.playerShield = true;
            else sa.gravesShield = true;
            return '卫星链路已激活。下一次伏击或导弹将被自动拦截。';
        }
    }
    return '';
}
    /* ================= 暗影空运 · 飞行棋逻辑 (3/3) ================= */

    // ---------- 回合切换 ----------
    function nextTurn() {
        if (!sa.active) return;
        sa.currentTurn = sa.currentTurn === 'player' ? 'graves' : 'player';
        sa.hasRolled = false;

        if (sa.currentTurn === 'graves') {
            if (sa.gravesSkipNext) {
                sa.gravesSkipNext = false;
                speak('我的通讯被干扰，这一回合跳过。');
                setTimeout(() => nextTurn(), 1400);
                return;
            }
            setDiceEnabled(false, '格 瑞 夫 斯 的 回 合');
            speak('轮到我了。');
            setTimeout(() => aiRollDice(), 1000);
        } else {
            if (sa.playerSkipNext) {
                sa.playerSkipNext = false;
                speak('你的通讯被干扰，这一回合跳过。');
                setDiceEnabled(false, '通 讯 干 扰');
                setTimeout(() => nextTurn(), 1400);
                return;
            }
            setDiceEnabled(true, '掷 骰 子');
            speak('轮到你了，Darlin\'。');
        }
        updateUI();
    }

    // ---------- AI 回合 ----------
function aiRollDice() {
    if (!sa.active) return;
    sa.busy = true;
    const dice = document.getElementById('saDice');
    if (dice) dice.classList.add('rolling');

    let count = 0;
    const iv = setInterval(() => {
        if (!sa.active) { clearInterval(iv); return; }
        if (dice) dice.textContent = Math.floor(Math.random() * 6) + 1;
        count++;
        if (count >= 12) {
            clearInterval(iv);
            const rawRoll = Math.floor(Math.random() * 6) + 1;
            if (dice) { dice.textContent = rawRoll; dice.classList.remove('rolling'); }

            if (sa.gravesHalfNext) {
                speak(`我掷出 ${rawRoll}。`);
                setTimeout(() => {
                    if (!sa.active) return;
                    const finalRoll = Math.max(1, Math.ceil(rawRoll / 2));
                    sa.gravesHalfNext = false;
                    sa.diceValue = finalRoll;
                    if (dice) {
                        dice.style.color = '#e03e3e';
                        dice.textContent = finalRoll;
                        setTimeout(() => { dice.style.color = ''; }, 800);
                    }
                    sa.busy = false;
                    speak(`燃油泄漏生效：${rawRoll} → ${finalRoll}。我这次只能走 ${finalRoll} 格。`);
                    setTimeout(() => aiSelectPlane(), 1000);
                }, 900);
            } else {
                sa.diceValue = rawRoll;
                sa.busy = false;
                speak(`我掷出 ${rawRoll}。`);
                setTimeout(() => aiSelectPlane(), 800);
            }
        }
    }, 70);
}
    function aiSelectPlane() {
        if (!sa.active) return;
        let bestIdx = -1, bestPos = -1;
        sa.gravesPlanes.forEach((p, i) => {
            if (p < SA_END && p > bestPos) { bestPos = p; bestIdx = i; }
        });
        if (bestIdx < 0) {
            if (checkWin('graves')) endGame('graves');
            else setTimeout(() => nextTurn(), 500);
            return;
        }
        const newPos = Math.min(sa.gravesPlanes[bestIdx] + sa.diceValue, SA_END);
        sa.gravesPlanes[bestIdx] = newPos;
        updateUI();

        const evt = sa.events[newPos];
        if (evt && newPos !== SA_END) {
            setTimeout(() => triggerGravesEvent(evt, bestIdx), 600);
        } else {
            if (checkWin('graves')) {
                endGame('graves');
            } else {
                setTimeout(() => nextTurn(), 700);
            }
        }
    }

    function triggerGravesEvent(evt, planeIdx) {
        const result = applyEvent(evt, 'graves', planeIdx);
        updateUI();
        speak('【' + SA_EVENT_STYLES[evt].name + '】' + result);

        if (evt === 'refuel') {
            setTimeout(() => {
                if (!sa.active) return;
                if (checkWin('graves')) { endGame('graves'); return; }
                aiRollDice();
            }, 1200);
            return;
        }

        setTimeout(() => {
            if (checkWin('graves')) endGame('graves');
            else if (sa.gravesSkipNext) {
                nextTurn();
            } else {
                nextTurn();
            }
        }, 1000);
    }

    // ---------- 胜负 ----------
    function checkWin(who) {
        const planes = who === 'player' ? sa.playerPlanes : sa.gravesPlanes;
        return planes[0] >= SA_END && planes[1] >= SA_END;
    }

    function endGame(winner) {
        if (!sa.active) return;
        sa.active = false;

        const isWin = winner === 'player';
        let delta;
        if (isWin) {
            delta = sa.bet * 2;
            dispatchFunds += delta;
            speak('我输了。钱归你。下次再来。');
        } else {
            delta = -sa.bet * 2;
            dispatchFunds = Math.max(0, dispatchFunds + delta);
            speak('愿赌服输。下次记得带够钱。');
        }

        if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        if (typeof saveGameState === 'function') saveGameState();

        const modal = document.getElementById('saGameOverModal');
        const title = document.getElementById('saGameOverTitle');
        const rank = document.getElementById('saGameOverRank');
        const desc = document.getElementById('saGameOverDesc');
        if (title) {
            title.textContent = isWin ? '空运成功 · 你赢了' : '空运失败 · 你输了';
            title.classList.toggle('fail', !isWin);
        }
        if (rank) {
            rank.textContent = isWin ? 'WIN' : 'LOSE';
            rank.className = 'sa-modal-rank ' + (isWin ? 'win' : 'lose');
        }
        if (desc) {
            const sign = delta >= 0 ? '+' : '-';
            desc.textContent = `你：${sa.playerPlanes.filter(p => p >= SA_END).length} / 2 抵达\n格瑞夫斯：${sa.gravesPlanes.filter(p => p >= SA_END).length} / 2 抵达\n\n资金变动：${sign}$${Math.abs(delta).toLocaleString('en-US')}`;
        }
        if (modal) modal.classList.add('active');

        const currentSession = sa.sessionId;
        if (typeof triggerGravesAltMessage === 'function') {
            setTimeout(() => {
                if (sa.sessionId !== currentSession) return;
                if (isWin) {
                    triggerGravesAltMessage(`Darlin'，空运行动结束。$${(sa.bet * 2).toLocaleString('en-US')} 已经到你账上了。下次赌注再大点。`);
                } else {
                    triggerGravesAltMessage(`你输给我 $${(sa.bet * 2).toLocaleString('en-US')}。空运要的是规划，不是运气。`);
                }
            }, 3500);
        }
    }
})();

/* ================= 暗影突进 · 跑酷逻辑（像素版） ================= */
(function() {
    let canvas, ctx;
    let srAnimId = null;
    let srActive = false;

    // 物理参数
    const GRAVITY = 0.6;
    const JUMP_FORCE = -11.5;
    const GROUND_Y = 200; // 地面线
    let baseSpeed = 6;
    let currentSpeed = 6;

    let score = 0;
    let highScore = parseInt(localStorage.getItem('shadowRunnerHighScore')) || 0;
    let isGameOver = false;
    let frameCount = 0;
let countdownTimer = 0; // 倒计时（秒）
    // 玩家状态
    let player = {
        x: 50,
        y: GROUND_Y - 40, // 身高40
        width: 24,        // 像素小人宽度
        height: 40,
        vy: 0,
        isJumping: false,
        isDucking: false,
        duckHeight: 22
    };

    let obstacles = [];

    function initCanvas() {
        canvas = document.getElementById('srCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        canvas.width = 380;
        canvas.height = 250;
        // 关闭抗锯齿，保持像素风锐利
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
    }

    window.openShadowRunner = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();

        const overlay = document.getElementById('srOverlay');
        if (!overlay) return;
        if (overlay.parentNode !== document.body) document.body.appendChild(overlay);
        overlay.classList.add('active');

        initCanvas();
        srActive = true;
        srRestart();
    };

    window.closeShadowRunner = function() {
        srActive = false;
        isGameOver = true;
        if (srAnimId) cancelAnimationFrame(srAnimId);
        const overlay = document.getElementById('srOverlay');
        if (overlay) overlay.classList.remove('active');
        document.getElementById('srModal').classList.remove('active');
    };

   window.srRestart = function() {
    document.getElementById('srModal').classList.remove('active');
    score = 0;
    currentSpeed = 0; // 倒计时期间速度为0
    countdownTimer = 3.5; // 设置3.5秒倒计时，留点余量给"3,2,1"
    obstacles = [];
    isGameOver = false;
    frameCount = 0;
    player.y = GROUND_Y - player.height;
    player.vy = 0;
    player.isJumping = false;
    player.isDucking = false;
    document.getElementById('srBtnDown').classList.remove('active');
    
    document.getElementById('srHighScore').textContent = highScore;
    document.getElementById('srScore').textContent = '0';
    
    if (srAnimId) cancelAnimationFrame(srAnimId);
    gameLoop();
};

    // ================= 操作控制 =================
    function jump() {
    if (isGameOver) return;
    // 如果在倒计时中，按跳跃直接取消倒计时
    if (countdownTimer > 0) {
        countdownTimer = 0;
        currentSpeed = baseSpeed;
    }
    
    if (player.isJumping || player.isDucking) return;
    player.vy = JUMP_FORCE;
    player.isJumping = true;
}

    function duckStart() {
        if (isGameOver || player.isJumping) return;
        player.isDucking = true;
        document.getElementById('srBtnDown').classList.add('active');
    }

    function duckEnd() {
        player.isDucking = false;
        document.getElementById('srBtnDown').classList.remove('active');
    }

    // 键盘支持
    document.addEventListener('keydown', (e) => {
        if (!srActive) return;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
            e.preventDefault(); jump();
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            e.preventDefault(); duckStart();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (!srActive) return;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            duckEnd();
        }
    });

    // 鼠标与触屏支持
    const btnJump = document.getElementById('srBtnJump');
    const btnDown = document.getElementById('srBtnDown');

    btnJump.addEventListener('mousedown', jump);
    btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { passive: false });

    btnDown.addEventListener('mousedown', duckStart);
    btnDown.addEventListener('touchstart', (e) => { e.preventDefault(); duckStart(); }, { passive: false });
    
    window.addEventListener('mouseup', duckEnd);
    btnDown.addEventListener('touchend', (e) => { e.preventDefault(); duckEnd(); });
    btnDown.addEventListener('touchcancel', (e) => { e.preventDefault(); duckEnd(); });

    // ================= 游戏主循环 =================
    function gameLoop() {
        if (!srActive) return;

        if (!isGameOver) {
            update();
            draw();
            frameCount++;
            srAnimId = requestAnimationFrame(gameLoop);
        }
    }

    function update() {
    // 跳跃物理
    if (player.isJumping) {
        player.y += player.vy;
        player.vy += GRAVITY;
        if (player.y >= GROUND_Y - player.height) {
            player.y = GROUND_Y - player.height;
            player.isJumping = false;
            player.vy = 0;
        }
    }

    // --- 倒计时处理 ---
    if (countdownTimer > 0) {
        countdownTimer -= 1 / 60; // 假设60帧，每帧减0.016秒
        if (countdownTimer <= 0) {
            countdownTimer = 0;
            currentSpeed = baseSpeed; // 倒计时结束，游戏正式开始
        }
        return; // 倒计时期间，跳过下面的分数计算和障碍物生成
    }

    // 2. 速度与得分
    score += 0.1;
    if (frameCount % 100 === 0) currentSpeed += 0.1; // 缓慢加速
    document.getElementById('srScore').textContent = Math.floor(score);

    // 3. 生成障碍物 ... (下面保持你现有的代码不变)

       // 3. 生成障碍物
if (frameCount % Math.floor(Math.max(50, 90 - score / 50)) === 0) {
    let isFlying = Math.random() > 0.5; // 50% 出空中激光网，50% 出地面拒马

    if (isFlying) {
        // 空中激光网：从高空一直挂下来，挡住所有跳跃路线
        let width = 24;
        let height = 135; // 极高，直接封死上方空间
        let y = GROUND_Y - 165; // 顶部在极高处，底部距离地面 35px
        // （玩家滑铲高度22能钻过去，站立40会撞，起跳必死）
        obstacles.push({
            x: canvas.width, y: y, width: width, height: height, type: 'drone'
        });
    } else {
        // 地面拒马：必须跳过去
        let width = 20 + Math.random() * 15;
        let height = 30 + Math.random() * 10;
        let y = GROUND_Y - height;
        obstacles.push({
            x: canvas.width, y: y, width: width, height: height, type: 'mine'
        });
    }
}

        // 4. 障碍物移动与碰撞
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.x -= currentSpeed;

            // 玩家碰撞箱（略微收缩，提升手感）
            let pY = player.isDucking ? GROUND_Y - player.duckHeight : player.y;
            let pH = player.isDucking ? player.duckHeight : player.height;
            
            let pRect = { x: player.x + 6, y: pY + 2, w: player.width - 10, h: pH - 4 };
            let oRect = { x: obs.x + 2, y: obs.y + 2, w: obs.width - 4, h: obs.height - 4 };

            // AABB 碰撞
            if (pRect.x < oRect.x + oRect.w &&
                pRect.x + pRect.w > oRect.x &&
                pRect.y < oRect.y + oRect.h &&
                pRect.y + pRect.h > oRect.y) {
                gameOver();
            }

            if (obs.x + obs.width < 0) {
                obstacles.splice(i, 1);
            }
        }
    }

    // ================= 像素风绘制 =================
    function draw() {
        // 纯黑背景
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 画地面线（虚线）
        ctx.fillStyle = '#2e3540';
        let offset = (frameCount * currentSpeed) % 20;
        for (let i = -20; i < canvas.width; i += 20) {
            ctx.fillRect(i + offset, GROUND_Y + 2, 10, 2);
        }
        // 画地面的随机像素小石头
        ctx.fillStyle = '#1f232b';
        for (let i = 0; i < 10; i++) {
            let rx = (i * 45 + offset) % canvas.width;
            ctx.fillRect(rx, GROUND_Y + 6, 3, 2);
        }

        // 绘制玩家
        drawPixelPlayer();

        // 绘制障碍物
        obstacles.forEach(obs => {
            if (obs.type === 'mine') {
                drawPixelMine(obs.x, obs.y, obs.width, obs.height);
            } else {
                drawPixelDrone(obs.x, obs.y, obs.width, obs.height);
            }
        });
    }

    // 绘制像素特工
    function drawPixelPlayer() {
        const baseX = player.x;
        const baseY = player.isDucking ? GROUND_Y - player.duckHeight : player.y;
        
        ctx.fillStyle = '#d4af37'; // 暗影金配色

        if (player.isDucking) {
            // 滑铲姿态
            ctx.fillRect(baseX - 5, baseY + 8, 34, 14); // 身体
            ctx.fillStyle = '#fff';
            ctx.fillRect(baseX + 24, baseY + 10, 5, 5); // 头部/面罩
            // 腿部特效（滑铲线）
            ctx.fillStyle = '#2e3540';
            ctx.fillRect(baseX - 15, baseY + 20, 10, 2);
        } else {
            // 站立/跳跃姿态
            // 头
            ctx.fillStyle = '#fff';
            ctx.fillRect(baseX + 10, baseY, 12, 10);
            // 眼睛
            ctx.fillStyle = '#0a0a0c';
            ctx.fillRect(baseX + 17, baseY + 3, 3, 3);
            
            // 身体
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(baseX + 8, baseY + 10, 14, 15);
            
            // 腿部动画
            if (player.isJumping) {
                // 跳跃时腿收缩
                ctx.fillStyle = '#d4af37';
                ctx.fillRect(baseX + 6, baseY + 25, 8, 10);
                ctx.fillRect(baseX + 16, baseY + 25, 8, 10);
            } else {
                // 奔跑时双腿交替
                let legFrame = Math.floor(frameCount / 5) % 2;
                ctx.fillStyle = '#d4af37';
                if (legFrame === 0) {
                    ctx.fillRect(baseX + 6, baseY + 25, 7, 15);  // 前腿伸出
                    ctx.fillRect(baseX + 15, baseY + 25, 7, 8);  // 后腿收起
                } else {
                    ctx.fillRect(baseX + 6, baseY + 25, 7, 8);
                    ctx.fillRect(baseX + 15, baseY + 25, 7, 15);
                }
            }
        }
    }

    // 绘制像素地雷/拒马
    function drawPixelMine(x, y, w, h) {
        ctx.fillStyle = '#e03e3e'; // 危险红
        // 画两个交叉的拒马
        for (let i = 0; i < w; i+=4) {
            ctx.fillRect(x + i, y + h - 4, 4, 4);
            if(i % 8 === 0) ctx.fillRect(x + i, y, 4, h - 4);
        }
        // 警示灯
        ctx.fillStyle = (Math.floor(frameCount / 10) % 2 === 0) ? '#fff' : '#e03e3e';
        ctx.fillRect(x + w/2 - 2, y - 4, 4, 4);
    }

    // 绘制像素无人机
    function drawPixelDrone(x, y, w, h) {
        // 旋翼横杆
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(x - 6, y, w + 12, 3);
        // 机身
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(x + 4, y + 4, w - 8, h - 6);
        // 红外探测仪（闪烁）
        ctx.fillStyle = (Math.floor(frameCount / 15) % 2 === 0) ? '#e03e3e' : '#000';
        ctx.fillRect(x + w/2 - 2, y + h - 6, 4, 4);
        // 绘制倒计时
    if (countdownTimer > 0) {
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 60px "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Math.ceil 向上取整，这样 3.1 秒时显示 4，3.0 秒时显示 3
        let num = Math.ceil(countdownTimer); 
        ctx.fillText(num, canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '14px Consolas, monospace';
        ctx.fillStyle = '#2e3540';
        ctx.fillText('SYSTEM READY...', canvas.width / 2, canvas.height / 2 + 40);
    }
}
 

    function gameOver() {
        isGameOver = true;
        
        if (score > highScore) {
            highScore = Math.floor(score);
            localStorage.setItem('shadowRunnerHighScore', highScore);
            document.getElementById('srHighScore').textContent = highScore;
        }

        // 资金奖励
        let reward = Math.floor(score) * 100;
        if (reward > 0 && typeof dispatchFunds !== 'undefined') {
            dispatchFunds += reward;
            if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        }
        if (typeof saveGameState === 'function') saveGameState();

        let comment = "";
        if (score < 100) comment = "就这点反应速度？你在战场上活不过三秒。";
        else if (score < 300) comment = "勉强及格的体能，看来平时没少跑路。";
        else comment = "干得漂亮，这身手有资格进暗影了。奖金已发放。";

        document.getElementById('srFinalScore').textContent = `${Math.floor(score)} m`;
        document.getElementById('srModalDesc').innerHTML = `${comment}<br><br><span style="color:var(--gold); font-size:12px;">行动资金: +$${reward.toLocaleString('en-US')}</span>`;
        document.getElementById('srModal').classList.add('active');

        // 触发小号吐槽
        if (typeof triggerGravesAltMessage === 'function') {
            setTimeout(() => {
                triggerGravesAltMessage(`Darlin'，你的跑酷成绩是 ${Math.floor(score)} 米。${comment}`);
            }, 2500);
        }
    }
})();

/* ================= 暗影加密电台核心逻辑 ================= */
(function() {
    // 👇 在这里配置你的 6 首音乐信息 👇
    // 请确保文件放在了正确的位置（比如和 index.html 同级，或者 music 文件夹里）
    const playlist = [
        { name: "肖邦", artist: "肖邦古典", src: "chopin.mp3" },
        { name: "贝多芬", artist: "贝多芬古典", src: "beethoven.mp3" },
        { name: "DARK", artist: "激烈", src: "dark.mp3" },
        { name: "维瓦尔第spring", artist: "维瓦尔第 (古典)", src: "vivaldi_spring.mp3" },
        { name: "Soft", artist: "舒缓", src: "soft.mp3" },
        { name: "relax", artist: "轻松", src: "relax.mp3" },
        { name: "Dark Hanger", artist: "Dicemare", src: "GRAVES.mp3" },
        { name: "The Ledger", artist: "Dicemare", src: "SHADOW.mp3" },
        { name: "CheckList", artist: "Phillip Graves,Cyan", src: "111cyan.mp3" }
  ];

    let currentIndex = 0;
    let isPlaying = false;
    let audio = document.getElementById('shadowAudio');

    // 初始化事件监听
    function initAudio() {
        // 当歌曲播放完毕时自动下一首
        audio.addEventListener('ended', nextTrack);
        
        // 更新时间进度条
        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const current = audio.currentTime;
            const total = audio.duration;
            
            document.getElementById('mCurrentTime').textContent = formatTime(current);
            document.getElementById('mTotalTime').textContent = formatTime(total);
            
            const percent = (current / total) * 100;
            document.getElementById('mBarFill').style.width = `${percent}%`;
        });
    }

    function formatTime(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(Math.floor(sec % 60)).padStart(2, '0');
        return `${m}:${s}`;
    }

    // 加载歌曲
    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        currentIndex = index;
        
        const track = playlist[index];
        audio.src = track.src;
        
        // 更新 UI
        document.getElementById('mTrackName').textContent = track.name;
        document.getElementById('mTrackArtist').textContent = track.artist;
        document.getElementById('miniName').textContent = track.name;
        
        // 如果当前在播放状态，切歌后自动继续播
        if (isPlaying) {
            audio.play().catch(e => console.log('播放失败，请检查文件路径', e));
        }
    }

    // 播放/暂停控制
    window.toggleMusicPlay = function() {
        if (!audio.src) loadTrack(0); // 第一次点击先加载第一首

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => {
                alert("无法播放，请检查 mp3 文件路径是否配置正确！");
            });
        }
    };

    // 监听播放状态变化 (更新UI)
   // 监听播放事件（点击播放时，唱针落下）
audio.addEventListener('play', () => {
    isPlaying = true;
    document.getElementById('mPlayBtn').textContent = '⏸';
    document.getElementById('vinylDisc').classList.add('playing');
    // 👇 关键：播放时，给唱针加上 playing 类
    document.getElementById('tonearm').classList.add('playing'); 
    document.getElementById('miniDisc').classList.add('playing');
    document.getElementById('miniStatus').textContent = '后台播放中...';
});

// 监听暂停事件（点击暂停时，唱针抬起）
audio.addEventListener('pause', () => {
    isPlaying = false;
    document.getElementById('mPlayBtn').textContent = '▶';
    document.getElementById('vinylDisc').classList.remove('playing');
    // 👇 关键：暂停时，移除唱针的 playing 类
    document.getElementById('tonearm').classList.remove('playing'); 
    document.getElementById('miniDisc').classList.remove('playing');
    document.getElementById('miniStatus').textContent = '已暂停';
});

    // 上一首/下一首
    window.nextTrack = function() {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadTrack(currentIndex);
    };

    window.prevTrack = function() {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentIndex);
    };

    // 进度条点击跳转
    document.getElementById('mBarBg').addEventListener('click', function(e) {
        if (!audio.duration) return;
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // 打开/关闭全屏播放器
    window.openMusicPlayer = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();

        const overlay = document.getElementById('musicOverlay');
        if (!overlay) return;
        if (overlay.parentNode !== document.body) document.body.appendChild(overlay);
        
        // 如果首次打开，加载第一首（但不自动播放，等用户点）
        if (!audio.src) loadTrack(0);

        overlay.classList.add('active');
        document.getElementById('miniPlayer').classList.remove('active'); // 隐藏迷你条
    };

    window.closeMusicPlayer = function() {
        const overlay = document.getElementById('musicOverlay');
        if (overlay) overlay.classList.remove('active');
        
        // 核心逻辑：退出界面时，如果音乐正在播放，显示迷你悬浮条
        if (isPlaying) {
            document.getElementById('miniPlayer').classList.add('active');
        }
    };

    // 初始化
    initAudio();

    // 处理切歌防报错（必须在用户点击时初始化）
    document.addEventListener('click', function initAudioCtxOnce() {
        if (audio && !audio.src) {
            // 预加载但不播
            loadTrack(0);
        }
        document.removeEventListener('click', initAudioCtxOnce);
    });

})();

/* ================= 暗影极速 · 纵向跑酷逻辑 ================= */
(function() {
    let canvas, ctx;
    let rushAnimId = null;
    let rushActive = false;

    // 游戏参数
    const LANE_COUNT = 3;
    const ROAD_WIDTH = 240; // 路面宽度
    const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT;
    let baseSpeed = 6;
    let currentSpeed = 6;

    // 状态
    let score = 0;
    let coinsCollected = 0;
    let highScore = parseInt(localStorage.getItem('shadowRushHighScore')) || 0;
    let isGameOver = false;
    let frameCount = 0;
    let spawnTimer = 0;

    // 玩家（小车）
    let player = {
        lane: 1, // 0, 1, 2
        x: 0,    // 动态计算
        y: 0,    // 底部
        width: 34,
        height: 60,
        targetX: 0
    };

    // 实体
    let obstacles = [];
    let coins = [];

    function initCanvas() {
        canvas = document.getElementById('rushCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        canvas.width = 380;
        canvas.height = 500;
        
        // 计算初始玩家位置
        player.y = canvas.height - 90;
        player.x = (canvas.width / 2) + (player.lane - 1) * LANE_WIDTH;
        player.targetX = player.x;
    }

    window.openShadowRush = function() {
        if (typeof closeAllOverlays === 'function') closeAllOverlays();
        if (typeof closeAppCenter === 'function') closeAppCenter();

        const overlay = document.getElementById('rushOverlay');
        if (!overlay) return;
        if (overlay.parentNode !== document.body) document.body.appendChild(overlay);
        overlay.classList.add('active');

        initCanvas();
        rushActive = true;
        rushRestart();
    };

    window.closeShadowRush = function() {
        rushActive = false;
        isGameOver = true;
        if (rushAnimId) cancelAnimationFrame(rushAnimId);
        const overlay = document.getElementById('rushOverlay');
        if (overlay) overlay.classList.remove('active');
        document.getElementById('rushModal').classList.remove('active');
    };

    window.rushRestart = function() {
        document.getElementById('rushModal').classList.remove('active');
        score = 0;
        coinsCollected = 0;
        currentSpeed = baseSpeed;
        obstacles = [];
        coins = [];
        isGameOver = false;
        frameCount = 0;
        spawnTimer = 0;
        player.lane = 1;
        player.x = (canvas.width / 2);
        player.targetX = player.x;
        
        document.getElementById('rushHighScore').textContent = highScore;
        document.getElementById('rushScore').textContent = '0';
        document.getElementById('rushCoins').textContent = '0';
        
        if (rushAnimId) cancelAnimationFrame(rushAnimId);
        gameLoop();
    };

    // ================= 操作控制 =================
    window.rushMove = function(dir) {
        if (isGameOver) return;
        if (dir === 'left' && player.lane > 0) {
            player.lane--;
        } else if (dir === 'right' && player.lane < LANE_COUNT - 1) {
            player.lane++;
        }
        // 计算目标 X 坐标（居中）
        player.targetX = (canvas.width / 2) + (player.lane - 1) * LANE_WIDTH;
    };

    // 键盘支持
    document.addEventListener('keydown', (e) => {
        if (!rushActive) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            e.preventDefault(); rushMove('left');
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            e.preventDefault(); rushMove('right');
        }
    });

    // ================= 游戏主循环 =================
    function gameLoop() {
        if (!rushActive) return;
        if (!isGameOver) {
            update();
            draw();
            frameCount++;
            rushAnimId = requestAnimationFrame(gameLoop);
        }
    }

    function update() {
        // 1. 玩家平滑移动
        player.x += (player.targetX - player.x) * 0.25;

        // 2. 速度与得分
        score += 0.1;
        if (frameCount % 100 === 0) currentSpeed += 0.15;
        document.getElementById('rushScore').textContent = Math.floor(score);

        // 3. 生成障碍物与金币
        spawnTimer++;
        // 随机生成间隔
        if (spawnTimer > Math.max(30, 60 - score / 100)) {
            spawnTimer = 0;
            let spawnLane = Math.floor(Math.random() * LANE_COUNT);
            
            // 50% 概率出金币，50% 出障碍
            if (Math.random() > 0.4) {
    // 👇 先判断是否要生成大型油罐车
    // 条件：画面上半部没有其他障碍（防止必死局）+ 15% 概率
    const canSpawnTanker = obstacles.every(o => o.y > 150);
    const roll = Math.random();
    
    if (roll < 0.15 && canSpawnTanker) {
        // 大型油罐车：占两个相邻车道
        const leftSide = Math.random() > 0.5;  // 随机选左侧(0+1)还是右侧(1+2)
        const centerX = leftSide
            ? (canvas.width / 2) - LANE_WIDTH / 2
            : (canvas.width / 2) + LANE_WIDTH / 2;
        
        obstacles.push({
            x: centerX,
            y: -100,
            width: LANE_WIDTH * 1.8,   // 略窄于2个车道，留点缝
            height: 90,
            type: 'tanker',
            tankerSide: leftSide ? 'left' : 'right'
        });
        
        spawnTimer = -30;  // 👈 额外延迟下一波，给玩家反应时间
    } else {
        // 普通路障 / 巡逻无人机
        if (spawnLane === 1) spawnLane = Math.random() > 0.5 ? 0 : 2;
        
        let obsType = 'barrier';
        let obsWidth = 30;
        let obsHeight = 50;
        if (Math.random() < 0.3) {
            obsType = 'patrol';
            obsWidth = 36;
            obsHeight = 40;
        }
        
        const baseX = (canvas.width / 2) + (spawnLane - 1) * LANE_WIDTH;
        obstacles.push({
            x: baseX,
            y: -80,
            width: obsWidth,
            height: obsHeight,
            type: obsType,
            baseX: baseX,
            patrolRange: obsType === 'patrol' ? LANE_WIDTH * 0.9 : 0,
            patrolTime: Math.random() * Math.PI * 2
        });
    }
} else {
                // 生成金币阵列 (1~3个)
                let count = Math.floor(Math.random() * 3) + 1;
                for(let i=0; i<count; i++) {
                    coins.push({
                        x: (canvas.width / 2) + (spawnLane - 1) * LANE_WIDTH,
                        y: -50 - (i * 40), // 垂直排列
                        width: 20,
                        height: 20
                    });
                }
            }
        }

        // 4. 移动障碍物并判定碰撞
        for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.y += currentSpeed;

    // 👇 新增：巡逻无人机横移
    if (obs.type === 'patrol') {
        obs.patrolTime += 0.05;
        obs.x = obs.baseX + Math.sin(obs.patrolTime) * obs.patrolRange;
    }

    // 碰撞箱（稍微缩减一点，提升手感）
    if (Math.abs(player.x - obs.x) < (player.width + obs.width)/2 - 6 &&
        Math.abs(player.y - obs.y) < (player.height + obs.height)/2 - 6) {
        gameOver();
    }

    if (obs.y > canvas.height) obstacles.splice(i, 1);
}

        // 5. 移动金币并判定拾取
        for (let i = coins.length - 1; i >= 0; i--) {
            let c = coins[i];
            c.y += currentSpeed;

            if (Math.abs(player.x - c.x) < (player.width + c.width)/2 &&
                Math.abs(player.y - c.y) < (player.height + c.height)/2) {
                coinsCollected++;
                document.getElementById('rushCoins').textContent = coinsCollected;
                coins.splice(i, 1);
            } else if (c.y > canvas.height) {
                coins.splice(i, 1);
            }
        }
    }

    // ================= 绘制 =================
    function draw() {
        // 背景
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制路面
        const roadLeft = (canvas.width - ROAD_WIDTH) / 2;
        const roadRight = roadLeft + ROAD_WIDTH;
        
        // 路面底色（稍亮一点的黑）
        ctx.fillStyle = '#121216';
        ctx.fillRect(roadLeft, 0, ROAD_WIDTH, canvas.height);

        // 画车道分割线（虚线）
        ctx.strokeStyle = '#2a2a35';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = (frameCount * currentSpeed) % 40;
        
        for (let i = 1; i < LANE_COUNT; i++) {
            let lineX = roadLeft + i * LANE_WIDTH;
            ctx.beginPath();
            ctx.moveTo(lineX, 0);
            ctx.lineTo(lineX, canvas.height);
            ctx.stroke();
        }
        ctx.setLineDash([]); // 恢复实线

        // 路面边缘的金色警戒线
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(roadLeft, 0); ctx.lineTo(roadLeft, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(roadRight, 0); ctx.lineTo(roadRight, canvas.height); ctx.stroke();

        // 绘制障碍物（红色激光路障）
       obstacles.forEach(obs => {
    if (obs.type === 'tanker') {
        // ========== 大型油罐车 ==========
        const x = obs.x - obs.width/2;
        const y = obs.y - obs.height/2;
        
        // 车身主体（深灰装甲）
        ctx.fillStyle = '#2a2a35';
        ctx.fillRect(x, y, obs.width, obs.height);
        
        // 橙色危险边框
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, obs.width, obs.height);
        
        // 中间的橙色警戒带
        ctx.fillStyle = 'rgba(230, 126, 34, 0.5)';
        ctx.fillRect(x + 4, obs.y - 8, obs.width - 8, 16);
        
        // 顶部两个车头灯（金色发光）
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        ctx.fillRect(x + 8, y - 3, 8, 3);
        ctx.fillRect(x + obs.width - 16, y - 3, 8, 3);
        ctx.shadowBlur = 0;
        
        // 中间黄色警告三角
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y - 10);
        ctx.lineTo(obs.x - 10, obs.y + 6);
        ctx.lineTo(obs.x + 10, obs.y + 6);
        ctx.closePath();
        ctx.fill();
        
        // 三角里的感叹号
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', obs.x, obs.y - 1);
        
        // 两侧闪烁红色警示灯
        if (Math.floor(frameCount / 10) % 2 === 0) {
            ctx.fillStyle = '#ff4444';
            ctx.shadowColor = '#ff4444';
            ctx.shadowBlur = 10;
            ctx.fillRect(x + 2, y + 8, 4, 4);
            ctx.fillRect(x + obs.width - 6, y + 8, 4, 4);
            ctx.shadowBlur = 0;
        }
    } else if (obs.type === 'patrol') {
        // 紫色无人机机身（原有，不动）
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(obs.x - obs.width/2, obs.y - obs.height/2, obs.width, obs.height);
        
        // 顶部旋翼横杆
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(obs.x - obs.width/2 - 6, obs.y - obs.height/2 - 3, obs.width + 12, 3);
        
        // 中心探测核心（闪烁）
        const blink = (Math.floor(frameCount / 8) % 2 === 0) ? '#ff5555' : '#e03e3e';
        ctx.fillStyle = blink;
        ctx.shadowColor = blink;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        // 原来的红色激光路障（原有，不动）
        ctx.fillStyle = '#e03e3e';
        ctx.fillRect(obs.x - obs.width/2, obs.y - obs.height/2, obs.width, obs.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(obs.x - obs.width/2 + 5, obs.y - obs.height/2 + 10, obs.width - 10, 5);
        ctx.fillRect(obs.x - obs.width/2 + 5, obs.y - obs.height/2 + 25, obs.width - 10, 5);
    }
});

        // 绘制金币（金色发光方块）
        coins.forEach(c => {
            ctx.fillStyle = '#d4af37';
            ctx.shadowColor = '#d4af37';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // 重置
            // 金币中间的符号
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', c.x, c.y + 1);
        });

        // 绘制玩家（黑色装甲小车）
        drawPlayer();
    }

    function drawPlayer() {
        const px = player.x;
        const py = player.y;
        const w = player.width;
        const h = player.height;

        // 影子
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(px - w/2 + 4, py - h/2 + 4, w, h);

        // 车身主装甲
        ctx.fillStyle = '#14171d';
        ctx.fillRect(px - w/2, py - h/2, w, h);
        
        // 金色装甲边框
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.strokeRect(px - w/2, py - h/2, w, h);

        // 车窗
        ctx.fillStyle = '#2a2a35';
        ctx.fillRect(px - w/2 + 6, py - h/2 + 10, w - 12, 15);

        // 车轮
        ctx.fillStyle = '#000';
        ctx.fillRect(px - w/2 - 4, py - h/2 + 8, 6, 14);
        ctx.fillRect(px + w/2 - 2, py - h/2 + 8, 6, 14);
        ctx.fillRect(px - w/2 - 4, py + h/2 - 22, 6, 14);
        ctx.fillRect(px + w/2 - 2, py + h/2 - 22, 6, 14);

        // 车头灯（灯光特效）
        ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.beginPath();
        ctx.moveTo(px - w/2 + 4, py - h/2);
        ctx.lineTo(px - w/2 - 15, py - h/2 - 30);
        ctx.lineTo(px + w/2 + 15, py - h/2 - 30);
        ctx.lineTo(px + w/2 - 4, py - h/2);
        ctx.fill();
        
        // 车灯灯泡
        ctx.fillStyle = '#fff';
        ctx.fillRect(px - 10, py - h/2, 6, 3);
        ctx.fillRect(px + 4, py - h/2, 6, 3);
    }

    function gameOver() {
        isGameOver = true;
        
        if (score > highScore) {
            highScore = Math.floor(score);
            localStorage.setItem('shadowRushHighScore', highScore);
            document.getElementById('rushHighScore').textContent = highScore;
        }

        // 资金奖励：1个金币 = 1万行动资金
        let reward = coinsCollected * 2000;
        if (reward > 0 && typeof dispatchFunds !== 'undefined') {
            dispatchFunds += reward;
            if (typeof renderDispatchFunds === 'function') renderDispatchFunds();
        }
        if (typeof saveGameState === 'function') saveGameState();

        let comment = "";
        if (score < 200) comment = "就这点距离？连德州的州界都没出。";
        else if (score < 500) comment = "车技勉强及格，不过下次记得躲开那些红色的东西。";
        else comment = "干得漂亮，这车技够资格给我当司机了。奖金收好。";

        document.getElementById('rushFinalScore').textContent = `${Math.floor(score)} m`;
        document.getElementById('rushModalDesc').innerHTML = `${comment}<br><br><span style="color:var(--gold); font-size:12px;">拾取金币: ${coinsCollected} (行动资金 +$${reward.toLocaleString('en-US')})</span>`;
        document.getElementById('rushModal').classList.add('active');

       // 👇 修复：在死亡瞬间立刻存下真实分数，防止被新一局覆盖
const finalScore = Math.floor(score); 

if (typeof triggerGravesAltMessage === 'function') {
    setTimeout(() => {
        triggerGravesAltMessage(`Darlin'，极速突围结束，跑了 ${finalScore} 米。${comment}`);
    }, 2000);
}
    }
})();

/* ================= 暗影旅行 · 核心逻辑 ================= */
(function() {
    'use strict';
    
    // ============ 6 座城市数据 ============
const TRAVEL_CITIES = [
    {
        id: 'paris', name: '巴黎', emoji: '🗼',
        country: 'France · 法国',
        lat: 48.85, lng: 2.35,
        bg: 'paris.jpg',
        spots: [
            { id: 'paris_1', name: '埃菲尔铁塔', emoji: '🗼', photo: 'paris_1.jpg',
              eventTitle: '铁塔亮灯',
              eventDesc: '整点到了。铁塔上的两万盏灯同时闪起来，像一场没人预告的流星雨。',
              gravesLine: '"两万盏灯同时亮。法国人真会搞花活。不过这光线打在你脸上，还挺好看。"' },
            { id: 'paris_2', name: '塞纳河游船', emoji: '🛶', photo: 'paris_2.jpg',
              eventTitle: '游船夜风',
              eventDesc: '塞纳河上，游船慢慢滑过一座石桥。河面的灯影被水波揉碎又拼合。',
              gravesLine: '"夜风凉，把外套穿上。别跟我说不冷，你撒谎技术很烂。"' },
            { id: 'paris_3', name: '蒙马特高地', emoji: '🌅', photo: 'paris_3.jpg',
              eventTitle: '清晨的画家广场',
              eventDesc: '天刚亮，蒙马特高地的画家广场还没开张。几把旧画架立在石板路上，晨光把影子拉得很长。',
              gravesLine: '"这地方艺术家扎堆。我本来觉得是浪费时间。现在坐这儿看太阳，倒也不算太浪费。……别看我，看日出。"' }
        ],
        hiddenTitle: '巴黎 · 铁塔顶上',
        hiddenText: '埃菲尔铁塔顶层的风比下面冷得多。他把外套罩在你肩上，自己靠在栏杆边，没抽烟。\n\n"我以前来过这儿。那时候穿着军装，口袋里没几个钱。这城市跟我没关系。"\n\n"现在不一样了。"\n\n他侧头看你，霓虹让他的眼睛亮亮的。\n\n"现在站在这儿的是暗影公司CEO。整座城市，我想让哪盏灯亮就让哪盏亮。"\n\n轻轻笑了一声。\n\n"但说实话，那些灯再亮，也跟我没什么关系。"\n\n他的手落到你肩上。\n\n"只有你在，这地方我才会多看两眼。"'
    },
    {
        id: 'tokyo', name: '东京', emoji: '⛩️',
        country: 'Japan · 日本',
        lat: 35.68, lng: 139.69,
        bg: 'tokyo.jpg',
        spots: [
            { id: 'tokyo_1', name: '浅草寺', emoji: '⛩️', photo: 'tokyo_1.jpg',
              eventTitle: '雪落雷门',
              eventDesc: '浅草寺的雷门大灯笼在雪里亮着，红色的纸罩上积了薄薄一层白。香炉的烟缓缓上升，跟雪花混在一起。',
              gravesLine: '"下雪了。这庙比照片里小。不过那个红灯笼倒是够醒目。你手冷？伸过来。"' },
            { id: 'tokyo_2', name: '涩谷路口', emoji: '🚦', photo: 'tokyo_2.jpg',
              eventTitle: '人潮涌来',
              eventDesc: '涩谷十字路口的绿灯亮了。三千多人同时涌向斑马线，像一场预演过的潮水。',
              gravesLine: '"绿灯一亮，三千人跟开闸似的。别松手，跟我走。丢了上哪儿找你去。"' },
            { id: 'tokyo_3', name: '台场摩天轮', emoji: '🎡', photo: 'tokyo_3.jpg',
              eventTitle: '摩天轮上',
              eventDesc: '台场的摩天轮慢慢转到最高点。东京湾的灯火在脚下铺开，像撒了一地的橘子皮。',
              gravesLine: '"这玩意儿转一圈要十六分钟。我在上面能处理三份合同。……你想说什么？行，我听。"' }
        ],
        hiddenTitle: '东京 · 涩谷人潮',
        hiddenText: '涩谷的绿灯亮起，三千人同时涌向斑马线。他几乎是在第一时间抓住你的手，把你往身边带了一步。\n\n"别走散。"\n\n他声音不高，在这嘈杂里居然还听得清楚。\n\n你抬头看他，他还看着前方。\n\n"Darlin\'，我以为我什么都不怕。"绿灯在闪烁倒数，"结果我竟然在怕一松手你就不见。你又不是小孩了。"\n\n到了。他没松手，反而握得更紧。\n\n"明天去夏威夷好吗？"'
    },
    {
        id: 'dubai', name: '迪拜', emoji: '🕌',
        country: 'UAE · 阿联酋',
        lat: 25.20, lng: 55.27,
        bg: 'dubai.jpg',
        spots: [
            { id: 'dubai_1', name: '哈利法塔', emoji: '🏙️', photo: 'dubai_1.jpg',
              eventTitle: '云端之上',
              eventDesc: '哈利法塔第148层。窗外的城市小得像模型，沙漠在远处延伸成一片模糊的金色。',
              gravesLine: '"整层都清了。不是炫富，是嫌人多。……也不想别人看你。"' },
            { id: 'dubai_2', name: '沙漠冲沙', emoji: '🏜️', photo: 'dubai_2.jpg',
              eventTitle: '沙丘上',
              eventDesc: '越野车冲上沙丘顶端，停了一秒，然后俯冲下去。轮胎卷起的沙尘在身后拖成一条黄龙。',
              gravesLine: '"这沙子晃眼，跟你似的。……就是随口一说。专心抓稳。"' },
            { id: 'dubai_3', name: '帆船酒店', emoji: '🍽️', photo: 'dubai_3.jpg',
              eventTitle: '海底餐厅',
              eventDesc: '帆船酒店的海底餐厅，鱼群隔着玻璃游过。烛光把两个人的脸都染成暖色。',
              gravesLine: '"这顿饭的价格够买辆车。要真论起来是浪费。但你笑起来的时候，就……算了，吃吧。"' }
        ],
        hiddenTitle: '迪拜 · 沙漠篝火',
        hiddenText: '深夜的沙漠，篝火噼啪响。他拿着一根树枝拨弄火堆，火星腾起来，在半空中就灭了。\n\n"以前我一个人在沙漠里过夜，脑子里想的都是明天要杀的人。"\n\n火光把他的侧脸照得明暗分明。\n\n"现在坐在这儿，想的是明天给你做什么早餐。"\n\n他抬眼看你，嘴角有一点笑。\n\n"别笑。我也不太习惯自己这样。"\n\n火光里他眯了眯眼。\n\n"可是你说过喜欢。我记得你提过一次。"'
    },
    {
        id: 'rio', name: '里约', emoji: '🎭',
        country: 'Brazil · 巴西',
        lat: -22.91, lng: -43.17,
        bg: 'rio.jpg',
        spots: [
            { id: 'rio_1', name: '基督像', emoji: '⛰️', photo: 'rio_1.jpg',
              eventTitle: '俯瞰全城',
              eventDesc: '基督像脚下的平台。整座里约铺在山海之间，黑色的山、白色的浪、彩色的房子。',
              gravesLine: '"从上面看，这城市被切成两半。富人区和贫民窟。挺有意思的布局。……你在看基督像？行，我不说话了。"' },
            { id: 'rio_2', name: '海滩', emoji: '🏖️', photo: 'rio_2.jpg',
              eventTitle: '沙滩椰子水',
              eventDesc: '科帕卡巴纳海滩的黑白波浪纹地砖一直延伸到海岸线。一杯冰椰子水放在小桌上。',
              gravesLine: '"这椰子水卖十倍价。我不在意。好吧，其实连我都觉得贵了。"' },
            { id: 'rio_3', name: '狂欢节', emoji: '💃', photo: 'rio_3.jpg',
              eventTitle: '桑巴巡游',
              eventDesc: '狂欢节的巡游花车在街上缓缓前进，舞者的羽毛头饰在灯光里晃动。',
              gravesLine: '"这种场合我从来不来。太吵。今晚破例。"' }
        ],
        hiddenTitle: '里约 · 礁石上的承诺',
        hiddenText: '狂欢节的音乐凌晨两点才停。沙滩上人散得差不多了，你们没回酒店，坐在礁石上。\n\n"刚才有个小孩在我手腕上系了根红丝带。他说这是里约的祝福。"\n\n他抬手看了那条红绳。\n\n"这辈子没人给我系过这玩意儿。"\n\n然后他解下来，扣在你手腕上。\n\n"戴着。"\n\n你抬头看他。\n\n"别摘。"他收回手，"只要它在你手上一天，不管你在哪儿，我都能找到。"\n\n停了两秒。\n\n"这不是警告。是承诺。"'
    },
    {
        id: 'iceland', name: '冰岛', emoji: '❄️',
        country: 'Iceland · 冰岛',
        lat: 64.96, lng: -19.02,
        bg: 'iceland.jpg',
        spots: [
            { id: 'iceland_1', name: '黑沙滩', emoji: '🌊', photo: 'iceland_1.jpg',
              eventTitle: '黑沙滩巨浪',
              eventDesc: 'Reynisfjara 黑沙滩。白色的巨浪拍在黑色的沙上，把火山石磨成了圆润的小块。',
              gravesLine: '"这浪看着温柔，能直接把你拖走。别站太近。……我说真的，退后两步。"' },
            { id: 'iceland_2', name: '蓝湖温泉', emoji: '💧', photo: 'iceland_2.jpg',
              eventTitle: '蓝湖的水',
              eventDesc: '蓝湖温泉的奶蓝色水面，白色雾气缓慢上升。远处的黑色熔岩田被雪覆盖了一半。',
              gravesLine: '"水温有点烫。你多泡一会儿，我出去抽根烟。……怎么了？行，我坐着。"' },
            { id: 'iceland_3', name: '极光木屋', emoji: '🌌', photo: 'iceland_3.jpg',
              eventTitle: '极光出现',
              eventDesc: '木屋门口。绿色的极光像一条缓慢流动的河，从北边的天空开始，慢慢铺满整片夜空。',
              gravesLine: '"别说话。……就看着。这种时候说什么都是废话。"' }
        ],
        hiddenTitle: '冰岛 · 木屋炉火',
        hiddenText: '木屋里炉火烧得旺，窗玻璃结了一层白霜。他坐在单人沙发上，一杯威士忌在手里，没喝，看着火。\n\n"冰岛这国家挺安静。没有枪声，没有电话，没有下一秒可能要签的合同。"\n\n很久没说话。\n\n"我以前在战场上待过更冷的地方。那种冷，是往骨头里钻的，钻完还剩一个人。"\n\n他把杯子放到地上。\n\n"今天下了飞机，看到你站在雪里的时候，我突然觉得……这种冷，好像也不算太难受。"\n\n他站起来，走过来，手落在你头顶。\n\n"回去之后，可能得忙一阵。趁现在，好好玩。"'
    },
    {
        id: 'hawaii', name: '夏威夷', emoji: '🌺',
        country: 'USA · 美国',
        lat: 21.31, lng: -157.86,
        bg: 'hawaii.jpg',
        spots: [
            { id: 'hawaii_1', name: '威基基海滩', emoji: '🌅', photo: 'hawaii_1.jpg',
              eventTitle: '日落冲浪',
              eventDesc: '威基基海滩的日落把海面染成橘红色。远处有人抱着冲浪板往回走，海浪一层叠一层。',
              gravesLine: '"我湿透了，你笑得那么大声。……行，你厉害。等我起来你就完了。"' },
            { id: 'hawaii_2', name: '火山口', emoji: '🌋', photo: 'hawaii_2.jpg',
              eventTitle: '硫磺味',
              eventDesc: '火山口边缘的步道。地面是冷却的黑色熔岩，远处冒着硫磺蒸汽，空气里有种金属味。',
              gravesLine: '"这硫磺味像战场。但这里没人死，只有地球在活。挺好，偶尔看看地球活着的样子。"' },
            { id: 'hawaii_3', name: '草裙舞晚宴', emoji: '🔥', photo: 'hawaii_3.jpg',
              eventTitle: '篝火晚宴',
              eventDesc: '海滩上的篝火晚宴。穿草裙的舞者在火堆旁摆动，鼓声在夜色里传得很远。',
              gravesLine: '"这舞我不跳。……好吧。"' }
        ],
        hiddenTitle: '夏威夷 · 海边的承诺',
        hiddenText: '威基基海滩的日落把整片海染成橘红。他赤脚站在沙上，海水涌过来又退，他没躲。\n\n"我一直在做相似的事，为一些我自己都忘了的理由。"\n\n他转过身，两只手落到你肩上搭着。\n\n"等哪天我真退休了——我现在还不敢想那天——我想在这儿弄栋房子。你早上看海，我晚上回来做饭。"\n\n他低头，额头贴了一下你的额头。\n\n"不过那都是以后的事。"\n\n他直起身。\n\n"现在回家。"'
    }
];
    
    // ============ 存档 ============
    const TRAVEL_SAVE_KEY = 'shadow_travel_save';
    let travelData = { collected: {}, visited: {}, totalAffection: 0 };
    
    function loadTravelData() {
        try {
            const saved = localStorage.getItem(TRAVEL_SAVE_KEY);
            if (saved) travelData = Object.assign(travelData, JSON.parse(saved));
        } catch (e) { console.warn('旅行存档读取失败', e); }
    }
    function saveTravelData() {
        try {
            localStorage.setItem(TRAVEL_SAVE_KEY, JSON.stringify(travelData));
        } catch (e) { console.warn('旅行存档保存失败', e); }
    }
    
    // ============ 工具 ============
    function getCity(id) { return TRAVEL_CITIES.find(c => c.id === id); }
    function getCollectedCount(cityId) { return (travelData.collected[cityId] || []).length; }
    function getTotalCollected() {
        let s = 0; Object.values(travelData.collected).forEach(a => s += a.length); return s;
    }
    function getTotalVisited() { return Object.keys(travelData.visited).length; }
    function isSpotCollected(cityId, spotId) {
        return (travelData.collected[cityId] || []).includes(spotId);
    }
    function isCityCompleted(cityId) { return getCollectedCount(cityId) >= 3; }
    
    // ============ 地球绘制 ============
    let earthCanvas, earthCtx, earthAnimId, earthRotation = 0, cityPoints = [];
    
    function initTravelEarth() {
    earthCanvas = document.getElementById('travelEarthCanvas');
    if (!earthCanvas) return;
    earthCtx = earthCanvas.getContext('2d');
    earthRotation = 0;
    
    // 👇 核心修复：改用 onclick，避免拖拽事件冲突导致点不动
    earthCanvas.onclick = handleEarthClick; 
    
    drawTravelEarth();
}
    
    function drawTravelEarth() {
        if (!earthCtx || !earthCanvas) return;
        const overlay = document.getElementById('travelOverlay');
        if (!overlay || !overlay.classList.contains('active')) {
            if (earthAnimId) { cancelAnimationFrame(earthAnimId); earthAnimId = null; }
            return;
        }
        
        const w = earthCanvas.width, h = earthCanvas.height;
        const cx = w / 2, cy = h / 2;
        const r = Math.min(w, h) * 0.4;
        
        earthCtx.clearRect(0, 0, w, h);
        
        // 外发光
        const glow = earthCtx.createRadialGradient(cx, cy, r - 20, cx, cy, r + 25);
        glow.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
        glow.addColorStop(0.5, 'rgba(212, 175, 55, 0.1)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        earthCtx.beginPath();
        earthCtx.arc(cx, cy, r + 25, 0, Math.PI * 2);
        earthCtx.fillStyle = glow;
        earthCtx.fill();
        
        // 海洋
        const bg = earthCtx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, r);
        bg.addColorStop(0, '#1a2030');
        bg.addColorStop(1, '#08090b');
        earthCtx.beginPath();
        earthCtx.arc(cx, cy, r, 0, Math.PI * 2);
        earthCtx.fillStyle = bg;
        earthCtx.fill();
        
        // 边缘
        earthCtx.beginPath();
        earthCtx.arc(cx, cy, r, 0, Math.PI * 2);
        earthCtx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
        earthCtx.lineWidth = 1.5;
        earthCtx.stroke();
        
        // 经纬
        earthCtx.save();
        earthCtx.translate(cx, cy);
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + earthRotation;
            earthCtx.beginPath();
            for (let j = 0; j <= 180; j += 10) {
                const lat = (j - 90) * Math.PI / 180;
                const x = r * Math.cos(lat) * Math.cos(angle);
                const y = r * Math.sin(lat);
                if (j === 0) earthCtx.moveTo(x, y);
                else earthCtx.lineTo(x, y);
            }
            const alpha = 0.15 + 0.35 * Math.abs(Math.cos(angle));
            earthCtx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            earthCtx.lineWidth = 1;
            earthCtx.stroke();
        }
        for (let lat = -60; lat <= 60; lat += 30) {
            const rl = lat * Math.PI / 180;
            earthCtx.beginPath();
            for (let lng = 0; lng <= 360; lng += 5) {
                const ang = (lng * Math.PI / 180) + earthRotation;
                const x = r * Math.cos(rl) * Math.cos(ang);
                const y = r * Math.sin(rl);
                if (lng === 0) earthCtx.moveTo(x, y);
                else earthCtx.lineTo(x, y);
            }
            earthCtx.strokeStyle = `rgba(212, 175, 55, ${0.1 + 0.15 * Math.cos(rl)})`;
            earthCtx.lineWidth = 1;
            earthCtx.stroke();
        }
        earthCtx.restore();
        
        // 城市点
        cityPoints = [];
        TRAVEL_CITIES.forEach(city => {
            const radLat = city.lat * Math.PI / 180;
            const radLng = city.lng * Math.PI / 180;
            const x3d = r * Math.cos(radLat) * Math.sin(radLng + earthRotation);
            const y3d = r * Math.sin(radLat);
            const z3d = r * Math.cos(radLat) * Math.cos(radLng + earthRotation);
            if (z3d > 0) {
                const sx = cx + x3d, sy = cy - y3d;
                const pulse = Math.sin(Date.now() / 400) * 0.5 + 0.5;
                const isComplete = isCityCompleted(city.id);
                
                earthCtx.beginPath();
                earthCtx.arc(sx, sy, 8 + pulse * 6, 0, Math.PI * 2);
                earthCtx.fillStyle = isComplete
                    ? `rgba(46, 204, 113, ${0.15 + pulse * 0.2})`
                    : `rgba(212, 175, 55, ${0.15 + pulse * 0.3})`;
                earthCtx.fill();
                
                earthCtx.beginPath();
                earthCtx.arc(sx, sy, 4, 0, Math.PI * 2);
                earthCtx.fillStyle = isComplete ? '#2ecc71' : '#d4af37';
                earthCtx.shadowColor = earthCtx.fillStyle;
                earthCtx.shadowBlur = 12;
                earthCtx.fill();
                earthCtx.shadowBlur = 0;
                
                earthCtx.font = 'bold 11px "Consolas", monospace';
                earthCtx.textAlign = 'center';
                earthCtx.fillStyle = isComplete ? '#2ecc71' : '#d4af37';
                earthCtx.fillText(city.name, sx, sy - 12);
                
                cityPoints.push({ x: sx, y: sy, cityId: city.id });
            }
        });
        
        earthRotation += 0.002;
        earthAnimId = requestAnimationFrame(drawTravelEarth);
    }
    
    function handleEarthClick(e) {
    if (!earthCanvas) return;
    
    console.log("画布被点击了！");
    
    // 👇 新增：阻止默认行为和事件冒泡
    e.preventDefault();
    e.stopPropagation();

    const rect = earthCanvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (earthCanvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (earthCanvas.height / rect.height);
    
    let nearestCity = null;
    let minDist = 80; 
    
    for (const p of cityPoints) {
        const dist = Math.hypot(clickX - p.x, clickY - p.y);
        if (dist < minDist) {
            minDist = dist;
            nearestCity = p.cityId;
        }
    }
    
    if (nearestCity) {
        console.log("选中了城市:", nearestCity);
        showTravelCityCard(nearestCity);
    } else {
        console.log("点偏了，没点到城市。");
    }
}
    
    // ============ 城市卡片 ============
    let currentTravelCityId = null;
    
   function showTravelCityCard(cityId) {
    const city = getCity(cityId);
    if (!city) return;
    currentTravelCityId = cityId;
    
    document.getElementById('tccEmoji').textContent = city.emoji;
    document.getElementById('tccName').textContent = city.name;
    document.getElementById('tccCountry').textContent = city.country;
    
    const c = getCollectedCount(cityId);
    const v = travelData.visited[cityId];
    document.getElementById('tccProgress').textContent = `明信片 ${c}/3 · ${v ? '已到访' : '未到访'}`;
    
    const cardModal = document.getElementById('travelCityCardModal');
    
    // 👇 核心修复：强行挂载到 body 上，脱离 .phone-mockup 的限制
    if (cardModal.parentNode !== document.body) {
        document.body.appendChild(cardModal);
    }
    
    cardModal.classList.add('active');
    cardModal.style.display = 'flex'; 
    cardModal.style.zIndex = '2147483647'; // 强制最高层级，防止被遮挡
}

window.closeTravelCityCard = function() {
    const cardModal = document.getElementById('travelCityCardModal');
    // 优雅的关闭方式
    cardModal.classList.remove('active');
    cardModal.style.display = 'none';
    currentTravelCityId = null;
};
    
  window.departToCity = function() {
    if (!currentTravelCityId) return;
    const cityId = currentTravelCityId;
    closeTravelCityCard();
    
    const flying = document.getElementById('travelFlying');
    document.getElementById('flyingRoute').textContent = `飞往 ${getCity(cityId).name}...`;
    
    flying.classList.add('active');
    flying.style.display = 'flex';
    
    setTimeout(() => {
        flying.classList.remove('active');
        flying.style.display = 'none';
        openTravelCity(cityId);
    }, 2200);
};

function openTravelCity(cityId) {
    const city = getCity(cityId);
    if (!city) return;
    
    if (!travelData.visited[cityId]) {
        travelData.visited[cityId] = true;
        travelData.totalAffection += 5;
        syncTravelAffection(5);
        saveTravelData();
    }
    
    document.getElementById('cityBg').style.backgroundImage = `url('${city.bg}')`;
    document.getElementById('cityPageTitle').textContent = `${city.emoji} ${city.name}`;
    renderCitySpots(cityId);
    
    const cityOverlay = document.getElementById('travelCityOverlay');
    cityOverlay.classList.add('active');
    cityOverlay.style.display = 'flex'; // 用 flex 铺满，去掉之前的 block
}
    
    function renderCitySpots(cityId) {
        const city = getCity(cityId);
        const container = document.getElementById('citySpots');
        container.innerHTML = '';
        document.getElementById('cityPanelCount').textContent = `${getCollectedCount(cityId)} / 3`;
        
        city.spots.forEach(spot => {
            const isC = isSpotCollected(cityId, spot.id);
            const card = document.createElement('div');
            card.className = 'city-spot-card ' + (isC ? 'collected' : 'locked');
            card.innerHTML = `
                <div class="city-spot-img" style="background-image: url('${spot.photo}')"></div>
                <div class="city-spot-name">${spot.emoji} ${spot.name}</div>
            `;
            card.onclick = () => handleSpotClick(cityId, spot);
            container.appendChild(card);
        });
    }
    
    function handleSpotClick(cityId, spot) {
        const isC = isSpotCollected(cityId, spot.id);
        if (isC) {
            showTravelEvent(spot, '已收集', '这张明信片已经在你手上了。', '想再看一次的话，随时可以回来。', null);
            return;
        }
        showTravelEvent(spot, spot.eventTitle, spot.eventDesc, spot.gravesLine, () => {
            if (!travelData.collected[cityId]) travelData.collected[cityId] = [];
            travelData.collected[cityId].push(spot.id);
            const add = 3 + Math.floor(Math.random() * 6);
            travelData.totalAffection += add;
            syncTravelAffection(add);
            saveTravelData();
            renderCitySpots(cityId);
            updateTravelStats();
            if (isCityCompleted(cityId)) {
                setTimeout(() => showTravelHidden(cityId), 800);
            }
        });
    }
    
    // ============ 事件弹窗 ============
    let currentEventCb = null;
    function showTravelEvent(spot, title, desc, line, onContinue) {
        document.getElementById('tveEmoji').textContent = spot.emoji;
        document.getElementById('tveTitle').textContent = title;
        document.getElementById('tveDesc').textContent = desc;
        document.getElementById('tveGravesLine').textContent = line;
        currentEventCb = onContinue || null;
        document.getElementById('travelEventModal').classList.add('active');
    }
    window.closeTravelEvent = function() {
        document.getElementById('travelEventModal').classList.remove('active');
        if (currentEventCb) {
            const cb = currentEventCb;
            currentEventCb = null;
            setTimeout(cb, 200);
        }
    };
    
    // ============ 隐藏剧情 ============
    function showTravelHidden(cityId) {
        const city = getCity(cityId);
        if (!city) return;
        document.getElementById('tvhTitle').textContent = city.hiddenTitle;
        document.getElementById('tvhText').textContent = city.hiddenText;
        
        const key = 'hidden_claimed_' + cityId;
        if (!travelData[key]) {
            travelData[key] = true;
            travelData.totalAffection += 20;
            syncTravelAffection(20);
            saveTravelData();
        }
        document.getElementById('travelHiddenModal').classList.add('active');
    }
    window.closeTravelHidden = function() {
        document.getElementById('travelHiddenModal').classList.remove('active');
    };
    
    // ============ 好感同步 ============
    function syncTravelAffection(delta) {
        let current = parseInt(localStorage.getItem('gravesAffection')) || 0;
        current += delta;
        if (current < 0) current = 0;
        localStorage.setItem('gravesAffection', current);
        if (typeof affectionScore !== 'undefined') affectionScore = current;
        if (typeof checkAffectionMilestones === 'function') checkAffectionMilestones();
        updateTravelStats();
    }
    
    function updateTravelStats() {
        const a = document.getElementById('travelAffectionDisplay');
        if (a) a.textContent = travelData.totalAffection;
        const v = document.getElementById('travelVisitedCount');
        if (v) v.textContent = getTotalVisited();
        const c = document.getElementById('travelCollectedCount');
        if (c) c.textContent = getTotalCollected();
    }
    
    // ============ 开关 ============
       window.openTravel = function() {
    if (typeof closeAllOverlays === 'function') closeAllOverlays();
    loadTravelData();
    updateTravelStats();
    
    const overlay = document.getElementById('travelOverlay');
    const phoneMockup = document.querySelector('.phone-mockup');
    
    if (overlay && phoneMockup) {
        if (overlay.parentNode !== phoneMockup) {
            phoneMockup.appendChild(overlay);
        }
        overlay.classList.add('active');
        overlay.style.display = 'flex';
        
        // 👇 核心修复：把所有的旅行弹窗移到 body 上，并清空状态
        const travelModals = [
            'travelCityCardModal', 'travelFlying', 'travelCityOverlay', 
            'travelEventModal', 'travelHiddenModal'
        ];
        travelModals.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.parentNode !== document.body) {
                    document.body.appendChild(el); // 移到 body 防止被裁剪
                }
                el.classList.remove('active');
                el.style.removeProperty('display'); 
            }
        });
    }
    
    if (typeof earthAnimId !== 'undefined' && earthAnimId) {
        cancelAnimationFrame(earthAnimId);
        earthAnimId = null;
    }
    
    setTimeout(initTravelEarth, 100);
};

window.closeTravel = function() {
    const o = document.getElementById('travelOverlay');
    if (o) {
        o.classList.remove('active');
        o.style.display = 'none'; 
    }
    
    // 👇 核心修复：关闭主界面时，一并关闭所有子弹窗
    const travelModals = [
        'travelCityCardModal', 'travelFlying', 'travelCityOverlay', 
        'travelEventModal', 'travelHiddenModal'
    ];
    travelModals.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
            el.style.display = 'none';
        }
    });

    if (typeof earthAnimId !== 'undefined' && earthAnimId) { 
        cancelAnimationFrame(earthAnimId); 
        earthAnimId = null; 
    }
};
    
    window.closeTravelCity = function() {
    const o = document.getElementById('travelCityOverlay');
    if (o) {
        o.classList.remove('active');
        o.style.display = 'none'; // 👈 核心修复：必须加这行！强行隐藏，清除行内样式
    }
    
    // 顺便把可能弹出的剧情/事件弹窗也隐藏掉
    ['travelEventModal', 'travelHiddenModal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
            el.style.display = 'none';
        }
    });
    
    updateTravelStats();
};
    // 初始化
    loadTravelData();
    updateTravelStats();
})(); // 👈 关键点：如果你发现文件最后没有这行，把它加上！