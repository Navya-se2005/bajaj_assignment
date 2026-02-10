import { OFFICIAL_EMAIL } from '../constants';
import { SimulatedResponse, HttpMethod } from '../types';
import { generateFibonacci, filterPrimes, calculateLcm, calculateHcf } from './mathService';
import { getSingleWordAiResponse } from './aiService';

const createErrorResponse = (status: number, message: string): SimulatedResponse => ({
  status,
  statusText: status === 400 ? 'Bad Request' : status === 500 ? 'Internal Server Error' : 'Error',
  body: {
    is_success: false,
    official_email: OFFICIAL_EMAIL,
    error: message
  }
});

const createSuccessResponse = (data: any): SimulatedResponse => ({
  status: 200,
  statusText: 'OK',
  body: {
    is_success: true,
    official_email: OFFICIAL_EMAIL,
    data
  }
});

export const simulateApiRequest = async (method: HttpMethod, endpoint: string, bodyStr: string): Promise<SimulatedResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (method === HttpMethod.GET && endpoint === '/health') {
    return {
      status: 200,
      statusText: 'OK',
      body: {
        is_success: true,
        official_email: OFFICIAL_EMAIL
      }
    };
  }

  if (method === HttpMethod.POST && endpoint === '/bfhl') {
    let parsedBody;
    try {
      parsedBody = JSON.parse(bodyStr);
    } catch (e) {
      return createErrorResponse(400, "Invalid JSON format");
    }

    if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
      return createErrorResponse(400, "Request body must be a JSON object");
    }

    const keys = Object.keys(parsedBody);
    const validKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
    
    const presentValidKeys = keys.filter(k => validKeys.includes(k));

    if (presentValidKeys.length === 0) {
      return createErrorResponse(400, `Request must contain exactly one of: ${validKeys.join(', ')}`);
    }

    if (presentValidKeys.length > 1 || keys.length > 1) {
      return createErrorResponse(400, `Request must contain EXACTLY ONE valid key. Found multiple.`);
    }

    const key = presentValidKeys[0];
    const value = parsedBody[key];

    try {
      let result;
      switch (key) {
        case 'fibonacci':
          result = generateFibonacci(value);
          break;
        case 'prime':
          result = filterPrimes(value);
          break;
        case 'lcm':
          result = calculateLcm(value);
          break;
        case 'hcf':
          result = calculateHcf(value);
          break;
        case 'AI':
          result = await getSingleWordAiResponse(value);
          break;
        default:
          return createErrorResponse(400, "Unknown key processed."); // Should be unreachable
      }
      return createSuccessResponse(result);
    } catch (error: any) {
      // Differentiate between user input errors (400) and server errors (500)
      if (error.message.startsWith("Invalid input")) {
         return createErrorResponse(400, error.message);
      }
      return createErrorResponse(500, error.message || "Internal Server Error during processing.");
    }
  }

  return createErrorResponse(404, "Endpoint not found");
};
