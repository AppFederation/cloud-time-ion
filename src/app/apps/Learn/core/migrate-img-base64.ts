import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MigrateImgBase64Service {
  disableUpload: boolean = true;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  private getBase64Size(base64: string): number {
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length / 4) * 3 - padding;
  }

  async processLearnItems(): Promise<void> {
    const learnItems = await this.firestore.collection('LearnItem').get().toPromise();
    const totalDocuments = learnItems.docs.length;
    let totalSizeInBytes = 0;
    let totalSizeSaved = 0;
    let totalSizeOfDocuments = 0;
    let totalImages = 0;
    let documentsWithImages = 0;
    let errorCount = 0;

    // Initial pass to count total images and their sizes
    for (const document of learnItems.docs) {
      let documentContainsImage = false;
      let documentSize = 0;
      const data: { [key: string]: string } = document.data() as { [key: string]: string };
      for (const key in data) {
        if (typeof data[key] === 'string') {
          documentSize += new Blob([data[key]]).size;
          const parser = new DOMParser();
          const doc = parser.parseFromString(data[key], 'text/html');
          const imgTags = doc.querySelectorAll('img');
          Array.from(imgTags).forEach((img) => {
            const src = img.getAttribute('src');
            if (src?.startsWith('data:image')) {
              const base64 = src.split(',')[1];
              if (base64) {
                totalSizeInBytes += this.getBase64Size(base64);
                totalImages++;
                documentContainsImage = true;
              }
            }
          });
        }
      }
      if (documentContainsImage) {
        documentsWithImages++;
      }
      totalSizeOfDocuments += documentSize;
    }

    console.log(`Total images to process: ${totalImages}`);
    console.log(`Total documents with images: ${documentsWithImages}`);
    console.log(`Total size in bytes to process: ${totalSizeInBytes.toLocaleString()} bytes`);
    console.log(`Total size of all documents: ${totalSizeOfDocuments.toLocaleString()} bytes`);

    let sizeProcessed = 0;

    for (const [index, document] of learnItems.docs.entries()) {
      console.log(`Processing document ${index + 1} of ${totalDocuments}`);
      console.log(
        `Progress: Bytes ${sizeProcessed.toLocaleString()} of ${totalSizeInBytes.toLocaleString()} (${(
          (sizeProcessed / totalSizeInBytes) *
          100
        ).toFixed(2)}%)`
      );

      try {
        let documentChanged = false;
        const data: { [key: string]: string } = document.data() as { [key: string]: string };
        for (const key in data) {
          if (typeof data[key] === 'string') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data[key], 'text/html');
            const imgTags = doc.querySelectorAll('img');
            for (const img of Array.from(imgTags)) {
              const src = img.getAttribute('src');
              if (src?.startsWith('data:image')) {
                const base64 = src.split(',')[1];
                if (base64) {
                  const fileType = src.split(',')[0].match(/:(.*?);/)?.[1];
                  const filePath = `images/${document.id}_${key}_${Date.now()}.${fileType?.split('/')[1] || 'png'}`;
                  let url: string;

                  if (!this.disableUpload) {
                    const fileRef = this.storage.ref(filePath);
                    await fileRef.putString(base64, 'base64');
                    url = await fileRef.getDownloadURL().toPromise();
                  } else {
                    url = `https://mockurl.com/${filePath}`;
                  }

                  img.setAttribute('src', url);
                  totalSizeSaved += this.getBase64Size(base64);
                  documentChanged = true;
                  console.log(`Replaced image: ${src}`);
                }
              }
            }
            data[key] = doc.body.innerHTML;
          }
        }

        if (documentChanged) {
          await this.firestore.collection('LearnItem_Processed').doc(document.id).set(data);
          sizeProcessed += totalSizeSaved;
        }

        console.log(`Document ${document.id} processed successfully. No errors.`);
      } catch (error) {
        console.error(`An error occurred while processing document ${document.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Processing complete. Total errors: ${errorCount}`);
    console.log(`Total images processed: ${totalImages}`);
    console.log(`Total documents with images processed: ${documentsWithImages}`);
    console.log(`Total size in bytes saved: ${totalSizeSaved.toLocaleString()} bytes`);
    console.log(
      `Percentage of bytes saved compared to total size of all documents: ${(
        (totalSizeSaved / totalSizeOfDocuments) *
        100
      ).toFixed(2)}%`
    );
  }
}
