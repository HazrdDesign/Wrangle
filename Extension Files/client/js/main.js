// Main Logic
const csInterface = new CSInterface();
let activeCat = "Text";
let editingId = null; // Track if we are editing an existing item

// Initialize
// Initialize
window.onload = function () {
    try {
        LibraryManager.init();
        initSettings(); // Load and apply settings

        // Set active category
        const cats = LibraryManager.getCategories();
        if (cats.length > 0 && !cats.includes(activeCat)) {
            activeCat = cats[0];
        }

        renderSidebar();
        renderContent();

        // Global Event Listeners
        document.getElementById('btn-remove-all').onclick = removeAllExpressions;

        // Settings Listeners
        document.getElementById('set-hue').addEventListener('input', updateSettings);
        document.getElementById('set-font').addEventListener('input', updateSettings);
    } catch (e) {
        alert("Wrangle Initialization Error: " + e.message);
        console.error(e);
    }
};

// --- SETTINGS ---
function initSettings() {
    const saved = localStorage.getItem('wrangle_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        document.documentElement.style.setProperty('--hue', settings.hue);
        document.documentElement.style.setProperty('--base-font-size', settings.fontSize + 'px');

        document.getElementById('set-hue').value = settings.hue;
        document.getElementById('val-hue').innerText = settings.hue;

        document.getElementById('set-font').value = settings.fontSize;
        document.getElementById('val-font').innerText = settings.fontSize + 'px';
    }
}

function updateSettings(e) {
    const hue = document.getElementById('set-hue').value;
    const fontSize = document.getElementById('set-font').value;

    document.documentElement.style.setProperty('--hue', hue);
    document.documentElement.style.setProperty('--base-font-size', fontSize + 'px');

    document.getElementById('val-hue').innerText = hue;
    document.getElementById('val-font').innerText = fontSize + 'px';

    localStorage.setItem('wrangle_settings', JSON.stringify({
        hue: hue,
        fontSize: fontSize
    }));
}

