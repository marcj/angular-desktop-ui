import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public title: string = 'iconfont-generator';

    public radioValue: string = 'a';
    public selectBox1?: string = undefined;

    public setDarkMode(active: boolean) {
        document.body.classList.remove('dark');
        document.body.classList.remove('light');

        if (active) {
            document.body.classList.add('dark');
        }
    }
}
