import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appConselingSchedule]'
})
export class ConselingScheduleDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
