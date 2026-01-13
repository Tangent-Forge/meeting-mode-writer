/**
 * Meeting Mode Writer
 * Google Workspace Add-on for meeting documentation
 */

const UI_LABEL = 'Meeting Mode Writer';
const storageKey = 'meetingMode_config';
const logKey = 'meetingMode_logs';

// Add-on Lifecycle Functions
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  const ui = DocumentApp.getUi();
  ui.createMenu(UI_LABEL)
    .addItem('Open Writer', 'showSidebar')
    .addItem('Templates', 'showTemplates')
    .addItem('Action Items', 'showActionItems')
    .addItem('Export', 'showExportDialog')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle(UI_LABEL)
    .setWidth(400);
  DocumentApp.getUi().showSidebar(html);
}

// API Functions for Sidebar
function getDocumentInfo() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  return {
    id: doc.getId(),
    title: doc.getName(),
    wordCount: body.getText().split(/\s+/).length,
    paragraphCount: body.getNumChildren()
  };
}

function applyTemplate(templateId) {
  const template = loadTemplate(templateId);
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Clear existing content
  body.clear();
  
  // Apply template content
  const content = template.content
    .replace('{date}', new Date().toLocaleDateString())
    .replace('{time}', new Date().toLocaleTimeString())
    .replace('{title}', doc.getName());
  
  body.setText(content);
  
  logActivity('template_applied', { templateId: templateId });
  
  return { success: true, templateName: template.name };
}

function formatAsActionItem(text) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  const paragraph = body.appendParagraph(text);
  paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING3);
  paragraph.setBold(true);
  
  // Add checkbox
  const checkbox = body.appendListItem('☐ ' + text);
  checkbox.setGlyphType(DocumentApp.GlyphType.BULLET);
  
  logActivity('action_item_formatted', { text: text });
  
  return { success: true };
}

function formatAsDecision(text) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  const paragraph = body.appendParagraph('DECISION: ' + text);
  paragraph.setBold(true);
  paragraph.setForegroundColor('#4CAF50');
  
  logActivity('decision_formatted', { text: text });
  
  return { success: true };
}

function formatAsNote(text) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  const paragraph = body.appendParagraph(text);
  paragraph.setIndentStart(20);
  
  logActivity('note_formatted', { text: text });
  
  return { success: true };
}

function createActionItem(description, owner, dueDate) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  const actionItem = {
    id: Utilities.getUuid(),
    description: description,
    owner: owner,
    dueDate: dueDate,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Add to document
  body.appendParagraph('');
  const paragraph = body.appendParagraph('ACTION ITEM: ' + description);
  paragraph.setBold(true);
  paragraph.setForegroundColor('#FF9800');
  
  body.appendParagraph('Owner: ' + owner);
  body.appendParagraph('Due: ' + dueDate);
  
  // Save to storage
  saveActionItem(doc.getId(), actionItem);
  
  logActivity('action_item_created', actionItem);
  
  return { success: true, actionItem: actionItem };
}

function getActionItems(docId) {
  const props = PropertiesService.getDocumentProperties();
  const actionItems = props.getProperty('actionItems');
  return actionItems ? JSON.parse(actionItems) : [];
}

function saveActionItem(docId, actionItem) {
  const props = PropertiesService.getDocumentProperties();
  const actionItems = JSON.parse(props.getProperty('actionItems') || '[]');
  actionItems.push(actionItem);
  props.setProperty('actionItems', JSON.stringify(actionItems));
}

function updateActionItemStatus(itemId, status) {
  const actionItems = getActionItems(DocumentApp.getActiveDocument().getId());
  const item = actionItems.find(a => a.id === itemId);
  
  if (item) {
    item.status = status;
    const props = PropertiesService.getDocumentProperties();
    props.setProperty('actionItems', JSON.stringify(actionItems));
    
    logActivity('action_item_updated', { itemId: itemId, status: status });
    
    return { success: true };
  }
  
  return { success: false, error: 'Action item not found' };
}

