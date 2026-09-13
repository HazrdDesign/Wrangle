// Default Expression Library
const legacyLibrary = {
    "Text": [
        { id: 101, name: "Lock Gradient Ramp to Text", code: "// Apply to Gradient Ramp's Start and End positions\nthisLayer.toComp(value);\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#2ed573" },
        { id: 102, name: "Auto Center Anchor Point", code: "// Apply to Text Layer's Anchor Point\nr = sourceRectAtTime(time, false);\n[r.left + r.width/2, r.top + r.height/2];\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#2ed573" },
        { id: 103, name: "Typewriter with Cursor", code: "// Apply to Source Text\nn = Math.min(text.sourceText.length, Math.floor(time * effect(\"Speed\")(\"Slider\")));\ntext.sourceText.substr(0, n) + \"|\";\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Speed", matchName: "ADBE Slider Control" }], color: "#2ed573" },
        { id: 104, name: "Digital Clock", code: "// Apply to Source Text\nh = Math.floor(time / 3600);\nm = Math.floor(time / 60) % 60;\ns = Math.floor(time % 60);\n[h, m, s].map(x => x < 10 ? \"0\" + x : x).join(\":\");\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#2ed573" },
        { id: 105, name: "Number Counter", code: "// Apply to Source Text\nn = Math.round(value);\nn.toLocaleString();\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#2ed573" },
        { id: 106, name: "Glitched Text", code: "// Apply to Source Text\noriginalText = text.sourceText;\nglitchSpeed = effect(\"Speed\")(\"Slider\");\ncorruptionLevel = effect(\"Corruption\")(\"Slider\") / 100;\n\n// Full range of printable Unicode characters approximation\nunicodeStart = 33;  // \"!\"\nunicodeEnd = 126;   // \"~\"\n\nresult = \"\";\nseedRandom(Math.floor(time * glitchSpeed * 10), true);\n\nfor (i = 0; i < originalText.length; i++) {\n    char = originalText.charAt(i);\n    if (char == \" \") {\n        result += \" \";\n        continue;\n    }\n    if (random() < corruptionLevel) {\n        switch (Math.floor(random(4))) {\n            case 0: \n                // Pick random printable ASCII character\n                result += String.fromCharCode(Math.floor(random(unicodeStart, unicodeEnd+1)));\n                break;\n            case 1: \n                // Duplicate the original char for glitchy effect\n                result += char + char;\n                break;\n            case 2: \n                // Randomize case\n                result += (random() > 0.5) ? char.toUpperCase() : char.toLowerCase();\n                break;\n            case 3: \n                // Pick a random high Unicode block for “weird” symbols\n                result += String.fromCharCode(Math.floor(random(0x2500, 0x25FF))); // Box-drawing block\n                break;\n        }\n    } else {\n        result += char;\n    }\n}\nresult;\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Speed", matchName: "ADBE Slider Control" }, { name: "Corruption", matchName: "ADBE Slider Control" }], color: "#2ed573" }
    ],
    "Time": [
        { id: 201, name: "Loop (Dropdown Select)", code: "// Apply to any keyframed property\nloopMap = [\"cycle\", \"pingpong\", \"offset\"];\ntype = loopMap[effect(\"Loop Type\")(\"Menu\") - 1];\nloopOut(type);\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Loop Type", matchName: "ADBE Dropdown Control" }], color: "#1e90ff" },
        { id: 203, name: "Posterize Time", code: "// Apply to any property\nposterizeTime(effect(\"Frame Rate\")(\"Slider\"));\nvalue;\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Frame Rate", matchName: "ADBE Slider Control" }], color: "#1e90ff" },
        { id: 204, name: "Start / End at Time", code: "// Apply to any property\ntime > inPoint && time < outPoint ? value : valueAtTime(inPoint);\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#1e90ff" },
        { id: 205, name: "Simple Time Driver", code: "// Apply to any property\ntime * 100;\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#1e90ff" },
        { id: 206, name: "Delay Index Value", code: "// Apply to any property (e.g. Rotation)\ndelayFrames = effect(\"Delay Frames\")(\"Slider\");\ndelayTime = delayFrames * thisComp.frameDuration * (index - 1);\nthisComp.layer(1).rotation.valueAtTime(time - delayTime);\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Delay Frames", matchName: "ADBE Slider Control" }], color: "#1e90ff" }
    ],
    "Wiggle": [
        { id: 301, name: "Choppy Stop Motion", code: "// Apply to any property\nposterizeTime(effect(\"Frame Rate\")(\"Slider\"));\nwiggle(effect(\"Frequency\")(\"Slider\"), effect(\"Amplitude\")(\"Slider\"));\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Frame Rate", matchName: "ADBE Slider Control" }, { name: "Frequency", matchName: "ADBE Slider Control" }, { name: "Amplitude", matchName: "ADBE Slider Control" }], color: "#ffa502" },
        { id: 302, name: "Random Flicker Opacity", code: "// Apply to Opacity property\nposterizeTime(effect(\"Frame Rate\")(\"Slider\"));\nrandom(0, 100);\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Frame Rate", matchName: "ADBE Slider Control" }], color: "#ffa502" },
        { id: 303, name: "Wiggle 1D (X Only)", code: "// Apply to 2D Position property\nx = wiggle(effect(\"Frequency\")(\"Slider\"), effect(\"Amplitude\")(\"Slider\"))[0];\n[x, value[1]];\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Frequency", matchName: "ADBE Slider Control" }, { name: "Amplitude", matchName: "ADBE Slider Control" }], color: "#ffa502" },
        { id: 304, name: "Wiggle Loop", code: "// Apply to any property\nfreq = effect(\"Frequency\")(\"Slider\");\namp = effect(\"Amplitude\")(\"Slider\");\nloopDur = effect(\"Duration\")(\"Slider\");\nw = wiggle(freq, amp, 1, 0.5, time % loopDur);\nw;\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Frequency", matchName: "ADBE Slider Control" }, { name: "Amplitude", matchName: "ADBE Slider Control" }, { name: "Duration", matchName: "ADBE Slider Control" }], color: "#ffa502" }
    ],
    "Transform": [
        { id: 401, name: "Exponential Scale", code: "// Apply to Scale property\nfreq = effect(\"Frequency\")(\"Slider\");\namp = effect(\"Amplitude\")(\"Slider\");\nw = wiggle(freq, amp);\nvalue * (1 + w);\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Frequency", matchName: "ADBE Slider Control" }, { name: "Amplitude", matchName: "ADBE Slider Control" }], color: "#ff4757" },
        { id: 402, name: "Random Layer Scale", code: "// Apply to Scale property\nseedRandom(index, true);\n[random(50, 150), random(50, 150)];\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#ff4757" },
        { id: 403, name: "Maintain Stroke Width", code: "// Apply to Stroke Width property\nvalue / max(length(toComp([0, 0]), toComp([0.7071, 0.7071])), 0.001);\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#ff4757" },
        { id: 404, name: "Procedural Sine Path", code: "// Apply to Shape Path property\namp = effect(\"Amplitude\")(\"Slider\");\nwLen = effect(\"Wavelength\")(\"Slider\");\nlengthTotal = effect(\"Length\")(\"Slider\");\npts = [];\nfor (i = 0; i < 200; i++) {\n  t = i / 199;\n  x = t * lengthTotal - lengthTotal / 2;\n  y = amp * Math.sin(t * lengthTotal / wLen * 2 * Math.PI);\n  pts.push([x, y]);\n}\ncreatePath(pts, [], [], false);\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Amplitude", matchName: "ADBE Slider Control" }, { name: "Wavelength", matchName: "ADBE Slider Control" }, { name: "Length", matchName: "ADBE Slider Control" }], color: "#ff4757" },
        { id: 405, name: "Heartbeat Pulse", code: "// Apply to Scale property\nfreq = effect(\"Frequency\")(\"Slider\");\namp = effect(\"Amplitude\")(\"Slider\");\nvalue + Math.sin(time * freq * 2 * Math.PI) * amp;\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Frequency", matchName: "ADBE Slider Control" }, { name: "Amplitude", matchName: "ADBE Slider Control" }], color: "#ff4757" },
        { id: 406, name: "Circular Orbit", code: "// Apply to Position property\nspeed = effect(\"Speed\")(\"Slider\");\nradius = effect(\"Radius\")(\"Slider\");\n\na = time * speed;\nvalue + [Math.cos(a) * radius, Math.sin(a) * radius, 0];\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Speed", matchName: "ADBE Slider Control" }, { name: "Radius", matchName: "ADBE Slider Control" }], color: "#ff4757" }
    ],
    "Utility": [],
    "Color": [
        { id: 601, name: "Rainbow Cycle", code: "// Apply to any color property\nspeed = effect(\"Speed\")(\"Slider\");\nh = (time * speed) % 1;\nhslToRgb([h, 1, 0.5, 1]);\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "Speed", matchName: "ADBE Slider Control" }], color: "#ffffff" },
        { id: 602, name: "Random Color Per Second", code: "// Apply to any color property\nseedRandom(Math.floor(time), true);\n[random(), random(), random()];\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#ffffff" },
        { id: 603, name: "Brightness Pulse (Same Hue)", code: "// Apply to any color property\nh = 0.6;\nl = 0.5 + Math.sin(time * 4) * 0.25;\nhslToRgb([h, 1, l]);\n// ®Wrangle by Jose \"Hazrd\" Lopez", color: "#ffffff" }
    ],
    "3D": [
        { id: 702, name: "2D to 3D Space Null", code: "// Apply to 2D Position property\nthisComp.layer(effect(\"3D Layer\")(\"Layer\")).toComp([0, 0, 0]);\n// ®Wrangle by Jose \"Hazrd\" Lopez", controllers: [{ name: "3D Layer", matchName: "ADBE Layer Control" }], color: "#a29bfe" }
    ],
    "Custom": []
};


