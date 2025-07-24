import { Client, isFullPage } from "@notionhq/client";
import { downloadImage } from "./utils/imageDownloader";

type Rando = {
  // Notion properties
  id: string;
  cover: string | undefined;
  title: string;
  dateStart: string | undefined;
  dateEnd: string | undefined;
  type: string | undefined;
  mapsLink: string | undefined;
  photosLink: string | undefined;
  visorandoLink: string | undefined;
  photos: string[] | undefined;
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
          const p = page.properties;

          let cover = undefined;
          if (page.cover?.type === "file") {
            cover = page.cover?.file?.url;
          } else if (page.cover?.type === "external") {
            cover = page.cover?.external?.url;
          }
          // @ts-expect-error todo:check how to handle types correctly from Notion
          const photos = (p.Photos?.files || []).map((f) => f?.file?.url).filter(Boolean);

          const localCover = cover ? await downloadImage(cover) : undefined;
          const localPhotos = await Promise.all(photos.map((url: string) => downloadImage(url)));

          // @ts-expect-error todo:check how to handle types correctly from Notion
          const visoRandoLink = p["VisoRandoLink"].url || undefined;
          const randoData = visoRandoLink ? await $fetch(`/api/rando?url=${visoRandoLink}`) : null;

          return {
            id: page.id,
            ...randoData,
            cover: localCover,
            photos: localPhotos.filter(Boolean),
            // @ts-expect-error todo:check how to handle types correctly from Notion
            title: p.Nom.title[0]?.plain_text || "Untitled",
            // @ts-expect-error todo:check how to handle types correctly from Notion
            dateStart: p.Date.date.start || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            dateEnd: p.Date.date.end || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            type: p.Type.select?.name || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            mapsLink: p.MapsLink.url || undefined,
            // @ts-expect-error todo:check how to handle types correctly from Notion
            photosLink: p.PhotosLink.url || undefined,
            visorandoLink: visoRandoLink,
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
