import axios from 'axios';
import { DOMAIN_SERVER } from '../config';
import pkg from '../../package.json';
import i18n from '@meeting-module/locales/i18n';

const axiosInstance = axios.create({
  baseURL: DOMAIN_SERVER,
});

let cachedPrivateConfig: {
  meetingServerDomain?: string;
  meeting?: {
    serverUrl?: string;
  };
} | null = null;
let privateConfigLoading: Promise<void> | null = null;

function ensurePrivateConfigReady() {
  if (!window.isElectronNative) {
    return Promise.resolve();
  }

  if (cachedPrivateConfig) {
    return Promise.resolve();
  }

  if (!privateConfigLoading) {
    privateConfigLoading =
      window.ipcRenderer
        ?.invoke('getPrivateConfig')
        .then((privateConfig) => {
          cachedPrivateConfig = privateConfig;
          const meetingServerUrl =
            privateConfig?.meetingServerDomain ||
            privateConfig?.meeting?.serverUrl;

          if (meetingServerUrl) {
            axiosInstance.defaults.baseURL = meetingServerUrl;
          }
        })
        .catch((error) => {
          console.log('getPrivateConfig error', error);
        }) || Promise.resolve();
  }

  return privateConfigLoading;
}

axiosInstance.interceptors.request.use(
  async function (config) {
    await ensurePrivateConfigReady();

    config.headers = {
      ...config.headers,
      clientType: 'Web',
      versionCode: pkg.version,
      'Accept-Language': i18n.language,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    const code = response.data.code;

    if (code === 0) {
      return response.data.data;
    } else {
      return Promise.reject(response.data);
    }
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;
