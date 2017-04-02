module.exports = {
    "globals": {
        "angular": true
    },
    "env": {
        "browser": true
    },
    "extends": "airbnb-base",
    "rules": {
        "indent": [ 1, 4, {"VariableDeclarator": 1} ],
        "vars-on-top": 0,
        "func-names": 0,
        "no-param-reassign": 1,
        "no-prototype-builtins": 0,
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "max-len": [1, 120],
        "space-before-function-paren": ["error", { "anonymous" : "never" }],
        "comma-dangle": ["error", "never"],
        "global-require": 0,
        "arrow-body-style": ["error", "as-needed", { requireReturnForObjectLiteral: true }],
        "import/no-extraneous-dependencies": 0,
        "import/imports-first": 0,
        "import/no-unresolved": 0,
        "import/extensions": 0
    }
};
