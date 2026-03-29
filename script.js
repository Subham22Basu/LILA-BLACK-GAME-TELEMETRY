const mapConfigs = {
    "AmbroseValley": { scale: 900, originX: -370, originZ: -473, image: "AmbroseValley_Minimap.png" },
    "GrandRift": { scale: 581, originX: -290, originZ: -290, image: "GrandRift_Minimap.png" },
    "Lockdown": { scale: 1000, originX: -500, originZ: -500, image: "Lockdown_Minimap.jpg" }
};

let fullDatabase = [];
let currentMatchEvents = [];
let config;

async function initApp() {
    try {
        const response = await fetch('database.json');
        fullDatabase = await response.json();
        const container = document.getElementById('ui-controls');

        // Dropdown (Sorted by Python)
        const matchSelect = document.createElement('select');
        const uniqueIds = [...new Set(fullDatabase.map(m => m.match_id))];
        uniqueIds.forEach(id => {
            const first = fullDatabase.find(x => x.match_id === id);
            const opt = document.createElement('option');
            opt.value = id;
            opt.innerText = `${first.match_date} | ${first.map_id} | ID: ${id.substring(0, 5)}`;
            matchSelect.appendChild(opt);
        });
        container.appendChild(matchSelect);

        // Slider
        const slider = document.createElement('input');
        slider.type = "range";
        slider.id = "time-slider";
        slider.min = "-1"; 
        slider.onmousedown = (e) => e.stopPropagation(); 
        container.appendChild(slider);

        const heatBtn = document.createElement('button');
        heatBtn.id = "heatmap-btn";
        heatBtn.innerText = "HEATMAP OFF";
        document.getElementById('heatmap-container').appendChild(heatBtn);

        heatBtn.onclick = () => {
            const canvas = document.getElementById('map-canvas');
            const active = canvas.classList.toggle('heatmap-mode');
            heatBtn.classList.toggle('active-heat');
            heatBtn.innerText = active ? "HEATMAP ON" : "HEATMAP OFF";
            
            // THIS IS THE MISSING LINE:
            document.getElementById('heat-legend-extra').style.display = active ? "block" : "none";
            
            drawMap(parseInt(slider.value));
        };

        matchSelect.onchange = () => updateMatch(matchSelect.value);
        slider.oninput = (e) => requestAnimationFrame(() => drawMap(parseInt(e.target.value)));
        document.querySelectorAll('#filter-panel input').forEach(i => i.onchange = () => drawMap(parseInt(slider.value)));

        updateMatch(matchSelect.value);
        setupDraggable();
        setupCoordinateTracker();

    } catch (err) { console.error("Init Error:", err); }
}

function updateMatch(id) {
    currentMatchEvents = fullDatabase.filter(e => e.match_id === id);
    if (!currentMatchEvents.length) return;
    config = mapConfigs[currentMatchEvents[0].map_id];
    document.getElementById('map-canvas').style.backgroundImage = `url('${config.image}')`;
    const slider = document.getElementById('time-slider');
    slider.max = currentMatchEvents.length - 1;
    slider.value = "-1"; 
    drawMap(-1);
}

function drawMap(index) {
    const canvas = document.getElementById('map-canvas');
    if (index < 0) { canvas.innerHTML = ""; return; }

    const visible = currentMatchEvents.slice(0, index + 1);
    const isHeat = canvas.classList.contains('heatmap-mode');
    const f = {
        traffic: document.getElementById('filter-traffic').checked,
        kills: document.getElementById('filter-kills').checked,
        deaths: document.getElementById('filter-deaths').checked,
        storm: document.getElementById('filter-storm').checked,
        loot: document.getElementById('filter-loot').checked
    };

    const frag = document.createDocumentFragment();
    visible.forEach(e => {
        const evt = String(e.event);
        let hClass = "", emoji = "";
        if ((evt === "Position" || evt === "BotPosition") && f.traffic) hClass = e.is_bot ? 'dot bot' : 'dot human';
        else if ((evt === "Kill" || evt === "BotKill") && f.kills) { hClass = 'dot heat-kill'; emoji = "🎯"; }
        else if ((evt === "Killed" || evt === "BotKilled") && f.deaths) { hClass = 'dot heat-death'; emoji = "☠️"; }
        else if (evt === "KilledByStorm" && f.storm) { hClass = 'dot heat-storm'; emoji = "🌪️"; }
        else if (evt === "Loot" && f.loot) { hClass = 'dot heat-loot'; emoji = "💰"; }

        if (hClass) {
            const el = document.createElement('div');
            const u = (e.x - config.originX) / config.scale;
            const v = (e.z - config.originZ) / config.scale;
            el.style.left = `${u * 1024}px`;
            el.style.top = `${(1 - v) * 1024}px`;
            if (isHeat || !emoji) el.className = hClass;
            else { el.className = 'event-marker'; el.innerText = emoji; }
            frag.appendChild(el);
        }
    });
    canvas.innerHTML = "";
    canvas.appendChild(frag);
}

function setupDraggable() {
    const panel = document.getElementById('control-panel');
    const handle = document.getElementById('drag-handle');
    let isDrag = false, ox, oy;
    handle.onmousedown = (e) => { isDrag = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop; handle.style.cursor = 'grabbing'; };
    window.onmousemove = (e) => { if (!isDrag) return; panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; panel.style.bottom = 'auto'; panel.style.right = 'auto'; };
    window.onmouseup = () => { isDrag = false; handle.style.cursor = 'grab'; };
}

function setupCoordinateTracker() {
    const canvas = document.getElementById('map-canvas');
    const hud = document.getElementById('coordinate-hud');
    canvas.onmousemove = (e) => {
        if (!config) return;
        const r = canvas.getBoundingClientRect();
        const px = (e.clientX - r.left) * (1024 / r.width);
        const py = (e.clientY - r.top) * (1024 / r.height);
        const wx = (px / 1024 * config.scale) + config.originX;
        const wz = (1 - (py / 1024)) * config.scale + config.originZ;
        hud.innerText = `X: ${wx.toFixed(1)} | Z: ${wz.toFixed(1)}`;
    };
}

initApp();