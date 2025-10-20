import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { RemoteConfigService } from './core/services/remote-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  menuEnabled = true;
  constructor(private platform: Platform,
    private rcService: RemoteConfigService,
  private menu: MenuController, private router: Router) {
    this.initializeApp();
  }

    async ngOnInit() {
    this.menuEnabled = await this.rcService.isMenuEnabled();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('App inicializada');
    });
  }

  navigateTo(url: string) {
    this.menu.close();
    this.router.navigate([url]);

  }
}
