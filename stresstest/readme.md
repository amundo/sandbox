# Stress Test
This small app is designed to test which method of solving the data/view conundrum is optimal. In general, it can be extended in order to test the effects of various coding decisions on how long it takes to display the entirety of the Chitimacha corpus.

In its current instantiation, **stresstest** is designed to test which of these two methods of solving the data/view conundrum displays the data faster:
1. Add unique identifiers into the DOM using node IDs
2. Add event listeners to every node in the DOM

The user selects which method they want to render the corpus with, and the app displays the time it took for the function to run. Each stress test is stored in local storage with the details of the test, in case we want to export and compare the data in the future. This also allows the stress tests to be machine- and browser-specific.
