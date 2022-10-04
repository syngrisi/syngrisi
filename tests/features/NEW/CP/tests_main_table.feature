Feature: Test Main Table

    Scenario: Navigation to link with predefined parameters
    Navigate to url with predefined 'base_filter', 'filter', 'groupBy', 'sortBy', 'app', etc.
    e.g.: ?base_filter=%7B%22app%22%3A%2262e37f9dee40093744bb1f1e%22%2C%22run%22%3A%226336f0f4f5bda77d65be2f91%22%7D&groupBy=runs&sortBy=timestamp%3Adesc
        When I fail
