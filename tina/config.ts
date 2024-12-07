import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "./",
    basePath: "",
  },
  media: {
    tina: {
      mediaRoot: "assets/images",
      publicFolder: "./",
    },
  },
  search: {
    tina: {
      indexerToken: process.env.TINA_TOKEN,
      stopwordLanguages: ["eng"]
    }
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "_content/pages",
        format: "json",
        ui: {
          router: ({ document }) => `/${document._sys.filename}`,
        },
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
        ui: {
          filename: {
            readonly: true,
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
  cmsCallback: (cms) => {
    // Add any CMS customizations here
    return cms;
  },
});