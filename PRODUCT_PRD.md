# Meeting Mode Writer - Product Requirements Document

## Executive Summary

Meeting Mode Writer addresses the common challenge of creating professional meeting documentation by providing templates, formatting tools, and AI-powered suggestions. By streamlining the note-taking process, this add-on saves time and ensures consistent, high-quality meeting records.

## Target Persona

**Primary**: Alex, a project manager who spends hours formatting meeting notes and ensuring all action items are captured and assigned.

**Secondary**: Sarah, a team lead who needs to quickly document daily standups and planning sessions.

## Core Features

### 1. Template System
- Pre-built templates for different meeting types
- Custom template creation and editing
- Template variables (date, attendees, location)
- Template library with categories

### 2. Quick Formatting
- One-click formatting for action items
- Decision highlighting and tracking
- Note section organization
- Bullet point and numbering shortcuts

### 3. AI Suggestions
- Content structure suggestions
- Action item extraction
- Summary generation
- Smart completion of common phrases

### 4. Participant Management
- Attendee list management
- Role assignment (facilitator, note-taker, etc.)
- Contribution tracking
- Email integration for invitations

### 5. Action Item Tracking
- Create action items with owners and due dates
- Track action item status
- Generate action item reports
- Integration with task management tools

## Technical Architecture

### Apps Script Modules

**TemplateEngine**
- `loadTemplate(templateId)`: Load template from library
- `applyTemplate(docId, templateId)`: Apply template to document
- `createCustomTemplate(name, content)`: Create new template
- `listTemplates()`: Get available templates

**Formatter**
- `formatActionItem(text)`: Format as action item
- `formatDecision(text)`: Format as decision
- `formatNote(text)`: Format as note
- `applyStyle(range, style)`: Apply formatting to text range

**SuggestionEngine**
- `suggestStructure(content)`: Suggest document structure
- `extractActionItems(content)`: Identify action items
- `generateSummary(content)`: Create meeting summary
- `completePhrase(context)`: Auto-complete text

**ActionItemTracker**
- `createActionItem(description, owner, dueDate)`: Create new action item
- `updateActionItemStatus(itemId, status)`: Update item status
- `listActionItems(docId)`: Get all action items
- `generateActionItemReport(docId)`: Create status report

**Exporter**
- `exportToPDF(docId)`: Convert to PDF
- `exportToHTML(docId)`: Convert to HTML
- `exportToMarkdown(docId)`: Convert to Markdown
- `exportToEmail(docId)`: Send as email

**HistoryManager**
- `saveMeetingDocument(docId, metadata)`: Save meeting record
- `getMeetingHistory(filters)`: Retrieve past meetings
- `searchMeetings(query)`: Search meeting documents
- `archiveMeeting(docId)`: Archive old meetings

### Data Structures

**MeetingTemplate**
```javascript
{
  id: string,
  name: string,
  category: string,
  content: string,
  variables: string[],
  createdAt: Date
}
```

**ActionItem**
```javascript
{
  id: string,
  description: string,
  owner: string,
  dueDate: Date,
  status: 'pending' | 'in-progress' | 'completed',
  createdAt: Date
}
```

**MeetingMetadata**
```javascript
{
  docId: string,
  title: string,
  date: Date,
  attendees: string[],
  actionItems: ActionItem[],
  templateId: string
}
```

### OAuth Scopes Required
- `https://www.googleapis.com/auth/documents` - Create and edit Google Docs
- `https://www.googleapis.com/auth/drive` - Save and organize documents
- `https://www.googleapis.com/auth/script.container.ui` - Display sidebar

## Build Checklist

- [ ] Implement TemplateEngine core logic
- [ ] Build Formatter with quick formatting tools
- [ ] Create SuggestionEngine with AI features
- [ ] Develop ActionItemTracker for task management
- [ ] Implement Exporter with multiple formats
- [ ] Design and implement Sidebar UI
- [ ] Add template library management
- [ ] Create comprehensive error handling
- [ ] Add user permission checks
- [ ] Test with various document types
- [ ] Create user documentation
- [ ] Prepare compliance documentation
