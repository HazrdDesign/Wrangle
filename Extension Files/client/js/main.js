// Wrangle — panel logic
// Rendering is done with DOM nodes + textContent (never innerHTML with user
// data) so names containing quotes/angle brackets can't break the UI.

const csInterface = new CSInterface();

const ALL_CAT = "__all__";
const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

const CONTROL_LABELS = {
    "ADBE Slider Control": "Slider",
    "ADBE Checkbox Control": "Checkbox",
    "ADBE Color Control": "Color",
    "ADBE Angle Control": "Angle",
    "ADBE Point Control": "Point",
    "ADBE Point3D Control": "3D Point",
    "ADBE Layer Control": "Layer",
    "ADBE Dropdown Control": "Menu"
};

let activeCat = ALL_CAT;
let searchQuery = "";
let editingRef = null;          // { cat, id } while editing an expression
let editingCategoryName = null; // category name while editing a category
let capturedControllers = [];
let selectedIcon = null;        // icon picked in the category dialog

let settings = {
    matchAE: true,
    hue: 220,
    fontSize: 13
};

// ---------------------------------------------------------------- INIT

window.onload = function () {
    try {
        LibraryManager.init();
        loadSettings();
        applySettings();

        renderTabs();
        renderContent();
        wireStaticUI();
        applyPlatformLabels();

        // Re-match AE's skin when the user changes Brightness in AE prefs
        try {
            csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, function () {
                if (settings.matchAE) applyMatchedTheme();
            });
        } catch (e) { /* not running inside CEP */ }
    } catch (e) {
        alert("Wrangle initialization error: " + e.message);
        console.error(e);
    }
};

function wireStaticUI() {
    // Header
    document.getElementById('btn-add').addEventListener('click', handleAddButton);
    document.getElementById('btn-add-cat').addEventListener('click', function () { openCategoryDialog(null); });
    document.getElementById('btn-more').addEventListener('click', function (e) {
        e.stopPropagation();
        document.getElementById('more-menu').classList.toggle('open');
    });
    document.getElementById('menu-settings').addEventListener('click', function () {
        closeMenu();
        openSettings();
    });
    document.getElementById('menu-remove-all').addEventListener('click', function () {
        closeMenu();
        removeAllExpressions();
    });
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.menu-wrap')) closeMenu();
    });

    // Search
    const search = document.getElementById('search');
    const clearBtn = document.getElementById('search-clear');
    search.addEventListener('input', function () {
        searchQuery = search.value.trim().toLowerCase();
        clearBtn.classList.toggle('visible', searchQuery !== "");
        renderContent();
    });
    clearBtn.addEventListener('click', function () {
        search.value = "";
        searchQuery = "";
        clearBtn.classList.remove('visible');
        renderContent();
    });

    // Tab bar edit button
    document.getElementById('btn-edit-cat').addEventListener('click', function () {
        if (activeCat !== ALL_CAT) openCategoryDialog(activeCat);
    });

    // Expression dialog
    document.getElementById('btn-close-expr').addEventListener('click', closeDialog);
    document.getElementById('btn-save-expr').addEventListener('click', saveExpression);
    document.getElementById('inp-name').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') saveExpression();
    });

    // Category dialog
    document.getElementById('btn-close-cat').addEventListener('click', closeCategoryDialog);
    document.getElementById('btn-save-cat').addEventListener('click', saveCategoryName);
    document.getElementById('btn-del-cat').addEventListener('click', deleteCategoryBtn);
    document.getElementById('inp-cat-name').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') saveCategoryName();
    });

    // Settings dialog
    document.getElementById('btn-close-settings').addEventListener('click', closeSettings);
    document.getElementById('set-match').addEventListener('change', updateSettings);
    document.getElementById('set-hue').addEventListener('input', updateSettings);
    document.getElementById('set-font').addEventListener('input', updateSettings);

    // Overlay click + Escape close any dialog
    const overlays = document.querySelectorAll('.dialog-overlay');
    for (let i = 0; i < overlays.length; i++) {
        overlays[i].addEventListener('click', function (e) {
            if (e.target === this) this.classList.remove('open');
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
            closeDialog();
            closeSettings();
            closeCategoryDialog();
        }
    });
}

