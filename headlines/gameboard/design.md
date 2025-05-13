# Dashboards

Use Dashboards to get an overview of your modeling and test execution activities, as well as to analyze test cases in Eggplant DAI. Dashboards help you determine the status of your test project. For example, whether your test cases have all been hit, percentage of passed vs failed test cases, and so on. There are three types of dashboards in Eggplant DAI:

* [Test Case](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/) - provides an overview of your script-based test case results.
* [Model](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/) - provides a recap of your recent directed and exploratory testing.
* [Exploratory](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/) - provides an overview of your testing in chart reports.





# Test Case Dashboard

The Test case dashboard provides an overview of the various test case reports for both script-based and model-based test cases. You can use this dashboard to gain insights and analyze aggregated data for all your test cases, enabling you to make informed decisions and enhance your testing processes. By default, the dashboard shows data from the last 7 days, covering all your models and suites. However, you can tailor the view by customizing both the date range and applying filters to focus on a specific model or suite as needed.

note

* Information about test cases created before DAI version 6.1 will not show in this dashboard because they do not have test case IDs.
* The total Number of Test Case Results on the Test Case Dashboard may differ from the Number of Test Results.

## Launching the Test case dashboard[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#launching-the-test-case-dashboard)

To get started, simply go to **Dashboards > Test Case**.

## Test case dashboard[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#test-case-dashboard)

The following reports make up the **Test case dashboard**. Each one provides a help (?) button to provide explanations of the data they are reporting.

