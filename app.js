const data = {
    // Fixed Earthly Branches positions (0-indexed for mapping to grid)
    branches: ["巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰"],
    palaceTypes: [
        "命宮", "兄弟宮", "夫妻宮", "子女宮", "財帛宮", "疾厄宮", 
        "遷移宮", "交友宮", "事業宮", "田宅宮", "福德宮", "父母宮"
    ],
    palaceInterpretations: {
        "命宮": "核心價值觀、原始性格、看待世界的過濾器。",
        "遷移宮": "我面對陌生環境的反應，以及我希望在社會上呈現出的樣子。",
        "父母宮": "我期望能「罩著我」的人事物。包括主管、制度、貴人或能滿足我需求的人。",
        "兄弟宮": "我對親近戰友、手足的期待。是你轉身時最直接的支撐。",
        "夫妻宮": "我渴望能與我共同分擔生命責任、達成人生願景的對象。",
        "子女宮": "我的行事謀略、技巧，以及我如何將理念擴散、教導給他人。",
        "財帛宮": "我對喜愛之物（物質或感情）的佔有慾、企圖心與取財態度。",
        "事業宮": "我如何展現自我價值，以獲得社會的認同與定位。",
        "田宅宮": "我在所處環境（家庭、公司）中所擁有的實質影響力與安全感。",
        "交友宮": "我對陪伴者的期待，那些能接受我理念並協助執行、護持我的人。",
        "福德宮": "我的精神避風港、潛意識偏好，以及內心深處最擔心的隱憂。",
        "疾厄宮": "我的情緒深處、身體特質，以及最直覺的感官反應。"
    },
    stars: {
        "紫微": "自尊心、希望被尊重、追求高度與格局。",
        "天機": "邏輯思考、善於企劃、變動性、神經敏銳。",
        "太陽": "擴散性、主動付出、愛面子、關注公眾利益。",
        "武曲": "剛直、執行力、實事求是、對物質敏感。",
        "天同": "追求和諧、感性、避苦求樂、情緒化。",
        "廉貞": "規矩與囚縛、精密的觀察、自我要求高。",
        "天府": "穩定、收藏、防禦、厚實的累積。",
        "太陰": "收斂、細膩、富想像力、注重內在安全感。",
        "貪狼": "慾望的探求、學習力強、多才多藝、社交性。",
        "巨門": "質疑與研究、深耕、口才、防衛心強。",
        "天相": "平衡、服務、注重形象、需要平台。",
        "天梁": "庇蔭、老成、固執、具備指導性。",
        "七殺": "肅殺、直接、獨來獨往、目標導向。",
        "破軍": "損耗與創新、敢於冒險、挑戰舊體制。",
        "左輔": "明助，代表實質資源的額外助力，性格寬厚。",
        "右弼": "暗助，代表心理支持的額外助力，性格寬厚。",
        "文昌": "水準與修飾，偏重邏輯與證書，在意行為質感。",
        "文曲": "水準與修飾，偏重感性與才藝，在意形象表現。",
        "擎羊": "直接的傷害或突破，像手術刀，精準且痛。",
        "陀羅": "隱形的磨練、原地打轉、糾結、慢工出細活。",
        "火星": "爆發力、瞬間的能量、脾氣急躁。",
        "鈴星": "持續的壓力、內斂的火氣、精明與算計。"
    }
};

class ZiweiApp {
    constructor() {
        this.activePalaceId = null;
        this.lifePalacePos = 9; // Default Yin (寅)
        this.ziweiPos = 9; // Default Yin (寅)
        this.mode = 'view'; // 'view', 'setLife', 'setZiwei'
        this.init();
    }

    init() {
        // Parse URL query parameters to auto-fill ming and ziwei
        const params = new URLSearchParams(window.location.search);
        if (params.has('ming')) {
            const mingBranch = params.get('ming');
            const idx = data.branches.indexOf(mingBranch);
            if (idx !== -1) this.lifePalacePos = idx;
        }
        if (params.has('ziwei')) {
            const ziweiBranch = params.get('ziwei');
            const idx = data.branches.indexOf(ziweiBranch);
            if (idx !== -1) this.ziweiPos = idx;
        }

        this.renderChart();
    }

    getPalaceType(branchIndex) {
        const ccwIndices = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10];
        const lifeIdx = ccwIndices.indexOf(this.lifePalacePos);
        const currentIdx = ccwIndices.indexOf(branchIndex);
        
