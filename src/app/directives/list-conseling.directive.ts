import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appListConseling]'
})
export class ListConselingDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
