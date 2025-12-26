// Default Expression Library
const defaultLibrary = {
    "Motion": [
        { id: 1, name: "Standard Wiggle", icon: "∿", code: "var freq = effect('Frequency')('Slider');\nvar amp = effect('Amplitude')('Slider');\nwiggle(freq, amp);", color: "#2ed573" },
        { id: 2, name: "Wiggle + Control", icon: "🎚️", code: "freq = effect('Speed')('Slider'); amp = effect('Amount')('Slider'); wiggle(freq, amp);", color: "#2ed573", controllers: [{ name: "Speed", matchName: "ADBE Slider Control" }, { name: "Amount", matchName: "ADBE Slider Control" }] },
        { id: 3, name: "Inertial Bounce", icon: "🏀", code: "amp = .05; freq = 2.0; decay = 2.0; n = 0; if (numKeys > 0){ n = nearestKey(time).index; if (key(n).time > time){ n--; }} if (n == 0){ t = 0; }else{ t = time - key(n).time; } if (n > 0 && t < 1){ v = velocityAtTime(key(n).time - thisComp.frameDuration/10); value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t); }else{ value; }", color: "#ffa502" },
        { id: 4, name: "Separate X/Y", icon: "↔", code: "x = value[0]; y = value[1]; [x, y]" },
        { id: 5, name: "Smooth Drift", icon: "🍃", code: "var speed = effect('Speed')('Slider');\nvalue + [time * speed, 0];", controllers: [{ name: "Speed", matchName: "ADBE Slider Control" }] },
        { id: 101, name: "Loop Wiggle", icon: "♾️", code: "var freq = effect('Freq')('Slider');\nvar amp = effect('Amp')('Slider');\nvar loopTime = effect('Loop Time')('Slider');\nvar t = time % loopTime;\nvar w1 = wiggle(freq, amp, 1, 0.5, t);\nvar w2 = wiggle(freq, amp, 1, 0.5, t - loopTime);\nlinear(t, 0, loopTime, w1, w2);", controllers: [{ name: "Freq", matchName: "ADBE Slider Control" }, { name: "Amp", matchName: "ADBE Slider Control" }, { name: "Loop Time", matchName: "ADBE Slider Control" }] },
        {
            id: 103,
            name: "Wiggle on Speed",
            icon: "🏎️",
            color: "#ff4757",
            code: `// Wiggle Based on Speed with Reverse Control
var sensitivity = effect("Sensitivity")("Slider"); // Lower = more reactive
var maxAmount = effect("Max Amount")("Slider"); // Max intensity
var reverse = effect("Reverse")("Checkbox"); // Check to invert logic

var speedValue = 0;
try {
    speedValue = transform.position.speed;
} catch(e) {
    speedValue = 0; // Fallback if not on a layer with position
}

var amt = 0;
if (reverse == 1) {
    var calculated = clamp(speedValue / (sensitivity > 0 ? sensitivity : 1), 0, maxAmount);
    amt = maxAmount - calculated;
} else {
    amt = clamp(speedValue / (sensitivity > 0 ? sensitivity : 1), 0, maxAmount);
}

wiggle(10, amt);`,
            controllers: [
                { name: "Sensitivity", matchName: "ADBE Slider Control" },
                { name: "Max Amount", matchName: "ADBE Slider Control" },
                { name: "Reverse", matchName: "ADBE Checkbox Control" }
            ]
        }
    ],
    "Text": [
        { id: 6, name: "Typewriter", icon: "⌨️", code: "txt=value; n=effect('Completion')('Slider'); txt.substr(0,n)", controllers: [{ name: "Completion", matchName: "ADBE Slider Control" }] },
        { id: 7, name: "Num Counter", icon: "#", code: "effect('Value')('Slider').value.toFixed(0)", controllers: [{ name: "Value", matchName: "ADBE Slider Control" }] },
        { id: 8, name: "Timecode", icon: "⏱", code: "timeToTimecode(t = time + timeOffset, timecodeBase = 30, isDuration = false)" },
        { id: 9, name: "Bouncing Text", icon: "↕", code: "// Text bounce logic" },
        { id: 102, name: "Center Anchor", icon: "🎯", code: "y=value[1]-sourceRectAtTime(time).height/2; [0,y]" }
    ],
    "Loop": [
        { id: 10, name: "Loop Cycle", icon: "↻", code: "loopOut('cycle');" },
        { id: 11, name: "Ping Pong", icon: "⇄", code: "loopOut('pingpong');" },
        { id: 12, name: "Offset", icon: "↝", code: "loopOut('offset');" },
        { id: 13, name: "Continue", icon: "⇢", code: "loopOut('continue');" }
    ],
    "Color": [
        { id: 14, name: "Rainbow Cycle", icon: "🌈", code: "var speed = effect('Speed')('Slider');\nhslToRgb([time * speed % 1, 1, 0.5, 1])", controllers: [{ name: "Speed", matchName: "ADBE Slider Control" }] },
        { id: 15, name: "Random Flash", icon: "⚡", code: "seedRandom(index, true); random([0,0,0,1], [1,1,1,1])" }
    ],
    "Utils": [
        { id: 16, name: "Fit to Comp", icon: "⛶", code: "[thisComp.width, thisComp.height]" },
        { id: 17, name: "Index Delay", icon: "📚", code: "delay = 5; d = delay*thisComp.frameDuration*(index - 1); thisComp.layer(1).rotation.valueAtTime(time - d)" },
        { id: 18, name: "2D to 3D Null", icon: "🧊", code: "thisComp.layer('3D Layer Name').toComp([0,0,0]);" }
    ],
    "Custom": []
};

