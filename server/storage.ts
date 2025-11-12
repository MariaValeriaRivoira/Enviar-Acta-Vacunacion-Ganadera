// Storage interface - not used for this application
// This application sends emails directly without persisting data
export interface IStorage {}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
