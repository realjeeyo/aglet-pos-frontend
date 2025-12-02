/**
 * API Configuration
 * Centralized API endpoint configuration for the application
 */

export const API_URL = "http://localhost:3000/api";

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint path (without base URL)
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} If the request fails
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'An unexpected error occurred');
  }
}
