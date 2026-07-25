/**
 * Google Apps Script for Eythor Solar Website
 * 
 * Deploy this as a Web App:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Paste this entire code
 * 4. Save → Deploy → New deployment → Web App
 * 5. Set "Execute as" → "Me"
 * 6. Set "Who has access" → "Anyone"
 * 7. Deploy and copy the URL
 * 8. Paste the URL into src/utils/submitToGoogleSheets.ts
 */

// Configuration - CHANGE THESE:
const SHEET_NAME = 'Solar Customer Data';
const DRIVE_FOLDER_NAME = 'Solar Customer Uploads';

// Get or create the master folder in Google Drive
function getOrCreateMasterFolder() {
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

// Get or create the spreadsheet
function getOrCreateSpreadsheet() {
  // Search by the exact name that SpreadsheetApp.create() uses (no .xlsx extension)
  const files = DriveApp.getFilesByName(SHEET_NAME);
  let ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(SHEET_NAME);
  }
  
  // Ensure first sheet has headers
  const sheet = ss.getSheets()[0];
  const headers = [
    'Timestamp',
    'Name',
    'Phone',
    'Email',
    'Address',
    'Pincode',
    'Kilowatts',
    'House Number',
    'Street Address',
    'City',
    'State',
    'Purpose',
    'Action',
    'Table Number',
    'Rows',
    'Columns',
    'Panels',
    'Panel Model',
    'Rated Power (W)',
    'Panel Length (mm)',
    'Panel Width (mm)',
    'Images Folder Link',
  ];
  
  // Check if headers match; if not, rewrite the first row
  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(headers.length, sheet.getLastColumn())).getValues()[0];
  const headersMatch = currentHeaders.slice(0, headers.length).every((val, idx) => val === headers[idx]);
  
  if (!headersMatch || sheet.getLastRow() === 0) {
    // Ensure exactly 22 columns in the first row
    if (sheet.getLastRow() >= 1) {
      // Overwrite first row cells up to 22 columns
      const range = sheet.getRange(1, 1, 1, 22);
      range.setValues([headers]);
      range.setFontWeight('bold');
    } else {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
  }
  
  return { ss, sheet };
}

// Function to save a base64 image to a Drive folder
function saveImageToFolder(folder, fileName, base64Data) {
  // Extract the actual base64 data (remove data:image/...;base64, prefix)
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let data;
  let mimeType;
  
  if (matches && matches.length === 3) {
    mimeType = matches[1];
    data = Utilities.base64Decode(matches[2]);
  } else {
    // Try to decode as raw base64
    mimeType = 'image/jpeg';
    data = Utilities.base64Decode(base64Data);
  }
  
  const blob = Utilities.newBlob(data, mimeType, fileName);
  return folder.createFile(blob);
}

// POST handler - receives data from the website
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const masterFolder = getOrCreateMasterFolder();
    const { sheet } = getOrCreateSpreadsheet();
    
    // Create a customer folder: "CustomerName - Phone"
    const customerFolderName = `${data.customer.name} - ${data.customer.phone}`;
    const existingFolders = masterFolder.getFoldersByName(customerFolderName);
    let customerFolder;
    if (existingFolders.hasNext()) {
      customerFolder = existingFolders.next();
    } else {
      customerFolder = masterFolder.createFolder(customerFolderName);
    }
    
    // Save images per table into separate subfolders
    var images = data.images || [];
    if (images.length > 0) {
      // Group images by tableNumber
      var imagesByTable = {};
      images.forEach(function(img) {
        var key = 'Table ' + img.tableNumber;
        if (!imagesByTable[key]) {
          imagesByTable[key] = [];
        }
        imagesByTable[key].push(img);
      });
      
      // Create a subfolder for each table and save images
      Object.keys(imagesByTable).forEach(function(tableFolderName) {
        var tableFolders = customerFolder.getFoldersByName(tableFolderName);
        var tableFolder;
        if (tableFolders.hasNext()) {
          tableFolder = tableFolders.next();
        } else {
          tableFolder = customerFolder.createFolder(tableFolderName);
        }
        
        imagesByTable[tableFolderName].forEach(function(img) {
          var safeLabel = img.label.replace(/[^a-zA-Z0-9]/g, '_');
          var fileName = safeLabel + '.jpg';
          try {
            saveImageToFolder(tableFolder, fileName, img.dataUrl);
          } catch (imgErr) {
            console.error('Failed to save image ' + fileName + ':', imgErr);
          }
        });
      });
    }
    
    // Get the customer folder link (links to parent folder, not individual table folders)
    const folderLink = customerFolder.getUrl();
    
    // Write a row for each table
    const tables = data.tables || [];
    if (tables.length === 0) {
      // Write one row with just customer info
      const rowData = [
        new Date().toISOString(),
        data.customer.name,
        data.customer.phone,
        data.customer.email,
        data.customer.address,
        data.customer.pincode,
        data.customer.kilowatts || '',
        data.customer.houseNumber || '',
        data.customer.streetAddress || '',
        data.customer.city || '',
        data.customer.state || '',
        data.customer.purpose || '',
        data.customer.action || '',
        '',
        '',
        '',
        data.totalPanels || 0,
        '',
        '',
        '',
        '',
        folderLink,
      ];
      sheet.appendRow(rowData);
    } else {
      tables.forEach(function(table) {
        const rowData = [
          new Date().toISOString(),
          data.customer.name,
          data.customer.phone,
          data.customer.email,
          data.customer.address,
          data.customer.pincode,
          data.customer.kilowatts || '',
          data.customer.houseNumber || '',
          data.customer.streetAddress || '',
          data.customer.city || '',
          data.customer.state || '',
          data.customer.purpose || '',
          data.customer.action || '',
          table.tableNumber || '',
          table.rows || '',
          table.columns || '',
          table.panels || '',
          table.panelModel || '',
          table.ratedPower || '',
          table.panelLength || '',
          table.panelWidth || '',
          folderLink,
        ];
        sheet.appendRow(rowData);
      });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler - for testing the web app
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'running',
      message: 'Eythor Solar Google Apps Script is running. Send POST requests with customer data.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}