// Exact shipped v1.3 presets, for preserving user edits during upgrades.
const libraryV12 = {
  "Text": [
    {
      "id": 101,
      "name": "Lock Gradient Ramp to Text",
      "code": "// Apply to Gradient Ramp Start / End · Text layer\nvar r = sourceRectAtTime(time, false);\nvar pad = effect(\"Wrangle 101 - Padding\")(1);\nvar x = thisProperty.propertyIndex === 1 ? r.left - pad : r.left + r.width + pad;\n[x, r.top + r.height / 2];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "ramp",
      "controllers": [
        {
          "name": "Wrangle 101 - Padding",
          "label": "Padding",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Fits a horizontal ramp to the text bounds. Apply to both Start of Ramp and End of Ramp."
    },
    {
      "id": 104,
      "name": "Digital Clock",
      "code": "// Apply to Source Text\nvar t = Math.max(0, Math.floor(time - inPoint + effect(\"Wrangle 104 - Offset Seconds\")(1)));\nfunction two(n) { return n < 10 ? '0' + n : '' + n; }\ntwo(Math.floor(t / 3600)) + ':' + two(Math.floor(t / 60) % 60) + ':' + two(t % 60);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "text",
      "controllers": [
        {
          "name": "Wrangle 104 - Offset Seconds",
          "label": "Offset Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Elapsed HH:MM:SS from the layer in-point."
    },
    {
      "id": 105,
      "name": "Number Counter",
      "code": "// Apply to Source Text\nvar digits = Math.max(0, Math.min(6, Math.round(effect(\"Wrangle 105 - Decimals\")(1))));\nvar parts = Number(effect(\"Wrangle 105 - Value\")(1)).toFixed(digits).split('.');\nparts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');\nparts.join('.');\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "text",
      "controllers": [
        {
          "name": "Wrangle 105 - Value",
          "label": "Value",
          "matchName": "ADBE Slider Control",
          "value": 1000
        },
        {
          "name": "Wrangle 105 - Decimals",
          "label": "Decimals",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Animate the Value slider to count. Decimals ranges from 0 to 6."
    },
    {
      "id": 106,
      "name": "Glitched Text",
      "code": "// Apply to Source Text\nvar original = String(value);\nvar speed = Math.max(0, effect(\"Wrangle 106 - Speed\")(1));\nvar amount = Math.max(0, Math.min(100, effect(\"Wrangle 106 - Corruption\")(1))) / 100;\nseedRandom(Math.floor((time - inPoint) * speed), true);\nvar result = '';\nfor (var i = 0; i < original.length; i++) {\n var ch = original.charAt(i);\n result += /\\s/.test(ch) || random() >= amount ? ch : String.fromCharCode(Math.floor(random(33, 127)));\n}\nresult;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "text",
      "controllers": [
        {
          "name": "Wrangle 106 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 12
        },
        {
          "name": "Wrangle 106 - Corruption",
          "label": "Corruption",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Speed is changes per second; Corruption is a percentage."
    }
  ],
  "Time": [
    {
      "id": 201,
      "name": "Loop (Dropdown Select)",
      "code": "// Apply to Numeric properties\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 201 - Loop Type\")(1))));\nnumKeys >= 2 ? loopOut(modes[mode - 1]) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 201 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        }
      ],
      "requiresKeys": 2,
      "description": "Repeats the keyframed animation after the last keyframe."
    },
    {
      "id": 203,
      "name": "Posterize Time",
      "code": "// Apply to Numeric properties\nposterizeTime(Math.max(0.01, effect(\"Wrangle 203 - Frame Rate\")(1)));\nvalue;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 203 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        }
      ],
      "description": "Samples existing animation at the chosen frames per second."
    },
    {
      "id": 204,
      "name": "Hold Outside Time Range",
      "code": "// Apply to Numeric properties\nvar start = inPoint + Math.max(0, effect(\"Wrangle 204 - Start Offset Frames\")(1)) * thisComp.frameDuration;\nvar end = Math.max(start, outPoint - Math.max(0, effect(\"Wrangle 204 - End Offset Frames\")(1)) * thisComp.frameDuration);\nvalueAtTime(Math.max(start, Math.min(end, time)));\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 204 - Start Offset Frames",
          "label": "Start Offset Frames",
          "matchName": "ADBE Slider Control",
          "value": 0
        },
        {
          "name": "Wrangle 204 - End Offset Frames",
          "label": "End Offset Frames",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Holds the start value before the range and the end value after it. Offsets are measured inward from the layer in/out points."
    }
  ],
  "Wiggle": [
    {
      "id": 301,
      "name": "Choppy Stop Motion",
      "code": "// Apply to Numeric properties\nposterizeTime(Math.max(0.01, effect(\"Wrangle 301 - Frame Rate\")(1)));\nwiggle(Math.max(0, effect(\"Wrangle 301 - Frequency\")(1)), Math.max(0, effect(\"Wrangle 301 - Amplitude\")(1)));\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 301 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        },
        {
          "name": "Wrangle 301 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 301 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Stepped random motion. Amplitude uses the selected property’s units."
    },
    {
      "id": 302,
      "name": "Random Flicker Opacity",
      "code": "// Apply to Opacity\nposterizeTime(Math.max(0.01, effect(\"Wrangle 302 - Frame Rate\")(1)));\nrandom(0, 100);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "opacity",
      "controllers": [
        {
          "name": "Wrangle 302 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        }
      ],
      "description": "Randomizes opacity from 0 to 100 at the chosen frame rate."
    },
    {
      "id": 304,
      "name": "Wiggle Loop",
      "code": "// Apply to Numeric properties\nvar frequency = Math.max(0, effect(\"Wrangle 304 - Frequency\")(1));\nvar amplitude = Math.max(0, effect(\"Wrangle 304 - Amplitude\")(1));\nvar duration = Math.max(thisComp.frameDuration, effect(\"Wrangle 304 - Duration\")(1));\nvar t = ((time - inPoint) % duration + duration) % duration;\nvar a = wiggle(frequency, amplitude, 1, 0.5, t);\nvar b = wiggle(frequency, amplitude, 1, 0.5, t - duration);\nlinear(t, 0, duration, a, b);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 304 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 1
        },
        {
          "name": "Wrangle 304 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 25
        },
        {
          "name": "Wrangle 304 - Duration",
          "label": "Duration",
          "matchName": "ADBE Slider Control",
          "value": 3
        }
      ],
      "description": "Seamless random motion for a static base value. Duration is in seconds; animate the base separately if a seamless loop is not required."
    }
  ],
  "Transform": [
    {
      "id": 402,
      "name": "Random Layer Scale",
      "code": "// Apply to Scale\nvar lo = Math.min(effect(\"Wrangle 402 - Minimum\")(1), effect(\"Wrangle 402 - Maximum\")(1));\nvar hi = Math.max(effect(\"Wrangle 402 - Minimum\")(1), effect(\"Wrangle 402 - Maximum\")(1));\nseedRandom(index + Math.round(effect(\"Wrangle 402 - Seed\")(1)), true);\nvar s = random(lo, hi);\nvalue.length === 3 ? [s, s, s] : [s, s];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "scale",
      "controllers": [
        {
          "name": "Wrangle 402 - Minimum",
          "label": "Minimum",
          "matchName": "ADBE Slider Control",
          "value": 50
        },
        {
          "name": "Wrangle 402 - Maximum",
          "label": "Maximum",
          "matchName": "ADBE Slider Control",
          "value": 150
        },
        {
          "name": "Wrangle 402 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "One stable, uniform scale per layer. Minimum and Maximum are percentages."
    },
    {
      "id": 403,
      "name": "Maintain Stroke Width",
      "code": "// Apply to Shape Stroke Width\nvar x = length(thisLayer.toCompVec([1, 0, 0]));\nvar y = length(thisLayer.toCompVec([0, 1, 0]));\nvar scaleFactor = Math.max((x + y) / 2, 0.001);\nvalue / scaleFactor;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "stroke",
      "controllers": [],
      "description": "Compensates for layer/parent scale. For predictable results use uniform scale and unscaled shape groups; nonuniform/perspective scaling is approximate."
    },
    {
      "id": 404,
      "name": "Procedural Sine Path",
      "code": "// Apply to Shape Path\nvar amplitude = effect(\"Wrangle 404 - Amplitude\")(1);\nvar wavelength = Math.max(0.001, Math.abs(effect(\"Wrangle 404 - Wavelength\")(1)));\nvar total = Math.max(0.001, Math.abs(effect(\"Wrangle 404 - Length\")(1)));\nvar phase = effect(\"Wrangle 404 - Phase Degrees\")(1) * Math.PI / 180;\nvar pts = [];\nfor (var i = 0; i < 200; i++) {\n var x = i / 199 * total;\n pts.push([x - total / 2, amplitude * Math.sin(x / wavelength * Math.PI * 2 + phase)]);\n}\ncreatePath(pts, [], [], false);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "path",
      "controllers": [
        {
          "name": "Wrangle 404 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 40
        },
        {
          "name": "Wrangle 404 - Wavelength",
          "label": "Wavelength",
          "matchName": "ADBE Slider Control",
          "value": 200
        },
        {
          "name": "Wrangle 404 - Length",
          "label": "Length",
          "matchName": "ADBE Slider Control",
          "value": 600
        },
        {
          "name": "Wrangle 404 - Phase Degrees",
          "label": "Phase Degrees",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Creates an open sine path. Animate Phase Degrees to move the wave."
    },
    {
      "id": 406,
      "name": "Circular Orbit",
      "code": "// Apply to Position (2D / 3D)\nvar a = (time - inPoint) * effect(\"Wrangle 406 - Speed\")(1) * Math.PI * 2;\nvar radius = effect(\"Wrangle 406 - Radius\")(1);\nvar x = value[0] + Math.cos(a) * radius;\nvar y = value[1] + Math.sin(a) * radius;\nvalue.length === 3 ? [x, y, value[2]] : [x, y];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "position",
      "controllers": [
        {
          "name": "Wrangle 406 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 0.25
        },
        {
          "name": "Wrangle 406 - Radius",
          "label": "Radius",
          "matchName": "ADBE Slider Control",
          "value": 100
        }
      ],
      "description": "Orbits the original position in its parent space. Speed is revolutions per second; Z is preserved."
    }
  ],
  "Utility": [],
  "Color": [
    {
      "id": 601,
      "name": "Rainbow Cycle",
      "code": "// Apply to Color\nvar h = ((time - inPoint) * effect(\"Wrangle 601 - Speed\")(1) % 1 + 1) % 1;\nhslToRgb([h, 1, 0.5, value[3]]);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 601 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 0.2
        }
      ],
      "description": "Cycles hue while preserving the original alpha. Negative Speed reverses direction."
    },
    {
      "id": 602,
      "name": "Random Color Per Second",
      "code": "// Apply to Color\nseedRandom(Math.floor(time - inPoint), true);\n[random(), random(), random(), value[3]];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [],
      "description": "One random color per second, preserving alpha."
    },
    {
      "id": 603,
      "name": "Brightness Pulse (Same Hue)",
      "code": "// Apply to Color\nvar hsl = rgbToHsl(value);\nvar amount = Math.max(0, Math.min(100, effect(\"Wrangle 603 - Amount\")(1))) / 100;\nvar light = hsl[2] + Math.sin((time - inPoint) * effect(\"Wrangle 603 - Frequency\")(1) * Math.PI * 2) * amount;\nhslToRgb([hsl[0], hsl[1], Math.max(0, Math.min(1, light)), value[3]]);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 603 - Amount",
          "label": "Amount",
          "matchName": "ADBE Slider Control",
          "value": 25
        },
        {
          "name": "Wrangle 603 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        }
      ],
      "description": "Pulses lightness while preserving the original hue, saturation, and alpha."
    }
  ],
  "Custom": []
};

// Shipped v1.4 catalog for preserving user edits/deletions.
const libraryV13 = {
  "Text": [
    {
      "id": 104,
      "name": "Digital Clock",
      "code": "// Apply to Source Text\nvar t = Math.max(0, Math.floor(time - inPoint + effect(\"Wrangle 104 - Offset Seconds\")(1)));\nfunction two(n) { return n < 10 ? '0' + n : '' + n; }\ntwo(Math.floor(t / 3600)) + ':' + two(Math.floor(t / 60) % 60) + ':' + two(t % 60);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "text",
      "controllers": [
        {
          "name": "Wrangle 104 - Offset Seconds",
          "label": "Offset Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Elapsed HH:MM:SS from the layer in-point."
    },
    {
      "id": 105,
      "name": "Number Counter",
      "code": "// Apply to Source Text\nvar digits = Math.max(0, Math.min(6, Math.round(effect(\"Wrangle 105 - Decimals\")(1))));\nvar parts = Number(effect(\"Wrangle 105 - Value\")(1)).toFixed(digits).split('.');\nparts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');\nparts.join('.');\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "text",
      "controllers": [
        {
          "name": "Wrangle 105 - Value",
          "label": "Value",
          "matchName": "ADBE Slider Control",
          "value": 1000
        },
        {
          "name": "Wrangle 105 - Decimals",
          "label": "Decimals",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Animate the Value slider to count. Decimals ranges from 0 to 6."
    },
    {
      "id": 107,
      "name": "Typewriter",
      "target": "text",
      "code": "// Apply to Source Text\n// Apply to Source Text. Starts at the layer in-point plus Delay Seconds.\nvar original = String(value);\nvar elapsed = time - inPoint - effect(\"Wrangle 107 - Delay Seconds\")(1);\nvar speed = Math.max(0, effect(\"Wrangle 107 - Speed\")(1));\n// Keep surrogate pairs together (for example emoji).\nvar chars = original.match(/[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\s\\S]/g) || [];\nvar n = Math.max(0, Math.min(chars.length, Math.floor(elapsed * speed)));\nvar show = effect(\"Wrangle 107 - Show Cursor\")(1) > 0;\nvar blink = Math.max(0, effect(\"Wrangle 107 - Blink Speed\")(1));\nvar visible = elapsed >= 0 && (blink === 0 || Math.floor(elapsed * blink * 2) % 2 === 0);\nvar cursor = effect(\"Wrangle 107 - Cursor Style\")(1) < 2 ? '|' : '_';\nchars.slice(0, n).join('') + (show && visible ? cursor : '');\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 107 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 12
        },
        {
          "name": "Wrangle 107 - Delay Seconds",
          "label": "Delay Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        },
        {
          "name": "Wrangle 107 - Show Cursor",
          "label": "Show Cursor",
          "matchName": "ADBE Checkbox Control",
          "value": 1
        },
        {
          "name": "Wrangle 107 - Cursor Style",
          "label": "Cursor Style",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "|",
            "_"
          ]
        },
        {
          "name": "Wrangle 107 - Blink Speed",
          "label": "Blink Speed",
          "matchName": "ADBE Slider Control",
          "value": 2
        }
      ],
      "description": "Reveals characters per second. Toggle Show Cursor; choose | or _. Blink Speed is cycles/second (0 stays visible). Uses the layer’s base text styling."
    }
  ],
  "Time": [
    {
      "id": 201,
      "name": "Loop Out",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 201 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 201 - Keyframe Count\")(1));\nspan = Math.min(Math.floor(span), Math.max(0, numKeys - 1));\n// 0 uses all keyframes; otherwise counts keyframe intervals.\nnumKeys >= 2 ? loopOut(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 201 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 201 - Keyframe Count",
          "label": "Keyframe Count",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopOut: Cycle, Ping-pong, Offset, or Continue. Keyframe Count is intervals; 0 uses all keys. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 203,
      "name": "Posterize Time",
      "code": "// Apply to Numeric properties\nposterizeTime(Math.max(0.01, effect(\"Wrangle 203 - Frame Rate\")(1)));\nvalue;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 203 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        }
      ],
      "description": "Samples existing animation at the chosen frames per second."
    },
    {
      "id": 207,
      "name": "Loop In",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 207 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 207 - Keyframe Count\")(1));\nspan = Math.min(Math.floor(span), Math.max(0, numKeys - 1));\n// 0 uses all keyframes; otherwise counts keyframe intervals.\nnumKeys >= 2 ? loopIn(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 207 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 207 - Keyframe Count",
          "label": "Keyframe Count",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopIn: Cycle, Ping-pong, Offset, or Continue. Keyframe Count is intervals; 0 uses all keys. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 208,
      "name": "Loop Out Duration",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 208 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 208 - Duration Seconds\")(1));\n// 0 uses the default duration relative to the layer in/out point.\nnumKeys >= 2 ? loopOutDuration(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 208 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 208 - Duration Seconds",
          "label": "Duration Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopOutDuration: Cycle, Ping-pong, Offset, or Continue. Duration is seconds; 0 uses the AE default. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 209,
      "name": "Loop In Duration",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 209 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 209 - Duration Seconds\")(1));\n// 0 uses the default duration relative to the layer in/out point.\nnumKeys >= 2 ? loopInDuration(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 209 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 209 - Duration Seconds",
          "label": "Duration Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopInDuration: Cycle, Ping-pong, Offset, or Continue. Duration is seconds; 0 uses the AE default. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 210,
      "name": "Auto Fade In / Out",
      "target": "opacity",
      "code": "// Apply to Opacity\n// Apply to Opacity. Fade durations are in seconds from layer in/out points.\nvar fi = Math.max(0, effect(\"Wrangle 210 - Fade In Seconds\")(1));\nvar fo = Math.max(0, effect(\"Wrangle 210 - Fade Out Seconds\")(1));\nvar start = fi === 0 ? (time >= inPoint ? 1 : 0) : Math.max(0, Math.min(1, (time - inPoint) / fi));\nvar end = fo === 0 ? (time < outPoint ? 1 : 0) : Math.max(0, Math.min(1, (outPoint - time) / fo));\nvalue * Math.min(start, end);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 210 - Fade In Seconds",
          "label": "Fade In Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        },
        {
          "name": "Wrangle 210 - Fade Out Seconds",
          "label": "Fade Out Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        }
      ],
      "description": "Fades the existing opacity at layer edges. Zero disables that fade; overlapping fades stay bounded."
    }
  ],
  "Wiggle": [
    {
      "id": 301,
      "name": "Choppy Stop Motion",
      "code": "// Apply to Numeric properties\nposterizeTime(Math.max(0.01, effect(\"Wrangle 301 - Frame Rate\")(1)));\nwiggle(Math.max(0, effect(\"Wrangle 301 - Frequency\")(1)), Math.max(0, effect(\"Wrangle 301 - Amplitude\")(1)));\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 301 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        },
        {
          "name": "Wrangle 301 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 301 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Stepped random motion. Amplitude uses the selected property’s units."
    },
    {
      "id": 302,
      "name": "Random Flicker Opacity",
      "code": "// Apply to Opacity\nposterizeTime(Math.max(0.01, effect(\"Wrangle 302 - Frame Rate\")(1)));\nrandom(0, 100);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "opacity",
      "controllers": [
        {
          "name": "Wrangle 302 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        }
      ],
      "description": "Randomizes opacity from 0 to 100 at the chosen frame rate."
    },
    {
      "id": 304,
      "name": "Wiggle Loop",
      "code": "// Apply to Numeric properties\nvar frequency = Math.max(0, effect(\"Wrangle 304 - Frequency\")(1));\nvar amplitude = Math.max(0, effect(\"Wrangle 304 - Amplitude\")(1));\nvar duration = Math.max(thisComp.frameDuration, effect(\"Wrangle 304 - Duration\")(1));\nvar t = ((time - inPoint) % duration + duration) % duration;\nvar a = wiggle(frequency, amplitude, 1, 0.5, t);\nvar b = wiggle(frequency, amplitude, 1, 0.5, t - duration);\nlinear(t, 0, duration, a, b);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 304 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 1
        },
        {
          "name": "Wrangle 304 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 25
        },
        {
          "name": "Wrangle 304 - Duration",
          "label": "Duration",
          "matchName": "ADBE Slider Control",
          "value": 3
        }
      ],
      "description": "Seamless random motion for a static base value. Duration is in seconds; animate the base separately if a seamless loop is not required."
    },
    {
      "id": 305,
      "name": "Wiggle X-Axis Only",
      "target": "position",
      "code": "// Apply to Position (2D / 3D)\n// Use unseparated layer Position. Preserves the other axes.\nvar f = Math.max(0, effect(\"Wrangle 305 - Frequency\")(1));\nvar a = Math.max(0, effect(\"Wrangle 305 - Amplitude\")(1));\nvar w = wiggle(f, a);\nvar p = value.slice(0);\np[0] = w[0];\np;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 305 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 305 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Wiggles only X; preserves the other coordinates, including Z."
    },
    {
      "id": 306,
      "name": "Wiggle Y-Axis Only",
      "target": "position",
      "code": "// Apply to Position (2D / 3D)\n// Use unseparated layer Position. Preserves the other axes.\nvar f = Math.max(0, effect(\"Wrangle 306 - Frequency\")(1));\nvar a = Math.max(0, effect(\"Wrangle 306 - Amplitude\")(1));\nvar w = wiggle(f, a);\nvar p = value.slice(0);\np[1] = w[1];\np;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 306 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 306 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Wiggles only Y; preserves the other coordinates, including Z."
    },
    {
      "id": 307,
      "name": "Basic Wiggle",
      "target": "numeric",
      "code": "// Apply to Numeric properties\nwiggle(Math.max(0, effect(\"Wrangle 307 - Frequency\")(1)), Math.max(0, effect(\"Wrangle 307 - Amplitude\")(1)));\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 307 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 307 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Random motion; amplitude uses the selected property’s units."
    }
  ],
  "Transform": [
    {
      "id": 402,
      "name": "Random Layer Scale",
      "code": "// Apply to Scale\nvar lo = Math.min(effect(\"Wrangle 402 - Minimum\")(1), effect(\"Wrangle 402 - Maximum\")(1));\nvar hi = Math.max(effect(\"Wrangle 402 - Minimum\")(1), effect(\"Wrangle 402 - Maximum\")(1));\nseedRandom(index + Math.round(effect(\"Wrangle 402 - Seed\")(1)), true);\nvar s = random(lo, hi);\nvalue.length === 3 ? [s, s, s] : [s, s];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "scale",
      "controllers": [
        {
          "name": "Wrangle 402 - Minimum",
          "label": "Minimum",
          "matchName": "ADBE Slider Control",
          "value": 50
        },
        {
          "name": "Wrangle 402 - Maximum",
          "label": "Maximum",
          "matchName": "ADBE Slider Control",
          "value": 150
        },
        {
          "name": "Wrangle 402 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "One stable, uniform scale per layer. Minimum and Maximum are percentages."
    },
    {
      "id": 403,
      "name": "Maintain Stroke Width",
      "code": "// Apply to Shape Stroke Width\nvar x = length(thisLayer.toCompVec([1, 0, 0]));\nvar y = length(thisLayer.toCompVec([0, 1, 0]));\nvar scaleFactor = Math.max((x + y) / 2, 0.001);\nvalue * Math.max(0, effect(\"Wrangle 403 - Width Multiplier\")(1)) / scaleFactor;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "stroke",
      "controllers": [
        {
          "name": "Wrangle 403 - Width Multiplier",
          "label": "Width Multiplier",
          "matchName": "ADBE Slider Control",
          "value": 1
        }
      ],
      "description": "Compensates for layer/parent scale. For predictable results use uniform scale and unscaled shape groups; nonuniform/perspective scaling is approximate."
    },
    {
      "id": 404,
      "name": "Procedural Sine Path",
      "code": "// Apply to Shape Path\nvar amplitude = effect(\"Wrangle 404 - Amplitude\")(1);\nvar wavelength = Math.max(0.001, Math.abs(effect(\"Wrangle 404 - Wavelength\")(1)));\nvar total = Math.max(0.001, Math.abs(effect(\"Wrangle 404 - Length\")(1)));\nvar phase = effect(\"Wrangle 404 - Phase Degrees\")(1) * Math.PI / 180;\nvar pts = [];\nfor (var i = 0; i < 200; i++) {\n var x = i / 199 * total;\n pts.push([x - total / 2, amplitude * Math.sin(x / wavelength * Math.PI * 2 + phase)]);\n}\ncreatePath(pts, [], [], false);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "path",
      "controllers": [
        {
          "name": "Wrangle 404 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 40
        },
        {
          "name": "Wrangle 404 - Wavelength",
          "label": "Wavelength",
          "matchName": "ADBE Slider Control",
          "value": 200
        },
        {
          "name": "Wrangle 404 - Length",
          "label": "Length",
          "matchName": "ADBE Slider Control",
          "value": 600
        },
        {
          "name": "Wrangle 404 - Phase Degrees",
          "label": "Phase Degrees",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Creates an open sine path. Animate Phase Degrees to move the wave."
    },
    {
      "id": 406,
      "name": "Circular Orbit",
      "code": "// Apply to Position (2D / 3D)\nvar a = (time - inPoint) * effect(\"Wrangle 406 - Speed\")(1) * Math.PI * 2;\nvar radius = effect(\"Wrangle 406 - Radius\")(1);\nvar x = value[0] + Math.cos(a) * radius;\nvar y = value[1] + Math.sin(a) * radius;\nvalue.length === 3 ? [x, y, value[2]] : [x, y];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "position",
      "controllers": [
        {
          "name": "Wrangle 406 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 0.25
        },
        {
          "name": "Wrangle 406 - Radius",
          "label": "Radius",
          "matchName": "ADBE Slider Control",
          "value": 100
        }
      ],
      "description": "Orbits the original position in its parent space. Speed is revolutions per second; Z is preserved."
    },
    {
      "id": 407,
      "name": "Auto Center Anchor Point",
      "target": "anchor",
      "code": "// Apply to Anchor Point\n// Text or shape layer Transform > Anchor Point, not a shape group's anchor.\nvar r = sourceRectAtTime(time, false);\nvar offset = effect(\"Wrangle 407 - Offset\")(1);\nvar x = r.left + r.width / 2 + offset[0];\nvar y = r.top + r.height / 2 + offset[1];\nvalue.length === 3 ? [x, y, value[2]] : [x, y];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 407 - Offset",
          "label": "Offset",
          "matchName": "ADBE Point Control",
          "value": [
            0,
            0
          ]
        }
      ],
      "description": "Centers the layer anchor on current text/shape bounds. Offset is in layer pixels. Changing the anchor can move the artwork; Position is not compensated.",
      "targetSpec": {
        "matchNames": [
          "ADBE Anchor Point"
        ],
        "boundsLayer": true
      }
    },
    {
      "id": 408,
      "name": "Counter Rotation",
      "target": "rotation",
      "code": "// Apply to Rotation\n// Apply to 2D layer Rotation. Use a chain of 2D parents.\nvar total = effect(\"Wrangle 408 - Angle Offset\")(1);\nvar current = thisLayer;\nwhile (current.hasParent) {\n current = current.parent;\n total += current.transform.rotation;\n}\nvalue - total;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 408 - Angle Offset",
          "label": "Angle Offset",
          "matchName": "ADBE Angle Control",
          "value": 0
        }
      ],
      "description": "Cancels rotation from every 2D parent. Angle Offset is subtracted from the original rotation.",
      "targetSpec": {
        "matchNames": [
          "ADBE Rotate Z"
        ],
        "twoDChain": true
      }
    },
    {
      "id": 409,
      "name": "Inertial Bounce",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to keyframed numeric properties (Position, Scale, Rotation, etc.).\nvar amp = Math.max(0, effect(\"Wrangle 409 - Amplitude\")(1));\nvar freq = Math.max(0, effect(\"Wrangle 409 - Frequency\")(1));\nvar decay = Math.max(0.01, effect(\"Wrangle 409 - Decay\")(1));\nvar n = 0;\nif (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) n--; }\nvar result = value;\nif (n > 0) {\n var t = time - key(n).time;\n var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n var factor = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n if (value instanceof Array) {\n  result = []; for (var i = 0; i < value.length; i++) result.push(value[i] + v[i] * factor);\n } else result = value + v * factor;\n}\nresult;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 409 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 0.05
        },
        {
          "name": "Wrangle 409 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 3
        },
        {
          "name": "Wrangle 409 - Decay",
          "label": "Decay",
          "matchName": "ADBE Slider Control",
          "value": 5
        }
      ],
      "description": "Adds a decaying overshoot using incoming keyframe velocity. Hold keys or zero incoming velocity produce no bounce.",
      "requiresKeys": 2
    }
  ],
  "Utility": [],
  "Color": [
    {
      "id": 601,
      "name": "Rainbow Cycle",
      "code": "// Apply to Color\nvar h = ((time - inPoint) * effect(\"Wrangle 601 - Speed\")(1) % 1 + 1) % 1;\nhslToRgb([h, 1, 0.5, value[3]]);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 601 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 0.2
        }
      ],
      "description": "Cycles hue while preserving the original alpha. Negative Speed reverses direction."
    },
    {
      "id": 602,
      "name": "Random Color Per Second",
      "code": "// Apply to Color\nvar rate = Math.max(0, effect(\"Wrangle 602 - Changes Per Second\")(1));\nseedRandom(Math.floor((time - inPoint) * rate) + Math.round(effect(\"Wrangle 602 - Seed\")(1)), true);\n[random(), random(), random(), value[3]];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 602 - Changes Per Second",
          "label": "Changes Per Second",
          "matchName": "ADBE Slider Control",
          "value": 1
        },
        {
          "name": "Wrangle 602 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Random color at Changes Per Second (default 1). Zero freezes the color; Seed changes the sequence. Preserves alpha."
    },
    {
      "id": 603,
      "name": "Brightness Pulse (Same Hue)",
      "code": "// Apply to Color\nvar hsl = rgbToHsl(value);\nvar amount = Math.max(0, Math.min(100, effect(\"Wrangle 603 - Amount\")(1))) / 100;\nvar light = hsl[2] + Math.sin((time - inPoint) * effect(\"Wrangle 603 - Frequency\")(1) * Math.PI * 2) * amount;\nhslToRgb([hsl[0], hsl[1], Math.max(0, Math.min(1, light)), value[3]]);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 603 - Amount",
          "label": "Amount",
          "matchName": "ADBE Slider Control",
          "value": 25
        },
        {
          "name": "Wrangle 603 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        }
      ],
      "description": "Pulses lightness while preserving the original hue, saturation, and alpha."
    }
  ],
  "Custom": []
};

// Shipped v1.5 stock for recognizing rollback and repairs.
const libraryV14 = {
  "Text": [
    {
      "id": 104,
      "name": "Digital Clock",
      "code": "// Apply to Source Text\nvar t = Math.max(0, Math.floor(time - inPoint + effect(\"Wrangle 104 - Offset Seconds\")(1)));\nfunction two(n) { return n < 10 ? '0' + n : '' + n; }\ntwo(Math.floor(t / 3600)) + ':' + two(Math.floor(t / 60) % 60) + ':' + two(t % 60);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "text",
      "controllers": [
        {
          "name": "Wrangle 104 - Offset Seconds",
          "label": "Offset Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Elapsed HH:MM:SS from the layer in-point."
    },
    {
      "id": 105,
      "name": "Number Counter",
      "code": "// Apply to Source Text\nvar digits = Math.max(0, Math.min(6, Math.round(effect(\"Wrangle 105 - Decimals\")(1))));\nvar parts = Number(effect(\"Wrangle 105 - Value\")(1)).toFixed(digits).split('.');\nparts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');\nparts.join('.');\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "text",
      "controllers": [
        {
          "name": "Wrangle 105 - Value",
          "label": "Value",
          "matchName": "ADBE Slider Control",
          "value": 1000
        },
        {
          "name": "Wrangle 105 - Decimals",
          "label": "Decimals",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Animate the Value slider to count. Decimals ranges from 0 to 6."
    },
    {
      "id": 107,
      "name": "Typewriter",
      "target": "text",
      "code": "// Apply to Source Text\n// Apply to Source Text. Starts at the layer in-point plus Delay Seconds.\nvar original = String(value);\nvar elapsed = time - inPoint - effect(\"Wrangle 107 - Delay Seconds\")(1);\nvar speed = Math.max(0, effect(\"Wrangle 107 - Speed\")(1));\n// Keep surrogate pairs together (for example emoji).\nvar chars = original.match(/[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\s\\S]/g) || [];\nvar n = Math.max(0, Math.min(chars.length, Math.floor(elapsed * speed)));\nvar show = effect(\"Wrangle 107 - Show Cursor\")(1) > 0;\nvar blink = Math.max(0, effect(\"Wrangle 107 - Blink Speed\")(1));\nvar visible = elapsed >= 0 && (blink === 0 || Math.floor(elapsed * blink * 2) % 2 === 0);\nvar cursor = effect(\"Wrangle 107 - Cursor Style\")(1) < 2 ? '|' : '_';\nchars.slice(0, n).join('') + (show && visible ? cursor : '');\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 107 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 12
        },
        {
          "name": "Wrangle 107 - Delay Seconds",
          "label": "Delay Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        },
        {
          "name": "Wrangle 107 - Show Cursor",
          "label": "Show Cursor",
          "matchName": "ADBE Checkbox Control",
          "value": 1
        },
        {
          "name": "Wrangle 107 - Cursor Style",
          "label": "Cursor Style",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "|",
            "_"
          ]
        },
        {
          "name": "Wrangle 107 - Blink Speed",
          "label": "Blink Speed",
          "matchName": "ADBE Slider Control",
          "value": 2
        }
      ],
      "description": "Reveals characters per second. Toggle Show Cursor; choose | or _. Blink Speed is cycles/second (0 stays visible). Uses the layer’s base text styling."
    }
  ],
  "Time": [
    {
      "id": 201,
      "name": "Loop Out",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 201 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 201 - Keyframe Count\")(1));\nspan = Math.min(Math.floor(span), Math.max(0, numKeys - 1));\n// 0 uses all keyframes; otherwise counts keyframe intervals.\nnumKeys >= 2 ? loopOut(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 201 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 201 - Keyframe Count",
          "label": "Keyframe Count",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopOut: Cycle, Ping-pong, Offset, or Continue. Keyframe Count is intervals; 0 uses all keys. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 203,
      "name": "Posterize Time",
      "code": "// Apply to Numeric properties\nposterizeTime(Math.max(0.01, effect(\"Wrangle 203 - Frame Rate\")(1)));\nvalue;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 203 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        }
      ],
      "description": "Samples existing animation at the chosen frames per second."
    },
    {
      "id": 207,
      "name": "Loop In",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 207 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 207 - Keyframe Count\")(1));\nspan = Math.min(Math.floor(span), Math.max(0, numKeys - 1));\n// 0 uses all keyframes; otherwise counts keyframe intervals.\nnumKeys >= 2 ? loopIn(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 207 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 207 - Keyframe Count",
          "label": "Keyframe Count",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopIn: Cycle, Ping-pong, Offset, or Continue. Keyframe Count is intervals; 0 uses all keys. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 208,
      "name": "Loop Out Duration",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 208 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 208 - Duration Seconds\")(1));\n// 0 uses the default duration relative to the layer in/out point.\nnumKeys >= 2 ? loopOutDuration(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 208 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 208 - Duration Seconds",
          "label": "Duration Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopOutDuration: Cycle, Ping-pong, Offset, or Continue. Duration is seconds; 0 uses the AE default. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 209,
      "name": "Loop In Duration",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to numeric properties with at least two keyframes.\nvar modes = ['cycle', 'pingpong', 'offset', 'continue'];\nvar mode = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 209 - Loop Type\")(1))));\nvar span = Math.max(0, effect(\"Wrangle 209 - Duration Seconds\")(1));\n// 0 uses the default duration relative to the layer in/out point.\nnumKeys >= 2 ? loopInDuration(modes[mode - 1], span) : value;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 209 - Loop Type",
          "label": "Loop Type",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "Cycle",
            "Ping-pong",
            "Offset",
            "Continue"
          ]
        },
        {
          "name": "Wrangle 209 - Duration Seconds",
          "label": "Duration Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "loopInDuration: Cycle, Ping-pong, Offset, or Continue. Duration is seconds; 0 uses the AE default. Continue ignores the span.",
      "requiresKeys": 2
    },
    {
      "id": 210,
      "name": "Auto Fade In / Out",
      "target": "opacity",
      "code": "// Apply to Opacity\n// Apply to Opacity. Fade durations are in seconds from layer in/out points.\nvar fi = Math.max(0, effect(\"Wrangle 210 - Fade In Seconds\")(1));\nvar fo = Math.max(0, effect(\"Wrangle 210 - Fade Out Seconds\")(1));\nvar start = fi === 0 ? (time >= inPoint ? 1 : 0) : Math.max(0, Math.min(1, (time - inPoint) / fi));\nvar end = fo === 0 ? (time < outPoint ? 1 : 0) : Math.max(0, Math.min(1, (outPoint - time) / fo));\nvalue * Math.min(start, end);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 210 - Fade In Seconds",
          "label": "Fade In Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        },
        {
          "name": "Wrangle 210 - Fade Out Seconds",
          "label": "Fade Out Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        }
      ],
      "description": "Fades the existing opacity at layer edges. Zero disables that fade; overlapping fades stay bounded."
    },
    {
      "id": 211,
      "name": "Random Reveal",
      "target": "opacity",
      "code": "// Apply to Opacity\n// Opacity. Animate Progress from 0 to 100 across selected/duplicated layers.\nseedRandom(Math.round(effect(\"Wrangle 211 - Seed\")(1)), true);\nvar threshold = random(0, 100);\nvar progress = Math.max(0, Math.min(100, effect(\"Wrangle 211 - Progress\")(1)));\nprogress >= 100 || (progress > 0 && progress >= threshold) ? value : 0;\n// Adapted for Wrangle: controllers and safeguards.\n// Source: https://docs.nosleepcreative.com/after-effects/expressions\n//Expressions by Desmon Du/NoSleepCreative",
      "controllers": [
        {
          "name": "Wrangle 211 - Progress",
          "label": "Progress",
          "matchName": "ADBE Slider Control",
          "value": 50
        },
        {
          "name": "Wrangle 211 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Animate Progress 0–100 for a stable randomized reveal. Preserves the original opacity; 0 hides all, 100 reveals all."
    },
    {
      "id": 212,
      "name": "Random Fade In",
      "target": "opacity",
      "code": "// Apply to Opacity\n// Opacity. Delay is randomized per layer from its in-point.\nseedRandom(Math.round(effect(\"Wrangle 212 - Seed\")(1)), true);\nvar delay = random(0, Math.max(0, effect(\"Wrangle 212 - Maximum Delay\")(1)));\nvar duration = Math.max(0, effect(\"Wrangle 212 - Fade Seconds\")(1));\nvar elapsed = time - inPoint - delay;\nvar fade = duration === 0 ? (elapsed >= 0 ? 1 : 0) : Math.max(0, Math.min(1, elapsed / duration));\nvalue * fade;\n// Adapted for Wrangle: controllers and safeguards.\n// Source: https://docs.nosleepcreative.com/after-effects/expressions\n//Expressions by Desmon Du/NoSleepCreative",
      "controllers": [
        {
          "name": "Wrangle 212 - Maximum Delay",
          "label": "Maximum Delay",
          "matchName": "ADBE Slider Control",
          "value": 1
        },
        {
          "name": "Wrangle 212 - Fade Seconds",
          "label": "Fade Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        },
        {
          "name": "Wrangle 212 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Randomly staggers fade-ins without naming or linking layers. Delays and duration are seconds; animate Seed only if you want changing timing."
    },
    {
      "id": 213,
      "name": "Opacity Wave",
      "target": "opacity",
      "code": "// Apply to Opacity\n// Opacity. Frequency is cycles/second; phases are degrees.\nvar phase = effect(\"Wrangle 213 - Phase\")(1) + (index - 1) * effect(\"Wrangle 213 - Layer Phase\")(1);\nvar wave = (1 + Math.sin((time - inPoint) * effect(\"Wrangle 213 - Frequency\")(1) * Math.PI * 2 + phase * Math.PI / 180)) / 2;\nvar low = Math.max(0, Math.min(100, effect(\"Wrangle 213 - Minimum\")(1)));\nvar high = Math.max(0, Math.min(100, effect(\"Wrangle 213 - Maximum\")(1)));\nvar lo = Math.min(low, high), hi = Math.max(low, high);\nvalue * (lo + (hi - lo) * wave) / 100;\n// Adapted for Wrangle: controllers and safeguards.\n// Source: https://docs.nosleepcreative.com/after-effects/expressions\n//Expressions by Desmon Du/NoSleepCreative",
      "controllers": [
        {
          "name": "Wrangle 213 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 1
        },
        {
          "name": "Wrangle 213 - Minimum",
          "label": "Minimum",
          "matchName": "ADBE Slider Control",
          "value": 0
        },
        {
          "name": "Wrangle 213 - Maximum",
          "label": "Maximum",
          "matchName": "ADBE Slider Control",
          "value": 100
        },
        {
          "name": "Wrangle 213 - Phase",
          "label": "Phase",
          "matchName": "ADBE Angle Control",
          "value": 0
        },
        {
          "name": "Wrangle 213 - Layer Phase",
          "label": "Layer Phase",
          "matchName": "ADBE Angle Control",
          "value": 30
        }
      ],
      "description": "Smooth opacity pulses. Layer Phase offsets duplicated layers; limits are percentages of the existing opacity. Reordering layers changes their phase."
    }
  ],
  "Wiggle": [
    {
      "id": 301,
      "name": "Choppy Stop Motion",
      "code": "// Apply to Numeric properties\nposterizeTime(Math.max(0.01, effect(\"Wrangle 301 - Frame Rate\")(1)));\nwiggle(Math.max(0, effect(\"Wrangle 301 - Frequency\")(1)), Math.max(0, effect(\"Wrangle 301 - Amplitude\")(1)));\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 301 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        },
        {
          "name": "Wrangle 301 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 301 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Stepped random motion. Amplitude uses the selected property’s units."
    },
    {
      "id": 302,
      "name": "Random Flicker Opacity",
      "code": "// Apply to Opacity\nposterizeTime(Math.max(0.01, effect(\"Wrangle 302 - Frame Rate\")(1)));\nrandom(0, 100);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "opacity",
      "controllers": [
        {
          "name": "Wrangle 302 - Frame Rate",
          "label": "Frame Rate",
          "matchName": "ADBE Slider Control",
          "value": 12
        }
      ],
      "description": "Randomizes opacity from 0 to 100 at the chosen frame rate."
    },
    {
      "id": 304,
      "name": "Wiggle Loop",
      "code": "// Apply to Numeric properties\nvar frequency = Math.max(0, effect(\"Wrangle 304 - Frequency\")(1));\nvar amplitude = Math.max(0, effect(\"Wrangle 304 - Amplitude\")(1));\nvar duration = Math.max(thisComp.frameDuration, effect(\"Wrangle 304 - Duration\")(1));\nvar t = ((time - inPoint) % duration + duration) % duration;\nvar a = wiggle(frequency, amplitude, 1, 0.5, t);\nvar b = wiggle(frequency, amplitude, 1, 0.5, t - duration);\nlinear(t, 0, duration, a, b);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "numeric",
      "controllers": [
        {
          "name": "Wrangle 304 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 1
        },
        {
          "name": "Wrangle 304 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 25
        },
        {
          "name": "Wrangle 304 - Duration",
          "label": "Duration",
          "matchName": "ADBE Slider Control",
          "value": 3
        }
      ],
      "description": "Seamless random motion for a static base value. Duration is in seconds; animate the base separately if a seamless loop is not required."
    },
    {
      "id": 305,
      "name": "Wiggle X-Axis Only",
      "target": "position",
      "code": "// Apply to Position (2D / 3D)\n// Use unseparated layer Position. Preserves the other axes.\nvar f = Math.max(0, effect(\"Wrangle 305 - Frequency\")(1));\nvar a = Math.max(0, effect(\"Wrangle 305 - Amplitude\")(1));\nvar w = wiggle(f, a);\nvar p = value.slice(0);\np[0] = w[0];\np;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 305 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 305 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Wiggles only X; preserves the other coordinates, including Z."
    },
    {
      "id": 306,
      "name": "Wiggle Y-Axis Only",
      "target": "position",
      "code": "// Apply to Position (2D / 3D)\n// Use unseparated layer Position. Preserves the other axes.\nvar f = Math.max(0, effect(\"Wrangle 306 - Frequency\")(1));\nvar a = Math.max(0, effect(\"Wrangle 306 - Amplitude\")(1));\nvar w = wiggle(f, a);\nvar p = value.slice(0);\np[1] = w[1];\np;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 306 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 306 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Wiggles only Y; preserves the other coordinates, including Z."
    },
    {
      "id": 307,
      "name": "Basic Wiggle",
      "target": "numeric",
      "code": "// Apply to Numeric properties\nwiggle(Math.max(0, effect(\"Wrangle 307 - Frequency\")(1)), Math.max(0, effect(\"Wrangle 307 - Amplitude\")(1)));\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 307 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 2
        },
        {
          "name": "Wrangle 307 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 20
        }
      ],
      "description": "Random motion; amplitude uses the selected property’s units."
    }
  ],
  "Transform": [
    {
      "id": 402,
      "name": "Random Layer Scale",
      "code": "// Apply to Scale\nvar lo = Math.min(effect(\"Wrangle 402 - Minimum\")(1), effect(\"Wrangle 402 - Maximum\")(1));\nvar hi = Math.max(effect(\"Wrangle 402 - Minimum\")(1), effect(\"Wrangle 402 - Maximum\")(1));\nseedRandom(index + Math.round(effect(\"Wrangle 402 - Seed\")(1)), true);\nvar s = random(lo, hi);\nvalue.length === 3 ? [s, s, s] : [s, s];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "scale",
      "controllers": [
        {
          "name": "Wrangle 402 - Minimum",
          "label": "Minimum",
          "matchName": "ADBE Slider Control",
          "value": 50
        },
        {
          "name": "Wrangle 402 - Maximum",
          "label": "Maximum",
          "matchName": "ADBE Slider Control",
          "value": 150
        },
        {
          "name": "Wrangle 402 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "One stable, uniform scale per layer. Minimum and Maximum are percentages."
    },
    {
      "id": 403,
      "name": "Maintain Stroke Width",
      "code": "// Apply to Shape Stroke Width\nvar x = length(thisLayer.toCompVec([1, 0, 0]));\nvar y = length(thisLayer.toCompVec([0, 1, 0]));\nvar scaleFactor = Math.max((x + y) / 2, 0.001);\nvalue * Math.max(0, effect(\"Wrangle 403 - Width Multiplier\")(1)) / scaleFactor;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "stroke",
      "controllers": [
        {
          "name": "Wrangle 403 - Width Multiplier",
          "label": "Width Multiplier",
          "matchName": "ADBE Slider Control",
          "value": 1
        }
      ],
      "description": "Compensates for layer/parent scale. For predictable results use uniform scale and unscaled shape groups; nonuniform/perspective scaling is approximate."
    },
    {
      "id": 404,
      "name": "Procedural Sine Path",
      "code": "// Apply to Shape Path\nvar amplitude = effect(\"Wrangle 404 - Amplitude\")(1);\nvar wavelength = Math.max(0.001, Math.abs(effect(\"Wrangle 404 - Wavelength\")(1)));\nvar total = Math.max(0.001, Math.abs(effect(\"Wrangle 404 - Length\")(1)));\nvar phase = effect(\"Wrangle 404 - Phase Degrees\")(1) * Math.PI / 180;\nvar pts = [];\nfor (var i = 0; i < 200; i++) {\n var x = i / 199 * total;\n pts.push([x - total / 2, amplitude * Math.sin(x / wavelength * Math.PI * 2 + phase)]);\n}\ncreatePath(pts, [], [], false);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "path",
      "controllers": [
        {
          "name": "Wrangle 404 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 40
        },
        {
          "name": "Wrangle 404 - Wavelength",
          "label": "Wavelength",
          "matchName": "ADBE Slider Control",
          "value": 200
        },
        {
          "name": "Wrangle 404 - Length",
          "label": "Length",
          "matchName": "ADBE Slider Control",
          "value": 600
        },
        {
          "name": "Wrangle 404 - Phase Degrees",
          "label": "Phase Degrees",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Creates an open sine path. Animate Phase Degrees to move the wave."
    },
    {
      "id": 406,
      "name": "Circular Orbit",
      "code": "// Apply to Position (2D / 3D)\nvar a = (time - inPoint) * effect(\"Wrangle 406 - Speed\")(1) * Math.PI * 2;\nvar radius = effect(\"Wrangle 406 - Radius\")(1);\nvar x = value[0] + Math.cos(a) * radius;\nvar y = value[1] + Math.sin(a) * radius;\nvalue.length === 3 ? [x, y, value[2]] : [x, y];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "position",
      "controllers": [
        {
          "name": "Wrangle 406 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 0.25
        },
        {
          "name": "Wrangle 406 - Radius",
          "label": "Radius",
          "matchName": "ADBE Slider Control",
          "value": 100
        }
      ],
      "description": "Orbits the original position in its parent space. Speed is revolutions per second; Z is preserved."
    },
    {
      "id": 407,
      "name": "Auto Center Anchor Point",
      "target": "anchor",
      "code": "// Apply to Anchor Point\n// Text or shape layer Transform > Anchor Point, not a shape group's anchor.\nvar r = sourceRectAtTime(time, false);\nvar offset = effect(\"Wrangle 407 - Offset\")(1);\nvar x = r.left + r.width / 2 + offset[0];\nvar y = r.top + r.height / 2 + offset[1];\nvalue.length === 3 ? [x, y, value[2]] : [x, y];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 407 - Offset",
          "label": "Offset",
          "matchName": "ADBE Point Control",
          "value": [
            0,
            0
          ]
        }
      ],
      "description": "Centers the layer anchor on current text/shape bounds. Offset is in layer pixels. Changing the anchor can move the artwork; Position is not compensated.",
      "targetSpec": {
        "matchNames": [
          "ADBE Anchor Point"
        ],
        "boundsLayer": true
      }
    },
    {
      "id": 408,
      "name": "Counter Rotation",
      "target": "rotation",
      "code": "// Apply to Rotation\n// Apply to 2D layer Rotation. Use a chain of 2D parents.\nvar total = effect(\"Wrangle 408 - Angle Offset\")(1);\nvar current = thisLayer;\nwhile (current.hasParent) {\n current = current.parent;\n total += current.transform.rotation;\n}\nvalue - total;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 408 - Angle Offset",
          "label": "Angle Offset",
          "matchName": "ADBE Angle Control",
          "value": 0
        }
      ],
      "description": "Cancels rotation from every 2D parent. Angle Offset is subtracted from the original rotation.",
      "targetSpec": {
        "matchNames": [
          "ADBE Rotate Z"
        ],
        "twoDChain": true
      }
    },
    {
      "id": 409,
      "name": "Inertial Bounce",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Apply to keyframed numeric properties (Position, Scale, Rotation, etc.).\nvar amp = Math.max(0, effect(\"Wrangle 409 - Amplitude\")(1));\nvar freq = Math.max(0, effect(\"Wrangle 409 - Frequency\")(1));\nvar decay = Math.max(0.01, effect(\"Wrangle 409 - Decay\")(1));\nvar n = 0;\nif (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) n--; }\nvar result = value;\nif (n > 0) {\n var t = time - key(n).time;\n var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n var factor = amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n if (value instanceof Array) {\n  result = []; for (var i = 0; i < value.length; i++) result.push(value[i] + v[i] * factor);\n } else result = value + v * factor;\n}\nresult;\n// Wrangle by Jose \"Hazrd\" Lopez",
      "controllers": [
        {
          "name": "Wrangle 409 - Amplitude",
          "label": "Amplitude",
          "matchName": "ADBE Slider Control",
          "value": 0.05
        },
        {
          "name": "Wrangle 409 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 3
        },
        {
          "name": "Wrangle 409 - Decay",
          "label": "Decay",
          "matchName": "ADBE Slider Control",
          "value": 5
        }
      ],
      "description": "Adds a decaying overshoot using incoming keyframe velocity. Hold keys or zero incoming velocity produce no bounce.",
      "requiresKeys": 2
    },
    {
      "id": 410,
      "name": "Constant Drift",
      "target": "numeric",
      "code": "// Apply to Numeric properties\n// Numeric properties: units per second, relative to the layer in-point.\n// Axis affects vector properties only. A missing Z axis leaves 2D values unchanged.\nvar speed = effect(\"Wrangle 410 - Speed\")(1);\nvar elapsed = time - inPoint - effect(\"Wrangle 410 - Delay Seconds\")(1);\nif (effect(\"Wrangle 410 - Hold Before Start\")(1) > 0) elapsed = Math.max(0, elapsed);\nvar offset = speed * elapsed;\nvar axis = Math.max(1, Math.min(4, Math.round(effect(\"Wrangle 410 - Axis\")(1))));\nvar result = value;\nif (typeof value === 'number') result += offset;\nelse { result = value.slice(0); for (var d = 0; d < result.length; d++) if (axis === 1 || d === axis - 2) result[d] += offset; }\nresult;\n// Adapted for Wrangle: controllers and safeguards.\n// Source: https://docs.nosleepcreative.com/after-effects/expressions\n//Expressions by Desmon Du/NoSleepCreative",
      "controllers": [
        {
          "name": "Wrangle 410 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 50
        },
        {
          "name": "Wrangle 410 - Axis",
          "label": "Axis",
          "matchName": "ADBE Dropdown Control",
          "value": 1,
          "options": [
            "All",
            "X",
            "Y",
            "Z"
          ]
        },
        {
          "name": "Wrangle 410 - Delay Seconds",
          "label": "Delay Seconds",
          "matchName": "ADBE Slider Control",
          "value": 0
        },
        {
          "name": "Wrangle 410 - Hold Before Start",
          "label": "Hold Before Start",
          "matchName": "ADBE Checkbox Control",
          "value": 1
        }
      ],
      "description": "Continuous drift from the layer in-point. Speed uses property units/second; choose an axis for vectors."
    },
    {
      "id": 411,
      "name": "Random Position",
      "target": "position",
      "code": "// Apply to Position (2D / 3D)\n// Layer Position, unseparated. Adds stable offsets in parent space.\nvar spread = [Math.abs(effect(\"Wrangle 411 - X Spread\")(1)), Math.abs(effect(\"Wrangle 411 - Y Spread\")(1)), Math.abs(effect(\"Wrangle 411 - Z Spread\")(1))];\nseedRandom(Math.round(effect(\"Wrangle 411 - Seed\")(1)), true);\nvar result = value.slice(0);\nfor (var d = 0; d < result.length; d++) result[d] += random(-spread[d], spread[d]);\nresult;\n// Adapted for Wrangle: controllers and safeguards.\n// Source: https://docs.nosleepcreative.com/after-effects/expressions\n//Expressions by Desmon Du/NoSleepCreative",
      "controllers": [
        {
          "name": "Wrangle 411 - X Spread",
          "label": "X Spread",
          "matchName": "ADBE Slider Control",
          "value": 200
        },
        {
          "name": "Wrangle 411 - Y Spread",
          "label": "Y Spread",
          "matchName": "ADBE Slider Control",
          "value": 200
        },
        {
          "name": "Wrangle 411 - Z Spread",
          "label": "Z Spread",
          "matchName": "ADBE Slider Control",
          "value": 0
        },
        {
          "name": "Wrangle 411 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Stable random offsets around each layer’s original Position. Spread is pixels per axis; Z applies only to 3D layers. AE seeds each layer independently."
    },
    {
      "id": 412,
      "name": "Maintain Scale When Parented",
      "target": "scale",
      "code": "// Apply to Scale\n// Layer Transform > Scale; compensates the immediate parent's scale.\n// Best with aligned axes or uniform parent scale. Does not remove shear or ancestor scaling.\n// Near-zero parent axes cannot be inverted: those axes keep their base scale.\nvar amount = Math.max(0, effect(\"Wrangle 412 - Scale Multiplier\")(1));\nvar result = value.slice(0);\nfor (var d = 0; d < result.length; d++) {\n var inherited = 100;\n if (hasParent && effect(\"Wrangle 412 - Compensate Parent\")(1) > 0) {\n  var parentAxes = parent.transform.scale.value;\n  if (d < parentAxes.length && Math.abs(parentAxes[d]) >= 0.01) inherited = parentAxes[d];\n }\n result[d] = value[d] * amount * 100 / inherited;\n}\nresult;\n// Adapted for Wrangle: controllers and safeguards.\n// Source: https://docs.nosleepcreative.com/after-effects/expressions\n//Expressions by Desmon Du/NoSleepCreative",
      "controllers": [
        {
          "name": "Wrangle 412 - Compensate Parent",
          "label": "Compensate Parent",
          "matchName": "ADBE Checkbox Control",
          "value": 1
        },
        {
          "name": "Wrangle 412 - Scale Multiplier",
          "label": "Scale Multiplier",
          "matchName": "ADBE Slider Control",
          "value": 1
        }
      ],
      "description": "Compensates immediate parent scale; use uniform scaling or aligned axes. Handles unparented layers and zero scale safely. Does not remove shear or ancestor scaling.",
      "targetSpec": {
        "matchNames": [
          "ADBE Scale"
        ]
      }
    },
    {
      "id": 413,
      "name": "Auto-Orient Along Path",
      "target": "rotation",
      "code": "// Apply to Rotation\n// Apply to 2D layer Rotation with animated, unseparated Position.\n// Disable AE's built-in Auto-Orient. Angle Offset 0 points the artwork's +X axis along motion.\nvar p = transform.position;\nvar window = Math.max(0.01, Math.min(120, effect(\"Wrangle 413 - Smoothing Frames\")(1))) * thisComp.frameDuration;\nvar sampleTime = time;\nif (p.numKeys >= 2) sampleTime = Math.max(p.key(1).time, Math.min(p.key(p.numKeys).time, sampleTime));\nvar before = p.valueAtTime(sampleTime - window);\nvar after = p.valueAtTime(sampleTime + window);\nvar dx = after[0] - before[0], dy = after[1] - before[1];\nvar result = value + effect(\"Wrangle 413 - Angle Offset\")(1);\nif (dx * dx + dy * dy > 0.00000001) result += Math.atan2(dy, dx) * 180 / Math.PI;\nresult;\n// Adapted for Wrangle: controllers and safeguards.\n// Source: https://videolancer.net/expressions/\n//Expressions by Videolancer",
      "controllers": [
        {
          "name": "Wrangle 413 - Smoothing Frames",
          "label": "Smoothing Frames",
          "matchName": "ADBE Slider Control",
          "value": 3
        },
        {
          "name": "Wrangle 413 - Angle Offset",
          "label": "Angle Offset",
          "matchName": "ADBE Angle Control",
          "value": 0
        }
      ],
      "description": "Follows Position motion with adjustable smoothing and angle offset. 2D only; turn off built-in Auto-Orient. Stationary segments use the original Rotation plus offset.",
      "targetSpec": {
        "matchNames": [
          "ADBE Rotate Z"
        ],
        "twoDChain": true,
        "motionPosition": true
      }
    }
  ],
  "Utility": [],
  "Color": [
    {
      "id": 601,
      "name": "Rainbow Cycle",
      "code": "// Apply to Color\nvar h = ((time - inPoint) * effect(\"Wrangle 601 - Speed\")(1) % 1 + 1) % 1;\nhslToRgb([h, 1, 0.5, value[3]]);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 601 - Speed",
          "label": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 0.2
        }
      ],
      "description": "Cycles hue while preserving the original alpha. Negative Speed reverses direction."
    },
    {
      "id": 602,
      "name": "Random Color Per Second",
      "code": "// Apply to Color\nvar rate = Math.max(0, effect(\"Wrangle 602 - Changes Per Second\")(1));\nseedRandom(Math.floor((time - inPoint) * rate) + Math.round(effect(\"Wrangle 602 - Seed\")(1)), true);\n[random(), random(), random(), value[3]];\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 602 - Changes Per Second",
          "label": "Changes Per Second",
          "matchName": "ADBE Slider Control",
          "value": 1
        },
        {
          "name": "Wrangle 602 - Seed",
          "label": "Seed",
          "matchName": "ADBE Slider Control",
          "value": 0
        }
      ],
      "description": "Random color at Changes Per Second (default 1). Zero freezes the color; Seed changes the sequence. Preserves alpha."
    },
    {
      "id": 603,
      "name": "Brightness Pulse (Same Hue)",
      "code": "// Apply to Color\nvar hsl = rgbToHsl(value);\nvar amount = Math.max(0, Math.min(100, effect(\"Wrangle 603 - Amount\")(1))) / 100;\nvar light = hsl[2] + Math.sin((time - inPoint) * effect(\"Wrangle 603 - Frequency\")(1) * Math.PI * 2) * amount;\nhslToRgb([hsl[0], hsl[1], Math.max(0, Math.min(1, light)), value[3]]);\n// Wrangle by Jose \"Hazrd\" Lopez",
      "target": "color",
      "controllers": [
        {
          "name": "Wrangle 603 - Amount",
          "label": "Amount",
          "matchName": "ADBE Slider Control",
          "value": 25
        },
        {
          "name": "Wrangle 603 - Frequency",
          "label": "Frequency",
          "matchName": "ADBE Slider Control",
          "value": 0.5
        }
      ],
      "description": "Pulses lightness while preserving the original hue, saturation, and alpha."
    }
  ],
  "Custom": []
};
