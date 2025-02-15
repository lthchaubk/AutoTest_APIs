<h1>Performance Testing with jMeter</h1>
<h3>1. Install jMeter</h3>

```bash
brew install jmeter
```

<h3>2. Run jMeter</h3>
<h5>GUI mode: use to compose script</h5>

```bash
open /usr/local/bin/jmeter
OR
go to bin & ./jmeter
```

<h5>Cmd mode: use to run script</h5>

```bash
$jmeter -n -t testPlan.jmx -l log.jtl -H 127.0.0.1 -P 8000
```
For load testing, use CLI Mode (was NON GUI):

```bash
jmeter -n -t [jmx file] -l [results file] -e -o [Path to web report folder]
```

After got report.jtl file, gen dashboard report
```bash
jmeter -g report/test_report.jtl -o report/out/system/
```

<h3>3. Compose script</h3>
- Create testplan (test scenario) <br>
- Add Thread group is a child of this testplan <br>
- Add random timer for this Thread <br>
- Add transaction controller for this Thread <br>

<h3>4. Note</h3>
<h5>1.If you want to include the plugins (JMeterPlugins Standard, Extras, ExtrasLibs, WebDriver and Hadoop) use:<h5>

```bash
brew install jmeter --with-plugins
```

<h5>2. API working:<h5>
- 2.1 header <br>
- 2.2 JSON response	<br>
- 2.3 view result to debug	<br>

<h5>3. proxy should use with port 8888 (8080 use with charles)<h5>

<h5>4. Configuration Element<h5>
- Pre-Processor Elements <br>
- Timers <br>
- Samplers <br>
- Post-Processor Elements <br>
- Assertions <br>
- Listeners <br>
