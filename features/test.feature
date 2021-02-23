Feature: functionality
 
Scenario: Load the products list
    When we request the products list
    Then we should receive
        | name                                 | description                                                                |
        | Fix the monitor                      | Take the monitor to the master so that he can fix the monitor after a fall |
        | To water the flowers on the balcony  | The flowers on the balcony dry out very quickly                            |
        | Sign up for a gym                    | Belly fat begins to confuse passers-by                                     |

Scenario: Routing
    Given first view
    When we click on the first item
    Then we rout to details page with specific info

Scenario: Routing with activated checkbox
    When we click on the second item with activated header checkbox
    Then we rout to details page with opened dialog form with id "4"

Scenario: Search by name
    Given search field
    When we enter "Fix the monitor" in the input field
    Then we see items matching the request

Scenario: Go to the second view and reload page 
    When we go to the second view
    And reload the page
    Then we should see opened dialog 

Scenario: Data checking
    When dialog with some data
    Then data from dialog is equal to data from section