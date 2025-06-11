import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'ws://localhost:15675/ws';
const MQTT_SENSOR_TOPIC = 'sensor/#';
const MQTT_ACTUATOR_TOPIC = 'actuator/#';

let mqttClient: mqtt.MqttClient | null = null;

export const connectMQTT = (
  handleMessage: (topic: string, message: object) => void
): void => {
  if (mqttClient) {
    return;
  }

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
      const parsedMessage = JSON.parse(message.toString());
      handleMessage(topic, parsedMessage);
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
