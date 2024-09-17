export abstract class Storage {
  abstract upload(opts: {
    /**
     * The key to store the file under.
     * @example
     * key: 'folderA/folderB/filename.jpg'
     */
    key: string;

    /**
     * The mime type of the file.
     * @example
     * mime: 'image/jpeg'
     */
    mime: string;

    /**
     * The hashed buffer acting as the filename
     * @example
     * 0502d152d883e1f8710c77bf8082be19.jpg
     */
    hashedFilename: string;

    /**
     * The buffer to upload.
     */
    buffer: Buffer | Uint8Array;
  }): Promise<string>;
}
