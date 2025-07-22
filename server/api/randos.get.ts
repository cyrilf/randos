import { Client, isFullPage } from "@notionhq/client";

type Rando = {
  id: string;
  cover: string | undefined;
  title: string;
  dateStart: string | undefined;
  dateEnd: string | undefined;
  type: string | undefined;
  distance: number | undefined;
  duree: number | undefined;
  difficulte: string | undefined;
  denivele: number | undefined;
  maps: string | undefined;
  photos: string | undefined;
  details: string | undefined;
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
    randos = response.results
      .filter((page) => isFullPage(page))
      .map((page) => {
        let cover = undefined;
        if (page.cover?.type === "file") {
          cover = page.cover?.file?.url;
        } else if (page.cover?.type === "external") {
          cover = page.cover?.external?.url;
        }

        const p = page.properties;

        return {
          id: page.id,
          cover,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          title: p.Nom.title[0]?.plain_text || "Untitled",
          // @ts-expect-error todo:check how to handle types correctly from Notion
          dateStart: p.Date.date.start || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          dateEnd: p.Date.date.end || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          type: p.Type.select.name || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          distance: p.Distance.number || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          duree: p["Durée moyenne"].number || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          difficulte: p.Difficulté.select.name || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          denivele: p.Dénivelé.number || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          maps: p["Google Maps"].url || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          photos: p["Google Photos"].url || undefined,
          // @ts-expect-error todo:check how to handle types correctly from Notion
          details: p["Viso rando"].url || undefined,
        };
      });
  } catch (error) {
    console.error("Error processing Notion response:", error);
  }

  return {
    randos,
  };
});
