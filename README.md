# Metrics med Spring Boot, Micrometer, InfluxDB og Grafana 

I denne labben skal dere bli kjent med hvordan man instrumenterer en Spring Boot applikasjon med Metrics. Vi skal bruke rammeverket 
Micrometer som er integrert i Spring Boot - og tidsseriedatabasen influxDB. Vi skal også se hvordan vi kan bruke Grafana for visualisering 

Koden i dette repositoriet eksponerer et undepunkt på http://localhost:8080/account - utled fra koden hvordan payload
og URK struktur er. Lek med APIet via Postman

Applikasjon er konfigurert for på levere Metrics til lokal InfluxDB.

## Start influxDB

(Kilde https://blog.laputa.io/try-influxdb-and-grafana-by-docker-6b4d50c6a446) 

Vi kan få ut en influxdb konfigurasjonsfil fra container ved å kjøre kommandoen 

```sh
docker run --rm influxdb:1.0 influxd config > influxdb.conf
```

Dette kan være greit dersom vi ønsker å endre noe. Vi vil sende filen tilbake til containeren og overskrive med våre verdier 
når vi kjører influx

Vi kan starte influx med følgende docker kommando. Legg merke til av vi overstyrer konfigurasjonsfilen

```
docker run -d --name influxdb \
  -p 8083:8083 -p 8086:8086 -p 25826:25826/udp \
  -v $PWD/influxdb:/var/lib/influxdb \
  -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro \
  -v $PWD/types.db:/usr/share/collectd/types.db:ro \
  influxdb:1.0
````

hvis dere går til http://localhost:8083/ får dere opp et enkelt brukergrensesnitt. 

## Start Spring Boot applikasjonen

* Spring vil levere en del metrics til 
* Test grensesnittet i applikasjkonen med Postman 

## Sjekk at det kommer data  i influx

* Gå til http://localhost:8083/
* Bytt "database" til mydb
* I feltet for spørringer skriv "shoe measurements" for å se om data blir levert.

![Alt text](img/6.png  "a title")


## Visualisering av Metrics 

Start Grafana med docker 

```sh
docker run -d -p 3000:3000 --name grafana grafana/grafana:6.5.0
```

hvis dere går til http://localhost:3000/ får dere opp et enkelt brukergrensesnitt. - I grafana, Konfigurer en datasource og bruk følgende verdi som URL

* Dere må bytte passord første gang dere logger på 

* For å konfigurere Influx DB som e datakilde, velg "data sources" 

![Alt text](img/1.png  "a title")

* Velg deretter Influx DB og fyll ut følgende informasjoj

![Alt text](img/2.png  "a title")

*Velg database "mydb".* 
* Host må være ```http://host.docker.internal:8086```

Resten av verdiene kan være uendret.

Sjekk at du kan lage et Dashbord og at det er noe data du kan ta utgangspunkt i. Vi rekker ikke dypdykke i 
grafana i denne labben. Hovedformålet er å bli kjent med Rammeverket Micrometer. 

![Alt text](img/5.png  "a title")


 
## Instrumenter Spring Boot applikasjonen din med MicroMeter

Det er nå på tide å få noe metrics inn i InfluxDB og visualisere med Grafana. 

I grove trekk kan dette gjøres ved å legge til de riktige avhengighetene til prosjeketet, og la Spring Boot plukke disse opp med 
autokonfigurasjon. Micrometer rammeverket kommer som en transitiv avhengighet med Spring Boot Actuator. Så, disse to linjene i build.gradle er det som skal til 

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-influx</artifactId>
    <version>1.5.5</version>
</dependency>
```

Vi kan etter dette legge til Metrics i koden vår; 
```java 
@PostMapping(path = "/tx", consumes = "application/json", produces = "application/json")
    public void addMember(@RequestBody Transaction tx) {
        meterRegistry.counter("txcount", "currency", tx.getCurrency()).increment();
    }
}
```

Oppgave;

- Prøv ulike typer metrikker (Distribution summary, Counter, Gauge, Timer etc) - Sjekk dokumentasjonen - 
- Bruk gjerne følgende guide som inspirasjon https://www.baeldung.com/micrometer
- Referanseimplementasjon; https://micrometer.io/docs/concepts
- 
Nyttig informasjon; 

- https://spring.io/blog/2018/03/16/micrometer-spring-boot-2-s-new-application-metrics-collector
- https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics
