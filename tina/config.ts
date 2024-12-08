import { defineConfig } from "tinacms";

// Using Cloudflare Pages environment variable
const branch = process.env.GITHUB_BRANCH || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,  // Changed from NEXT_PUBLIC_TINA_CLIENT_ID
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: ".",
    basePath: "",
  },
  media: {
    tina: {
      mediaRoot: "assets/images",
      publicFolder: ".",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return `${values?.title?.toLowerCase().replace(/ /g, '-')}` || ''
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "image",
            name: "image",
            label: "Featured Image",
            description: "The main image for your blog post",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ["eng"]
    }
  },
});
