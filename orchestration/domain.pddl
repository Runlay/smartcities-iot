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
    (ac-off)
    (ventilation-on)
    (ventilation-off)
    (light-on)
    (light-off)
    (alarm-on)
    (alarm-off)
  )
  
  ;; Action to turn AC on when temperature is high
  (:action turn-ac-on
    :parameters ()
    :precondition (and 
      (temperature-high)
      (ac-off)
    )
    :effect (and (ac-on) (not (ac-off)))
  )

  ;; Action to turn AC off when temperature is not high
  (:action turn-ac-off
    :parameters ()
    :precondition (and 
      (or (temperature-low) (temperature-ok))
      (ac-on)
    )
    :effect (and (ac-off) (not (ac-on)))
  )

  ;; Action to turn ventilation on when humidity is high
  (:action turn-ventilation-on
    :parameters ()
    :precondition (and 
      (humidity-high)
      (ventilation-off)
    )
    :effect (and (ventilation-on) (not (ventilation-off)))
  )

  ;; Action to turn ventilation off when humidity is not high
  (:action turn-ventilation-off
    :parameters ()
    :precondition (and 
      (or (humidity-low) (humidity-ok))
      (ventilation-on)
    )
    :effect (and (ventilation-off) (not (ventilation-on)))
  )

  ;; Action to turn light on when motion is detected
  (:action turn-light-on
    :parameters ()
    :precondition (and 
      (motion-detected)
      (light-off)
    )
    :effect (and (light-on) (not (light-off)))
  )

  ;; Action to turn light off when no motion is detected
  (:action turn-light-off
    :parameters ()
    :precondition (and 
      (no-motion-detected)
      (light-on)
    )
    :effect (and (light-off) (not (light-on)))
  )

  ;; Action to turn alarm on when pressure is high
  (:action turn-alarm-on
    :parameters ()
    :precondition (and 
      (pressure-high)
      (alarm-off)
    )
    :effect (and (alarm-on) (not (alarm-off)))
  )

  ;; Action to turn alarm off when pressure is ok
  (:action turn-alarm-off
    :parameters ()
    :precondition (and 
      (pressure-ok)
      (alarm-on)
    )
    :effect (and (alarm-off) (not (alarm-on)))
  )
)