function openSettings() {
    document.getElementById('settings-modal').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

function showHelp() {
    document.getElementById('help-modal').style.display = 'flex';
}

function closeHelp() {
    document.getElementById('help-modal').style.display = 'none';
}

let editingCategoryName = null;

function editCategory(e, name) {
    if (e) e.stopPropagation();
    openCategoryDialog(name);
}

function handleAddCategoryButton(e) {
    openCategoryDialog(null); // null means new category
}

function openCategoryDialog(oldName) {
    editingCategoryName = oldName;

    if (oldName) {
        // Edit existing
        document.getElementById('inp-cat-name').value = oldName;
        document.getElementById('inp-cat-icon').value = LibraryManager.getIcon(oldName);
        document.getElementById('btn-del-cat').style.display = 'block'; // Show delete
        document.querySelector('#category-modal .dialog-title').innerText = "Edit Category";
    } else {
        // Create new
        document.getElementById('inp-cat-name').value = '';
        document.getElementById('inp-cat-icon').value = '';
        document.getElementById('btn-del-cat').style.display = 'none'; // Hide delete
        document.querySelector('#category-modal .dialog-title').innerText = "New Category";
    }

    document.getElementById('category-modal').style.display = 'flex';
    document.getElementById('inp-cat-name').focus();
}

function closeCategoryDialog() {
    document.getElementById('category-modal').style.display = 'none';
    editingCategoryName = null;
}

function saveCategoryName() {
    const newName = document.getElementById('inp-cat-name').value.trim();
    const newIcon = document.getElementById('inp-cat-icon').value.trim();

    if (!newName) {
        alert("Category name cannot be empty");
        return;
    }

    if (editingCategoryName) {
        // Rename if changed
        if (newName !== editingCategoryName) {
            LibraryManager.renameCategory(editingCategoryName, newName);
            if (activeCat === editingCategoryName) {
                activeCat = newName;
            }
        }
        // Update Icon
        if (newIcon) {
            LibraryManager.setIcon(newName, newIcon);
        }
    } else {
        // Create New
        if (!LibraryManager.createCategory(newName, newIcon)) {
            alert("Category already exists!");
            return;
        }
        activeCat = newName; // Switch to new category
    }

    renderSidebar();
    renderContent();
    closeCategoryDialog();
}

function deleteCategoryBtn() {
    if (!editingCategoryName) return;

    if (confirm(`Are you sure you want to delete the category "${editingCategoryName}" and all its expressions?`)) {
        LibraryManager.deleteCategory(editingCategoryName);

        // Reset active category if we deleted the current one
        if (activeCat === editingCategoryName) {
            const cats = LibraryManager.getCategories();
            activeCat = cats.length > 0 ? cats[0] : null;
        }

        renderSidebar();
        renderContent();
        closeCategoryDialog();
    }
}

// --- AE INTERACTIONS ---

let capturedControllers = [];

function applyExpression(code, controllers) {
    const escapedCode = JSON.stringify(code);
    const escapedControllers = JSON.stringify(controllers || []);
    const script = `applyExpression(${escapedCode}, ${escapedControllers});`;

    csInterface.evalScript(script, function (result) {
        // Result handling - JSX returns string
        if (result && result !== 'undefined' && result !== 'null') {
            if (result.startsWith("Error:")) {
                console.error(result);
                // Optional: Show toast or visual feedback for error
            } else {
                console.log("Expression applied successfully");
            }
        }
    });
}

function removeAllExpressions() {
    csInterface.evalScript("removeAllExpressions();", function (res) {
        if (res === 'undefined' || res === 'null') return;
    });
}

function handleAddButton(e) {
    // Check for modifier keys (Ctrl on Windows, Cmd on Mac)
    const isCtrlClick = e && (e.ctrlKey || e.metaKey);

    if (isCtrlClick) {
        // Ctrl+Click: Capture expression ONLY (no controllers)
        csInterface.evalScript("getSelectedExpression();", function (res) {
            capturedControllers = []; // No controllers
            openDialog(false);

            if (res && res !== 'undefined' && res !== 'null' && res !== "") {
                document.getElementById('inp-code').value = res;
            }
            document.getElementById('inp-name').focus();
        });
    } else {
        // Normal Click: Capture expression AND controllers
        csInterface.evalScript("captureExpressionAndControllers();", function (res) {
            let data = { code: "", controllers: [] };
            try {
                data = JSON.parse(res);
            } catch (err) {
                console.error("Error parsing captured data", err);
            }

            capturedControllers = data.controllers || [];
            openDialog(true); // Open with smart save flag

            if (data.code) {
                document.getElementById('inp-code').value = data.code;
            }
            document.getElementById('inp-name').focus();
        });
    }
}

function escapeString(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/'/g, "\\'");
}

// --- RENDER FUNCTIONS ---

function renderSidebar() {
    const el = document.getElementById('sidebar-nav');
    el.innerHTML = '';


    const categories = LibraryManager.getCategories();

    categories.forEach((cat, index) => {
        let div = document.createElement('div');
        div.className = `nav-item ${cat === activeCat ? 'active' : ''}`;
        div.draggable = true;
        div.dataset.index = index;
        div.dataset.category = cat;

        const iconContent = LibraryManager.getIcon(cat);
        const iconHtml = iconContent.includes('<svg')
            ? `<span class="nav-icon">${iconContent}</span>`
            : `<span class="nav-icon">${iconContent}</span>`;

        div.innerHTML = `
            ${iconHtml}
            ${cat}
            <span class="category-edit-icon" onclick="editCategory(event, '${escapeString(cat)}')">✎</span>
        `;

        div.onclick = (e) => {
            if (e.target.classList.contains('category-edit-icon')) return;
            activeCat = cat;
            renderSidebar();
            renderContent();
        };

        // Drag events for categories
        div.addEventListener('dragstart', handleCategoryDragStart);
        div.addEventListener('dragover', handleCategoryDragOver);
        div.addEventListener('drop', handleCategoryDrop);
        div.addEventListener('dragenter', handleCategoryDragEnter);
        div.addEventListener('dragleave', handleCategoryDragLeave);
        div.addEventListener('dragend', handleCategoryDragEnd);

        el.appendChild(div);
    });
}

function renderContent() {
    const el = document.getElementById('content');
    el.innerHTML = '';

    // Update Header
    document.getElementById('cat-title').innerText = `${activeCat} LIBRARY`;
    const items = LibraryManager.getItems(activeCat);
    document.getElementById('item-count').innerText = `${items.length} ITEMS`;

    items.forEach((item, index) => {
        let card = document.createElement('div');
        card.className = 'expr-card';
        card.draggable = true; // Enable drag
        card.dataset.index = index; // Store index

        // Set color via CSS variable for the dot indicator
        if (item.color) {
            card.style.setProperty('--card-color', item.color);
        }

        card.innerHTML = `
            <div class="expr-name">${item.name}</div>
            <div class="expr-meta">
                <div class="action-icons">
                    <span class="action-icon" onclick="editExpression(event, ${item.id})">✎</span>
                    <span class="action-icon delete" onclick="deleteExpression(event, ${item.id})">🗑</span>
                </div>
            </div>
        `;

        // Drag Events
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('dragend', handleDragEnd);

        // Interaction Logic
        card.onclick = (e) => {
            // If clicked on action icons, do nothing (handled by their onclick)
            if (e.target.closest('.action-icon')) return;

            if (e.ctrlKey || e.metaKey) {
                // Ctrl+Click: Apply expression ONLY (no controllers)
                applyExpression(item.code, []);
                card.style.transform = 'scale(0.98)';
                setTimeout(() => card.style.transform = '', 100);
            } else if (e.altKey) {
                // Alt+Click: Apply controllers ONLY (no expression)
                if (item.controllers && item.controllers.length > 0) {
                    applyExpression('', item.controllers);
                    card.style.backgroundColor = 'hsla(var(--hue), 100%, 58%, 0.2)';
                    setTimeout(() => card.style.backgroundColor = '', 200);
                }
            } else {
                // Normal Click: Apply expression AND controllers
                applyExpression(item.code, item.controllers || []);
                card.style.transform = 'scale(0.98)';
                setTimeout(() => card.style.transform = '', 100);
            }
        };

        el.appendChild(card);
    });
}

// --- DRAG AND DROP HANDLERS ---
let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl !== this) {
        const fromIndex = parseInt(dragSrcEl.dataset.index);
        const toIndex = parseInt(this.dataset.index);

        LibraryManager.reorderExpression(activeCat, fromIndex, toIndex);
        renderContent(); // Re-render to reflect new order
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    const items = document.querySelectorAll('.expr-card');
    items.forEach(function (item) {
        item.classList.remove('drag-over');
    });
}

