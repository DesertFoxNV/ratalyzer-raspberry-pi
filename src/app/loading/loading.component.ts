import { Component, Input } from '@angular/core';
import { Animations } from '../../assets/animations/animations';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  animations: [Animations.fadeIn]
})
export class LoadingComponent
{
  @Input() loading = true;
}