* [Filters](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#filters)
* [Test case run summary bar](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#test-case-run-summary-bar)
* [Test case runs per day](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#test-case-runs-per-day)
* [Test case results by status](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#test-case-results-by-status)
* [Top 10 longest running test cases](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#top-10-longest-running-test-cases)
* [Top 10 test case failures](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#top-10-test-case-failures)
* [Top 10 test case errors](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#top-10-test-case-errors)

 ![The Test case dashboard](https://docs.eggplantsoftware.com/dai/assets/images/dai-dashboard-test-case-b9b9a6bca4aff0a3baf2a9dfacb15335.png)

**Note:** All reports appear blank until you run at least one test case either as a model execution or as a [Directed Test Case](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-test-case-report/#directed-test-cases).

### Filters[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#filters)

Dashboard filters let you customize all test case reports on your dashboard according to your specific needs. You can personalize your dashboard by adjusting the date range and applying filters on specific models or suites.

 ![Test case dashboard filters](https://docs.eggplantsoftware.com/dai/assets/images/dai-test-case-dashboard-filters-f880f88f9488513e3e0fd8234341a68e.png)

* **Date range:** You can set up a custom date range to view the Test Case Dashboard over a specific period. By default, the dashboard displays results from the last 7 days.
* **Model or Suite:** Choose to filter by a specific model or suite, to narrow down to the desired scope.

### Test case run summary bar[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#test-case-run-summary-bar)

The Test case run summary bar offers a high-level overview and quick access to various test case statistics based on the applied filters at the dashboard level.

 ![Test case dashboard run summary bar](https://docs.eggplantsoftware.com/dai/assets/images/dai-test-case-dashboard-summary-bar-252bcf6c31e31616fb81474ba4a6a85d.png)

Some reports include buttons with arrows that allow you to view the list of test case results:

* **Test cases completed:** shows the total number of test cases that have been completed.
* **Total execution time:** shows the cumulative execution time taken for all test case executions.
* **Passed:** shows a count of test cases that have passed successfully.
* **Failed:** shows the number of test cases that failed.
* **Error:** shows the test cases that encountered errors during execution.
* **Cancelled:** shows the test case runs that were cancelled.
* **In progress:** shows the test cases that are currently running, allowing you to track ongoing testing activities.

### Test case runs per day[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#test-case-runs-per-day)

The Test case runs per day report offers insight into the distribution of different test case outcomes over time based on the applied filters at the dashboard level.

 ![Test case runs per day report](https://docs.eggplantsoftware.com/dai/assets/images/dai-test-case-runs-per-day-3ce49b0e9129c542e417eafc99580eb1.png)

* **Graph:** provides a visual representation of Passed, Failed, Error, and Cancelled test case results per day. Hover over data points on the lines to see the date and run outcome.
* **View all:** click this button to see a list of all test cases and their outcomes on the Test Results page.

### Test case results by status[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#test-case-results-by-status)

The Test case results by status report provides insights into the status disribution of your test cases based on the applied filters at the dashboard level. This report allows you to track and understand the overall performance of your test cases.

 ![Test case results by status report](https://docs.eggplantsoftware.com/dai/assets/images/dai-test-case-results-by-status-878a28a555ac6525a18a6b2f633885c1.png)

* **Run status breakdown donut chart:** shows the distribution of test cases across different run statuses (Passed, Failed, Error, and Cancelled), providing their relative proportions. By clicking on each status, you can access the list of test case results by status.
* **Run status table:** shows the total number and percentage of test cases by run status (Passed, Failed, Error, and Cancelled). You can click on each status to access the list of test cases by status.
* **View all:** click this button to see a list of all test cases and their outcomes on the Test Results page.

### Top 10 longest running test cases[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#top-10-longest-running-test-cases)

The Top 10 longest running test cases report identifies the top 10 longest test case runs based on the applied filters at the dashboard level. This report provides insights into the execution time of your tests, showing both the maxiumum and average time taken for each test case to run. This report also shows the model or suite they belong to, allowing you to identify and address performance issues.

 ![Top 10 longest running test cases report](https://docs.eggplantsoftware.com/dai/assets/images/dai-top-10-longest-running-test-cases-af358360a17369e16af86e8f5c386c22.png)

* **Test case:** shows the names of the 10 longest running test cases.
* **Execution time:** Shows the maximum and average execution time for each test case run, enabling you to understand the performance of your test cases.
  * **Average time to execute (Avg):** the average time it took to execute for all test runs.
  * **Maximum time to execute (Max):** the maximum time it took for a test run to execute.
* **Model/Suite:** shows the the model or suite that a test case uses.
* **Test case results:** click a test case to open it on the Test Results page to gain a comprehensive understanding of its execution time.
* **Test case actions menu:** click the three dots menu to open a specific test case in a new tab where you can view or edit it.
* **View all:** click this button to see a list of the 10 test cases and their outcomes sorted by the average time it took to execute on the Test Results page.

### Top 10 test case failures[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#top-10-test-case-failures)

The Top 10 test case failures report shows the test cases that encountered the highest number of failures based on the applied filters at the dashboard level. This report helps you focus on areas that require immediate attention.

 ![Top 10 test case failures report](https://docs.eggplantsoftware.com/dai/assets/images/dai-top-10-test-case-fails-804344aaa60a678b17a18889a7081a35.png)

* **Test case:** shows the names of the 10 test cases with the highest number of failures.
* **Total Failures:** shows the number of failures in descending order for the 10 test cases with the highest number of failures. This allows you to pinpoint recurring issues.
* **Fail overview:** click a test case and explore all of its failures to gain a deeper understanding of the encountered issues.
* **Model/Suite** shows the model or suite that a test case uses.
* **Test case actions:** click the three dots actions menu to open a specific test case in a new tab where you can view or edit it.
* **View all:** click this button to see the list of all the test cases that failed on the Test Results page.

### Top 10 test case errors[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-test-case/#top-10-test-case-errors)

The Top 10 test case errors report shows the test cases that have encountered the highest number of errors based on the applied filters at the dashboard level. This report helps you identify recurring errors and focus on areas that require attention.

 ![Top 10 test case errors report](https://docs.eggplantsoftware.com/dai/assets/images/dai-top-10-test-case-errors-f28fdf062d7af89eee68e6fdc59ffd93.png)

* **Test case:** shows the names of the 10 test cases with the highest number of errors.
* **Total Errors:** shows the number of errors in descending order for the 10 test cases with the highest number of errors.
* **Error overview:** click individual test cases and explore their errors to gain a deeper understanding of the encountered issues.
* **Model/Suite** shows the model or suite that a test case uses.
* **Test case actions:** click the three dots menu to open a specific test case in a new tab where you can view or edit it.
* **View all:** click this button to see the list of all the test cases that have errors on the Test Results page.



# Model Dashboard

The Model dashboard page shows a recap of your recent directed and exploratory testing in DAI. To populate the summary, select a Model from the drop-down list. The summary shows results from the last 7 days by default, but you can customize the date range as needed.

## Launching the Model Dashboard[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#launching-the-model-dashboard)

To get started, simply go to **Dashboards > Model**.

## The Model Dashboard[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#the-model-dashboard)

The following widgets make up the **Model Dashboard**:

* [Model Selector](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#model-selector)
* [Date Range Filter](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#date-range-filter)
* [Test Results Record](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#test)
* [All Runs (Exploratory/Directed)](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#all)
* [Test Case Completion (Directed)](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#test-case-completion-directed)
* [Failure Type](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#failure)
* [Coverage](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#coverage2)
* [Test Breakdown](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#test-breakdown)

 ![The Model Dashboard](https://docs.eggplantsoftware.com/dai/assets/images/dai-dashboard-model-fdcbcb3eef827bd1ad403145b9cfc7e3.png)

### Model Selector[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#model-selector)

The drop-down list of available models that you can select to view in this dashboard. The selector also provides a search capability, so the list shortens when you start typing to help you quickly find the model you want.

### Date Range Filter[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#date-range-filter)

You can either:

* View the collected summary data for a standard date range: **Today**, **Yesterday**, **Last 3 days**, **Last 7 days**, **Last 2 Weeks**, **Last 3 Weeks**, **Last Month**, **Last 3 Months**, and **Custom Range**.
* Choose a custom range for your snapshot by selecting the start and ends dates. If you do not specify a start date, Eggplant DAI uses the current date for that value.

If no date is specified, the dashboard displays data for the last seven days.

### Test Results Record[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#test)

The **Test Results Record** shows the distribution of successful and failed test runs for the selected date range. It captures information about exploratory test runs through your model as well as directed test cases. The status and type of runs are color-coded for easy reference.

 ![Test Results Record](https://docs.eggplantsoftware.com/dai/assets/images/dai-qa-test-results-record-83f0be244a39a8753561989b75a40959.png)

### All Runs (Exploratory/Directed)[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#all)

The **All Runs** donut chart and legend represent how many of the model’s test cases have been executed for both exploratory and directed test cases.

 ![All runs (exploratory/Directed)](https://docs.eggplantsoftware.com/dai/assets/images/dai-qa-all-runs-f12d05f0082d1d20b630171e0289eefd.png)

The **All Runs** widget provides the following information:

* **Pass:** The total number of passed test runs.
* **Fail:** The total number of failed test runs. **Incomplete:** The total number of incomplete test runs which either resulted in errors or ended abruptly for various reasons.

### Test Case Completion (Directed)[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#test-case-completion-directed)

The **Test Case Completion** donut chart and legend show the proportion of directed test cases that exist for the selected model that have been run to pass or fail.

 ![Test case completion](https://docs.eggplantsoftware.com/dai/assets/images/dai-qa-test-case-complete-056145b848714da0dc22a5c80fff8085.png)

* **Completed Test Cases:** The total number of successful test cases. If a test case has been run 10 times, it'll still be counted as one completed test case.
* **Incomplete Test Cases:** The total number of directed test cases that are incomplete or have not been attempted yet.

### Failure Type[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#failure)

The **Failure Type** donut chart and legend shows a breakdown of test run failures for directed and exploratory tests.

 ![Failure Type](https://docs.eggplantsoftware.com/dai/assets/images/dai-qa-failure-type-cae45e38b6b5f84ea23dfe903c474f17.png)

* **Failed Exploratory Runs:** The total number of failed test runs when running exploratory tests from both the [Model workspace](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-build-model/) and [Runner](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-runner/).
* **Failed Directed Test Cases:** The total number of directed test cases that failed when running tests from **Designer > Test Cases**.

### Coverage[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#coverage2)

The **Coverage** donut chart and legend represent the test coverage of all the runs from the latest version of the model. Coverage represents what percentage of your model has been visited during test runs. During a test run, Eggplant DAI calculates coverage for possible paths based on various combinations of sequences of actions in the model.

 ![Test coverage for model test runs](https://docs.eggplantsoftware.com/dai/assets/images/dai-qa-test-coverage-57f972459084e2ffb84f4e8aef5e384b.png)

note

The maximum test coverage that can be achieved may be below 100%.

The **Coverage** chart provides the following information:

* **Covered:** The percentage of tests covered for all the runs in this model.
* **Remaining:** The percentage of tests that are yet to be covered, i.e., remaining paths of a model that have not been hit during the test run.

For more information on how to view the total coverage for your model, see [Coverage](https://docs.eggplantsoftware.com/dai/DAI%207.1/coverage/).

### Test Breakdown[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-model/#test-breakdown)

The **Test Case Breakdown** chart shows success metrics for individual test cases that have been run.

 ![Test Breakdown chart for test cases](https://docs.eggplantsoftware.com/dai/assets/images/dai-qa-summary-breakdown_827x402-ce3dc124366687621a792fdaf0e0eb39.png)


# Exploratory Dashboard

The Exploratory dashboard provides a high-level overview of your testing, presented in report form. Most reports appear blank until you have executed a model at least once. The exceptions are the Bug Hunting and Test Cases reports, which have additional requirements.

## Launching the Exploratory Dashboard[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#launching-the-exploratory-dashboard)

To get started, simply go to **Dashboards > Exploratory**.

## The Exploratory Dashboard[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#the-exploratory-dashboard)

The following reports make up the **Exploratory Dashboard**.

* [Model Selector](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#model-selector)
* [Model](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#model)
* [Bug Hunting](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#bug-hunting)
* [Test Cases](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#test-cases)
* [Test Results](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#test-results)

 ![The Exploratory Dashboard](https://docs.eggplantsoftware.com/dai/assets/images/dai-dashboard-exploratory-067920e395aa50949caab008b188a363.png)

**Note:** All reports appear blank until you run at least one test case either as a model execution or as a [Directed Test Case](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-test-case-report/#directed-test-cases)

### Model Selector[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#model-selector)

The drop-down list of available models you can select to view in this dashboard. The selector also provides a search capability, so the list shortens when you start typing to help you quickly find the model you want.

### Model[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#model)

A donut chart showing automated and unautomated actions. Hover over the donut colors to see details. Below the chart, you see a comparison of automated states and actions run with the total number of states and actions. This widget has an **Edit** button you can click to open the model in the Designer.

### Bug Hunting[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#bug-hunting)

A donut chart showing the top failing actions and tags. Hover over the donut colors to see details. If you see the "No failures detected, all good!" message, it means no failures were detected for the model runs. This widget has a **View** button you can click to go to the Bug Hunting History for the model. To learn more, see [Bug Hunting](https://docs.eggplantsoftware.com/dai/DAI%207.1/bug-hunting/).

### Coverage[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#coverage)

A bar chart showing the percentage of the test coverage completed for the following categories: All Nodes, All Pairs, Extended, and Full Exploratory. Hover over the bars to see details. This widget has a **View** button to take you to the coverage page.

### Test Cases[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#test-cases)

Donut chart showing the test cases run and not run. Hover over the donut colors to see details. Below the chart, you can see the number of test cases run, and the total number of hits for a case. This widget has a **View** button you can click to see the list of test cases.

### Test Results[​](https://docs.eggplantsoftware.com/dai/DAI%207.1/dai-dashboard-exploratory/#test-results)

A donut chart showing you the Pass, Fail, In Progress, Cancelled, and Error result status for the model runs. Hover over the donut colors to see details. Below the chart, you can see a summary of the number of Runs, the Duration of the runs in hours, and the Pass Rate. This widget has a **View** button you can click to see the list of test results.






