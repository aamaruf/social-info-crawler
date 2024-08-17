const puppeteer = require('puppeteer');

async function scrapeFacebookPost(url) {
    // Define your Chrome executable path and user data directory
    const chromePath = '/usr/bin/google-chrome'; // Update this path
    const userDataDir = '/home/aamaruf/.config/google-chrome'; // Update this path

    // Launch Puppeteer with the existing Chrome profile
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromePath,
        userDataDir: userDataDir
    });

    const page = await browser.newPage();

    // Navigate to the Facebook post URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the comments/reactions section to load
    await page.waitForSelector('div[data-testid="UFI2CommentsList/root_depth_0"]');

    // Extract the profile names and links
    const profiles = await page.evaluate(() => {
        const profileElements = document.querySelectorAll('a[aria-hidden="false"]');
        const profileData = [];

        profileElements.forEach(el => {
            const name = el.innerText;
            const link = el.href;
            if (name && link) {
                profileData.push({ name, link });
            }
        });

        return profileData;
    });

    // Log the scraped data
    console.log(profiles);

    // Close the browser
    await browser.close();
}

const facebookPostUrl = 'https://www.facebook.com/watch?v=464737113038365'; // Replace with your target URL
scrapeFacebookPost(facebookPostUrl);
