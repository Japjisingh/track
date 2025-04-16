import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    googleAdsId,
    tagManagerId,
    fbPixel,
    pinterestPixel,
    tiktokPixel
  } = req.body;

  const templatePath = path.join(process.cwd(), 'public', 'base-container.json');
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

  const variables = [
    {
      name: "Google Ads Measurement ID",
      type: "constant",
      parameter: [{ key: "value", type: "template", value: googleAdsId }]
    },
    {
      name: "Tag Manager Container ID",
      type: "constant",
      parameter: [{ key: "value", type: "template", value: tagManagerId }]
    },
    {
      name: "Facebook Pixel",
      type: "constant",
      parameter: [{ key: "value", type: "template", value: fbPixel }]
    },
    {
      name: "Pinterest Pixel",
      type: "constant",
      parameter: [{ key: "value", type: "template", value: pinterestPixel }]
    },
    {
      name: "TikTok Pixel",
      type: "constant",
      parameter: [{ key: "value", type: "template", value: tiktokPixel }]
    }
  ];

  template.containerVersion.variable.push(...variables);

  const containerJSON = JSON.stringify(template, null, 2);
  res.setHeader('Content-Disposition', 'attachment; filename=\"GTM-Container.json\"');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(containerJSON);
}