        let diff = (currentIdx - lifeIdx + 12) % 12;
        return data.palaceTypes[diff];
    }

    getStarsAt(branchIndex) {
        const stars = [];
        const z = this.ziweiPos;
        const ccw = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10]; 
        const cw = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8]; 
        
        const zIdx = ccw.indexOf(z);
        
        // Ziwei System placement
        if (branchIndex === z) stars.push("紫微");
        if (branchIndex === ccw[(zIdx + 1) % 12]) stars.push("天機");
        if (branchIndex === ccw[(zIdx + 3) % 12]) stars.push("太陽");
        if (branchIndex === ccw[(zIdx + 4) % 12]) stars.push("武曲");
        if (branchIndex === ccw[(zIdx + 5) % 12]) stars.push("天同");
        if (branchIndex === ccw[(zIdx + 8) % 12]) stars.push("廉貞");

        // Tianfu placement
        const f = cw[zIdx];
        const fIdx = cw.indexOf(f);
        
        if (branchIndex === f) stars.push("天府");
        if (branchIndex === cw[(fIdx + 1) % 12]) stars.push("太陰");
        if (branchIndex === cw[(fIdx + 2) % 12]) stars.push("貪狼");
        if (branchIndex === cw[(fIdx + 3) % 12]) stars.push("巨門");
        if (branchIndex === cw[(fIdx + 4) % 12]) stars.push("天相");
        if (branchIndex === cw[(fIdx + 5) % 12]) stars.push("天梁");
        if (branchIndex === cw[(fIdx + 6) % 12]) stars.push("七殺");
        if (branchIndex === cw[(fIdx + 10) % 12]) stars.push("破軍");

        return stars;
    }

    renderChart() {
        const container = document.getElementById('ziweiChart');
        if (!container) return;
        
        container.querySelectorAll('.palace').forEach(p => p.remove());

        data.branches.forEach((branch, index) => {
            const div = document.createElement('div');
            div.className = `palace glass p-${index}`;
            const palaceType = this.getPalaceType(index);
            const stars = this.getStarsAt(index);

            if (this.activePalaceId === index) div.classList.add('active');
            if (this.mode !== 'view') div.style.borderColor = 'var(--accent)';
            
            div.onclick = () => this.handlePalaceClick(index);
            
            div.innerHTML = `
                <div class="palace-stars">
                    ${stars.map(s => `<span class="star-tag" style="background:${s==='紫微'?'var(--primary-color)':'var(--secondary-color)'}; color:${s==='紫微'?'black':'white'}">${s}</span>`).join('')}
                </div>
                <div class="palace-name">
                    ${palaceType === '命宮' ? `<span style="color:var(--accent); font-weight:bold;">${palaceType}</span>` : palaceType}
                    <span style="font-size:0.7rem; opacity:0.6; display:block; margin-top:4px;">${branch}</span>
                </div>
            `;
            container.appendChild(div);
        });

        this.updateCenterArea();
    }

    handlePalaceClick(index) {
        if (this.mode === 'setLife') {
            this.lifePalacePos = index;
            this.mode = 'view';
            this.renderChart();
        } else if (this.mode === 'setZiwei') {
            this.ziweiPos = index;
            this.mode = 'view';
            this.renderChart();
        } else {
            this.activePalaceId = index;
            this.updateInterpretation(index);
            this.renderChart();
        }
    }

    updateInterpretation(index) {
        const type = this.getPalaceType(index);
        const stars = this.getStarsAt(index);
        
        document.getElementById('palaceTitle').textContent = type;
        document.getElementById('palaceDescription').innerHTML = `
            <p><strong>宮位動機：</strong>${data.palaceInterpretations[type]}</p>
            <p style="margin-top: 1rem;">地支位：${data.branches[index]}</p>
        `;

        if (stars.length > 0) {
            document.getElementById('logicalBox').style.display = 'block';
            let logicText = stars.map(s => `<strong>${s}：</strong>${data.stars[s] || "（依據規則分佈）"}`).join('<br><br>');
            document.getElementById('logicalText').innerHTML = logicText;
        } else {
            document.getElementById('logicalBox').style.display = 'none';
        }
    }

    updateCenterArea() {
        const text = document.getElementById('centerText');
        if (this.mode === 'setLife') {
            text.innerHTML = "<span style='color:var(--accent); font-weight:bold;'>請選擇一個宮位<br>設定為「命宮」</span>";
        } else if (this.mode === 'setZiwei') {
            text.innerHTML = "<span style='color:var(--accent); font-weight:bold;'>請選擇一個宮位<br>設定「紫微星」位置</span>";
        } else {
            text.innerHTML = "點擊宮位查看解讀<br><small>地支位置固定</small>";
        }
    }

    setMode(newMode) {
        this.mode = newMode;
        this.renderChart();
    }

    showPrinciples() {
        this.mode = 'view';
        document.getElementById('palaceTitle').textContent = "核心解盤法則";
        document.getElementById('palaceDescription').innerHTML = `
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 1rem;"><strong>1. 體用關係：</strong>命宮為唯一的「體」。</li>
                <li style="margin-bottom: 1rem;"><strong>2. 嚴禁借對宮：</strong>每個宮位代表獨立動機，借對宮會導致混淆。</li>
                <li><strong>3. 吉煞星定義：</strong>吉星是大眾口味，煞星是特殊口味與高效工具。</li>
            </ul>
        `;
        document.getElementById('logicalBox').style.display = 'none';
    }

    showFourTrans() {
        this.mode = 'view';
        document.getElementById('palaceTitle').textContent = "四化的互相成就";
        document.getElementById('palaceDescription').innerHTML = `
            <div class="transformation-flow">
                <div class="flow-step">化祿 (緣起)</div>
                <span class="flow-arrow">➜</span>
                <div class="flow-step">化權 (實踐)</div>
                <span class="flow-arrow">➜</span>
                <div class="flow-step">化科 (優化)</div>
                <span class="flow-arrow">➜</span>
                <div class="flow-step">化忌 (執取)</div>
            </div>
            <p style="margin-top: 1rem;">四化共同成就了命主的生命動力。</p>
        `;
        document.getElementById('logicalBox').style.display = 'none';
    }

    copyAIParameters() {
        let text = "# 紫微斗數邏輯思維分析參數 (供 AI 深度分析使用)\n\n";
        text += "【核心框架】\n";
        text += "- 本質：命宮為「體」（黃金原料），其餘十一宮為「用」。\n";
        text += "- 法則：嚴禁借對宮（命遷除外），必須回歸命宮主觀價值，探討心理動機。\n\n";
        
        text += `【當前命盤設定】\n`;
        text += `- 命宮地支位：${data.branches[this.lifePalacePos]}\n`;
        text += `- 紫微星地支位：${data.branches[this.ziweiPos]}\n\n`;

        text += "【十二宮位詳細分佈與邏輯】\n";
        
        // Use standard clockwise branches order for report
        [9,10,11,0,1,2,3,4,5,6,7,8].forEach((branchIdx, i) => {
            const branchName = data.branches[branchIdx];
            const type = this.getPalaceType(branchIdx);
            const stars = this.getStarsAt(branchIdx);
            
            text += `${i + 1}. ${type} (${branchName})\n`;
            text += `   - 宮位動機: ${data.palaceInterpretations[type]}\n`;
            if (stars.length > 0) {
                text += `   - 坐落星曜: ${stars.join(', ')}\n`;
                stars.forEach(s => {
                    text += `     * ${s}: ${data.stars[s] || '（遵循邏輯規律分佈）'}\n`;
                });
            } else {
                text += `   - 坐落星曜: (無主星/輔星)\n`;
            }
            text += "\n";
        });

        text += "【AI 分析請求指令】\n";
        text += "請依據上述提供的「紫微斗數邏輯思維」框架，為此命盤進行綜合性的深度解讀。請特別關注命宮本質作為核心過濾器，如何與其他宮位的動機及星曜邏輯交互作用。請分析命主的心理動機鍊條、價值觀體系，並找出其無可取代的天賦優勢與「借盤修行」的具體建議。";

        navigator.clipboard.writeText(text).then(() => {
            alert("✅ AI 分析參數已成功複製到剪貼簿！\n現在您可以直接貼上到 Gemini 或其他 AI 進行深度分析。");
        }).catch(err => {
            console.error('無法複製文字: ', err);
            alert("❌ 複製失敗，請檢查瀏覽器權限。");
        });
    }

    resetChart() {
        this.lifePalacePos = 9;
        this.ziweiPos = 9;
        this.mode = 'view';
        this.activePalaceId = null;
        this.renderChart();
        document.getElementById('palaceTitle').textContent = "宮位詳解";
        document.getElementById('palaceDescription').innerHTML = "<p>請點擊左側命盤中的宮位...</p>";
        document.getElementById('logicalBox').style.display = 'none';
    }
}

const app = new ZiweiApp();
window.app = app;