function closeMenu() {
    document.getElementById('more-menu').classList.remove('open');
}

function applyPlatformLabels() {
    if (/Mac/i.test(navigator.platform)) {
        document.getElementById('hint-ctrl').textContent = "⌘";
        document.getElementById('hint-alt').textContent = "⌥";
    }
}

// ---------------------------------------------------------------- THEME

function loadSettings() {
    try {
        const saved = localStorage.getItem('wrangle_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (typeof parsed.hue !== 'undefined') settings.hue = parseInt(parsed.hue, 10) || 220;
            if (typeof parsed.fontSize !== 'undefined') settings.fontSize = parseInt(parsed.fontSize, 10) || 13;
            if (typeof parsed.matchAE !== 'undefined') settings.matchAE = !!parsed.matchAE;
        }
    } catch (e) {
        console.error("Could not read settings, using defaults:", e);
    }
}

function saveSettings() {
    try {
        localStorage.setItem('wrangle_settings', JSON.stringify(settings));
    } catch (e) {
        console.error("Could not save settings:", e);
    }
}

function applySettings() {
    document.documentElement.style.setProperty('--base-font-size', settings.fontSize + 'px');

    if (settings.matchAE) {
        applyMatchedTheme();
    } else {
        applyCustomTheme(settings.hue);
    }

    // Sync the settings dialog controls
    document.getElementById('set-match').checked = settings.matchAE;
    document.getElementById('set-hue').value = settings.hue;
    document.getElementById('val-hue').textContent = settings.hue;
    document.getElementById('set-font').value = settings.fontSize;
    document.getElementById('val-font').textContent = settings.fontSize + 'px';
    document.getElementById('hue-group').classList.toggle('disabled', settings.matchAE);
}

function updateSettings() {
    settings.matchAE = document.getElementById('set-match').checked;
    settings.hue = parseInt(document.getElementById('set-hue').value, 10);
    settings.fontSize = parseInt(document.getElementById('set-font').value, 10);
    saveSettings();
    applySettings();
}

// Read AE's skin color so the panel looks native at any Brightness setting.
function applyMatchedTheme() {
    let base = { r: 38, g: 38, b: 38 };
    try {
        const env = csInterface.getHostEnvironment();
        const c = env.appSkinInfo.panelBackgroundColor.color;
        base = { r: Math.round(c.red), g: Math.round(c.green), b: Math.round(c.blue) };
    } catch (e) { /* outside CEP: keep graphite fallback */ }
    setThemeTokens(base, '#4ba3e3');
}

function applyCustomTheme(hue) {
    const base = hslToRgb(hue, 0.17, 0.10);
    const accent = hslToRgb(hue, 0.85, 0.58);
    setThemeTokens(base, rgbToHex(accent));
}

function setThemeTokens(base, accentHex) {
    const lum = 0.299 * base.r + 0.587 * base.g + 0.114 * base.b;
    const dark = lum < 128;
    const s = document.documentElement.style;

    s.setProperty('--bg', rgbStr(base));
    s.setProperty('--bg-chrome', shade(base, dark ? -10 : -16));
    s.setProperty('--bg-inset', shade(base, dark ? -14 : -8));
    s.setProperty('--bg-hover', shade(base, dark ? 12 : -14));
    s.setProperty('--bg-active', shade(base, dark ? 20 : -22));
    s.setProperty('--border', shade(base, dark ? 24 : -30));
    s.setProperty('--border-soft', shade(base, dark ? 11 : -14));
    s.setProperty('--text', dark ? '#d8d8d8' : '#1b1b1b');
    s.setProperty('--text-muted', dark ? '#979797' : '#5a5a5a');
    s.setProperty('--accent', accentHex);

    // Keep button text readable regardless of the accent's hue
    const a = hexToRgb(accentHex);
    const accentLum = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    s.setProperty('--accent-text', accentLum > 150 ? '#111111' : '#ffffff');
}

