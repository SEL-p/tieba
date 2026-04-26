import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tieba.market',
  appName: 'Tieba Market',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: 'http://192.168.1.67:3000',
    cleartext: true
  }
};

export default config;
