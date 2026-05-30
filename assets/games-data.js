window.GAMES = [
  {
    "id": "10sec-stop",
    "title": "ピタッとストップ！10秒チャレンジ",
    "desc": "10.00秒にできるだけ近いところでストップするタイミングゲーム。",
    "tag": "タイミング",
    "type": "timerStop",
    "target": 10,
    "duration": 12
  },
  {
    "id": "sort-panic",
    "title": "サクサク仕分けパニック",
    "desc": "出てきたアイテムを食べものか道具にすばやく仕分けるゲーム。",
    "tag": "仕分け",
    "type": "sort",
    "duration": 30,
    "left": {
      "key": "food",
      "label": "食べもの"
    },
    "right": {
      "key": "tool",
      "label": "道具"
    },
    "items": [
      [
        "🍙",
        "おにぎり",
        "food"
      ],
      [
        "🍎",
        "りんご",
        "food"
      ],
      [
        "🍛",
        "カレー",
        "food"
      ],
      [
        "🍩",
        "ドーナツ",
        "food"
      ],
      [
        "🥤",
        "ジュース",
        "food"
      ],
      [
        "🔧",
        "レンチ",
        "tool"
      ],
      [
        "✂️",
        "ハサミ",
        "tool"
      ],
      [
        "🔦",
        "ライト",
        "tool"
      ],
      [
        "🪛",
        "ドライバー",
        "tool"
      ],
      [
        "🧹",
        "ほうき",
        "tool"
      ]
    ]
  },
  {
    "id": "red-tap",
    "title": "赤だけタップラッシュ",
    "desc": "たくさん並ぶ色の中から、赤いものだけをタップする反射ゲーム。",
    "tag": "反射",
    "type": "targetTap",
    "duration": 30,
    "target": "🔴",
    "targetLabel": "赤",
    "items": [
      "🔴",
      "🔵",
      "🟡",
      "🟢",
      "🟣",
      "⚫"
    ]
  },
  {
    "id": "number-order",
    "title": "数字ならべダッシュ",
    "desc": "バラバラに並んだ数字を1から順番にタップするスピードゲーム。",
    "tag": "順番",
    "type": "orderTap",
    "duration": 30,
    "count": 9
  },
  {
    "id": "green-light",
    "title": "青信号リアクション",
    "desc": "「GO!」が出た瞬間だけ押す、反応速度チャレンジ。",
    "tag": "反応速度",
    "type": "reaction",
    "rounds": 5
  },
  {
    "id": "light-memory",
    "title": "ひかり順番メモリー",
    "desc": "光った順番を覚えて、同じ順番で押す記憶ゲーム。",
    "tag": "記憶",
    "type": "memorySequence",
    "rounds": 6,
    "items": [
      "🔴",
      "🔵",
      "🟡",
      "🟢"
    ]
  },
  {
    "id": "gauge-stop",
    "title": "ゲージぴったり職人",
    "desc": "動くゲージを、中央のあたりゾーンで止めるゲーム。",
    "tag": "ゲージ",
    "type": "gaugeStop",
    "rounds": 8,
    "targetMin": 42,
    "targetMax": 58
  },
  {
    "id": "odd-one",
    "title": "ひとつだけ違うやつ",
    "desc": "同じものに紛れた、ひとつだけ違う絵文字を見つけるゲーム。",
    "tag": "発見",
    "type": "oddOne",
    "duration": 30
  },
  {
    "id": "math-dash",
    "title": "計算ダッシュ30",
    "desc": "30秒でかんたんな計算をどれだけ正解できるか挑戦。",
    "tag": "計算",
    "type": "mathChoice",
    "duration": 30
  },
  {
    "id": "big-number",
    "title": "大きい数字どっち？",
    "desc": "左右の数字を見て、大きい方をすばやく選ぶゲーム。",
    "tag": "比較",
    "type": "compare",
    "duration": 30,
    "mode": "bigger"
  },
  {
    "id": "click-sprint",
    "title": "連打スプリント",
    "desc": "10秒間でボタンを何回押せるかを競うシンプルな連打ゲーム。",
    "tag": "連打",
    "type": "clickRush",
    "duration": 10
  },
  {
    "id": "color-trap",
    "title": "色名トラップ",
    "desc": "文字の意味ではなく、文字の色を答えるひっかけゲーム。",
    "tag": "判断",
    "type": "wordColor",
    "duration": 30
  },
  {
    "id": "arrow-memory",
    "title": "矢印メモリー",
    "desc": "表示された矢印の順番を覚えて、同じ順番で入力するゲーム。",
    "tag": "記憶",
    "type": "memorySequence",
    "rounds": 6,
    "items": [
      "⬆️",
      "➡️",
      "⬇️",
      "⬅️"
    ]
  },
  {
    "id": "emoji-count",
    "title": "何個ある？カウント",
    "desc": "画面に出た目標アイテムの数をすばやく数えて答えるゲーム。",
    "tag": "観察",
    "type": "emojiCount",
    "duration": 30
  },
  {
    "id": "onigiri-catch",
    "title": "おにぎりだけ回収",
    "desc": "たくさんのアイテムから、おにぎりだけをタップして集めるゲーム。",
    "tag": "回収",
    "type": "targetTap",
    "duration": 30,
    "target": "🍙",
    "targetLabel": "おにぎり",
    "items": [
      "🍙",
      "🍎",
      "🍩",
      "🔧",
      "🧹",
      "🥤"
    ]
  },
  {
    "id": "safe-or-danger",
    "title": "セーフ？あぶない？仕分け",
    "desc": "出てきたものを、セーフかあぶないかに仕分ける判断ゲーム。",
    "tag": "仕分け",
    "type": "sort",
    "duration": 30,
    "left": {
      "key": "safe",
      "label": "セーフ"
    },
    "right": {
      "key": "danger",
      "label": "あぶない"
    },
    "items": [
      [
        "🧸",
        "ぬいぐるみ",
        "safe"
      ],
      [
        "📘",
        "ノート",
        "safe"
      ],
      [
        "🍞",
        "パン",
        "safe"
      ],
      [
        "🧢",
        "ぼうし",
        "safe"
      ],
      [
        "🎈",
        "風船",
        "safe"
      ],
      [
        "🍌",
        "バナナの皮",
        "danger"
      ],
      [
        "🔥",
        "火",
        "danger"
      ],
      [
        "⚡",
        "電気ビリビリ",
        "danger"
      ],
      [
        "🕳️",
        "穴",
        "danger"
      ],
      [
        "🧊",
        "すべる氷",
        "danger"
      ]
    ]
  },
  {
    "id": "power-charge",
    "title": "ぴったりパワー注入",
    "desc": "パワーを強すぎず弱すぎず、ちょうどよい範囲で止めるゲーム。",
    "tag": "ゲージ",
    "type": "gaugeStop",
    "rounds": 8,
    "targetMin": 62,
    "targetMax": 76
  },
  {
    "id": "five-sec-stop",
    "title": "5秒ぴったりミニ",
    "desc": "5.00秒にできるだけ近いところでストップする短時間チャレンジ。",
    "tag": "タイミング",
    "type": "timerStop",
    "target": 5,
    "duration": 7
  }
];