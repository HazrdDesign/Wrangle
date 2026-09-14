WRANGLE FOR AFTER EFFECTS
Version 1.6.1
==========================

Create, apply, and organize expressions without digging through expression code.
Select a timeline property, then click a preset. Wrangle applies the expression
and sets up its included controls on the layer. You can apply to multiple
compatible selected properties at once.

FEATURES
--------
- 40 bundled presets for text, time, wiggle, transforms, opacity, color,
  and utilities, with Essentials shortcuts to frequently used expressions.
- Property labels to help you choose where an expression belongs.
- Automatic setup of the controls included with each preset.
- Save your own expressions and supported controller values.
- Search, organize categories, and drag to reorder your library.
- Rounded dark interface with a customizable accent color.

INSTALLATION / UPDATING
-----------------------
1. Close After Effects. If updating, back up your library first (see below).
2. Open a ZXP installer, such as ZXP Installer:
   https://zxpinstaller.com/
3. Install the included Wrangle-v1.6.1.zxp file by dragging it into the installer.
4. Open After Effects, then choose Window > Extensions > Wrangle.
5. Dock the panel wherever you prefer in your workspace.

Use the signed .zxp installer, not a source-code ZIP. Debug mode is not part of
the normal installation steps for the signed release.

Updating keeps your saved library. A fresh preset reset is optional: use the
steps below if you want to replace your library with the current bundled set.

HOW TO USE
----------
Apply an expression:
1. Select the actual property in the timeline, such as Opacity or Anchor Point.
2. Check the preset's Apply To label.
3. Click the preset. Adjust its controls in the layer's Effect Controls panel.

Shortcuts:
- Click: apply the expression and its included controllers.
- Ctrl-click (Windows) / Cmd-click (Mac): apply the expression only.
  Any controls referenced by the expression must already exist.
- Alt-click (Windows) / Option-click (Mac): add controllers only to selected
  layers, without applying the expression.
- Undo in After Effects: undo the preceding timeline operation.

Applying a preset replaces the expression on each compatible selected property.
An existing controller with the same name and type is reused, preserving its
values and keyframes. A conflicting controller type produces an error.

Save and organize:
- Use + to capture a selected expression and supported current control values,
  or enter an expression yourself. Ctrl/Cmd-click + omits captured controllers.
- Use Edit to change the name, category, code, or Apply To property.
- Drag expression rows or category tabs to reorder them.
- Open More actions (...) for category management and other panel actions.
- Essentials includes shortcuts: editing one edits its original library entry.
  Removing a shortcut's preset also removes that entry from its source category.

Saved controller values are snapshots, not complete animated effect presets.
Custom dropdown labels and references to other layers may need manual setup.

Appearance:
Open More actions (...) > Accent Color. Use the RGB controls or enter a
six-digit hex color. Reset returns the accent to orange.

PRESET TIPS
-----------
- Typewriter: apply to Source Text. Controls include typing speed and an optional
  blinking cursor, with Vertical Bar and Underscore styles.
- Auto Center Anchor Point: apply to the layer's Anchor Point. Find it in
  Essentials; use its Offset control to adjust the centered anchor.
- Posterize + Wiggle: use Frame Rate, Frequency, and Amplitude controls.
- Color presets: apply to a color property, such as a Fill effect's Color.
- Loop In / Loop In Duration: loop BEFORE the first keyframe. For example,
  place keyframes at 2 and 3 seconds and preview the time before 2 seconds.
- Loop Out / Loop Out Duration: loop AFTER the last keyframe.
  Loop presets need at least two keyframes. Duration controls the sampled
  segment length; it does not set when the looping stops.

LIBRARY LOCATION & BACKUP
-------------------------
Wrangle stores expressions, categories, and saved controller settings in data.json.

Windows:
  %APPDATA%\Hazrd\Wrangle
  Paste this folder path into File Explorer's address bar and press Enter.

macOS:
  ~/Library/Application Support/Hazrd/Wrangle
  In Finder, choose Go > Go to Folder, then paste the path above.

Close After Effects before copying data.json to a safe backup location.
Keep this backup if you have custom or edited presets. Updates may also create
timestamped .bak files beside data.json before migrating an older library.

Wrangle also keeps a panel recovery copy. Removing data.json alone can allow
that copy to restore the old presets. Follow all reset steps below for a fresh
library. Reinstalling the extension alone does not reset your saved presets.

RESET TO THE INCLUDED PRESETS
-----------------------------
This replaces your active library with the presets bundled in the installed
version. Custom expressions, edits, deletions, and category arrangements will
not be in the fresh library. Back them up first. Expressions and controllers
already applied to After Effects projects are not changed by this reset.

1. Install the version of Wrangle whose presets you want, then close After
   Effects completely, including any other open versions of After Effects.

2. Open the library folder listed above. Move data.json into a separate backup
   folder, such as a dated Wrangle Backup folder on your Desktop.

3. If an older library exists in Documents/Wrangle/data.json, move that file
   into a separate backup folder too. Wrangle can import it automatically
   when the current library file is missing. Keep the two backups distinct.

4. Open the panel cache folder:
   Windows: %LOCALAPPDATA%\Temp\cep_cache
   macOS:   ~/Library/Caches/CSXS/cep_cache

   Move only folders whose names start with AEFT_ and end with
   com.hazrd.wrangle into your backup folder. For example:
   AEFT_26.3_com.hazrd.wrangle

   If multiple After Effects versions have Wrangle cache folders, move each
   matching folder. Leave all other extensions' folders alone. If no matching
   folder exists, continue. This also resets Wrangle's saved accent color.

5. Reopen After Effects and Wrangle. The plugin creates a new data.json with
   the bundled presets. Version 1.6.1 includes 40 unique presets; Essentials
   shortcuts can show the same preset in more than one category.

RESTORE A LIBRARY BACKUP
------------------------
1. Close After Effects completely.
2. Back up the current data.json, then replace it with your saved backup,
   naming the restored file data.json.
3. Move the matching Wrangle cache folders out of cep_cache as described above
   so a newer recovery copy cannot override the restored file.
4. Reopen Wrangle. An older library may be migrated to the installed version.

Restoring replaces the whole library; it does not merge two libraries. Use a
Wrangle version that supports your backup. Keep the original backup unchanged.

TROUBLESHOOTING
---------------
- Panel missing: confirm that the ZXP installer reported success, then fully
  restart After Effects and check Window > Extensions.
- Expression does not apply: select the property itself and check Apply To.
- Missing controllers: use a normal click rather than Ctrl/Cmd-click.
- Presets look unchanged after an update: your saved library is preserved.
  Use the full reset steps above if you want the fresh bundled set.
- Loop In appears inactive: preview BEFORE the first keyframe, not after it.

CREDITS
-------
Wrangle created by Jose "Hazrd" Lopez.
Individual expression source credits are included in expression comments
where provided. Preserve those credits when copying or sharing expressions.