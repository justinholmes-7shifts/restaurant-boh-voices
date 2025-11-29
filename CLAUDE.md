# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a research and data curation project tracking influential voices in the restaurant industry focused on back of house (BOH) labor management. The project identifies thought leaders across multiple platforms (YouTube, Instagram, TikTok, newsletters, and publications) who provide insights on workforce management, scheduling, employee retention, and operational efficiency.

## Data Structure

The primary data asset is `voices.csv`, which contains:
- Basic profile information (name, title, primary focus)
- Cross-platform presence (YouTube, Instagram, TikTok, newsletters, publications)
- Engagement metrics (subscribers, followers)
- Metadata (website, notes, date added)

Each row represents one influencer/thought leader with columns for each platform they're active on.

## Content Categories

When adding or categorizing voices, use these focus areas:
- Labor Management Software & Tools
- Restaurant Operations
- Team Building & Culture
- Scheduling Best Practices
- Cost Control & Analytics
- HR & Compliance

## Working with the Data

When adding new voices to `voices.csv`:
1. Fill in all applicable platform columns
2. Leave empty cells blank (no "N/A" or placeholder text)
3. Include engagement metrics when publicly available
4. Add date in YYYY-MM-DD format
5. Use the Notes column for notable achievements, book titles, or unique qualifications