function generateSummary() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const text = body.getText();
  
  // Simple summary generation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const summary = sentences.slice(0, 3).join('. ');
  
  body.appendParagraph('');
  const summaryParagraph = body.appendParagraph('SUMMARY:');
  summaryParagraph.setBold(true);
  summaryParagraph.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  body.appendParagraph(summary);
  
  logActivity('summary_generated', { length: summary.length });
  
  return { success: true, summary: summary };
}

function exportToPDF() {
  const doc = DocumentApp.getActiveDocument();
  const fileId = doc.getId();
  
  // Create PDF export
  const file = DriveApp.getFileById(fileId);
  const pdfBlob = file.getAs('application/pdf');
  pdfBlob.setName(doc.getName() + '.pdf');
  
  const pdfFile = DriveApp.createFile(pdfBlob);
  
  logActivity('exported_to_pdf', { fileId: fileId, pdfFileId: pdfFile.getId() });
  
  return { success: true, pdfUrl: pdfFile.getUrl() };
}

function exportToEmail() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  const emailContent = body.getText();
  const subject = 'Meeting Notes: ' + doc.getName();
  
  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: subject,
    body: emailContent
  });
  
  logActivity('exported_to_email', { subject: subject });
  
  return { success: true };
}

function showTemplates() {
  showSidebar();
}

function showActionItems() {
  showSidebar();
}

function showExportDialog() {
  showSidebar();
}

// Template Engine Module
const TemplateEngine = {
  loadTemplate: function(templateId) {
    return loadTemplate(templateId);
  },

  applyTemplate: function(docId, templateId) {
    return applyTemplate(templateId);
  },

  createCustomTemplate: function(name, content) {
    const template = {
      id: Utilities.getUuid(),
      name: name,
      content: content,
      createdAt: new Date().toISOString()
    };
    
    const props = PropertiesService.getUserProperties();
    const templates = JSON.parse(props.getProperty('templates') || '[]');
    templates.push(template);
    props.setProperty('templates', JSON.stringify(templates));
    
    return { success: true, template: template };
  },

  listTemplates: function() {
    const props = PropertiesService.getUserProperties();
    const templates = JSON.parse(props.getProperty('templates') || '[]');
    
    // Add default templates
    const defaultTemplates = [
      {
        id: 'agenda',
        name: 'Meeting Agenda',
        content: 'Meeting Agenda\n\nDate: {date}\nTime: {time}\n\nAttendees:\n- \n\nAgenda Items:\n1. \n2. \n3. \n\nNotes:\n'
      },
      {
        id: 'minutes',
        name: 'Meeting Minutes',
        content: 'Meeting Minutes\n\nDate: {date}\nTime: {time}\n\nAttendees:\n- \n\nDiscussion:\n\nDecisions:\n\nAction Items:\n\nNext Steps:\n'
      },
      {
        id: 'summary',
        name: 'Executive Summary',
        content: 'Executive Summary\n\nMeeting: {title}\nDate: {date}\n\nKey Points:\n\nDecisions Made:\n\nAction Items:\n\nNext Meeting: {date}'
      }
    ];
    
    return [...defaultTemplates, ...templates];
  }
};

function loadTemplate(templateId) {
  const templates = TemplateEngine.listTemplates();
  return templates.find(t => t.id === templateId) || templates[0];
}

// Formatter Module
const Formatter = {
  formatActionItem: function(text) {
    return formatAsActionItem(text);
  },

  formatDecision: function(text) {
    return formatAsDecision(text);
  },

  formatNote: function(text) {
    return formatAsNote(text);
  },

  applyStyle: function(range, style) {
    // Placeholder for range-based formatting
    return { success: true };
  }
};

