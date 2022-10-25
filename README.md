# Metrics med Spring Boot og CloudWatch 

I denne øvingen skal dere *bli kjent med* hvordan man instrumenterer en Spring Boot applikasjon med Metrics. Vi skal bruke rammeverket 
Micrometer som er integrert i Spring Boot. Vi skal også se på hvordan vi kan visualisere Metrics i AWS CloudWatch.

Bruk tid på å legge til, fjerne eller endre på koden som lager metrics, og se hvordan dette påvirker dataene og verdiene 
i CloudWatch. 

Koden i dette repositoriet eksponerer et undepunkt på http://localhost:8080/account - følgende funksjonalitet 
er implementert

* Lage ny konto POST path = "/account
* Info om konto GET path = "/account/{accountId}
* Oveføre penger POST path = "/account/{fromAccount}/transfer/{toAccount}

_ Transfer-endepunktet krever ikke at det eksisterer en konto fra før- men vil opprette både til- og fra
konto hvis de ikke eksisterer, så det er veldig bra for testing_

Payload for Overføringer , fromCountry og toCountry er valgfritt og default verdi er "NO"

```json
{
    "fromCountry" : "SE",
    "toCountry" : "US",
    "amount" : 500
}
```

## Vi skal gjøre denne øvingen på egen maskin- ikke i Cloud 9 

Derfor trenger du et IDE for Java , feks IntelliJ og AWS CLI på maskinen din

* Installer AWS CLI  https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

## Konfigurere AWS CLI

Logg inn i AWS kontoen vår som vanlig, finn din bruker og lag AccessKeys til din IAM bruker.

Kjør
```sh
aws configure
```

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

Start applikasjonen fra terminal, eller fra IntelliJ/IDE
```
mvn spring-boot:run
```

## Sjekk at det kommer data i CloudWatch

Spring Boot vil eksponere en god del metrics til CloudWatch automatisk, 
blant annet fra JVM, Spring web mm. 

![Alt text](img/cloudwatch.png  "a title")

* Åpne AWS UI, og tjenesten CloudWatch. Velg "Metrics".
* Søk på ditt eget studentnavn som "NameSpace"
* Du vil se at du allerede har noe metrics registert hvis du har startet appen riktig 

* fra Spring boot Web under *(exception, method, outcome, status, uri)*
* RAM og Garbage Collection Metrics under *Area*
* Tråder under *State*

Bruk Postman, Curl eller annen API klient til å gjøre operasjoner mot APIet. Sjekk i CloudWatch 
at du får data. 

* Velg de metrikkene du vil se på en graf, ved å søke eller navigere. 
* Velg fanan "Graphed metrics" - du får da dataene opp i graf form. 
* Du må deretter velge riktig statistiske funksjon for metrikken basert på hva slags data det er. 


## Legg til mer Metrics i applikasjonen din med MicroMeter 

* Kan du lage et nytt endepunkt med ny funksjonalitet? 
* Legg på en ekstra Tag for en eksisterende Metric. Hva skjer?  
* Les Spring Boot Micrometer dokumentasjonen, og se om du kan legge på en @Timed annotasjon for å måle hvor lang tid metoder tar https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#actuator.metrics.supported.timed-annotation
* Sjekk ut Micrometer sin "LongTaskTimer" funksjonalitet
* Prøv ulike typer metrikker (Distribution summary, Counter, Gauge, Timer etc) - Sjekk dokumentasjonen - 
* Bruk gjerne følgende guide som inspirasjon https://www.baeldung.com/micrometer
* Referanseimplementasjon; https://micrometer.io/docs/concepts

Nyttig informasjon; 

- https://spring.io/blog/2018/03/16/micrometer-spring-boot-2-s-new-application-metrics-collector
- https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics
