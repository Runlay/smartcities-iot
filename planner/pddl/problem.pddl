(define (problem 632)
          (:domain smart-store)

          (:init
            (temperature-high)
    (humidity-ok)
    (motion-detected)
    (pressure-high)
    (ac-off)
    (ventilation-off)
    (light-off)
    (alarm-on)
          )

          (:goal (and
            (ac-on)
    (light-on)
    (alarm-on)
          ))
        )