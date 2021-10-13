package com.example.demo;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Transaction {

    private String toAccount;
    private String fromAccount;
    private double amount;
    private String currency;

}
