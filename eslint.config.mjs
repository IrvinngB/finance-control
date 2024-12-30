import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Configuración extendida de ESLint para Next.js
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Aquí puedes personalizar las reglas específicas
    rules: {
      // Deshabilitar la advertencia de 'no-unused-vars' (variables no utilizadas)
      "@typescript-eslint/no-unused-vars": ["warn"],  // Cambiar a "off" para deshabilitar o "warn" para advertencia

      // Permitir el uso de 'any', o puedes especificar un tipo diferente como 'unknown'
      "@typescript-eslint/no-explicit-any": "off",  // Cambiar a "warn" si prefieres advertencia en lugar de error

      // Resolver el problema de interfaces vacías (se puede mantener vacío si es necesario)
      "@typescript-eslint/no-empty-interface": "off",  // O usa "warn" si prefieres advertencia

      // Asegurarse de que todas las interfaces tengan al menos una propiedad
      "@typescript-eslint/explicit-module-boundary-types": "warn",  // Para las funciones públicas
    },
  },
];

export default eslintConfig;
