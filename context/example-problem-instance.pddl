(define (problem smart-store-problem-123)
  (:domain smart-store)

  ;; Initial state: Current sensor readings and actuator states
  (:init
    ;; Sensor states
    (temperature-high)
    (humidity-ok)
    (pressure-ok)
    (no-motion-detected)

    ;; Actuator states
    ;; All actuators are implicitly off (no predicates needed)
  )

  ;; Goal state: Desired actuator configuration based on sensor readings
  (:goal (and
    (ac-on) ;; Turn on AC because temperature is high
    ;; all other actuators remain off (implicitly by not bein gin the goal state)
  ))
)
