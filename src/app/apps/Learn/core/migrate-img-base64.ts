import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MigrateImgBase64Service {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  async processLearnItems(): Promise<void> {
    console.log(`processLearnItems start`)
    const learnItems = await this.firestore.collection('LearnItem').get().toPromise();
    const totalDocuments = learnItems.docs.length;
    let errorCount = 0;
    let totalImagesReplaced = 0;
    let totalSizeInBytes = 0;

    for (const [index, document] of learnItems.docs.entries()) {
      console.log(`Processing document ${index + 1} of ${totalDocuments}`); // Print the progress
      try {
        const data: { [key: string]: string } = document.data() as { [key: string]: string };
        for (const key in data) {
          if (typeof data[key] === 'string') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data[key], 'text/html');
            const imgTags = doc.querySelectorAll('img');
            await Promise.all(Array.from(imgTags).map(async (img, imgIndex) => {
              const src = img.getAttribute('src');
              const match = src?.match(/^data:image\/(.*?);base64,/);
              if (match) {
                const base64 = src?.split(',')[1];
                if (base64) {
                  const sizeInBytes = Buffer.from(base64, 'base64').length;
                  totalSizeInBytes += sizeInBytes;

                  const extension = match[1];
                  const filePath = `images/${document.id}_${key}_${imgIndex}.${extension}`;
                  const fileRef = this.storage.ref(filePath);
                  // await this.storage.upload(filePath, base64); // FIXME
                  // const url = await fileRef.getDownloadURL().toPromise();
                  const url = 'ZZZZ FIXME'
                  console.log(`Image replaced in document ${document.id}, field ${key}, index ${imgIndex}: ${src} -> ${url}`);
                  img.setAttribute('src', url);

                  totalImagesReplaced++;
                }
              }
            }));
            data[key] = doc.body.innerHTML;
          }
        }
        await this.firestore.collection('LearnItem_Processed').doc(document.id).set(data);
        console.log(`Document ${document.id} processed successfully. No errors.`);
      } catch (error) {
        console.error(`An error occurred while processing document ${document.id}:`, error);
        errorCount++;
      }
    }
    console.log(`Processing complete. Total errors: ${errorCount}`);
    console.log(`Total images replaced: ${totalImagesReplaced}`);
    console.log(`Total size in bytes: ${totalSizeInBytes}`);
  }
}