// Suggestion Engine Module
const SuggestionEngine = {
  suggestStructure: function(content) {
    const suggestions = [];
    
    if (!content.includes('Agenda')) {
      suggestions.push('Consider adding an Agenda section');
    }
    
    if (!content.includes('Action Items')) {
      suggestions.push('Consider adding an Action Items section');
    }
    
    if (!content.includes('Decisions')) {
      suggestions.push('Consider adding a Decisions section');
    }
    
    return suggestions;
  },

  extractActionItems: function(content) {
    const actionItems = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('action') || 
          line.toLowerCase().includes('todo') ||
          line.toLowerCase().includes('follow up')) {
        actionItems.push(line.trim());
      }
    });
    
    return actionItems;
  },

  generateSummary: function(content) {
    return generateSummary();
  },

  completePhrase: function(context) {
    // Placeholder for phrase completion
    return { suggestions: [] };
  }
};

// Action Item Tracker Module
const ActionItemTracker = {
  createActionItem: function(description, owner, dueDate) {
    return createActionItem(description, owner, dueDate);
  },

  updateActionItemStatus: function(itemId, status) {
    return updateActionItemStatus(itemId, status);
  },

  listActionItems: function(docId) {
    return getActionItems(docId);
  },

  generateActionItemReport: function(docId) {
    const actionItems = getActionItems(docId);
    const pending = actionItems.filter(a => a.status === 'pending');
    const completed = actionItems.filter(a => a.status === 'completed');
    
    return {
      total: actionItems.length,
      pending: pending.length,
      completed: completed.length,
      items: actionItems
    };
  }
};

// Exporter Module
const Exporter = {
  exportToPDF: function(docId) {
    return exportToPDF();
  },

  exportToHTML: function(docId) {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    
    // Simple HTML export
    const html = '<html><body><h1>' + doc.getName() + '</h1><pre>' + 
                body.getText() + '</pre></body></html>';
    
    const blob = Utilities.newBlob(html, 'text/html', doc.getName() + '.html');
    const file = DriveApp.createFile(blob);
    
    return { success: true, htmlUrl: file.getUrl() };
  },

  exportToMarkdown: function(docId) {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    
    // Simple Markdown export
    const markdown = '# ' + doc.getName() + '\n\n' + body.getText();
    
    const blob = Utilities.newBlob(markdown, 'text/markdown', doc.getName() + '.md');
    const file = DriveApp.createFile(blob);
    
    return { success: true, markdownUrl: file.getUrl() };
  },

  exportToEmail: function(docId) {
    return exportToEmail();
  }
};

// History Manager Module
const HistoryManager = {
  saveMeetingDocument: function(docId, metadata) {
    const props = PropertiesService.getDocumentProperties();
    const history = JSON.parse(props.getProperty('meetingHistory') || '[]');
    
    history.push({
      docId: docId,
      metadata: metadata,
      savedAt: new Date().toISOString()
    });
    
    props.setProperty('meetingHistory', JSON.stringify(history));
    
    return { success: true };
  },

  getMeetingHistory: function(filters) {
    const props = PropertiesService.getDocumentProperties();
    const history = JSON.parse(props.getProperty('meetingHistory') || '[]');
    
    return history;
  },

  searchMeetings: function(query) {
    const history = this.getMeetingHistory();
    return history.filter(h => 
      h.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
      h.metadata.date.includes(query)
    );
  },

  archiveMeeting: function(docId) {
    // Placeholder for archiving
    return { success: true };
  }
};

// Helper Functions
function getConfig() {
  const props = PropertiesService.getUserProperties();
  const config = props.getProperty(storageKey);
  return config ? JSON.parse(config) : { defaultTemplate: 'agenda' };
}

function saveConfig(config) {
  const props = PropertiesService.getUserProperties();
  props.setProperty(storageKey, JSON.stringify(config));
}

function logActivity(action, details) {
  const props = PropertiesService.getUserProperties();
  const logs = JSON.parse(props.getProperty(logKey) || '[]');
  logs.unshift({
    timestamp: new Date().toISOString(),
    action: action,
    details: details
  });
  if (logs.length > 100) {
    logs.pop();
  }
  props.setProperty(logKey, JSON.stringify(logs));
}

function getActivityLog() {
  const props = PropertiesService.getUserProperties();
  return JSON.parse(props.getProperty(logKey) || '[]');
}
