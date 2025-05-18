//youtube-mass-unsubscribe script by BergiTech
//Version 1 
// Last Tested 18.05.2025
//https://github.com/BergiTech

function waitForSelector(selector, timeout = 3000, interval = 100) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(timer);
        reject(new Error(`Timeout waiting for selector: ${selector}`));
      }
    }, interval);
  });
}

async function unsubscribeAll() {
  const intervalTime = 2000; // 2 seconds per unsubscribe, adjust if needed

  while (true) {
    const channels = document
      .getElementById("grid-container")
      ?.getElementsByClassName("ytd-expanded-shelf-contents-renderer");

    if (!channels || channels.length === 0) {
      console.log("No more channels found, done!");
      break;
    }

    const channel = channels[0];
    if (!channel) break;

    const subscribeButton = channel.querySelector(".ytd-subscribe-button-renderer");
    if (!subscribeButton) {
      console.log("Subscribe button not found, skipping channel.");
      break;
    }

    subscribeButton.click();

    try {
      // Wait up to 3 seconds for unsubscribe button popup
      const unsubscribeButton = await waitForSelector("[aria-label^='Unsubscribe from']", 3000);
      unsubscribeButton.click();

      // Wait for confirm button
      const confirmButton = await waitForSelector("#confirm-button yt-button-shape button", 3000);
      confirmButton.click();

      console.log("Unsubscribed 1 channel");
    } catch (err) {
      console.log("Failed to find unsubscribe or confirm button:", err.message);
      // Optionally, try to close any popup or continue to next channel
    }

    // Wait intervalTime before next unsubscribe to avoid throttling
    await new Promise(res => setTimeout(res, intervalTime));
  }
}

unsubscribeAll();