function shade(base, delta) {
    return rgbStr({
        r: clamp255(base.r + delta),
        g: clamp255(base.g + delta),
        b: clamp255(base.b + delta)
    });
}

function clamp255(v) { return Math.max(0, Math.min(255, Math.round(v))); }
function rgbStr(c) { return 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')'; }

function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: clamp255(r * 255), g: clamp255(g * 255), b: clamp255(b * 255) };
}

function rgbToHex(c) {
    const to2 = function (v) { return ('0' + v.toString(16)).slice(-2); };
    return '#' + to2(c.r) + to2(c.g) + to2(c.b);
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16)
    };
}

// ---------------------------------------------------------------- ICONS

function iconNode(iconVal) {
    if (BUILTIN_ICONS.indexOf(iconVal) !== -1) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'ic');
        const use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', '#' + iconVal);
        use.setAttributeNS(XLINK_NS, 'xlink:href', '#' + iconVal);
        svg.appendChild(use);
        return svg;
    }
    // Legacy custom emoji/text icons still render as a text fallback
    const span = document.createElement('span');
    span.className = 'icon-fallback';
    span.textContent = iconVal || '';
    return span;
}

// ---------------------------------------------------------------- TABS

function renderTabs() {
    const el = document.getElementById('tabs');
    el.textContent = '';

    const categories = LibraryManager.getCategories();

    // "All" tab
    const allTab = document.createElement('div');
    allTab.className = 'tab' + (activeCat === ALL_CAT ? ' active' : '');
    allTab.textContent = 'All';
    allTab.addEventListener('click', function () { selectCategory(ALL_CAT); });
    el.appendChild(allTab);

    categories.forEach(function (cat) {
        const tab = document.createElement('div');
        tab.className = 'tab' + (cat === activeCat ? ' active' : '');
        tab.draggable = true;
        tab.dataset.category = cat;
        tab.title = cat + ' — right-click to edit';

        tab.appendChild(iconNode(LibraryManager.getIcon(cat)));

        const label = document.createElement('span');
        label.textContent = cat;
        tab.appendChild(label);

        tab.addEventListener('click', function () { selectCategory(cat); });
        tab.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            openCategoryDialog(cat);
        });

        tab.addEventListener('dragstart', handleCategoryDragStart);
        tab.addEventListener('dragover', handleCategoryDragOver);
        tab.addEventListener('drop', handleCategoryDrop);
        tab.addEventListener('dragenter', handleCategoryDragEnter);
        tab.addEventListener('dragleave', handleCategoryDragLeave);
        tab.addEventListener('dragend', handleCategoryDragEnd);

        el.appendChild(tab);
    });

    document.getElementById('btn-edit-cat').classList.toggle('visible', activeCat !== ALL_CAT);
}

function selectCategory(cat) {
    activeCat = cat;
    // Switching tabs exits search mode
    const search = document.getElementById('search');
    if (search.value !== "") {
        search.value = "";
        searchQuery = "";
        document.getElementById('search-clear').classList.remove('visible');
    }
    renderTabs();
    renderContent();
}

// ---------------------------------------------------------------- LIST

function renderContent() {
    const el = document.getElementById('content');
    el.textContent = '';

    const categories = LibraryManager.getCategories();

    if (categories.length === 0) {
        el.appendChild(emptyNote("No categories yet — click the folder button to create one."));
        return;
    }

    if (searchQuery !== "") {
        // Search across every category, grouped by category
        let any = false;
        categories.forEach(function (cat) {
            const matches = LibraryManager.getItems(cat).filter(function (item) {
                return (item.name + ' ' + (item.code || '')).toLowerCase().indexOf(searchQuery) !== -1;
            });
            if (matches.length === 0) return;
            any = true;
            el.appendChild(sectionHeader(cat, matches.length, true));
            matches.forEach(function (item) {
                el.appendChild(createRow(item, cat, -1, false));
            });
        });
        if (!any) {
            el.appendChild(emptyNote('No matches for "' + searchQuery + '".'));
        }
        return;
    }

    if (activeCat === ALL_CAT) {
        categories.forEach(function (cat) {
            const items = LibraryManager.getItems(cat);
            el.appendChild(sectionHeader(cat, items.length, true));
            items.forEach(function (item, index) {
                el.appendChild(createRow(item, cat, index, true));
            });
        });
        return;
    }

    // Single category view
    const items = LibraryManager.getItems(activeCat);
    el.appendChild(sectionHeader(activeCat, items.length, false));
    if (items.length === 0) {
        el.appendChild(emptyNote("No expressions yet — select a property in AE and click + to capture one."));
        return;
    }
    items.forEach(function (item, index) {
        el.appendChild(createRow(item, activeCat, index, true));
    });
}

