import { ApiHandler } from "sst/node/api";
import chromium from "@sparticuz/chromium";
import { Browser, default as puppeteerCore } from "puppeteer-core";

export const handler = ApiHandler(async (event) => {
  try {
    const urls = JSON.parse(event.body ?? "[]");
    if (!Array.isArray(urls) || urls.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Invalid request body" }),
      };
    }

    const browser = await getBrowser();

    const pdfs = await Promise.all(
      urls.map((url: string) => generatePdf(browser, url))
    );

    await browser.close();

    const firstPdf = pdfs[0];

    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-Type": "application/pdf",
      },
      body: firstPdf.toString("base64"),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(error),
    };
  }
});

async function generatePdf(browser: Browser, url: string) {
  const page = await browser.newPage();
  await page.goto(url);
  const pdf = await page.pdf({ format: "A4" });

  return pdf;
}

async function getBrowser(): Promise<Browser> {
  if (process.env.IS_LOCAL) {
    const puppeteer = await import("puppeteer");
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    }) as unknown as Promise<Browser>;
  }
  return puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}
