import type { SensorReading } from '@/types/types';
import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'ws://localhost:15675/ws';
const MQTT_TOPIC = 'sensor';

let mqttClient: mqtt.MqttClient | null = null;

export const connectMQTT = (
  setSensorReadings: (sensorReading: SensorReading) => void
): void => {
  if (mqttClient) {
    return;
  }

  // client has disable auto reconnect
  mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    reconnectPeriod: 0,
    username: 'guest',
    password: 'guest',
  });

  mqttClient.on('connect', () => {
    console.log(`Connected to MQTT broker on URL ${MQTT_BROKER_URL}`);

    mqttClient!.subscribe(MQTT_TOPIC, (err) => {
      if (err) {
        console.error(
          `Failed to subscribe to topic ${MQTT_TOPIC}. The following error occured:`,
          err
        );
      } else {
        console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
      }
    });
  });

  mqttClient.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);

    try {
      const sensorReading = JSON.parse(message.toString());
      setSensorReadings(sensorReading);
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
