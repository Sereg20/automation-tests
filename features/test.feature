Feature: functionality
 
Scenario: Load the products list
    When we request the products list
    Then we should receive
        | name                                 | description                                                                |
        | Fix the monitor                      | Take the monitor to the master so that he can fix the monitor after a fall |
        | To water the flowers on the balcony  | The flowers on the balcony dry out very quickly                            |
        | Sign up for a gym                    | Belly fat begins to confuse passers-by                                     |

