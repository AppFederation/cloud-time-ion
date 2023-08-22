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

  private getBase64Size(base64: string): number {
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length / 4) * 3 - padding;
  }

  async processLearnItems(): Promise<void> {
    const learnItems = await this.firestore.collection('LearnItem').get().toPromise();
    const totalDocuments = learnItems.docs.length;
    let totalSizeInBytes = 0;
    let totalSizeSaved = 0;

    // Initial pass to count total images and their sizes
    for (const document of learnItems.docs) {
      const data: { [key: string]: string } = document.data() as { [key: string]: string };
      for (const key in data) {
        if (typeof data[key] === 'string') {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data[key], 'text/html');
          const imgTags = doc.querySelectorAll('img');
          Array.from(imgTags).forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
              const base64 = src.split(',')[1];
              if (base64) {
                totalSizeInBytes += this.getBase64Size(base64);
              }
            }
          });
        }
      }
    }

    console.log(`Total size in bytes to process: ${totalSizeInBytes.toLocaleString()} bytes`);

    let sizeProcessed = 0;
    let errorCount = 0;

    for (const [index, document] of learnItems.docs.entries()) {
      console.log(`Processing document ${index + 1} of ${totalDocuments}`);
      console.log(`Progress: Bytes ${sizeProcessed.toLocaleString()} of ${totalSizeInBytes.toLocaleString()} (${((sizeProcessed / totalSizeInBytes) * 100).toFixed(2)}%)`);

      try {
        let documentChanged = false;
        const data: { [key: string]: string } = document.data() as { [key: string]: string };
        for (const key in data) {
          if (typeof data[key] === 'string') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data[key], 'text/html');
            const imgTags = doc.querySelectorAll('img');
            await Promise.all(Array.from(imgTags).map(async (img, imgIndex) => {
              const src = img.getAttribute('src');
              if (src) {
                const match = src.match(/^data:image\/(.*?);base64,/);
                if (match) {
                  const base64 = src.split(',')[1];
                  if (base64) {
                    const sizeInBytes = this.getBase64Size(base64);
                    sizeProcessed += sizeInBytes;
                    totalSizeSaved += sizeInBytes;

                    const extension = match[1];
                    // const filePath = `images/${document.id}_${key}_${imgIndex}.${extension}`;
                    // const fileRef = this.storage.ref(filePath);
                    // await this.storage.upload(filePath, base64);
                    // const url = await fileRef.getDownloadURL().toPromise();
                    const url = 'FIXME ZZZ';
                    img.setAttribute('src', url);

                    documentChanged = true;
                  }
                }
              }
            }));
            if (documentChanged) {
              data[key] = doc.body.innerHTML;
            }
          }
        }

        if (documentChanged) {
          await this.firestore.collection('LearnItem_Processed').doc(document.id).set(data);
        }

        console.log(`Document ${document.id} processed successfully. No errors.`);
      } catch (error) {
        console.error(`An error occurred while processing document ${document.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Processing complete. Total errors: ${errorCount}`);
    console.log(`Total size in bytes saved: ${totalSizeSaved.toLocaleString()} bytes`);
  }
}
