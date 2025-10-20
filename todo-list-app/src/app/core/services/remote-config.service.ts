import { Injectable } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  constructor(private remoteConfig: AngularFireRemoteConfig) {
     this.remoteConfig.settings.then(settings => {
      settings.minimumFetchIntervalMillis = 0;
    });
  }

  async isMenuEnabled(): Promise<boolean> {
    try {
      await this.remoteConfig.fetchAndActivate();
      const enabled = this.remoteConfig.getBoolean('feature_menu_enabled');
      return enabled;
    } catch (e) {
      console.error('Error cargando Remote Config:', e);
      return true;
    }
  }
}
