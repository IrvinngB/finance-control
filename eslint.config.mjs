import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Desactivar la verificación de tipos de retorno en las funciones
      "@typescript-eslint/explicit-module-boundary-types": "off",
      
      // Mantener como advertencia las variables no utilizadas
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Desactivar la regla de interfaces vacías
      "@typescript-eslint/no-empty-interface": "off",
      
      // Otras reglas que ya tenías
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;