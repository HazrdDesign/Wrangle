// Wrangle — ExtendScript host
// Uses matchNames ("ADBE Effect Parade") instead of display names so the
// panel keeps working on localized (non-English) installs of After Effects.

function applyExpression(code, controllers) {
    var result = "success";
    app.beginUndoGroup("Wrangle: Apply Expression");
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            throw new Error("Please select a composition.");
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            throw new Error("Please select at least one layer.");
        }

        var appliedCount = 0;
        var controllersAdded = 0;
        var expressionTargets = 0;

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];

            // 1. Create any missing controller effects (with default values)
            if (controllers && controllers.length > 0) {
                var effectGroup = layer.property("ADBE Effect Parade");
                if (effectGroup) {
                    for (var c = 0; c < controllers.length; c++) {
                        var ctrl = controllers[c];
                        if (!effectGroup.property(ctrl.name)) {
                            var newEff = effectGroup.addProperty(ctrl.matchName);
                            newEff.name = ctrl.name;
                            controllersAdded++;

                            if (ctrl.value !== undefined && ctrl.value !== null) {
                                try {
                                    newEff.property(1).setValue(ctrl.value);
                                } catch (valErr) {
                                    // Control type doesn't take this value — leave default
                                }
                            }
                        }
                    }
                }
            }

            // 2. Apply the expression to this layer's selected properties
            if (code && code !== "") {
                var selectedProps = layer.selectedProperties;
                for (var j = 0; j < selectedProps.length; j++) {
                    var prop = selectedProps[j];
                    if (prop.propertyType === PropertyType.PROPERTY && prop.canSetExpression) {
                        expressionTargets++;
                        try {
                            prop.expression = code;
                            appliedCount++;
                        } catch (exprErr) {
                            // Property rejected the expression; counted below
                        }
                    }
                }
            }
        }

        // Only complain after checking EVERY selected layer — a layer without
        // selected properties must not block one that has them.
        if (code && code !== "" && appliedCount === 0) {
            if (controllersAdded > 0) {
                throw new Error("Controllers were added, but no property was selected for the expression.\nSelect a property (Position, Scale, Opacity...) and click again.");
            }
            if (expressionTargets === 0) {
                throw new Error("Please select a property (like Position, Scale, or Opacity) to apply the expression.");
            }
            throw new Error("The selected property doesn't accept this expression.");
        }

    } catch (err) {
        result = "Error: " + err.message;
        alert(err.message);
    } finally {
        app.endUndoGroup();
    }

    return result;
}

// Returns the expression on the first selected property that has one.
// (Used by Ctrl+Click on the panel's + button.)
function getSelectedExpression() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) return "";

    var selectedLayers = comp.selectedLayers;
    for (var i = 0; i < selectedLayers.length; i++) {
        var props = selectedLayers[i].selectedProperties;
        for (var j = 0; j < props.length; j++) {
            var prop = props[j];
            if (prop.propertyType === PropertyType.PROPERTY && prop.canSetExpression && prop.expression !== "") {
                return prop.expression;
            }
        }
    }
    return "";
}

function captureExpressionAndControllers() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) return JSON.stringify({ code: "", controllers: [] });

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) return JSON.stringify({ code: "", controllers: [] });

    var layer = selectedLayers[0]; // Use first selected layer
    var code = "";
    var controllers = [];

    // 1. Expression from the first selected property that has one
    var props = layer.selectedProperties;
    for (var j = 0; j < props.length; j++) {
        var prop = props[j];
        if (prop.propertyType === PropertyType.PROPERTY && prop.canSetExpression && prop.expression !== "") {
            code = prop.expression;
            break;
        }
    }

    // Capture the control's current value where that makes sense, so a
    // saved setup comes back tuned the way it was left.
    function captureValue(effect) {
        try {
            var mn = effect.matchName;
            if (mn === "ADBE Slider Control" || mn === "ADBE Angle Control" || mn === "ADBE Checkbox Control") {
                return effect.property(1).value;
            }
        } catch (e) { }
        return undefined;
    }

    function pushController(effect) {
        for (var k = 0; k < controllers.length; k++) {
            if (controllers[k].name === effect.name) return; // de-dupe
        }
        var entry = { name: effect.name, matchName: effect.matchName };
        var val = captureValue(effect);
        if (val !== undefined) entry.value = val;
        controllers.push(entry);
    }

    // 2. Controllers: explicitly selected effects...
    var effectGroup = layer.property("ADBE Effect Parade");
    if (effectGroup) {
        for (var i = 1; i <= effectGroup.numProperties; i++) {
            var effect = effectGroup.property(i);
            if (effect.selected) pushController(effect);
        }

        // ...plus effects referenced by the expression: effect("Name")
        if (code !== "") {
            var effectRegex = /effect\s*\(\s*["']([^"']+)["']\s*\)/g;
            var match;
            while ((match = effectRegex.exec(code)) !== null) {
                var target = effectGroup.property(match[1]);
                if (target) pushController(target);
            }
        }
    }

    return JSON.stringify({
        code: code,
        controllers: controllers
    });
}

function removeAllExpressions() {
    app.beginUndoGroup("Wrangle: Remove All Expressions");
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) return;

        var selectedLayers = comp.selectedLayers;

        function recursiveRemove(propGroup) {
            for (var i = 1; i <= propGroup.numProperties; i++) {
                var prop = propGroup.property(i);
                if (prop.propertyType === PropertyType.PROPERTY && prop.canSetExpression) {
                    if (prop.expression !== "") {
                        prop.expression = "";
                    }
                } else if (prop.propertyType === PropertyType.NAMED_GROUP || prop.propertyType === PropertyType.INDEXED_GROUP) {
                    recursiveRemove(prop);
                }
            }
        }

        for (var i = 0; i < selectedLayers.length; i++) {
            recursiveRemove(selectedLayers[i]);
        }
    } finally {
        app.endUndoGroup();
    }
}
