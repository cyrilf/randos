import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  if (!query.url) {
    throw createError({
      statusCode: 400,
      statusMessage: "URL parameter is required",
    });
  }

  try {
    const html = await $fetch(query.url as string);
    if (typeof html !== "string") {
      console.error("Error fetching viso page:");
      return { error: "Failed to fetch viso page" };
    }

    const $ = cheerio.load(html);

    const description = $(".innerContentVR  p:first").html() || undefined;

    function getSelector(selector: string) {
      return $(`.vr-walk-datasheet--dataset:contains(${selector})`).text().trim();
    }
    function extractValue(text: string, regex: RegExp) {
      const match = text.match(regex);
      return match ? match[0] : undefined;
    }

    const distanceText = getSelector("Distance");
    const distanceRegex = /(\d+,\d+)\s*([a-zA-Z]+)/;
    const distance = extractValue(distanceText, distanceRegex);

    const durationText = getSelector("Durée moyenne");
    const durationRegex = /(\d+h\s\d+)/;
    const duration = extractValue(durationText, durationRegex);

    const difficultyText = getSelector("Difficulté");
    const difficulty = difficultyText.split(":")[1].trim();

    const elevationUpText = getSelector("Dénivelé positif");
    const elevationUpRegex = /\+?\s*(\d+\s*\d*)\s*m/;
    const elevationUp = extractValue(elevationUpText, elevationUpRegex);

    const elevationDownText = getSelector("Dénivelé négatif");
    const elevationDownRegex = /-?\s*(\d+\s*\d*)\s*m/;
    const elevationDown = extractValue(elevationDownText, elevationDownRegex);

    const highPointText = getSelector("Point haut");
    const highPointRegex = /(\d+\s\d+\s[m])/;
    const highPoint = extractValue(highPointText, highPointRegex);

    const lowPointText = getSelector("Point bas");
    const lowPointRegex = /(\d+\s\d+\s[m])/;
    const lowPoint = extractValue(lowPointText, lowPointRegex);

    const coordinatesText = getSelector("Départ/Arrivée");
    const coordinates = coordinatesText.split(":")[1].trim();

    return {
      description,
      distance,
      duration,
      difficulty,
      elevationUp,
      elevationDown,
      highPoint,
      lowPoint,
      coordinates,
    };
  } catch (error) {
    console.error("Error extracting viso data:", error);
    return { error: "Failed to extract viso data" };
  }
});
