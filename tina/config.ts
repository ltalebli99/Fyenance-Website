import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "./",
  },
  media: {
    tina: {
      mediaRoot: "assets/images",
      publicFolder: "./",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "_content/pages",
        format: "json",
        fields: [
          {
            type: "string",
            name: "heroTitle",
            label: "Hero Title",
            required: true,
          },
          {
            type: "string",
            name: "heroSubtitle",
            label: "Hero Subtitle",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "ctaText",
            label: "CTA Text",
          },
          {
            type: "string",
            name: "price",
            label: "Price",
          },
        ],
      },
      {
        name: "feature",
        label: "Features",
        path: "_content/features",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "icon",
            label: "Icon Class",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
    ],
  },
});