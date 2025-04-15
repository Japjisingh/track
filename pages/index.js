import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handlePaymentSuccess = async () => {
    const form = document.getElementById("trackingForm");
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());

    const res = await fetch("/api/generate-container", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
  };

  return (
    <>
      <Head>
        <title>Tracking Pixel Generator</title>
        <script
          src="https://www.paypal.com/sdk/js?client-id=YOUR_SANDBOX_CLIENT_ID"
          strategy="beforeInteractive"
        ></script>
      </Head>

      <main className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 min-h-screen flex items-center justify-center">
        <div className="max-w-3xl w-full p-6 bg-white rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Tracking Pixel Container Generator
          </h1>
          <form id="trackingForm" className="space-y-4">
            <input name="googleAdsId" placeholder="Google Ads Measurement ID" className="w-full border p-2 rounded" required />
            <input name="tagManagerId" placeholder="Google Tag Manager Container ID" className="w-full border p-2 rounded" required />
            <input name="fbPixel" placeholder="Facebook Pixel Code" className="w-full border p-2 rounded" required />
            <input name="pinterestPixel" placeholder="Pinterest Pixel Code" className="w-full border p-2 rounded" required />
            <input name="tiktokPixel" placeholder="TikTok Pixel Code" className="w-full border p-2 rounded" required />
            <div id="paypal-button-container" className="mt-4" />
          </form>

          {downloadUrl && (
            <div className="mt-4 text-center">
              <a
                href={downloadUrl}
                download="GTM-Container.json"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Download Container
              </a>
            </div>
          )}
        </div>
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            paypal.Buttons({
              createOrder: function(data, actions) {
                return actions.order.create({
                  purchase_units: [{ amount: { value: '199.00' } }]
                });
              },
              onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                  ${handlePaymentSuccess.toString()}
                  handlePaymentSuccess();
                });
              }
            }).render('#paypal-button-container');
          `,
        }}
      />
    </>
  );
}
