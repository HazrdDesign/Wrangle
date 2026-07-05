// Wrangle Library Data
//
// The default library is intentionally small: a handful of critical,
// battle-tested expressions. Controllers may carry a `value` so sliders
// land with a useful default instead of 0 (wiggle(0,0) looks "broken").

const DATA_VERSION = 12;

const defaultLibrary = {
    "Essentials": [
        {
            id: 1,
            name: "Spin (time × 30)",
            code: "// Apply to Rotation — 30° per second\ntime * 30;",
            color: "#4ba3e3"
        },
        {
            id: 2,
            name: "Wiggle",
            code: "// Apply to any property\nwiggle(effect(\"Frequency\")(\"Slider\"), effect(\"Amplitude\")(\"Slider\"));",
            controllers: [
                { name: "Frequency", matchName: "ADBE Slider Control", value: 3 },
                { name: "Amplitude", matchName: "ADBE Slider Control", value: 50 }
            ],
            color: "#ffa502"
        },
        {
            id: 3,
            name: "Loop Keyframes (Cycle)",
            code: "// Apply to any keyframed property\nloopOut(\"cycle\");",
            color: "#2ed573"
        },
        {
            id: 4,
            name: "Posterize Time",
            code: "// Apply to any animated property\nposterizeTime(effect(\"Frame Rate\")(\"Slider\"));\nvalue;",
            controllers: [
                { name: "Frame Rate", matchName: "ADBE Slider Control", value: 12 }
            ],
            color: "#a29bfe"
        },
        {
            id: 5,
            name: "Auto Center Anchor Point",
            code: "// Apply to Anchor Point (text or shape layers)\nr = sourceRectAtTime(time, false);\n[r.left + r.width/2, r.top + r.height/2];",
            color: "#2ed573"
        },
        {
            id: 6,
            name: "Typewriter",
            code: "// Apply to Source Text\nn = Math.min(text.sourceText.length, Math.floor(time * effect(\"Speed\")(\"Slider\")));\ntext.sourceText.substr(0, n);",
            controllers: [
                { name: "Speed", matchName: "ADBE Slider Control", value: 10 }
            ],
            color: "#ff7f50"
        }
    ],
    "Custom": []
};

const defaultIcons = {
    "Essentials": "ic-bolt",
    "Custom": "ic-star"
};

// Curated monochrome icon set (symbol ids in index.html)
const BUILTIN_ICONS = [
    "ic-bolt", "ic-star", "ic-text", "ic-time", "ic-wave", "ic-transform",
    "ic-sliders", "ic-palette", "ic-cube", "ic-loop", "ic-eye", "ic-camera",
    "ic-grid", "ic-heart", "ic-pin", "ic-folder"
];

const DEFAULT_ICON = "ic-folder";

// Legacy emoji defaults -> curated icons (v12 migration)
const EMOJI_TO_ICON = {
    "🔤": "ic-text",      // 🔤
    "🕒": "ic-time",      // 🕒
    "🪼": "ic-wave",      // 🪼
    "🪄": "ic-transform", // 🪄
    "🛠️": "ic-sliders", // 🛠️
    "🌈": "ic-palette",   // 🌈
    "🧊": "ic-cube",      // 🧊
    "★": "ic-star",            // ★
    "●": "ic-folder",          // ●
    "🎨": "ic-palette",   // 🎨
    "📁": "ic-folder"     // 📁
};

// Categories that shipped with old builds; their bundled items carry the
// "®Wrangle" credit line, which lets migration remove exactly those while
// keeping anything the user saved into them.
const LEGACY_DEFAULT_CATS = ["Text", "Time", "Wiggle", "Transform", "Utility", "Color", "3D"];
const LEGACY_ITEM_MARKER = "®Wrangle";

