# Metrics med Spring Boot, CloudWatch og Grafana

I denne øvingen skal dere bli kjent med hvordan man instrumenterer en Spring Boot applikasjon med Metrics. Vi skal bruke rammeverket 
Micrometer som er integrert i Spring Boot. 

Vi skal også se på Metrics i AWS CloudWatch, og hvordan vi kan bruke Grafana for visualisering 

Koden i dette repositoriet eksponerer et undepunkt på http://localhost:8080/account - se på koden hvordan payload
strukturen er definert og HTTP metodene som brukes. Prøv APIet via Postman.

## Start Spring Boot appen

```
mvn spring-boot:run
```

* Spring vil levere en god del metrics til CliudWatch automatisk, blant annet fra JVM, Spring Boot Actutor, Spring web mm. 
* Test grensesnittet i applikasjkonen med Postman
* Gå til AWS CloudWatch og gå til "Metrics"
* Søk på ditt eget studentnavn som NameSpace

## Sjekk at det kommer data i CloudWatch

## Legg til mer Metrics i  applikasjonen din med MicroMeter 

Vi kan "finne opp" våre egne metrics og metadata-  og lage metrics også for businessrelaterte hendelser. 
For eksempel akkumulere hvilke valutaer som er mest populære i tenkt scenario som vist her; (Pseudo-kode) 


```java 
@PostMapping(path = "/tx", consumes = "application/json", produces = "application/json")
    public void addMember(@RequestBody Transaction tx) {
        meterRegistry.counter("currencycount", "CUR", tx.getCurrency()).increment();
    }
}
```

## Visualisering av Metrics med Grafana

Start Grafana med docker 

```sh
docker run -d -p 3000:3000 --name grafana grafana/grafana:6.5.0
```

OBS! Det ligger en demo av konfigurasjon og oppsett av en datakilde og dashboard i grafana her;
https://kristiania.instructure.com/courses/6805/files/folder/demo

hvis dere går til <http://localhost:3000/> får dere opp et enkelt brukergrensesnitt. 


* Default brukernavn og passord er ``admin``.  
* Dere må bytte passord første gang dere logger på
* Velg "tannhjulet" på venstremenyen og Datasources.
* Lag en ny Datasource for InfluxDB

![Alt text](img/1.png  "a title")

* I URL skriver dere inn http://host.docker.internal:8086
* I Database feltet skriver dere _mydb_
* Alle andre felter skal være urøret

![Alt text](img/2.png  "a title")

* velg "Save & test". det skal komme opp en grønn melding som sier "Data source is working"

Sjekk at du kan lage et Dashbord og at det er noe data du kan ta utgangspunkt i. Vi rekker ikke dypdykke i 
grafana i denne labben. Hovedformålet er å bli kjent med Rammeverket Micrometer. 



![Alt text](img/5.png  "a title")

Oppgave;

- Prøv ulike typer metrikker (Distribution summary, Counter, Gauge, Timer etc) - Sjekk dokumentasjonen - 
- Bruk gjerne følgende guide som inspirasjon https://www.baeldung.com/micrometer
- Referanseimplementasjon; https://micrometer.io/docs/concepts

## Bonusoppgave

Installer last-test verktøyet K6 på maskinen din og kjør en liten load test mot applikasjonen. Fra ```k6/``` katalogen i dette repositoryet kan du kjøre kommandoen
```shell
 k6 run --vus 10 --duration 30s simpleloadtest.js
```

Nyttig informasjon; 

- https://spring.io/blog/2018/03/16/micrometer-spring-boot-2-s-new-application-metrics-collector
- https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics
