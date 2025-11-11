import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    public year: number = new Date().getFullYear();
}
