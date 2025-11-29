/**
 * Weekly Restaurant BOH Voices Scraper
 *
 * This script runs Apify scrapers for Instagram, TikTok, and YouTube
 * to discover trending voices in restaurant labor management.
 *
 * Setup:
 * 1. npm install apify-client
 * 2. Set APIFY_TOKEN environment variable
 * 3. Run: node scripts/apify-weekly-scraper.js
 */

// Load environment variables from .env file
require('dotenv').config();

const { ApifyClient } = require('apify-client');
const fs = require('fs');
const path = require('path');

// Initialize Apify client
const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

// Configuration
const config = {
    instagram: {
        hashtags: [
            'restaurantmanagement',
            'restaurantoperations',
            'kitchenmanagement',
            'restaurantscheduling',
            'restaurantlabor',
            'bohlife',
            'restaurantowner',
            'linecook',
            'restaurantmanager',
            'hospitalitylife'
        ],
        resultsLimit: 50
    },
    tiktok: {
        hashtags: [
            'restaurantmanagement',
            'restaurantowner',
            'kitchenlife',
            'bohlife',
            'restaurantoperations',
            'restaurantboss',
            'cheflife',
            'linecook',
            'restaurantmanager',
            'hospitalitylife',
            'restaurantteam',
            'kitchenmanager',
            'restaurantstaff',
            'chefsoftiktok'
        ],
        resultsPerHashtag: 50  // Get 50 videos per hashtag
    },
    youtube: {
        // Add your tracked channels here
        channelUrls: [
            'https://www.youtube.com/@TheRestaurantBoss',
            'https://www.youtube.com/@WilsonKLee',
            'https://www.youtube.com/@GordonRamsay'
        ]
    }
};

// Get current date for folder naming
const today = new Date().toISOString().split('T')[0];
const dataDir = path.join(__dirname, '..', 'data', 'weekly-scrapes', today);

// Create directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

async function scrapeInstagram() {
    console.log('📸 Starting Instagram hashtag scrape...');

    try {
        const run = await client.actor("apify/instagram-hashtag-scraper").call({
            hashtags: config.instagram.hashtags,
            resultsLimit: config.instagram.resultsLimit,
            resultsType: "posts",
            addParentData: true
        });

        console.log(`✅ Instagram scrape completed. Run ID: ${run.id}`);

        // Download results
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // Save to CSV
        const csvPath = path.join(dataDir, 'instagram-hashtags.json');
        fs.writeFileSync(csvPath, JSON.stringify(items, null, 2));

        console.log(`💾 Saved ${items.length} Instagram posts to ${csvPath}`);

        return items;
    } catch (error) {
        console.error('❌ Instagram scrape failed:', error.message);
        return [];
    }
}

async function scrapeTikTok() {
    console.log('🎵 Starting TikTok hashtag scrape...');

    try {
        const run = await client.actor("clockworks/tiktok-hashtag-scraper").call({
            hashtags: config.tiktok.hashtags,
            resultsPerHashtag: config.tiktok.resultsPerHashtag
        });

        console.log(`✅ TikTok scrape completed. Run ID: ${run.id}`);

        // Download results
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // Save to JSON
        const jsonPath = path.join(dataDir, 'tiktok-hashtags.json');
        fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));

        console.log(`💾 Saved ${items.length} TikTok videos to ${jsonPath}`);

        return items;
    } catch (error) {
        console.error('❌ TikTok scrape failed:', error.message);
        return [];
    }
}

async function scrapeYouTube() {
    console.log('📹 Starting YouTube channel scrape...');

    try {
        const run = await client.actor("streamers/youtube-scraper").call({
            startUrls: config.youtube.channelUrls.map(url => ({ url })),
            maxResults: 20  // Get recent 20 videos per channel
        });

        console.log(`✅ YouTube scrape completed. Run ID: ${run.id}`);

        // Download results
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // Save to JSON
        const jsonPath = path.join(dataDir, 'youtube-growth.json');
        fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2));

        console.log(`💾 Saved ${items.length} YouTube channels to ${jsonPath}`);

        return items;
    } catch (error) {
        console.error('❌ YouTube scrape failed:', error.message);
        return [];
    }
}

async function analyzeResults(instagramData, tiktokData, youtubeData) {
    console.log('\n📊 Analysis Summary:');
    console.log('='.repeat(50));

    // Instagram analysis
    if (instagramData.length > 0) {
        const topPosts = instagramData
            .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
            .slice(0, 5);

        console.log('\n📸 Top Instagram Posts:');
        topPosts.forEach((post, i) => {
            console.log(`  ${i + 1}. @${post.ownerUsername} - ${post.likesCount} likes`);
        });
    }

    // TikTok analysis
    if (tiktokData.length > 0) {
        console.log('\n🎵 TikTok Trending Data:');
        console.log(`  Total trending items: ${tiktokData.length}`);
    }

    // YouTube analysis
    if (youtubeData.length > 0) {
        console.log('\n📹 YouTube Channels:');
        youtubeData.forEach((channel, i) => {
            console.log(`  ${i + 1}. ${channel.channelName || 'Unknown'} - ${channel.subscriberCount || 'N/A'} subscribers`);
        });
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📁 All data saved to: ${dataDir}`);
}

async function main() {
    console.log('🚀 Starting weekly scrape...\n');

    // Check for API token
    if (!process.env.APIFY_TOKEN) {
        console.error('❌ Error: APIFY_TOKEN environment variable not set');
        console.log('Set it with: export APIFY_TOKEN=your_token_here');
        process.exit(1);
    }

    // Run scrapers in parallel
    const [instagramData, tiktokData, youtubeData] = await Promise.all([
        scrapeInstagram(),
        scrapeTikTok(),
        scrapeYouTube()
    ]);

    // Analyze results
    await analyzeResults(instagramData, tiktokData, youtubeData);

    console.log('\n✅ Weekly scrape completed!\n');
}

// Run the script
main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
