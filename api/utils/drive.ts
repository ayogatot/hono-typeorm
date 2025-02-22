import { google } from 'googleapis';
import credentials from '../credentials/credentials.json';
import { Readable } from 'stream';

export class DriveService {
  private driveClient;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    this.driveClient = google.drive({ version: 'v3', auth });
  }

  async uploadFile(file: File) {
    try {
      // Convert Blob/File to Buffer then to Node.js readable stream
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileStream = Readable.from(buffer);

      const response = await this.driveClient.files.create({
        requestBody: {
          name: file.name,
          mimeType: file.type,
          parents: ['1SqjDvMSuCqbpnzNwV0H0_oYgkt26hKEv'], // Folder ID
        },
        media: {
          mimeType: file.type,
          body: fileStream,
        },
      });

      // Make the file publicly accessible
      await this.driveClient.permissions.create({
        fileId: response.data.id!,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Get the file's web view link
      const result = await this.driveClient.files.get({
        fileId: response.data.id!,
        fields: 'webViewLink, webContentLink',
      });

      return {
        fileId: response.data.id,
        webViewLink: result.data.webViewLink,
        webContentLink: result.data.webContentLink,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }
} 