// Manager for Library Data
const LibraryManager = {
    data: {
        version: 2,
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

                const homeDir = os.homedir();
                const docDir = path.join(homeDir, 'Documents', 'Wrangle');

                if (!this.fs.existsSync(docDir)) {
                    this.fs.mkdirSync(docDir, { recursive: true });
                }

                this.filePath = path.join(docDir, 'data.json');
            }
        } catch (e) {
            console.error("Node.js initialization failed:", e);
        }

        this.load();
    },

    load() {
        let loadedData = null;

        // Try loading from file first
        if (this.filePath && this.fs && this.fs.existsSync(this.filePath)) {
            try {
                const fileData = this.fs.readFileSync(this.filePath, 'utf8');
                loadedData = JSON.parse(fileData);
            } catch (e) {
                console.error("Error loading file:", e);
            }
        }

        // Fallback: Load from localStorage
        if (!loadedData) {
            const saved = localStorage.getItem('wrangle_library');
            if (saved) {
                loadedData = JSON.parse(saved);
            }
        }

        // Initialize with defaults if nothing loaded
        if (!loadedData) {
            this.data.categories = JSON.parse(JSON.stringify(defaultLibrary));
            // Extract default icons
            for (let cat in defaultLibrary) {
                // Default icons mapping based on initial hardcoded values
                const icons = {
                    "Motion": "∿",
                    "Text": "T",
                    "Loop": "↻",
                    "Color": '<svg viewBox="0 0 250 250"><circle cx="68.73" cy="68.73" r="68.73"/><circle cx="198.46" cy="153.96" r="51.54"/><circle cx="78.37" cy="211.34" r="38.66"/></svg>',
                    "Utils": "⚙",
                    "Custom": "★"
                };
                if (icons[cat]) this.data.icons[cat] = icons[cat];
            }
            this.save();
            return;
        }

        // MIGRATION LOGIC
        if (!loadedData.version) {
            // Version 1 (Old format: just categories object)
            console.log("Migrating data to Version 2...");
            this.data.categories = loadedData; // The whole object was categories

            // Restore default icons for existing categories
            const defaultIcons = {
                "Motion": "∿",
                "Text": "T",
                "Loop": "↻",
                "Color": '<svg viewBox="0 0 250 250"><circle cx="68.73" cy="68.73" r="68.73"/><circle cx="198.46" cy="153.96" r="51.54"/><circle cx="78.37" cy="211.34" r="38.66"/></svg>',
                "Utils": "⚙",
                "Custom": "★"
            };

            for (let cat in this.data.categories) {
                if (defaultIcons[cat]) {
                    this.data.icons[cat] = defaultIcons[cat];
                } else {
                    this.data.icons[cat] = "●"; // Default for unknown
                }
            }

            // Merge defaults for missing categories
            for (let cat in defaultLibrary) {
                if (!this.data.categories[cat]) {
                    this.data.categories[cat] = defaultLibrary[cat];
                    if (defaultIcons[cat]) this.data.icons[cat] = defaultIcons[cat];
                }
            }

            this.save(); // Save migrated data
        } else {
            // Already Version 2 or newer
            this.data = loadedData;

            if (!this.data.categories) this.data.categories = {};
            if (!this.data.icons) this.data.icons = {};

            // Ensure defaults exist (in case of partial data)
            for (let cat in defaultLibrary) {
                if (!this.data.categories[cat]) {
                    this.data.categories[cat] = defaultLibrary[cat];
                }
            }
        }
    },

    save() {
        // Save to file
        if (this.filePath && this.fs) {
            try {
                this.fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4), 'utf8');
            } catch (e) {
                console.error("Error saving file:", e);
            }
        }

        // Keep localStorage as backup/sync for now
        localStorage.setItem('wrangle_library', JSON.stringify(this.data));
    },

    addExpression(cat, item) {
        if (!this.data.categories[cat]) this.data.categories[cat] = [];
        this.data.categories[cat].push(item);
        this.save();
    },

    removeExpression(cat, id) {
        if (this.data.categories[cat]) {
            this.data.categories[cat] = this.data.categories[cat].filter(item => item.id !== id);
            this.save();
        }
    },

    reorderExpression(cat, fromIndex, toIndex) {
        if (!this.data.categories[cat]) return;

        const list = this.data.categories[cat];
        if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return;

        const [movedItem] = list.splice(fromIndex, 1);
        list.splice(toIndex, 0, movedItem);

        this.save();
    },

    reorderCategories(fromIndex, toIndex) {
        const categories = Object.keys(this.data.categories);
        if (fromIndex < 0 || fromIndex >= categories.length || toIndex < 0 || toIndex >= categories.length) return;

        const [movedCat] = categories.splice(fromIndex, 1);
        categories.splice(toIndex, 0, movedCat);

        // Rebuild categories object in new order
        const newCats = {};
        categories.forEach(cat => {
            newCats[cat] = this.data.categories[cat];
        });
        this.data.categories = newCats;
        this.save();
    },

    renameCategory(oldName, newName) {
        if (!this.data.categories[oldName] || this.data.categories[newName]) return;

        // Move data
        this.data.categories[newName] = this.data.categories[oldName];
        delete this.data.categories[oldName];

        // Move icon
        if (this.data.icons[oldName]) {
            this.data.icons[newName] = this.data.icons[oldName];
            delete this.data.icons[oldName];
        }

        this.save();
    },

    deleteCategory(cat) {
        if (this.data.categories[cat]) {
            delete this.data.categories[cat];
        }
        if (this.data.icons[cat]) {
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
        return this.data.icons[cat] || "●";
    },

    createCategory(name, icon) {
        if (this.data.categories[name]) return false; // Already exists
        this.data.categories[name] = [];
        this.data.icons[name] = icon || "●";
        this.save();
        return true;
    },

    setIcon(cat, icon) {
        this.data.icons[cat] = icon;
        this.save();
    }
};
