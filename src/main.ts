import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

registerLocaleData(ptBr, 'pt-BR');
