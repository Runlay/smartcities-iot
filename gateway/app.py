from openzwave.option import ZWaveOption
from openzwave.network import ZWaveNetwork

device = "/dev/ttyUSB0"

options = ZWaveOption(device, config_path="/usr/local/etc/openzwave", user_path=".", cmd_line="")
options.lock()

network = ZWaveNetwork(options, log=None)

print("Waiting for network to become ready...")
import time
for i in range(30):
    if network.state >= network.STATE_READY:
        break
    print(".", end="", flush=True)
    time.sleep(1)

print("\nNetwork ready:", network.is_ready)