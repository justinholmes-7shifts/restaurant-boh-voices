# Automation Guide: Weekly Trending Voice Detection

This guide walks you through setting up automated weekly monitoring to discover emerging restaurant BOH and labor management influencers across social platforms.

## Overview

We'll use Apify scrapers to monitor:
- **Instagram**: Hashtag tracking and profile growth
- **TikTok**: Trending creators and hashtag performance
- **YouTube**: Channel growth and subscriber metrics

## Step 1: Apify Account Setup

1. **Create Account**: Go to [apify.com](https://apify.com) and sign up for a free account
   - Free tier includes: $5 monthly credit (~10,000 scraper runs)
   - Pay-as-you-go after free credits

2. **Get API Token**: Navigate to Settings > Integrations > API Token
   - Save this token - you'll need it for automation

## Step 2: Configure Platform Scrapers

### Instagram Hashtag Monitoring

**Actor to use**: [Instagram Hashtag Scraper](https://apify.com/apify/instagram-hashtag-scraper)

**Hashtags to monitor**:
```
#restaurantmanagement
#restaurantoperations
#kitchenmanagement
#restaurantscheduling
#restaurantlabor
#bohlife
#restaurantlife
#cheflife
#restaurantowner
#restauranttech
```

**Setup**:
1. Open Instagram Hashtag Scraper in Apify Console
2. Configure Input:
   ```json
   {
     "hashtags": [
       "restaurantmanagement",
       "restaurantoperations",
       "kitchenmanagement",
       "restaurantscheduling",
       "restaurantlabor"
     ],
     "resultsLimit": 50,
     "resultsType": "posts",
     "addParentData": true
   }
   ```
3. Test Run: Click "Start" to verify it works
4. Schedule: Set to run weekly (Sunday nights)

**Key metrics to track**:
- Username of poster
- Follower count (if available)
- Engagement rate (likes + comments / followers)
- Post frequency
- Content themes

### TikTok Trending Monitoring

**Actors to use**:
- [TikTok Trends Scraper](https://apify.com/clockworks/tiktok-trends-scraper) - For trending creators
- [TikTok Hashtag Scraper](https://apify.com/clockworks/tiktok-hashtag-scraper) - For specific hashtags

**Setup for Trends Scraper**:
1. Open TikTok Trends Scraper
2. Configure Input:
   ```json
   {
     "trendingCreators": 100,
     "trendingHashtags": 50,
     "trendingVideos": 50
   }
   ```
3. Schedule: Weekly runs

**Setup for Hashtag Scraper**:
1. Configure hashtags to monitor:
   ```json
   {
     "hashtags": [
       "#restaurantmanagement",
       "#restaurantowner",
       "#kitchenlife",
       "#restaurantoperations"
     ],
     "resultsPerHashtag": 50
   }
   ```

**Key metrics**:
- Creator handle and follower count
- Video views and engagement
- Growth velocity (new followers/week)
- Content consistency

### YouTube Channel Growth

**Actor to use**: [YouTube Growth Scraper](https://apify.com/bakkeshks/youtube-growth-scraper)

**Setup**:
1. Start with known channels from voices.csv
2. Add competitor/similar channels
3. Configure Input:
   ```json
   {
     "channelUrls": [
       "https://www.youtube.com/@TheRestaurantBoss",
       "https://www.youtube.com/@WilsonKLee",
       "https://www.youtube.com/@GordonRamsay"
     ]
   }
   ```

**Discovery approach**:
- Use YouTube search for "restaurant management" + filter by upload date (last week)
- Track channels that appear in search results
- Monitor subscriber growth trends

**Key metrics**:
- Subscriber count & growth rate
- Average views per video
- Upload frequency
- Engagement (likes, comments)

## Step 3: Schedule Weekly Runs

### Using Apify Console

1. For each scraper, click "Schedule" tab
2. Set to run every Sunday at 11:59 PM
3. Configure notifications for failures

### Using Apify API (Advanced)

Create a script to trigger scrapers programmatically:

```javascript
const { ApifyClient } = require('apify-client');

const client = new ApifyClient({
    token: 'YOUR_API_TOKEN',
});

async function runWeeklyScrape() {
    // Instagram
    const instagramRun = await client.actor("apify/instagram-hashtag-scraper").call({
        hashtags: ["restaurantmanagement", "restaurantoperations"],
        resultsLimit: 50
    });

    // TikTok
    const tiktokRun = await client.actor("clockworks/tiktok-trends-scraper").call({
        trendingCreators: 100
    });

    // YouTube
    const youtubeRun = await client.actor("bakkeshks/youtube-growth-scraper").call({
        channelUrls: [/* your channels */]
    });
}

// Run weekly
runWeeklyScrape();
```

## Step 4: Data Collection & Storage

### Export Scraped Data

After each run:
1. Download dataset as CSV/JSON
2. Store in `/data/weekly-scrapes/YYYY-MM-DD/` folder structure

### Recommended folder structure:
```
restaurant-boh-voices/
├── data/
│   ├── weekly-scrapes/
│   │   ├── 2025-11-24/
│   │   │   ├── instagram-hashtags.csv
│   │   │   ├── tiktok-trends.csv
│   │   │   └── youtube-growth.csv
│   │   ├── 2025-12-01/
│   │   └── ...
│   └── analysis/
│       └── growth-trends.csv
```

### Automate data download:

```javascript
const dataset = await client.dataset(instagramRun.defaultDatasetId).downloadItems('csv');
// Save to file system
fs.writeFileSync(`./data/weekly-scrapes/${date}/instagram-hashtags.csv`, dataset);
```

## Step 5: Analysis & Discovery

### Weekly Review Process

1. **Identify New Voices**:
   - Sort by follower count growth
   - Filter for consistent posting (3+ posts/week)
   - Look for engagement rate > 2%

2. **Qualification Criteria**:
   - Focus on restaurant operations (not just food)
   - Content about labor, scheduling, management
   - Professional credibility (not just lifestyle content)
   - Growing audience (10%+ growth monthly)

3. **Add to voices.csv**:
   - Research the qualified accounts
   - Fill in all platform data
   - Add to tracking database

### Analysis Queries

Track week-over-week growth:
```sql
-- Example: Find accounts with 20%+ follower growth
SELECT username,
       current_followers,
       previous_followers,
       ((current_followers - previous_followers) / previous_followers) * 100 as growth_pct
FROM weekly_data
WHERE growth_pct > 20
ORDER BY growth_pct DESC;
```

## Step 6: Alternative Tools

If Apify credits run out or you need more control:

### Direct API Access

**YouTube Data API**:
- Free: 10,000 units/day
- Good for: Channel stats, search, video details
- Setup: [Google Cloud Console](https://console.cloud.google.com/)

**Instagram Graph API**:
- Requires: Meta Business account + approved app
- Good for: Business accounts only
- Limited hashtag access

**TikTok API**:
- Requires: Developer account + app approval
- Most restrictive of the three
- Consider unofficial scrapers as alternative

### Other Scraping Tools

- **Bright Data**: Enterprise-grade, more expensive
- **Octoparse**: Visual scraper, good for non-coders
- **ParseHub**: Free tier available, desktop app
- **Custom Python scrapers**: Using BeautifulSoup/Selenium (requires maintenance)

## Cost Estimate

### Apify Monthly Costs

**Free Tier**: $5 credit
- ~50 Instagram hashtag scrapes
- ~50 TikTok trend scrapes
- ~100 YouTube channel checks

**Paid Plans**:
- Starter: $49/month (includes $50 credit)
- Scale: $499/month (includes $500 credit)

**Weekly monitoring** (estimated):
- Instagram: 5 hashtags × 50 posts = $0.50
- TikTok: 100 trending creators = $0.75
- YouTube: 20 channels = $0.25
- **Total: ~$1.50/week = $6/month**

## Monitoring Dashboard (Optional)

Create a simple dashboard to visualize trends:

### Tools:
- **Google Sheets**: Import CSVs, create charts
- **Airtable**: Better for relational data
- **Notion**: Good for weekly reports
- **Custom dashboard**: Python (Streamlit) or JavaScript (React)

### Key Visualizations:
- Top 10 fastest-growing accounts (weekly)
- Hashtag performance trends
- New voices discovered this month
- Platform comparison (IG vs TikTok vs YouTube)

## Workflow Summary

**Sunday Night (Automated)**:
1. Apify scrapers run on schedule
2. Data exported to CSV
3. Files saved to weekly folder

**Monday Morning (Manual)**:
1. Review weekly scrape results
2. Identify accounts with significant growth
3. Research promising new voices
4. Add qualified voices to voices.csv
5. Update growth metrics for existing voices

**Monthly Review**:
1. Analyze trends across all platforms
2. Adjust hashtag list based on performance
3. Review budget and scraper efficiency
4. Archive old data

## Next Steps

1. Set up Apify account
2. Configure and test one scraper (start with Instagram)
3. Run first weekly scrape
4. Review results and refine criteria
5. Expand to other platforms
6. Automate data collection
7. Build analysis workflow

## Resources

- [Apify Documentation](https://docs.apify.com/)
- [Instagram Hashtag Scraper](https://apify.com/apify/instagram-hashtag-scraper)
- [TikTok Trends Scraper](https://apify.com/clockworks/tiktok-trends-scraper)
- [YouTube Growth Scraper](https://apify.com/bakkeshks/youtube-growth-scraper)
- [Apify API Reference](https://docs.apify.com/api/v2)
