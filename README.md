# Meeting Mode Writer

## Overview

Meeting Mode Writer is a Google Workspace add-on that helps users write and format meeting notes, agendas, and summaries in Google Docs. It provides templates, formatting shortcuts, and AI-powered suggestions for creating professional meeting documentation.

## Features

- **Meeting Templates**: Pre-built templates for agendas, minutes, and summaries
- **Quick Formatting**: One-click formatting for action items, decisions, and notes
- **AI Suggestions**: Smart suggestions for content structure and completion
- **Participant Tracking**: Track attendees and their contributions
- **Action Item Management**: Create and track action items with owners and due dates
- **Time Stamping**: Auto-generate timestamps for meeting sections
- **Export Options**: Export to various formats (PDF, HTML, Markdown)
- **Meeting History**: Save and retrieve past meeting documents

## Target Users

- **Project Managers**: Documenting project meetings and decisions
- **Team Leads**: Recording team standups and planning sessions
- **HR Professionals**: Documenting performance reviews and HR meetings
- **Executives**: Creating executive summaries and board meeting notes
- **Anyone** who regularly participates in meetings

## Pricing

- **Free Tier**: Basic templates and formatting
- **Pro Tier ($6.99/month)**: AI suggestions, advanced templates, export options
- **Team Tier ($16.99/month)**: Shared templates, team analytics, priority support

## Timeline

- **Phase 1** (Week 1-2): Core template system and formatting
- **Phase 2** (Week 3-4): AI suggestions and content assistance
- **Phase 3** (Week 5-6): Action item tracking and management
- **Phase 4** (Week 7-8): Advanced features and team collaboration

## Architecture

### Backend (Apps Script)
- **TemplateEngine**: Load and apply meeting templates
- **Formatter**: Apply formatting to meeting content
- **SuggestionEngine**: Generate AI-powered suggestions
- **ActionItemTracker**: Manage action items and tasks
- **Exporter**: Convert documents to various formats
- **HistoryManager**: Save and retrieve meeting documents

### Frontend (HTML Service)
- **Template Gallery**: Browse and select templates
- **Editor Panel**: Quick formatting tools and shortcuts
- **Suggestions Panel**: AI-powered content suggestions
- **Action Items Panel**: Track and manage action items
- **Settings Manager**: Configure preferences

### Data Storage
- **PropertiesService**: Store configuration and templates
- **Docs API**: Create and edit Google Docs
- **Drive API**: Save and organize meeting documents

## Installation

1. Open Google Apps Script project
2. Copy `Code.gs` and `Sidebar.html`
3. Configure `appsscript.json` manifest
4. Enable required APIs in console
5. Test with sample meeting document

## Support

For issues or questions, contact: support@tangentforge.com
