# Smart Cities and Internet of Things: SmartStore – Smart Warehouse IoT System

A distributed IoT system for intelligent warehouse management using AI planning, sensor monitoring, and automated control systems.

## Project Requirements & Implementation

### Course Requirements

1. **System Distribution**:
   - 2+ machines
2. **System Integration**:
   - Indirect communication between components (e.g., publish-subscribe or message queues)
3. **AI Planning**:
   - PDDL domain model
   - Automatic generation of problem instances
   - Usage of a suitable AI planner
4. **IoT**:
   - 4+ sensors
   - 4+ actuators
     - 2+ physical and 2+ software-based, human-based, simulated, or virtual
5. **System Design**:
   - Modular component architecture
6. **Visualization**:
   - Current environment state
   - Active plans

### System Focus

- **Domain**: Smart Building
- **Type**: Warehouse
- **Functionality**:
  - **Monitoring**: Temperature, humidity, motion detection, pressure (storage rack weight)
  - **Automation**: AC control, ventilation, lighting, safety alarms
- **Components**: HVAC system, lighting, ventilation, alarm system
- **Objectives**: Energy efficiency and safety optimization

### IoT Implementation

- **Sensors**: Temperature, humidity, motion, pressure (4 sensors)
- **Actuators**: Lighting (physical), alarm (physical), AC (virtual), ventilation (virtual) (4 actuators)
- **Communication**: MQTT publish-subscribe with JSON messages
- **Hardware**: Raspberry Pi with sensor/actuator interfaces

## System Architecture

### Components Overview

#### **Gateway Service**

- IoT device management and abstraction layer
- Sensor data collection and actuator control
- Hardware interface for Raspberry Pi components
- Publishes sensor data to MQTT topics

#### **Messaging Service**

- MQTT broker for publish-subscribe communication
- Handles all inter-component messaging
- Topics: `/sensor/*`, `/actuator/*`, `/planner/*`, `/state/*`

#### **Backend Service**

- REST API server for system management
- Interfaces with Redis database for sensor data
- Provides endpoints for frontend and system configuration

#### **Database Service**

- Redis key-value store for sensor readings
- Fast data retrieval for real-time operations
- Historical data storage

#### **Frontend Service**

- Web dashboard for system visualization
- Real-time sensor data display
- Current plan execution status
- (User configuration interface)

#### **Context Service**

- Environment state management (transforms sensor readings into processable format)
- PDDL problem instance generation from sensor data

#### **AI Planner**

- Has fixed domain description
- Gets new problem instance from context whenever environment state changes (new sensor readings)
- Creates plan based on new input and sends it to orchestration service

#### **Orchestration Service**

- Gets plan from AI planner
- Maps it to actual actuator actions
- Forwards it to the gateway via messaging to trigger execution

## System Workflow

### Data Flow Process

1. **Sensor Collection**: Gateway reads physical sensors (temperature, humidity, motion, pressure)
2. **Data Publishing**: Gateway publishes sensor data to MQTT topics (`/sensor/temperature`, `/sensor/humidity`, etc.)
3. **State Management**: Context service subscribes to sensor topics, updates environment state
4. **Problem Generation**: Context creates PDDL problem instances when conditions require action
5. **AI Planning**: AI Planner receives problem instances, generates action plans using PDDL solver
6. **Plan Execution**: Orchestration service maps planned actions to specific actuator commands
7. **Actuator Control**: Gateway receives actuator commands, executes physical/virtual device actions
8. **Feedback Loop**: Actuator states published back to system for state verification

### MQTT Topic Structure

```
sensor/
├── temperature
├── humidity
├── motion
└── pressure

env/state

planner/
├── problem
└── plan

actuator/
├── lighting/
    ├── command
    └── state
├── alarm/
    ├── command
    └── state
├── ac/
    ├── command
    └── state
└── ventilation/
    ├── command
    └── state
```

### AI Planning Integration

- **Domain Model**: PDDL file defining warehouse environment, objects, and actions
- **Problem Generation**: Automatic creation of problem instances from sensor thresholds
- **Planner Tool**: FAST-DOWNWARD or similar PDDL solver
- **Execution Mapping**: Translation of abstract plans to concrete actuator commands

## Development Setup

Each service runs in isolated Docker containers with docker-compose orchestration. The system supports both development (single machine) and production (distributed) deployment configurations.
