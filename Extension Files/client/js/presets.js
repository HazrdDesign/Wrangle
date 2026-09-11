// Bundled presets. Keep IDs stable for nondestructive migrations.
const targetTypes = {
  "any": {
    "label": "Any expression property"
  },
  "numeric": {
    "label": "Numeric properties",
    "numeric": true
  },
  "text": {
    "label": "Source Text",
    "matchNames": [
      "ADBE Text Document"
    ]
  },
  "opacity": {
    "label": "Opacity",
    "matchNames": [
      "ADBE Opacity",
      "ADBE Vector Group Opacity",
      "ADBE Vector Fill Opacity",
      "ADBE Vector Stroke Opacity"
    ]
  },
  "scale": {
    "label": "Scale",
    "matchNames": [
      "ADBE Scale",
      "ADBE Vector Scale"
    ]
  },
  "position": {
    "label": "Position (2D / 3D)",
    "matchNames": [
      "ADBE Position"
    ],
    "unseparated": true
  },
  "color": {
    "label": "Color",
    "valueTypes": [
      "COLOR"
    ]
  },
  "path": {
    "label": "Shape Path",
    "matchNames": [
      "ADBE Vector Shape"
    ]
  },
  "stroke": {
    "label": "Shape Stroke Width",
    "matchNames": [
      "ADBE Vector Stroke Width"
    ]
  },
  "ramp": {
    "label": "Gradient Ramp Start / End · Text layer",
    "matchNames": [
      "ADBE Ramp-0001",
      "ADBE Ramp-0003"
    ],
    "textLayer": true
  }
};
const defaultLibrary = {
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
