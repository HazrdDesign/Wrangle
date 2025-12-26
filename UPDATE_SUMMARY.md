# Wrangle Update - Feature Additions & Bug Fixes

## Changes Implemented

### 1. ✅ Expression Application Fix (Critical)
**Issue**: Clicking library expressions didn't apply them to selected properties.

**Fix**: 
- Added callback function to `applyExpression()` for proper error handling
- Improved JSX error messaging in [index.jsx](file:///c:/Users/joelo/.gemini/antigravity/scratch/Wrangle/Extension%20Files/host/index.jsx)
- Added console logging for debugging

**Test**: Select a property (Position, Scale, Opacity) and click an expression - it should now apply.

---

### 2. ✅ Scrollable Sidebar
**Issue**: Category sidebar wasn't scrollable when window was constrained.

**Fix**: 
- Updated `.nav-group` CSS to include `overflow-y: auto` and `overflow-x: hidden`
- Sidebar categories now scroll independently from bottom buttons

---

### 3. ✅ Category Drag-and-Drop
**Feature**: Users can now reorder categories by dragging them.

**Implementation**:
- Added drag event listeners to category nav items
- Created `handleCategoryDragStart`, `handleCategoryDragOver`, `handleCategoryDrop`, etc.
- Added `LibraryManager.reorderCategories()` method
- Visual feedback with `.dragging` and `.drag-over` classes

**Usage**: Click and drag any category icon to reorder in the sidebar.

---

### 4. ✅ Category Renaming
**Feature**: Users can rename categories via pencil icon.

**Implementation**:
- Added pencil icon (✎) to each category that appears on hover
- Created `editCategory()` function with prompt dialog
- Added `LibraryManager.renameCategory()` method
- Prevents overwriting existing category names

**Usage**: Hover over a category and click the pencil icon to rename.

---

### 5. ✅ Updated Color Icon
**Issue**: Color category used emoji 🎨 which didn't match other icons.

**Fix**:
- Integrated SVG from [Colors.svg](file:///c:/Users/joelo/.gemini/antigravity/scratch/Wrangle/Icons/Colors.svg)
- Added SVG support in icon rendering logic
- Icon now uses three circles design matching the aesthetic

---

## Files Modified

### [main.js](file:///c:/Users/joelo/.gemini/antigravity/scratch/Wrangle/Extension%20Files/client/js/main.js)
- Updated `applyExpression()` with callback
- Modified `renderSidebar()` for drag-and-drop and edit icons
- Added category drag-and-drop handlers
- Added `editCategory()` function
- Updated icons object with SVG for Color

### [library.js](file:///c:/Users/joelo/.gemini/antigravity/scratch/Wrangle/Extension%20Files/client/js/library.js)
- Added `reorderCategories()` method
- Added `renameCategory()` method

### [style.css](file:///c:/Users/joelo/.gemini/antigravity/scratch/Wrangle/Extension%20Files/client/css/style.css)
- Made `.nav-group` scrollable
- Added `.nav-item.dragging` and `.nav-item.drag-over` styles
- Added `.category-edit-icon` styles (hidden by default, visible on hover)
- Added SVG icon support in `.nav-icon svg`

### [index.jsx](file:///c:/Users/joelo/.gemini/antigravity/scratch/Wrangle/Extension%20Files/host/index.jsx)
- Improved error messages for property selection

---

## Testing Checklist

### Expression Application ✓
1. Open After Effects with a composition
2. Select a layer
3. Select a property (Position, Scale, Opacity, Rotation, etc.)
4. Click "Standard Wiggle" or any expression in Wrangle
5. **Expected**: Expression applies to the selected property

### Sidebar Scrolling ✓
1. Resize the Wrangle panel to make it very short
2. **Expected**: Category list scrolls independently
3. Bottom buttons (+, ⚙) remain visible at bottom

### Category Drag-and-Drop ✓
1. Click and hold on a category (e.g., "Motion")
2. Drag to a different position
3. Release mouse
4. **Expected**: Categories reorder and maintain position after refresh

### Category Renaming ✓
1. Hover over a category
2. Click the pencil icon (✎) that appears
3. Enter new name in prompt
4. **Expected**: Category renames, expressions remain in category

### Color Icon ✓
1. Look at the Color category icon
2. **Expected**: See three circles design instead of 🎨 emoji

---

## Build Information

**Package**: `Builds\Wrangle.zxp`  
**Size**: 21,953 bytes  
**Timestamp**: 11/26/2025 12:27:46 AM  

---

## Known Behavior

1. **Expression Application Requirements**:
   - Must select a **specific property**, not just a layer
   - Property must accept expressions (Position, Scale, Rotation, Opacity, most effect parameters)

2. **Category Renaming**:
   - Cannot rename to an existing category name
   - Renaming preserves all expressions in that category

3. **Category Reordering**:
   - Order persists in `Documents\Wrangle\data.json`
   - Drag-and-drop works within visible sidebar area
