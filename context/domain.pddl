(define (domain warehouse)

    ;; Requirements for simple level 1 PDDL
    (:requirements :strips :adl)

    ;; Types
    (:types
        level
    )

    ;; Predicates:
    (:predicates
        ;; Sensor States
        (temperature-state ?l - level)
        (humidity-state ?l - level)
        (motion-detected)
        (pressure-state ?l - level)

        ;; Actuator States
        (ac-on)
        (ventilation-on)
        (lighting-on)
        (alarm-activated)

        ;; Goal States
        (is-comfortable)
        (is-safe)
        (is-energy-efficient)
    )

    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    ;;; ACTIONS
    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;

    ;;; Action to cool the warehouse if it's too hot.
    (:action turn-on-ac
        :precondition (and
            (temperature-state high)        ; IF temperature is high
            (not (is-comfortable))          ; AND the goal of comfort is not yet met
        )
        :effect (and
            (ac-on)                         ; THEN turn the AC on
            (is-comfortable)                ; This action makes the environment comfortable
            
            ;; The action's effect models the transition to the desired state.
            (not (temperature-state high))
            (temperature-state ok)

            ;; Turning a device on makes the system not energy-efficient.
            (not (is-energy-efficient))
        )
    )

    ;;; Action to turn off the AC when it's no longer needed. This promotes energy efficiency.
    (:action turn-off-ac
        :precondition (and
            (temperature-state ok)          ; IF temperature is fine
            (ac-on)                         ; AND the AC is on
        )
        :effect (and
            (not (ac-on))                   ; THEN turn the AC off
            (is-energy-efficient)           ; This action helps achieve the energy efficiency goal
        )
    )

    ;;; Action to turn on ventilation if humidity is high.
    (:action turn-on-ventilation
        :precondition (and
            (humidity-state high)
            (not (is-comfortable))
        )
        :effect (and
            (ventilation-on)
            (is-comfortable)
            (not (humidity-state high))
            (humidity-state ok)
            (not (is-energy-efficient))
        )
    )

    ;;; Action to turn off ventilation when it's no longer needed.
    (:action turn-off-ventilation
        :precondition (and
            (humidity-state ok)
            (ventilation-on)
        )
        :effect (and
            (not (ventilation-on))
            (is-energy-efficient)
        )
    )

    ;;; Action to turn on the lights when motion is detected.
    (:action turn-on-lighting
        :precondition (and
            (motion-detected)
            (not (lighting-on))
        )
        :effect (and
            (lighting-on)
            (not (is-energy-efficient))
        )
    )
    
    ;;; Action to turn off the lights when no motion is detected.
    (:action turn-off-lighting
        :precondition (and
            (not (motion-detected))
            (lighting-on)
        )
        :effect (and
            (not (lighting-on))
            (is-energy-efficient)
        )
    )

    ;;; Action to trigger the alarm if pressure is too high.
    (:action activate-alarm
        :precondition (and
            (pressure-state high)           ; IF pressure is high
            (not (is-safe))                 ; AND the environment is not yet considered safe
        )
        :effect (and
            (alarm-activated)
            (is-safe)                       ; Signaling the danger makes the environment "safe" from a response standpoint
            (not (pressure-state high))
            (pressure-state ok)
        )
    )
    
    ;;; Action to deactivate the alarm once the pressure is back to normal.
    (:action deactivate-alarm
        :precondition (and
            (pressure-state ok)
            (alarm-activated)
        )
        :effect (and
            (not (alarm-activated))
            (is-safe)
        )
    )
)
