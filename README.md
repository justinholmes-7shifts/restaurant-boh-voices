# Restaurant BOH Voices - Labor Management Influencers

A curated collection of top voices in the restaurant industry focused on back of house operations and labor management.

## Overview

This project tracks influential voices across multiple platforms who provide insights, best practices, and thought leadership on restaurant back of house labor management topics including:

- Staff scheduling and workforce management
- Employee retention and engagement
- Labor cost optimization
- Training and development
- Operational efficiency
- Team management

## Platforms Tracked

- **Authors** - Books, articles, and publications
- **YouTube** - Video content creators
- **Instagram** - Social media influencers
- **TikTok** - Short-form content creators
- **Newsletters** - Email newsletters and substacks

## Data Structure

See `voices.csv` for the main database of tracked voices with platform-specific information and engagement metrics.

## Categories

- Labor Management Software & Tools
- Restaurant Operations
- Team Building & Culture
- Scheduling Best Practices
- Cost Control & Analytics
- HR & Compliance

## Automated Discovery

This project includes automation tools to discover emerging voices weekly. See [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md) for:

- Setting up Apify scrapers for Instagram, TikTok, and YouTube
- Monitoring trending hashtags and creators
- Tracking channel growth and engagement metrics
- Weekly workflow for discovering new voices

**Quick Start**:
```bash
npm install
export APIFY_TOKEN=your_token_here
npm run scrape
```

## Contributing

When adding new voices, please include:
- Name and title
- Platform(s) where active
- Profile links
- Content focus areas
- Engagement metrics (where available)
- Notable content or achievements