// Manager for Library Data
const LibraryManager = {
    data: {
        version: DATA_VERSION,
        categories: {},
        icons: {}
    },
    filePath: null,
    fs: null,

    init() {
        // Initialize Node.js fs
        try {
            if (typeof require !== 'undefined') {
                this.fs = require('fs');
                const path = require('path');
                const os = require('os');

                // OS-standard paths
                const isWin = process.platform === 'win32';
                const appData = isWin ? process.env.APPDATA : path.join(os.homedir(), 'Library', 'Application Support');
                const appDir = path.join(appData, 'Hazrd', 'Wrangle');
                this.filePath = path.join(appDir, 'data.json');

                // Legacy path (for migration)
                const oldDocDir = path.join(os.homedir(), 'Documents', 'Wrangle');
                const oldFilePath = path.join(oldDocDir, 'data.json');

                if (!this.fs.existsSync(this.filePath) && this.fs.existsSync(oldFilePath)) {
                    try {
                        if (!this.fs.existsSync(appDir)) {
                            this.fs.mkdirSync(appDir, { recursive: true });
                        }
                        this.fs.copyFileSync(oldFilePath, this.filePath);
                        console.log("Migrated data to OS-standard path.");
                    } catch (migrationErr) {
                        console.error("Migration failed:", migrationErr);
                    }
                }

                if (!this.fs.existsSync(appDir)) {
                    this.fs.mkdirSync(appDir, { recursive: true });
                }
            }
        } catch (e) {
            console.error("Node.js initialization failed:", e);
        }

        this.load();
    },

    load() {
        let loadedData = null;

        // File first
        if (this.filePath && this.fs && this.fs.existsSync(this.filePath)) {
            try {
                loadedData = JSON.parse(this.fs.readFileSync(this.filePath, 'utf8'));
            } catch (e) {
                console.error("Error loading data file:", e);
            }
        }

        // Fallback: localStorage (guarded — corrupt storage must not kill startup)
        if (!loadedData) {
            try {
                const saved = localStorage.getItem('wrangle_library');
                if (saved) loadedData = JSON.parse(saved);
            } catch (e) {
                console.error("Error loading localStorage backup:", e);
            }
        }

        if (!loadedData || !loadedData.categories) {
            this.resetToDefaults();
            return;
        }

        this.data = loadedData;
        if (!this.data.icons) this.data.icons = {};

        // `version` may be missing on very old data — treat as 0, not "current"
        const version = this.data.version || 0;
        if (version < DATA_VERSION) {
            this.migrate(version);
        }
    },

    migrate(fromVersion) {
        console.log("Migrating library data v" + fromVersion + " -> v" + DATA_VERSION);

        // 1. Emoji icons -> curated monochrome icons
        for (const cat in this.data.icons) {
            const icon = this.data.icons[cat];
            if (EMOJI_TO_ICON[icon]) {
                this.data.icons[cat] = EMOJI_TO_ICON[icon];
            }
        }

        // 2. Remove old bundled expressions (marked with the ®Wrangle credit),
        //    keeping anything the user added to those categories.
        for (let i = 0; i < LEGACY_DEFAULT_CATS.length; i++) {
            const cat = LEGACY_DEFAULT_CATS[i];
            const items = this.data.categories[cat];
            if (!items) continue;

            const userItems = items.filter(function (item) {
                return !(item.code && item.code.indexOf(LEGACY_ITEM_MARKER) !== -1);
            });

            if (userItems.length > 0) {
                this.data.categories[cat] = userItems;
            } else {
                delete this.data.categories[cat];
                delete this.data.icons[cat];
            }
        }

        // 3. Ensure the new Essentials set exists, first in order
        if (!this.data.categories["Essentials"]) {
            const rebuilt = {};
            rebuilt["Essentials"] = JSON.parse(JSON.stringify(defaultLibrary["Essentials"]));
            for (const cat in this.data.categories) {
                rebuilt[cat] = this.data.categories[cat];
            }
            this.data.categories = rebuilt;
            this.data.icons["Essentials"] = defaultIcons["Essentials"];
        }
        if (!this.data.categories["Custom"]) {
            this.data.categories["Custom"] = [];
        }
        if (!this.data.icons["Custom"]) {
            this.data.icons["Custom"] = defaultIcons["Custom"];
        }

        this.data.version = DATA_VERSION;
        this.save();
    },

    resetToDefaults() {
        this.data = {
            version: DATA_VERSION,
            categories: JSON.parse(JSON.stringify(defaultLibrary)),
            icons: JSON.parse(JSON.stringify(defaultIcons))
        };
        this.save();
    },

    save() {
        if (this.filePath && this.fs) {
            try {
                this.fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4), 'utf8');
            } catch (e) {
                console.error("Error saving file:", e);
            }
        }

        try {
            localStorage.setItem('wrangle_library', JSON.stringify(this.data));
        } catch (e) {
            console.error("Error saving localStorage backup:", e);
        }
    },

    addExpression(cat, item) {
        if (!this.data.categories[cat]) this.data.categories[cat] = [];
        this.data.categories[cat].push(item);
        this.save();
    },

    // Edit in place: keeps the item's id and position. Moving to another
    // category appends there.
    updateExpression(oldCat, id, item, newCat) {
        const list = this.data.categories[oldCat];
        if (!list) return false;

        const idx = list.findIndex(function (i) { return i.id === id; });
        if (idx === -1) return false;

        item.id = id;
        if (!newCat || newCat === oldCat) {
            list[idx] = item;
        } else {
            list.splice(idx, 1);
            if (!this.data.categories[newCat]) this.data.categories[newCat] = [];
            this.data.categories[newCat].push(item);
        }
        this.save();
        return true;
    },

    removeExpression(cat, id) {
        if (this.data.categories[cat]) {
            this.data.categories[cat] = this.data.categories[cat].filter(function (item) {
                return item.id !== id;
            });
            this.save();
        }
    },

    reorderExpression(cat, fromIndex, toIndex) {
        if (!this.data.categories[cat]) return;

        const list = this.data.categories[cat];
        if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return;

        const moved = list.splice(fromIndex, 1)[0];
        list.splice(toIndex, 0, moved);

        this.save();
    },

    reorderCategories(fromIndex, toIndex) {
        const categories = Object.keys(this.data.categories);
        if (fromIndex < 0 || fromIndex >= categories.length || toIndex < 0 || toIndex >= categories.length) return;

        const moved = categories.splice(fromIndex, 1)[0];
        categories.splice(toIndex, 0, moved);

        const newCats = {};
        for (let i = 0; i < categories.length; i++) {
            newCats[categories[i]] = this.data.categories[categories[i]];
        }
        this.data.categories = newCats;
        this.save();
    },

    // Returns false when the rename can't happen (missing source or name
    // collision) so the UI can tell the user instead of silently no-op'ing.
    // Rebuilds the key order so the category keeps its position.
    renameCategory(oldName, newName) {
        if (!this.data.categories[oldName]) return false;
        if (oldName === newName) return true;
        if (this.data.categories[newName]) return false;

        const newCats = {};
        for (const cat in this.data.categories) {
            if (cat === oldName) {
                newCats[newName] = this.data.categories[oldName];
            } else {
                newCats[cat] = this.data.categories[cat];
            }
        }
        this.data.categories = newCats;

        if (this.data.icons[oldName] !== undefined) {
            this.data.icons[newName] = this.data.icons[oldName];
            delete this.data.icons[oldName];
        }

        this.save();
        return true;
    },

    deleteCategory(cat) {
        if (this.data.categories[cat]) {
            delete this.data.categories[cat];
        }
        if (this.data.icons[cat] !== undefined) {
            delete this.data.icons[cat];
        }
        this.save();
    },

    getCategories() {
        return Object.keys(this.data.categories);
    },

    getItems(cat) {
        return this.data.categories[cat] || [];
    },

    getIcon(cat) {
        return this.data.icons[cat] || DEFAULT_ICON;
    },

    createCategory(name, icon) {
        if (this.data.categories[name]) return false;
        this.data.categories[name] = [];
        this.data.icons[name] = icon || DEFAULT_ICON;
        this.save();
        return true;
    },

    setIcon(cat, icon) {
        this.data.icons[cat] = icon || DEFAULT_ICON;
        this.save();
    }
};
