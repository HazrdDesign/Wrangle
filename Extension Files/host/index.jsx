function applyExpression(code, controllers) {
    var result = "success";
    app.beginUndoGroup("Apply Expression");
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

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var selectedProps = layer.selectedProperties;

            // 1. Controller Check & Creation
            if (controllers && controllers.length > 0) {
                var effectGroup = layer.property("Effects");
                if (!effectGroup) {
                    // Try to add Effects group if it doesn't exist (rare but possible on some layer types)
                    // Usually it exists, but we check.
                }

                if (effectGroup) {
                    for (var c = 0; c < controllers.length; c++) {
                        var ctrl = controllers[c];
                        // Check if effect with this name exists
                        if (!effectGroup.property(ctrl.name)) {
                            var newEff = effectGroup.addProperty(ctrl.matchName);
                            newEff.name = ctrl.name;
                            controllersAdded++;
                        }
                    }
                }
            }

            // 2. Apply expression code to selected properties (only if code is provided)
            if (code && code !== "") {
                if (selectedProps.length > 0) {
                    for (var j = 0; j < selectedProps.length; j++) {
                        var prop = selectedProps[j];
                        if (prop.canSetExpression) {
                            try {
                                prop.expression = code;
                                appliedCount++;
                            } catch (e) {
                                // Ignore errors
                            }
                        }
                    }
                } else {
                    if (i === 0 && controllersAdded === 0) {
                        throw new Error("Please select a property (like Position, Scale, Opacity, etc.) to apply the expression.");
                    }
                }
            }
        }

        // Success if we applied code OR added controllers
        if (appliedCount === 0 && controllersAdded === 0 && selectedLayers.length > 0) {
            throw new Error("Could not apply expression. Make sure you have selected a property that accepts expressions.");
        }

    } catch (err) {
        result = "Error: " + err.message;
        alert(err.message);
    } finally {
        app.endUndoGroup();
    }

    return result;
}

function captureExpressionAndControllers() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) return JSON.stringify({ code: "", controllers: [] });

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) return JSON.stringify({ code: "", controllers: [] });

    var layer = selectedLayers[0]; // Use first selected layer
    var code = "";
    var controllers = [];

    // 1. Get Expression from selected property
    var props = layer.selectedProperties;
    for (var j = 0; j < props.length; j++) {
        if (props[j].canSetExpression && props[j].expression !== "") {
            code = props[j].expression;
            break; // Only capture first selected expression
        }
    }

    // 2. Scan for selected Effects to use as controllers
    var effectGroup = layer.property("Effects");
    if (effectGroup) {
        // A. Check for explicitly selected effects (Manual override)
        for (var i = 1; i <= effectGroup.numProperties; i++) {
            var effect = effectGroup.property(i);
            if (effect.selected) {
                controllers.push({
                    name: effect.name,
                    matchName: effect.matchName
                });
            }
        }

        // B. Auto-detect effects used in the expression
        if (code !== "") {
            // Regex to find effect("Name") or effect('Name')
            // Matches: effect ( "Name" ) or effect('Name') with optional whitespace
            var effectRegex = /effect\s*\(\s*["']([^"']+)["']\s*\)/g;
            var match;
            while ((match = effectRegex.exec(code)) !== null) {
                var effectName = match[1];
                // Check if this effect exists on the layer
                var targetEffect = effectGroup.property(effectName);
                if (targetEffect) {
                    // Check if already added to avoid duplicates
                    var exists = false;
                    for (var k = 0; k < controllers.length; k++) {
                        if (controllers[k].name === targetEffect.name) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        controllers.push({
                            name: targetEffect.name,
                            matchName: targetEffect.matchName
                        });
                    }
                }
            }
        }
    }

    return JSON.stringify({
        code: code,
        controllers: controllers
    });
}

function removeAllExpressions() {
    app.beginUndoGroup("Remove All Expressions");
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
    app.endUndoGroup();
}