function sectionHeader(cat, count, clickable) {
    const div = document.createElement('div');
    div.className = 'sect' + (clickable ? ' clickable' : '');
    div.textContent = cat + ' · ' + count;
    if (clickable) {
        div.title = 'Go to ' + cat;
        div.addEventListener('click', function () { selectCategory(cat); });
    }
    return div;
}

function emptyNote(text) {
    const div = document.createElement('div');
    div.className = 'empty-note';
    div.textContent = text;
    return div;
}

// Usage hint = the first comment line of the expression (minus old credits)
function getHint(code) {
    if (!code) return '';
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t === '') continue;
        if (t.indexOf('//') === 0) {
            const comment = t.replace(/^\/+\s*/, '');
            if (/wrangle/i.test(comment)) continue;
            return comment;
        }
        return '';
    }
    return '';
}

function createRow(item, cat, index, draggable) {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.cat = cat;
    row.dataset.index = index;

    const hint = getHint(item.code);
    const controllers = item.controllers || [];
    let tooltip = hint;
    if (controllers.length > 0) {
        const names = controllers.map(function (c) { return c.name; });
        tooltip += (tooltip ? '\n' : '') + 'Adds: ' + names.join(', ');
    }
    if (tooltip) row.title = tooltip;

    const bar = document.createElement('span');
    bar.className = 'row-bar';
    bar.style.backgroundColor = item.color || '#8a8a8a';
    row.appendChild(bar);

    const name = document.createElement('span');
    name.className = 'row-name';
    name.textContent = item.name;
    row.appendChild(name);

    if (controllers.length > 0) {
        const pill = document.createElement('span');
        pill.className = 'row-pill';
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'ic');
        const use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', '#ic-sliders');
        use.setAttributeNS(XLINK_NS, 'xlink:href', '#ic-sliders');
        svg.appendChild(use);
        pill.appendChild(svg);
        pill.appendChild(document.createTextNode(String(controllers.length)));
        row.appendChild(pill);
    }

    const actions = document.createElement('span');
    actions.className = 'row-actions';
    actions.appendChild(rowButton('ic-pencil', 'Edit', false, function (e) {
        e.stopPropagation();
        editExpression(cat, item.id);
    }));
    actions.appendChild(rowButton('ic-x', 'Delete', true, function (e) {
        e.stopPropagation();
        deleteExpression(cat, item.id, item.name);
    }));
    row.appendChild(actions);

    // Apply on click (modifiers per the footer legend)
    row.addEventListener('click', function (e) {
        if (e.target.closest('.row-btn')) return;

        if (e.ctrlKey || e.metaKey) {
            applyExpression(item.code, []);
        } else if (e.altKey) {
            if (controllers.length > 0) applyExpression('', controllers);
            else return;
        } else {
            applyExpression(item.code, controllers);
        }
        flashRow(row);
    });

    if (draggable && searchQuery === "") {
        row.draggable = true;
        row.addEventListener('dragstart', handleDragStart);
        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('drop', handleDrop);
        row.addEventListener('dragenter', handleDragEnter);
        row.addEventListener('dragleave', handleDragLeave);
        row.addEventListener('dragend', handleDragEnd);
    }

    return row;
}

