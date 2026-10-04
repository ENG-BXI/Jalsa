import * as sdk from 'node-appwrite';
import {env} from '../../config/env.js';
import {InputFile} from 'node-appwrite/file';

export class AppWriteService {
  private client: sdk.Client;
  private storage: sdk.Storage;
  constructor() {
    this.client = new sdk.Client().setEndpoint(env.APPWRITE_API_ENDPOINT).setProject(env.APPWRITE_PROJECT_ID).setKey(env.APPWRITE_API_KEY);
    this.storage = new sdk.Storage(this.client);
  }
  async createFile(bucketId: string, path?: string, originalName?: string) {
    if (!path || !originalName) return;
    const file = InputFile.fromPath(path, originalName);
    return this.storage.createFile(bucketId, sdk.ID.unique(), file);
  }
  async getFileId(bucketId: string, path?: string, originalName?: string) {
    return this.storage.getFile(bucketId, path || originalName || '');
  }
  async deleteFile(bucketId: string, fileId?: string) {
    if (!fileId) return;
    return this.storage.deleteFile(bucketId, fileId);
  }
}

export const appWriteService = new AppWriteService();
