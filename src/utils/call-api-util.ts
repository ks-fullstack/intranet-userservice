import axios, { AxiosRequestConfig} from "axios";
import APIConfig from "./config";

const buildAuthHeader = (apiName: string, token?: string): Record<string, string> => {
  const apiConfig = APIConfig.config.externalApisConfig?.[apiName];
  const authHeaders: Record<string, string> = {};
  if (!apiConfig?.authConfig) {
    return {};
  }

  const { type, username, password, headerName, tokenPrefix } = apiConfig.authConfig;

  switch (type) {
    case "bearer":
      authHeaders["Authorization"] = `Bearer ${token}`;
      break;
    case "basic":
      authHeaders["Authorization"] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
      break;
    case "apiKey":
      if (headerName && APIConfig.config.externalApisConfig?.[apiName]?.apiKey) {
        authHeaders[headerName] = APIConfig.config.externalApisConfig?.[apiName]?.apiKey || "";
      }
      break;
    case "custom":
      if (headerName && tokenPrefix && APIConfig.config.externalApisConfig?.[apiName]?.apiKey) {
        authHeaders[headerName] = `${tokenPrefix || ''} ${APIConfig.config.externalApisConfig?.[apiName]?.apiKey}`.trim();
      }
      break;
    case "none":
    default:
      console.warn(`No authentication configured for API: ${apiName}`);
      break;
  }
  return authHeaders;
};

const callAPI = async (apiName: string, endpoint: string, options: AxiosRequestConfig, token: string = ""): Promise<any> => {
  try {
    const baseUrl = APIConfig.config.externalApisConfig?.[apiName]?.baseUrl;
    if (!baseUrl) {
      throw new Error(`API configuration for ${apiName} not found`);
    }

    if (!APIConfig.config.externalApisConfig?.[apiName]?.enabled) {
      throw new Error(`API ${apiName} is disabled in configuration`);
    }

    const headers = {
      ...buildAuthHeader(apiName, token),
      ...(APIConfig.config.externalApisConfig?.[apiName]?.defaultHeaders || {})
    }

    const axiosConfig: AxiosRequestConfig = {
      baseURL: baseUrl,
      url: endpoint,
      method: options.method,
      headers,
      data: options.data,
      params: options.params,
      timeout: (APIConfig.config.externalApisConfig?.[apiName]?.timeout || 30) * 1000,
      validateStatus: () => true, // handle errors manually
    };

    const response = await axios(axiosConfig);
    if (APIConfig.config.externalApisConfig?.[apiName]?.retryCount && response.status >= 500) {
      let attempts = 0;
      const maxRetries = APIConfig.config.externalApisConfig[apiName].retryCount || 0;
      while (attempts < maxRetries) {
        attempts++;
        const retryResponse = await axios(axiosConfig);
        if (retryResponse.status >= 200 && retryResponse.status < 300) {
          return retryResponse.data;
        }
      }
    }

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`API ${apiName} call failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`Error calling API ${apiName}:`, error);
    throw new Error(`Failed to call API ${apiName}`);
  }
};

export { callAPI };
