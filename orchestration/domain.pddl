(define (domain smart-store)

  ;; Level 1 PDDL (STRIPS and ADL)
  (:requirements :strips :adl)
  
  ;; Predicates
  (:predicates
    ;; Temperature sensor states
    (temperature-low)
    (temperature-ok)
    (temperature-high)
    
    ;; Humidity sensor states
    (humidity-low)
    (humidity-ok)
    (humidity-high)
    
    ;; Pressure sensor states
    (pressure-ok)
    (pressure-high)
    
    ;; Motion sensor states
    (motion-detected)
    (no-motion-detected)
    
    ;; Actuator states
    (ac-on)
    (ventilation-on)
    (light-on)
    (alarm-on)
  )
  
  ;; Action to turn AC on when temperature is high
  (:action turn-ac-on
    :parameters ()
    :precondition (and 
      (temperature-high)
      (not (ac-on))
    )
    :effect (ac-on)
  )

  ;; Action to turn AC off when temperature is not high
  (:action turn-ac-off
    :parameters ()
    :precondition (and 
      (or (temperature-low) (temperature-ok))
      (ac-on)
    )
    :effect (not (ac-on))
  )

  ;; Action to turn ventilation on when humidity is high
  (:action turn-ventilation-on
    :parameters ()
    :precondition (and 
      (humidity-high)
      (not (ventilation-on))
    )
    :effect (ventilation-on)
  )

  ;; Action to turn ventilation off when humidity is not high
  (:action turn-ventilation-off
    :parameters ()
    :precondition (and 
      (or (humidity-low) (humidity-ok))
      (ventilation-on)
    )
    :effect (not (ventilation-on))
  )

  ;; Action to turn light on when motion is detected
  (:action turn-light-on
    :parameters ()
    :precondition (and 
      (motion-detected)
      (not (light-on))
    )
    :effect (light-on)
  )

  ;; Action to turn light off when no motion is detected
  (:action turn-light-off
    :parameters ()
    :precondition (and 
      (no-motion-detected)
      (light-on)
    )
    :effect (not (light-on))
  )

  ;; Action to turn alarm on when pressure is high
  (:action turn-alarm-on
    :parameters ()
    :precondition (and 
      (pressure-high)
      (not (alarm-on))
    )
    :effect (alarm-on)
  )

  ;; Action to turn alarm off when pressure is ok
  (:action turn-alarm-off
    :parameters ()
    :precondition (and 
      (pressure-ok)
      (alarm-on)
    )
    :effect (not (alarm-on))
  )
)