function rowButton(icon, title, isDelete, handler) {
    const btn = document.createElement('button');
    btn.className = 'row-btn' + (isDelete ? ' delete' : '');
    btn.title = title;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', icon === 'ic-pencil' ? 'ic ic-fill' : 'ic');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#' + icon);
    use.setAttributeNS(XLINK_NS, 'xlink:href', '#' + icon);
    svg.appendChild(use);
    btn.appendChild(svg);
    btn.addEventListener('click', handler);
    return btn;
}

function flashRow(row) {
    row.classList.remove('row-applied');
    // Force reflow so re-adding the class restarts the animation
    void row.offsetWidth;
    row.classList.add('row-applied');
    setTimeout(function () { row.classList.remove('row-applied'); }, 400);
}

// ---------------------------------------------------------------- AE BRIDGE

function applyExpression(code, controllers) {
    const script = 'applyExpression(' + JSON.stringify(code) + ', ' + JSON.stringify(controllers || []) + ');';
    csInterface.evalScript(script, function (result) {
        if (result && result !== 'undefined' && result !== 'null') {
            if (result.indexOf("Error:") === 0) {
                console.error(result);
            } else {
                console.log("Expression applied.");
            }
        }
    });
}

function removeAllExpressions() {
    const ok = confirm(
        "Remove ALL expressions from the selected layers?\n\n" +
        "This strips every expression on every property of the selection. " +
        "You can undo it in After Effects."
    );
    if (!ok) return;
    csInterface.evalScript("removeAllExpressions();", function () { });
}

function handleAddButton(e) {
    const isCtrlClick = e && (e.ctrlKey || e.metaKey);

    // Open the dialog right away; the capture fills it in when AE responds.
    capturedControllers = [];
    openDialog();
    document.getElementById('inp-name').focus();

    try {
        if (isCtrlClick) {
            // Ctrl+Click: capture expression ONLY (no controllers)
            csInterface.evalScript("getSelectedExpression();", function (res) {
                if (res && res !== 'undefined' && res !== 'null' && res !== "" && res.indexOf("EvalScript") === -1) {
                    document.getElementById('inp-code').value = res;
                }
            });
        } else {
            // Normal click: capture expression AND controllers (with current values)
            csInterface.evalScript("captureExpressionAndControllers();", function (res) {
                let data = { code: "", controllers: [] };
                try {
                    data = JSON.parse(res);
                } catch (err) {
                    console.error("Error parsing captured data", err);
                }

                capturedControllers = data.controllers || [];
                renderControllerChips();
                if (data.code) {
                    document.getElementById('inp-code').value = data.code;
                }
            });
        }
    } catch (err) {
        // Outside CEP (browser debugging) evalScript is unavailable — the
        // dialog still opens for manual entry.
        console.error("Capture unavailable:", err);
    }
}

// ---------------------------------------------------------------- ROW DRAG (reorder within a category)

let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    this.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter() {
    if (dragSrcEl && dragSrcEl !== this && dragSrcEl.dataset.cat === this.dataset.cat) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl && dragSrcEl !== this && dragSrcEl.dataset.cat === this.dataset.cat) {
        const fromIndex = parseInt(dragSrcEl.dataset.index, 10);
        const toIndex = parseInt(this.dataset.index, 10);
        LibraryManager.reorderExpression(this.dataset.cat, fromIndex, toIndex);
        renderContent();
    }
    return false;
}

function handleDragEnd() {
    this.classList.remove('dragging');
    const rows = document.querySelectorAll('.row');
    for (let i = 0; i < rows.length; i++) rows[i].classList.remove('drag-over');
    dragSrcEl = null;
}

// ---------------------------------------------------------------- TAB DRAG (reorder categories)

let dragSrcCategory = null;

function handleCategoryDragStart(e) {
    dragSrcCategory = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    this.classList.add('dragging');
}

function handleCategoryDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleCategoryDragEnter() {
    if (dragSrcCategory && dragSrcCategory !== this) this.classList.add('drag-over');
}

function handleCategoryDragLeave() {
    this.classList.remove('drag-over');
}

