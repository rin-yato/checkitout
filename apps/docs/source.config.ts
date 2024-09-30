import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import {
  fileGenerator,
  remarkDocGen,
  remarkInstall,
  typescriptGenerator,
} from "fumadocs-docgen";
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { transformerTwoslash } from "fumadocs-twoslash";

export const { docs, meta } = defineDocs();

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [remarkInstall, { persist: { id: "package-manager" } }],
      [remarkDocGen, { generators: [typescriptGenerator(), fileGenerator()] }],
    ],
    rehypeCodeOptions: {
      inline: "tailing-curly-colon",
      themes: {
        light: "catppuccin-latte",
        dark: "vesper",
      },
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerTwoslash()],
    },
  },
});
