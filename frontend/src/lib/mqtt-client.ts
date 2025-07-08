import mqtt from 'mqtt';

// const VITE_MQTT_BROKER_HOST =
//   import.meta.env.VITE_MQTT_BROKER_HOST || 'localhost';
const VITE_MQTT_BROKER_HOST = "2a00:1e:bb80:9201:c4:5072:2ca5:65f7"
const VITE_MQTT_BROKER_PORT_WS =
  import.meta.env.VITE_MQTT_BROKER_PORT_WS || 15675;
// Wrap IPv6 address in brackets for proper URL formatting
const VITE_MQTT_BROKER_URL = `ws://[${VITE_MQTT_BROKER_HOST}]:${VITE_MQTT_BROKER_PORT_WS}/ws`;
const VITE_MQTT_BROKER_USERNMAE = import.meta.env.VITE_MQTT_BROKER_USERNAME;
const VITE_MQTT_BROKER_PASSWORD = import.meta.env.VITE_MQTT_BROKER_PASSWORD;

const VITE_MQTT_SENSOR_TOPICS =
  import.meta.env.VITE_MQTT_SENSOR_TOPICS || 'sensor/+';
const VITE_MQTT_ENVIRONMENT_TOPICS =
  import.meta.env.VITE_MQTT_ENVIRONMENT_TOPICS || 'env/+';
const VITE_MQTT_PLANNER_TOPICS =
  import.meta.env.VITE_MQTT_PLANNER_TOPICS || 'planner/+';

const TOPICS = [
  VITE_MQTT_SENSOR_TOPICS,
  VITE_MQTT_ENVIRONMENT_TOPICS,
  VITE_MQTT_PLANNER_TOPICS,
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

    this.client = mqtt.connect(VITE_MQTT_BROKER_URL, {
      username: VITE_MQTT_BROKER_USERNMAE,
      password: VITE_MQTT_BROKER_PASSWORD,
    });

    this.client.on('connect', () => {
      console.log(`Connected to MQTT broker using URL ${VITE_MQTT_BROKER_URL}`);
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
