import type { SensorReading } from '@/types/types';
import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'ws://localhost:15675/ws';
const MQTT_SENSOR_TOPIC = 'sensors/#';
const MQTT_ACTUATOR_TOPIC = 'actuators/#';

let mqttClient: mqtt.MqttClient | null = null;

export const connectMQTT = (
  setSensorReadings: (sensorReading: SensorReading) => void
): void => {
  if (mqttClient) {
    return;
  }

  // client has disabled auto reconnect
  // TODO: move credentials to .env
  mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    reconnectPeriod: 0,
    username: 'guest',
    password: 'guest',
  });

  mqttClient.on('connect', () => {
    console.log(`Connected to MQTT broker on URL ${MQTT_BROKER_URL}`);

    mqttClient!.subscribe([MQTT_SENSOR_TOPIC, MQTT_ACTUATOR_TOPIC], (err) => {
      if (err) {
        console.error(
          `Failed to subscribe to topics ${MQTT_SENSOR_TOPIC}, ${MQTT_ACTUATOR_TOPIC}. The following error occured:`,
          err
        );
      } else {
        console.log(
          `Subscribed to topics: ${MQTT_SENSOR_TOPIC}, ${MQTT_ACTUATOR_TOPIC}`
        );
      }
    });
  });

  mqttClient.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);

    try {
      const newSensorReading = JSON.parse(message.toString()) as SensorReading;

      // append sensor reading to list of sensor readings
      setSensorReadings(newSensorReading);

      // update current sensor values
      // TODO: define enum for sensor types -> maybe put into one context and combine with reducer

      // TODO: update current actuator values
    } catch (error) {
      console.error(
        'Failed to parse sensor reading message. The following error occured:',
        error
      );
    }
  });
};

export const disconnectMQTT = (): void => {
  if (mqttClient) {
    mqttClient.end(() => {
      mqttClient = null;
      console.log('Disconnected from MQTT broker.');
    });
  }
};
