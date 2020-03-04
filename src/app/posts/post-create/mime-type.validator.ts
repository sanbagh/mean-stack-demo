import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if (typeof(control.value) === 'string') {
        return of(null);
    }
    const file = control.value as File;
    const reader = new FileReader();
    const frObs = of<{[key: string]: any}>((observer: Observer<{[key: string]: any}>) => {
      reader.addEventListener('loadend', () => {
         const data = new  Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
         let header = '';
         let isValid = false;
         // tslint:disable-next-line: prefer-for-of
         for (let i = 0; i < data.length; i++ ) {
                header += data[i].toString(16);
         }
         switch (header) {
          case '89504e47':
              isValid = true; break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
              isValid = true; break;
              default: isValid = false; // Or you can use the blob.type as fallbackbreak
        }
         if (isValid) {
            observer.next(null);
        } else {
            observer.next({invalidMimeType: true});
        }
    });
  });
    reader.readAsArrayBuffer(file);
    return frObs;
};
