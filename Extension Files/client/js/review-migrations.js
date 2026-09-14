// Exact earlier snippets: upgrade only when code and controllers still match.
const reviewRepairs = [
  {
    "id": 5,
    "to": 407,
    "keepId": true,
    "original": {
      "id": 5,
      "name": "Auto Center Anchor Point",
      "code": "// Apply to Anchor Point (text or shape layers)\nr = sourceRectAtTime(time, false);\n[r.left + r.width/2, r.top + r.height/2];",
      "color": "#2ed573",
      "target": "anchor",
      "controllers": []
    }
  },
  {
    "id": 1776791506731,
    "to": 301,
    "keepId": true,
    "original": {
      "id": 1776791506731,
      "name": "Posterize+Wiggle(15,15,5)",
      "code": "posterizeTime(15);\nwiggle(15, 5);",
      "color": "#2997ff",
      "controllers": [],
      "target": "any"
    }
  },
  {
    "id": 6,
    "to": 107,
    "keepId": true,
    "original": {
      "id": 6,
      "name": "Typewriter",
      "code": "// Apply to Source Text\nn = Math.min(text.sourceText.length, Math.floor(time * effect(\"Speed\")(\"Slider\")));\ntext.sourceText.substr(0, n);",
      "controllers": [
        {
          "name": "Speed",
          "matchName": "ADBE Slider Control",
          "value": 10
        }
      ],
      "color": "#ff7f50",
      "target": "text"
    }
  }
];
const reviewStockVariants = [
  {
    "id": 107,
    "name": "Typewriter",
    "target": "text",
    "code": "// Apply to Source Text. Starts at the layer in-point plus Delay Seconds.\nvar original = String(value);\nvar elapsed = time - inPoint - effect(\"Wrangle 107 - Delay Seconds\")(1);\nvar speed = Math.max(0, effect(\"Wrangle 107 - Speed\")(1));\n// Keep surrogate pairs together (for example emoji).\nvar chars = original.match(/[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\s\\S]/g) || [];\nvar n = Math.max(0, Math.min(chars.length, Math.floor(elapsed * speed)));\nvar show = effect(\"Wrangle 107 - Show Cursor\")(1) > 0;\nvar blink = Math.max(0, effect(\"Wrangle 107 - Blink Speed\")(1));\nvar visible = elapsed >= 0 && (blink === 0 || Math.floor(elapsed * blink * 2) % 2 === 0);\nvar cursor = effect(\"Wrangle 107 - Cursor Style\")(1) < 2 ? '|' : '_';\nchars.slice(0, n).join('') + (show && visible ? cursor : '');\n// Wrangle by Jose \"Hazrd\" Lopez",
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
    ]
  }
];
