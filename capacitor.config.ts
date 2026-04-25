import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tieba.market',
  appName: 'Tieba Market',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
