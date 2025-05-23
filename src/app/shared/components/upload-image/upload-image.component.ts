import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';

import { FileUploadModule } from 'primeng/fileupload';
import { ImageService } from '../../../services';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrl: './upload-image.component.scss',
    imports: [CommonModule, FileUploadModule, ButtonModule, ToastModule],
    providers: [MessageService, ImageService]
})
export class UploadImageComponent {
    @Input() image: string = '';
    uploadedFiles: any[] = [];

    constructor(
        private imageService: ImageService,
        private messageService: MessageService
    ) {}

    // onUpload(event: any) {
    //     for (const file of event.files) {
    //         this.uploadedFiles.push(file);
    //     }

    //     this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    // }

    onSend(fu: any) {
        for (const file of fu.files) {
            this.imageService.upload(file).subscribe({
                next: (res) => {
                    if (!res.filePath) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed' });
                        return;
                    }

                    this.image = res.filePath;
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed' });
                }
            });
        }
    }
}
