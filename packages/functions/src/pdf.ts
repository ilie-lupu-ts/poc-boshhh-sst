import { ApiHandler } from "sst/node/api";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const handler = ApiHandler(async (event) => {
  try {
    const url = event.queryStringParameters?.url;
    if (!url) {
      return {
        statusCode: 400,
        body: "Missing 'url' query parameter",
      };
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const pdf = await page.pdf({ format: "A4" });

    const pages = await browser.pages();
    for (let i = 0; i < pages.length; i++) {
      await pages[i].close();
    }

    await browser.close();

    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type": "application/pdf",
      },
      body: pdf.toString("base64"),
    };
  } catch (error) {
    return {
      statusCode: 500,
      error,
    };
  }
});
