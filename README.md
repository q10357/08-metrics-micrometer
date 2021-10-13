# Metrics med Spring Boot, Micrometer, InfluxDB og Grafana 

I denne labben skal dere bli kjent med hvordan man instrumenterer en Spring Boot applikasjon med Metrics. Vi skal bruke rammeverket 
Micrometer som er integrert i Spring Boot - og tidsseriedatabasen influxDB. Vi skal også se hvordan vi kan bruke Grafana for visualisering 

Koden i dette repositoriet eksponerer et undepunkt på http://localhost:8080/tx - som tar i mot en POST med følgende 
payload.

```json

{
	"fromAccount": "16231027916",
	"toAccount": "16231027916",
	"amount": 545454545,
	"currency" : "USD"
}
```
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
docker run --name influxdb \
  -p 8083:8083 -p 8086:8086 -p 25826:25826/udp \
  -v $PWD/influxdb:/var/lib/influxdb \
  -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro \
  -v $PWD/types.db:/usr/share/collectd/types.db:ro \
  influxdb:1.0
````

hvis dere går til http://localhost:8083/ får dere opp et enkelt brukergrensesnitt. 


## Visualisering av Metrics 

Start Grafana med docker 

```sh
docker run -d -p 3000:3000 --name grafana grafana/grafana:6.5.0
```

hvis dere går til http://localhost:3000/ får dere opp et enkelt brukergrensesnitt. - I grafana, Konfigurer en datasource og bruk følgende verdi som URL
```
http://host.docker.internal:8086
```
*Velg database "mydb".* Resten av verdiene kan være uendret.

 
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

Vi kan etter det legge til Metrics i koden vår; 
```java 
@PostMapping(path = "/tx", consumes = "application/json", produces = "application/json")
    public void addMember(@RequestBody Transaction tx) {
        meterRegistry.counter("txcount", "currency", tx.getCurrency()).increment();
    }
}
```

Oppgave;

- Prøv ulike typer metrikker (Distribution summary, Counter, Gauge, Timer etc) - Sjekk dokumentasjonen - 

Nyttig informasjon; 

- https://spring.io/blog/2018/03/16/micrometer-spring-boot-2-s-new-application-metrics-collector
- https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics
