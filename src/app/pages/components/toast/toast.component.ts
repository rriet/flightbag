import { Component, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/services/toast-service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html'
})
export class ToastComponent {

  constructor(public _toastService: ToastService) {}

  isTemplate(toast:any) { return toast.textOrTpl instanceof TemplateRef; }

}