function handleCategoryDrop(e) {
    e.stopPropagation();
    if (dragSrcCategory && dragSrcCategory !== this) {
        const cats = LibraryManager.getCategories();
        const fromIndex = cats.indexOf(dragSrcCategory.dataset.category);
        const toIndex = cats.indexOf(this.dataset.category);
        if (fromIndex !== -1 && toIndex !== -1) {
            LibraryManager.reorderCategories(fromIndex, toIndex);
            renderTabs();
            renderContent();
        }
    }
    return false;
}

function handleCategoryDragEnd() {
    this.classList.remove('dragging');
    const tabs = document.querySelectorAll('.tab');
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('drag-over');
    dragSrcCategory = null;
}

// ---------------------------------------------------------------- EXPRESSION CRUD

function deleteExpression(cat, id, name) {
    if (confirm('Delete "' + name + '"?')) {
        LibraryManager.removeExpression(cat, id);
        renderTabs();
        renderContent();
    }
}

function editExpression(cat, id) {
    const items = LibraryManager.getItems(cat);
    const item = items.filter(function (i) { return i.id === id; })[0];
    if (!item) return;

    editingRef = { cat: cat, id: id };
    capturedControllers = (item.controllers || []).slice();

    document.getElementById('inp-name').value = item.name;
    document.getElementById('inp-code').value = item.code;
    document.getElementById('inp-color').value = item.color || "#4ba3e3";

    openDialog(cat);
}

// ---------------------------------------------------------------- EXPRESSION DIALOG

function openDialog(preselectCat) {
    const isEdit = !!editingRef;
    document.getElementById('dlg-expr-title').textContent = isEdit ? 'Edit Expression' : 'Add Expression';

    if (!isEdit) {
        document.getElementById('inp-name').value = '';
        document.getElementById('inp-code').value = '';
        document.getElementById('inp-color').value = '#4ba3e3';
    }

    // (Re)populate the category select every time
    const sel = document.getElementById('inp-cat');
    sel.textContent = '';
    const categories = LibraryManager.getCategories();
    const target = preselectCat || (activeCat !== ALL_CAT ? activeCat : null);
    categories.forEach(function (cat) {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.text = cat;
        if (cat === target) opt.selected = true;
        sel.add(opt);
    });
    if (categories.indexOf("Custom") === -1) {
        const opt = document.createElement('option');
        opt.value = "Custom";
        opt.text = "Custom";
        if (!target) opt.selected = true;
        sel.add(opt);
    }

    renderControllerChips();
    document.getElementById('dialog').classList.add('open');
}

function renderControllerChips() {
    const wrap = document.getElementById('ctrl-chips');
    wrap.textContent = '';

    if (capturedControllers.length === 0) {
        const none = document.createElement('span');
        none.className = 'chips-empty';
        none.textContent = 'None captured — select effects (or reference them in the expression) before clicking +.';
        wrap.appendChild(none);
        return;
    }

    capturedControllers.forEach(function (ctrl, idx) {
        const chip = document.createElement('span');
        chip.className = 'chip';

        const name = document.createElement('span');
        name.textContent = ctrl.name;
        chip.appendChild(name);

        const type = document.createElement('span');
        type.className = 'chip-type';
        type.textContent = CONTROL_LABELS[ctrl.matchName] || 'Control';
        chip.appendChild(type);

        const remove = document.createElement('button');
        remove.title = 'Remove controller';
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'ic');
        const use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', '#ic-x');
        use.setAttributeNS(XLINK_NS, 'xlink:href', '#ic-x');
        svg.appendChild(use);
        remove.appendChild(svg);
        remove.addEventListener('click', function () {
            capturedControllers.splice(idx, 1);
            renderControllerChips();
        });
        chip.appendChild(remove);

        wrap.appendChild(chip);
    });
}

function closeDialog() {
    document.getElementById('dialog').classList.remove('open');
    editingRef = null;
    capturedControllers = [];
}

