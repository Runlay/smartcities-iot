import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'ws://localhost:15675/ws';
const MQTT_SENSOR_TOPICS = 'sensor/+';
const MQTT_ACTUATOR_TOPICS = 'actuator/+';
const MQTT_ENVIRONMENT_TOPICS = 'env/+';
const MQTT_PLAN_TOPICS = 'planner/+';

const TOPICS = [
  MQTT_SENSOR_TOPICS,
  MQTT_ACTUATOR_TOPICS,
  MQTT_ENVIRONMENT_TOPICS,
  MQTT_PLAN_TOPICS,
];

interface MessageHandler {
  topicPrefix: string;
  handler: (topic: string, message: object) => void;
}

class MqttClient {
  private client: mqtt.MqttClient | null = null;
  private messageHandlers: MessageHandler[] = [];
  private isConnected = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (this.client) {
      return;
    }

    console.log('Connecting to MQTT broker...');

    this.client = mqtt.connect(MQTT_BROKER_URL, {
      username: 'guest',
      password: 'guest',
    });

    this.client.on('connect', () => {
      console.log(`Connected to MQTT broker using URL ${MQTT_BROKER_URL}`);
      this.isConnected = true;

      this.client!.subscribe(TOPICS, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topics ${TOPICS}. Error:`, err);
        } else {
          console.log(`Subscribed to topics ${TOPICS}`);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());

        this.messageHandlers.forEach(({ topicPrefix, handler }) => {
          if (topic.startsWith(topicPrefix)) {
            handler(topic, parsedMessage);
          }
        });
      } catch (error) {
        console.error(
          `Failed to parse message from topic ${topic}. Error:`,
          error
        );
      }
    });

    this.client.on('error', (error) => {
      console.error(`MQTT connection error:`, error);
      this.isConnected = false;
      this.client = null;
    });

    this.client.on('close', () => {
      console.log('MQTT connection closed.');
      this.isConnected = false;
      this.client = null;
    });
  }

  public addMessageHandler(
    topicPrefix: string,
    handler: (topic: string, message: object) => void
  ): void {
    this.messageHandlers.push({ topicPrefix, handler });
  }

  public removeMessageHandler(
    topicPrefix: string,
    handler: (topic: string, message: object) => void
  ): void {
    this.messageHandlers = this.messageHandlers.filter(
      (h) => h.topicPrefix !== topicPrefix || h.handler !== handler
    );
  }

  public publish(topic: string, message: object): void {
    if (!this.isConnected || !this.client) {
      console.error('MQTT client is not connected. Cannot publish message.');
      return;
    }

    const messageString = JSON.stringify(message);
    this.client.publish(topic, messageString, (err) => {
      if (err) {
        console.error(
          `Failed to publish message to topic ${topic}. Error:`,
          err
        );
      } else {
        console.log(`Message published to topic ${topic}:`, messageString);
      }
    });
  }

  public disconnect(): void {
    if (this.client) {
      this.client.end(() => {
        this.isConnected = false;
        this.client = null;
        console.log('Disconnected from MQTT broker.');
      });
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

const mqttClient = new MqttClient();

export const addMqttMessagehandler = (
  topicPrefix: string,
  handler: (topic: string, message: object) => void
): void => {
  mqttClient.addMessageHandler(topicPrefix, handler);
};

export const removeMqttMessageHandler = (
  topicPrefix: string,
  handler: (topic: string, message: object) => void
): void => {
  mqttClient.removeMessageHandler(topicPrefix, handler);
};

export const publishMqttMessage = (topic: string, message: object): void => {
  mqttClient.publish(topic, message);
};

export const disconnectMqttClient = (): void => {
  mqttClient.disconnect();
};

export const getMqttConnectionStatus = (): boolean => {
  return mqttClient.getConnectionStatus();
};
