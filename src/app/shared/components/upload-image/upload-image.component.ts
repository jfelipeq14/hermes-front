import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
    @Output() uploadImage = new EventEmitter<any>();
    uploadedFiles: any[] = [];

    constructor(
        private imageService: ImageService,
        private messageService: MessageService
    ) {}

    onSend(fu: any) {
        this.imageService.upload(fu.files[0]).subscribe({
            next: (res) => {
                if (!res.filePath) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File Upload Failed' });
                    return;
                }

                this.uploadImage.emit(res.filePath);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded' });
            }
        });
    }
}
