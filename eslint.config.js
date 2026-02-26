module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                module: "readonly",
                require: "readonly"
                // ... otras globales de Node si son necesarias
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off", // Permitir console.log en un bot básico
            "no-undef": "error",
            "prettier/prettier": "error",
        },
    }
];
