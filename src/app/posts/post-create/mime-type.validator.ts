import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if(typeof(control.value) === 'string'){
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    fileReader.onloadend = () => { }
    const flObservable = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener("loadend", () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = "";
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }
            if (isValid){
                observer.next(null);//null means ok for validator otherwise returns errors
            }else{
                observer.next({ invalidMineType: true });
            }
            observer.complete();//let subscribers now that er are done
        });
        fileReader.readAsArrayBuffer(file);
    });
    return flObservable;
};//[indicates the property], async validator