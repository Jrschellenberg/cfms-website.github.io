const isDebug = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'qa';

let presets = [
  "@babel/preset-env"
];

if(isDebug) {
  presets = [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "69"
        }
      }
    ]
  ];
}

module.exports = {
  "presets": presets,
  "plugins": [
    [
      "@babel/plugin-proposal-object-rest-spread"
    ],
    ["@babel/plugin-proposal-class-properties"],
    [
      "@babel/transform-react-jsx",
      {
        "pragma": "h",
        "pragmaFrag": "\"span\""
      }
    ],
    [
      "module-resolver",
      {
        "root": [
          "."
        ],
        "alias": {
          "react": "preact-compat",
          "react-dom": "preact-compat",
          "create-react-class": "preact-compat/lib/create-react-class",
          "react-dom-factories": "preact-compat/lib/react-dom-factories"
        }
      }
    ],
    
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  
  ]
}