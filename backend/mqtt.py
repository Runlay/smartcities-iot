import paho.mqtt.client as mqtt
mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

mqttc.connect("http://localhost/1883", 1883, 60)