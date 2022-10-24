# Metrics med Spring Boot og CloudWatch 

I denne øvingen skal dere bli kjent med hvordan man instrumenterer en Spring Boot applikasjon med Metrics. Vi skal bruke rammeverket 
Micrometer som er integrert i Spring Boot. Vi skal også se på hvordan vi kan visualisere Metrics i AWS CloudWatch og 
CloudWatch

Koden i dette repositoriet eksponerer et undepunkt på http://localhost:8080/account - følgende funksjonalitet 
er implementert

NB. Transfer-endepunktet krever ikke at det eksisterer en konto fra før- men vil opprette både til- og fra
konto hvis de ikke eksisterer.

* Lage ny konto POST path = "/account
* Info om konto GET path = "/account/{accountId}
* Oveføre penger POST path = "/account/{fromAccount}/transfer/{toAccount}

Payload for Overføringer , fromCountry og toCountry er valgfritt og default verdi er "NO"

```json
{
    "fromCountry" : "SE",
    "toCountry" : "US",
    "amount" : 500
}
```

## Vi skal gjøre øvingen på egen maskin, ikke ved hjelp av Cloud 9 

* Installer AWS CLI 
* https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

## Konfigurere AWS CLI

```sh
aws configure
```
AccessKeyID og SecretAccessKey blir gitt i klasserommet. 

## Start Spring Boot appen

Du må endre på klassen *MetricsConfig* og bruke ditt egent studentnavn istedet for *glennbech* i kodeblokken 

````java
 return new CloudWatchConfig() {
        private Map<String, String> configuration = Map.of(
                "cloudwatch.namespace", "glennbech",
                "cloudwatch.step", Duration.ofSeconds(5).toString());
        
        ....
    };
````

Start applikasjonen
```
mvn spring-boot:run
```

Spring vil eksponere en god del metrics til CloudWatch automatisk, blant annet fra JVM, Spring web mm. 

* Åpne AWS UI , og tjenesten CloudWatch. Velg "Metrics".
* Søk på ditt eget studentnavn som "NameSpace"
* Du vil se at du allerede har noe metrics

* fra Spring boot Web under *(exception, method, outcome, status, uri)*
* RAM og Garbage Collection Metrics under *Area*
* Tråder under *State*

## Sjekk at det kommer data i CloudWatch

Bruk Postman, Curl eller annen API klient til å gjøre operasjoner mot APIet. Sjekk i CloudWatch 
at du får data. 

## Legg til  mer Metrics i  applikasjonen din med MicroMeter 

Les Spring Boot Micrometer dokumentasjonen, og se om du kan legge på en @Timed annotasjon for å måle
hvor lang tid metoder tar https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#actuator.metrics.supported.timed-annotation

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
