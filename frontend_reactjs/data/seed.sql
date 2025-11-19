-- Sample data for AI Urban Ops

-- Insert sample incidents
INSERT INTO incidents (title, description, status, severity, type, location, reported_at, assigned_to, tags)
VALUES
  ('Water main break on Main Street', 'Major water main rupture causing flooding', 'active', 'critical', 'infrastructure', '{"lat": 40.7128, "lng": -74.0060, "address": "123 Main Street, New York, NY"}', NOW() - INTERVAL '2 hours', 'John Smith', ARRAY['water', 'infrastructure', 'urgent']),
  ('Traffic accident at 5th Avenue', 'Multi-vehicle collision blocking traffic', 'investigating', 'high', 'traffic', '{"lat": 40.7614, "lng": -73.9776, "address": "5th Avenue & 42nd Street, New York, NY"}', NOW() - INTERVAL '1 hour', 'Jane Doe', ARRAY['traffic', 'accident']),
  ('Power outage in downtown area', 'Electrical grid failure affecting 500 buildings', 'active', 'critical', 'infrastructure', '{"lat": 40.7489, "lng": -73.9680, "address": "Downtown District, New York, NY"}', NOW() - INTERVAL '30 minutes', NULL, ARRAY['power', 'infrastructure']),
  ('Street lighting malfunction', 'Multiple street lights out on Park Avenue', 'resolved', 'medium', 'maintenance', '{"lat": 40.7549, "lng": -73.9840, "address": "Park Avenue, New York, NY"}', NOW() - INTERVAL '5 hours', 'Mike Johnson', ARRAY['lighting', 'maintenance']),
  ('Air quality alert', 'Elevated pollution levels detected', 'investigating', 'medium', 'environment', '{"lat": 40.7580, "lng": -73.9855, "address": "Midtown Manhattan, New York, NY"}', NOW() - INTERVAL '3 hours', 'Sarah Williams', ARRAY['environment', 'air-quality']);

-- Insert sample sensors
INSERT INTO sensors (name, type, status, location, last_reading)
VALUES
  ('Air Quality Sensor AQ-001', 'air_quality', 'online', '{"lat": 40.7580, "lng": -73.9855, "address": "Times Square, New York, NY"}', '{"value": 85, "unit": "AQI", "timestamp": "2025-11-05T09:00:00Z"}'),
  ('Traffic Monitor TM-042', 'traffic', 'online', '{"lat": 40.7614, "lng": -73.9776, "address": "5th Avenue, New York, NY"}', '{"value": 342, "unit": "vehicles/hr", "timestamp": "2025-11-05T09:00:00Z"}'),
  ('Noise Sensor NS-015', 'noise', 'online', '{"lat": 40.7549, "lng": -73.9840, "address": "Park Avenue, New York, NY"}', '{"value": 68, "unit": "dB", "timestamp": "2025-11-05T09:00:00Z"}'),
  ('Water Quality WQ-023', 'water', 'maintenance', '{"lat": 40.7128, "lng": -74.0060, "address": "Hudson River Pier, New York, NY"}', '{"value": 7.2, "unit": "pH", "timestamp": "2025-11-05T08:45:00Z"}'),
  ('Weather Station WS-008', 'weather', 'online', '{"lat": 40.7489, "lng": -73.9680, "address": "Central Park, New York, NY"}', '{"value": 18, "unit": "°C", "timestamp": "2025-11-05T09:00:00Z"}');

-- Insert sample sensor readings for the first sensor
INSERT INTO sensor_readings (sensor_id, value, timestamp)
SELECT
  (SELECT id FROM sensors WHERE name = 'Air Quality Sensor AQ-001' LIMIT 1),
  70 + (random() * 40)::numeric,
  NOW() - (interval '1 hour' * generate_series)
FROM generate_series(0, 23);

-- Insert sample CCTV cameras
INSERT INTO cctv_cameras (name, location, status, stream_url, recording_enabled)
VALUES
  ('Camera CAM-101', '{"lat": 40.7580, "lng": -73.9855, "address": "Times Square North"}', 'online', 'rtsp://camera101.urbanops.city/stream', true),
  ('Camera CAM-102', '{"lat": 40.7614, "lng": -73.9776, "address": "5th Avenue & 42nd St"}', 'online', 'rtsp://camera102.urbanops.city/stream', true),
  ('Camera CAM-103', '{"lat": 40.7549, "lng": -73.9840, "address": "Park Avenue South"}', 'offline', 'rtsp://camera103.urbanops.city/stream', false),
  ('Camera CAM-104', '{"lat": 40.7489, "lng": -73.9680, "address": "Central Park Entrance"}', 'online', 'rtsp://camera104.urbanops.city/stream', true),
  ('Camera CAM-105', '{"lat": 40.7128, "lng": -74.0060, "address": "Main Street Plaza"}', 'online', 'rtsp://camera105.urbanops.city/stream', true);