// --- CATEGORY DRAG AND DROP ---

let dragSrcCategory = null;

function handleCategoryDragStart(e) {
    dragSrcCategory = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleCategoryDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleCategoryDragEnter(e) {
    this.classList.add('drag-over');
}

function handleCategoryDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleCategoryDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcCategory !== this) {
        const fromIndex = parseInt(dragSrcCategory.dataset.index);
        const toIndex = parseInt(this.dataset.index);

        LibraryManager.reorderCategories(fromIndex, toIndex);
        renderSidebar();
    }
    return false;
}

function handleCategoryDragEnd(e) {
    this.classList.remove('dragging');
    const items = document.querySelectorAll('.nav-item');
    items.forEach(function (item) {
        item.classList.remove('drag-over');
    });
}
function deleteExpression(e, id) {
    e.stopPropagation();
    if (confirm("Delete this expression?")) {
        LibraryManager.removeExpression(activeCat, id);
        renderContent();
    }
}

function editExpression(e, id) {
    e.stopPropagation();
    const items = LibraryManager.getItems(activeCat);
    const item = items.find(i => i.id === id);
    if (!item) return;

    editingId = id; // Set editing mode
    capturedControllers = item.controllers || []; // Load existing controllers

    // Populate Dialog
    document.getElementById('inp-name').value = item.name;
    document.getElementById('inp-code').value = item.code;
    document.getElementById('inp-color').value = item.color || "#2997ff";

    // Populate Category Select
    const sel = document.getElementById('inp-cat');
    sel.innerHTML = '';
    const categories = LibraryManager.getCategories();
    categories.forEach(cat => {
        let opt = document.createElement('option');
        opt.value = cat;
        opt.text = cat;
        if (cat === activeCat) opt.selected = true;
        sel.add(opt);
    });

    openDialog(false); // Not a smart save, just edit

    // Update status for edit mode
    const statusEl = document.getElementById('ctrl-status');
    if (capturedControllers.length > 0) {
        statusEl.innerText = "Yes (" + capturedControllers.length + ")";
        statusEl.style.color = "var(--accent)";
    } else {
        statusEl.innerText = "None";
        statusEl.style.color = "#6e7681";
    }
}

// --- DIALOG LOGIC ---

const dialog = document.getElementById('dialog');

function openDialog(isSmartSave) {
    const statusEl = document.getElementById('ctrl-status');

    if (!editingId) {
        // Clear fields if adding new
        document.getElementById('inp-name').value = '';
        document.getElementById('inp-code').value = '';
        document.getElementById('inp-color').value = '#2997ff';

        // Populate Category Select
        const sel = document.getElementById('inp-cat');
        sel.innerHTML = '';
        const categories = LibraryManager.getCategories();
        categories.forEach(cat => {
            let opt = document.createElement('option');
            opt.value = cat;
            opt.text = cat;
            if (cat === activeCat) opt.selected = true;
            sel.add(opt);
        });
        // Add Custom if not there
        if (!categories.includes("Custom")) {
            let opt = document.createElement('option');
            opt.value = "Custom";
            opt.text = "Custom";
            sel.add(opt);
        }

        // Update Status
        if (isSmartSave && capturedControllers.length > 0) {
            statusEl.innerText = "Yes (" + capturedControllers.length + ")";
            statusEl.style.color = "var(--accent)";
        } else {
            statusEl.innerText = "None";
            statusEl.style.color = "#6e7681";
        }
    }

    dialog.style.display = 'flex';
}

function closeDialog() {
    dialog.style.display = 'none';
    editingId = null;
    capturedControllers = []; // Clear
}

function saveExpression() {
    const name = document.getElementById('inp-name').value;
    const code = document.getElementById('inp-code').value;
    const cat = document.getElementById('inp-cat').value;
    const color = document.getElementById('inp-color').value;

    if (!name || !code) { alert("Name and Code are required"); return; }

    if (editingId) {
        LibraryManager.removeExpression(activeCat, editingId);
    }

    LibraryManager.addExpression(cat, {
        id: Date.now(),
        name: name,
        code: code,
        color: color,
        controllers: capturedControllers // Save controllers
    });

    activeCat = cat; // Switch to new category
    closeDialog();
    renderSidebar();
    renderContent();
}
