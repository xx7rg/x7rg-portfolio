import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  /*
   * Originkit sources supplied by Rogério verbatim (NeonBorder, BlockTextReveal), preserved as
   * delivered. Both are fully linted against every other rule; only react-hooks/refs is off here,
   * scoped to these two files, not the whole project.
   *
   * The rule flags a "latest value" ref (e.g. `live.current = {...}` written directly in the
   * component body, read back later inside a rAF loop) so the loop always sees the current props
   * without a stale closure or an extra effect re-run. That's load-bearing for both components'
   * approved animation timing, not a mistake to fix — rewriting it risks changing NeonBorder's and
   * BlockTextReveal's approved runtime behavior, which is explicitly out of scope for a lint pass.
   * NeonBorder's other 8 violations (react-hooks/rules-of-hooks, from the internal helper's
   * generated name starting with "__" instead of an uppercase letter) were a naming issue, not a
   * behavior one, and were fixed directly (renamed to OriginkitNeonBorderBase) rather than excepted.
   */
  {
    files: ["src/components/effects/NeonBorder.tsx", "src/components/effects/BlockTextReveal.tsx"],
    rules: {
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
