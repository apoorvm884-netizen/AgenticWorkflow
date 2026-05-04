// ============================================================
// AGENTIC WORKFLOW — Google Apps Script Backend
// Sheet Tab Name: Table2
// Columns: ID, Category, Tool Name, Website,
//          What It Does, Best For, Free Plan Details, Keywords
// Deploy as: Web App | Execute as: Me | Access: Anyone
// ============================================================

function doGet(e) {

  const SHEET_NAME = 'Table2'; // Your exact sheet tab name

  try {

    // Step 1: Open the sheet
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    // Step 2: Check if sheet exists
    if (!sheet) {
      return jsonResponse({
        success: false,
        error: 'Sheet "' + SHEET_NAME + '" not found. Check tab name.'
      });
    }

    // Step 3: Read all data
    const data = sheet.getDataRange().getValues();

    // Step 4: Check if data exists
    if (data.length < 2) {
      return jsonResponse({
        success: false,
        error: 'Sheet is empty or has only headers.'
      });
    }

    // Step 5: First row = headers
    const headers = data[0].map(h => h.toString().trim());

    // Step 6: Convert each row into an object
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Skip completely empty rows
      const isEmpty = row.every(cell =>
        cell === '' || cell === null || cell === undefined
      );
      if (isEmpty) continue;

      // Map each cell to its header
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx] !== undefined
          ? row[idx].toString().trim()
          : '';
      });

      rows.push(obj);
    }

    // Step 7: Return clean JSON
    return jsonResponse({
      success: true,
      total: rows.length,
      sheetName: SHEET_NAME,
      lastUpdated: new Date().toISOString(),
      data: rows
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

// ============================================================
// Helper: Convert object to JSON response
// ============================================================
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// OPTIONAL: Format your Google Sheet with professional styling
// Run this manually from Apps Script editor if needed
// ============================================================
function formatSheet() {
  var sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Table2');

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Sheet "Table2" not found.');
    return;
  }

  var lastRow = Math.max(sheet.getLastRow(), 2);
  var tableRange = sheet.getRange(1, 1, lastRow, 8);

  // Header row
  var header = sheet.getRange(1, 1, 1, 8);
  header.setBackground('#1a73e8')
        .setFontColor('white')
        .setFontWeight('bold')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle')
        .setFontSize(12);

  // Alternating row colors
  tableRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);

  // Text wrap and alignment
  tableRange.setVerticalAlignment('middle');
  sheet.getRange(2, 1, lastRow - 1, 1).setHorizontalAlignment('center');
  sheet.getRange(2, 2, lastRow - 1, 7).setWrap(true);

  // Freeze header row
  sheet.setFrozenRows(1);

  // Column widths
  sheet.setColumnWidth(1, 45);   // ID
  sheet.setColumnWidth(2, 140);  // Category
  sheet.setColumnWidth(3, 160);  // Tool Name
  sheet.setColumnWidth(4, 220);  // Website
  sheet.setColumnWidth(5, 320);  // What It Does
  sheet.setColumnWidth(6, 150);  // Best For
  sheet.setColumnWidth(7, 220);  // Free Plan Details
  sheet.setColumnWidth(8, 200);  // Keywords

  // Borders
  tableRange.setBorder(
    true, true, true, true, true, true,
    '#d1d3d4',
    SpreadsheetApp.BorderStyle.SOLID
  );

  SpreadsheetApp.getUi().alert(
    'Sheet formatted successfully!\n' +
    'Total rows found: ' + (lastRow - 1)
  );
}

// ============================================================
// OPTIONAL: Add menu to Google Sheet toolbar
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 AI Library')
    .addItem('Format Sheet', 'formatSheet')
    .addToUi();
}
