// Google Apps Script Web App URL - User needs to replace this after deploying
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzKvaSxfuKgQdSlTStQ9WbCMO6H0r1ginZ_AL8axSsP8099nPmrxXLtRTBOC7RZGtUClA/exec';

export interface CustomerData {
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  kilowatts: string;
  houseNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  purpose: string;
  action: string;
}

export interface ImageData {
  label: string;
  dataUrl: string; // base64 data URL
  tableNumber: number;
}

export interface SubmissionData {
  customer: CustomerData;
  totalPanels: number;
  tables: {
    tableNumber: number | string;
    rows: number | string;
    columns: number | string;
    panels: number | string;
    panelModel: string;
    ratedPower: string;
    panelLength: string;
    panelWidth: string;
  }[];
  images: ImageData[];
}

export async function submitToGoogleSheets(data: SubmissionData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // With no-cors mode, we can't read the response body
    // The request will still reach the Apps Script
    return { success: true, message: 'Data submitted successfully!' };
  } catch (error: any) {
    console.error('Error submitting to Google Sheets:', error);
    return { success: false, message: error.message || 'Failed to submit data' };
  }
}

/**
 * Convert a File to a base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}