import { Client, isFullPage } from "@notionhq/client";

type Rando = {
  // Notion properties
  id: string;
  cover: string | undefined;
  title: string;
  dateStart: string | undefined;
  dateEnd: string | undefined;
  type: string | undefined;
  maps: string | undefined;
  photos: string | undefined;
  visorando: string | undefined;
  // Viso Rando properties
  description?: string;
  distance?: string;
  duration?: string;
  difficulty?: string;
  elevationUp?: string;
  elevationDown?: string;
  highPoint?: string;
  lowPoint?: string;
  coordinates?: string;
};

export default defineEventHandler(async (event) => {
  const { notionApiKey, notionDatabaseId } = useRuntimeConfig(event);

  const notion = new Client({
    auth: notionApiKey,
  });
  const response = await notion.databases.query({
    database_id: notionDatabaseId,
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  let randos: Rando[] = [];

  try {
    randos = await Promise.all(
      response.results
        .filter((page) => isFullPage(page))
        .map(async (page) => {
          let cover = undefined;
          if (page.cover?.type === "file") {
            cover = page.cover?.file?.url;
          } else if (page.cover?.type === "external") {
            cover = page.cover?.external?.url;
          }

          const p = page.properties;

          // @ts-expect-error todo:check how to handle types correctly from Notion
          const visoRandoUrl = p["Viso rando"].url || undefined;
          let randoData = null;

          if (visoRandoUrl) {
            randoData = await $fetch(`/api/rando?url=${visoRandoUrl}`);
          }

          return {
            id: page.id,
            ...randoData,
            cover,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            title: p.Nom.title[0]?.plain_text || "Untitled",
            // @ts-expect-error todo:check how to handle types correctly from Notion
            dateStart: p.Date.date.start || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            dateEnd: p.Date.date.end || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            type: p.Type.select?.name || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            maps: p.Maps.url || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            photos: p.Photos.url || undefined,
            visorando: visoRandoUrl,
          };
        }),
    );
  } catch (error) {
    console.error("Error processing Notion response:", error);
  }

  return {
    randos,
  };
});