function saveExpression() {
    const name = document.getElementById('inp-name').value.trim();
    const code = document.getElementById('inp-code').value;
    const cat = document.getElementById('inp-cat').value;
    const color = document.getElementById('inp-color').value;

    if (!name || !code.trim()) {
        alert("Name and expression code are required.");
        return;
    }

    const item = {
        id: Date.now(),
        name: name,
        code: code,
        color: color,
        controllers: capturedControllers
    };

    if (editingRef) {
        // Edit in place — keeps id and list position
        LibraryManager.updateExpression(editingRef.cat, editingRef.id, item, cat);
    } else {
        LibraryManager.addExpression(cat, item);
    }

    if (activeCat !== ALL_CAT) activeCat = cat;
    closeDialog();
    renderTabs();
    renderContent();
}

// ---------------------------------------------------------------- CATEGORY DIALOG

function openCategoryDialog(oldName) {
    editingCategoryName = oldName;

    const nameInput = document.getElementById('inp-cat-name');
    if (oldName) {
        nameInput.value = oldName;
        selectedIcon = LibraryManager.getIcon(oldName);
        document.getElementById('btn-del-cat').style.display = 'block';
        document.getElementById('dlg-cat-title').textContent = "Edit Category";
    } else {
        nameInput.value = '';
        selectedIcon = DEFAULT_ICON;
        document.getElementById('btn-del-cat').style.display = 'none';
        document.getElementById('dlg-cat-title').textContent = "New Category";
    }

    renderIconGrid();
    document.getElementById('category-modal').classList.add('open');
    nameInput.focus();
}

function renderIconGrid() {
    const grid = document.getElementById('icon-grid');
    grid.textContent = '';

    const icons = BUILTIN_ICONS.slice();
    // A legacy custom emoji still shows up as a selectable cell so editing
    // a category doesn't silently discard it.
    if (selectedIcon && icons.indexOf(selectedIcon) === -1) {
        icons.push(selectedIcon);
    }

    icons.forEach(function (icon) {
        const cell = document.createElement('button');
        cell.className = 'icon-cell' + (icon === selectedIcon ? ' selected' : '');
        cell.title = icon.indexOf('ic-') === 0 ? icon.replace('ic-', '') : 'Current icon';
        cell.appendChild(iconNode(icon));
        cell.addEventListener('click', function () {
            selectedIcon = icon;
            renderIconGrid();
        });
        grid.appendChild(cell);
    });
}

function closeCategoryDialog() {
    document.getElementById('category-modal').classList.remove('open');
    editingCategoryName = null;
}

function saveCategoryName() {
    const newName = document.getElementById('inp-cat-name').value.trim();

    if (!newName) {
        alert("Category name cannot be empty.");
        return;
    }

    if (editingCategoryName) {
        if (newName !== editingCategoryName) {
            if (!LibraryManager.renameCategory(editingCategoryName, newName)) {
                alert('A category named "' + newName + '" already exists.');
                return;
            }
            if (activeCat === editingCategoryName) activeCat = newName;
        }
        LibraryManager.setIcon(newName, selectedIcon);
    } else {
        if (!LibraryManager.createCategory(newName, selectedIcon)) {
            alert('A category named "' + newName + '" already exists.');
            return;
        }
        activeCat = newName;
    }

    renderTabs();
    renderContent();
    closeCategoryDialog();
}

function deleteCategoryBtn() {
    if (!editingCategoryName) return;

    const count = LibraryManager.getItems(editingCategoryName).length;
    const suffix = count > 0 ? ' and its ' + count + ' expression' + (count === 1 ? '' : 's') : '';
    if (confirm('Delete the category "' + editingCategoryName + '"' + suffix + '?')) {
        LibraryManager.deleteCategory(editingCategoryName);
        if (activeCat === editingCategoryName) activeCat = ALL_CAT;

        renderTabs();
        renderContent();
        closeCategoryDialog();
    }
}

// ---------------------------------------------------------------- SETTINGS DIALOG

function openSettings() {
    document.getElementById('settings-modal').classList.add('open');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('open');
}
