import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "react-native/index": "src/react-native/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-native"],
});
