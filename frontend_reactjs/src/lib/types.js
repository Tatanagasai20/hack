/**
 * Type definitions for Urban Ops application
 * Using JSDoc comments for type checking in JavaScript
 */

/**
 * @typedef {Object} Location
 * @property {number} lat - Latitude coordinate
 * @property {number} lng - Longitude coordinate
 * @property {string} address - Address string
 */

/**
 * @typedef {Object} LastReading
 * @property {number} value - Reading value
 * @property {string} unit - Unit of measurement
 * @property {string} timestamp - ISO timestamp string
 */

/**
 * @typedef {Object} Incident
 * @property {string} id - Unique incident identifier
 * @property {string} title - Incident title
 * @property {string} description - Incident description
 * @property {string} status - Incident status: 'active' | 'investigating' | 'resolved' | 'closed'
 * @property {string} severity - Severity level: 'critical' | 'high' | 'medium' | 'low'
 * @property {string} type - Incident type (e.g., 'traffic', 'safety', 'environmental')
 * @property {Location} location - Location object with coordinates and address
 * @property {string} reportedAt - ISO timestamp when incident was reported
 * @property {string|null} resolvedAt - ISO timestamp when incident was resolved (null if not resolved)
 * @property {string|null} assignedTo - Username of assigned user (null if unassigned)
 * @property {string[]} tags - Array of tag strings
 */

/**
 * @typedef {Object} Sensor
 * @property {string} id - Unique sensor identifier
 * @property {string} name - Sensor name
 * @property {string} type - Sensor type: 'traffic' | 'air_quality' | 'noise' | 'water' | 'weather'
 * @property {string} status - Sensor status: 'online' | 'offline' | 'maintenance'
 * @property {Location} location - Location object with coordinates and address
 * @property {LastReading} lastReading - Last reading data
 * @property {Array} metrics - Array of metric data points
 */

// ✅ Export dummy schemas to allow JS imports (resolves the build error)
export const Incident = {};
export const Sensor = {};
