package com.utipdam.mobility.exception;

public class DefaultException extends Exception {
    private final String errorMessage;

    public DefaultException(String var1) {
        this.errorMessage = var1;
    }

    public String getLocalizedMessage() {
        return this.errorMessage;
    }
}
