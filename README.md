# Wrangle for After Effects

**Wrangle** is a powerful expression library manager for After Effects designed to streamline your workflow by providing instant access to curated expressions with automatic controller setup.

---

## ✨ Features

- **Search-first**: A persistent search field (like Effects & Presets) finds any expression across every category instantly.
- **Compact, AE-native UI**: Category tabs, dense list rows, and a theme that matches your After Effects Brightness setting.
- **Auto-Controllers**: Automatically adds Slider, Checkbox, Menu, and Layer controls to your target layer — with the values you saved them at.
- **Controller badges**: Every expression that bundles controls shows a count pill right on its row.
- **Curated Essentials**: Ships with a small set of battle-tested expressions (spin, wiggle, loop, posterize time, auto-center anchor, typewriter).
- **Persistence**: Your custom expressions and categories are saved in OS-standard locations.

---

## 🚀 How to Use

### 1. Applying Expressions
Select a layer and property in After Effects, then click an expression in Wrangle. The legend at the bottom of the panel is always visible:

- **Click**: Applies the expression **AND** adds any bundled controllers (Sliders, etc.).
- **Ctrl + Click** (⌘ on Mac): Applies the expression **ONLY** (ignores controllers).
- **Alt + Click** (⌥ on Mac): Adds the **CONTROLLERS ONLY** (ignores the expression code).

Hover any row to see where the expression is meant to be applied and which controllers it adds.

### 2. Managing your Library
- **➕ Add Expression**: Click `+` in the header to save the expression (and controllers, with their current values) from your selection. `Ctrl+Click` captures the expression only.
- **📂 Categories**: Categories live in the tab strip. Click the folder button to create one; **right-click a tab** (or use the pencil at the right end of the tab strip) to rename it, change its icon, or delete it.
- **🎛 Icons**: Pick a category icon from the built-in monochrome set — one click, renders identically on every OS.
- **↕️ Reorder**: Drag and drop rows or tabs to rearrange them.
- **🔍 Search**: Type in the search field to filter your entire library, grouped by category. Click a group header to jump to that category.
- **🗑 Remove All**: Under the `⋯` menu — strips all expressions from the selected layers (asks for confirmation, undoable in AE).

### 3. Customization
Open **⋯ → Settings** to adjust the panel:

- **Match After Effects** (default): the panel samples AE's skin color and follows your Brightness preference.
- **Custom Hue**: turn matching off to tint the panel with your own hue, like before.
- **Font Size**: scales the entire UI, rows included.

---

## 📂 Data & Backup
Wrangle saves your library data in update-safe system folders:

- **Windows**: `C:\Users\<username>\AppData\Roaming\Hazrd\Wrangle\data.json`
- **macOS**: `/Users/<username>/Library/Application Support/Hazrd/Wrangle/data.json`

You can back up this file or share it with other team members to sync your expression libraries. Any project-specific data added will persist across plugin updates and Adobe versions.

> Upgrading from 1.0: the old bundled expressions are replaced by the new Essentials set, but anything **you** saved — including items you added inside the old default categories — is preserved automatically.

---

## ✍️ Credits
Created by **Jose "Hazrd" Lopez**
*Hazrd*
*®Wrangle*
