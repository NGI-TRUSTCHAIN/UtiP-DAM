package com.utipdam.mobility.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "vendor")
@Data
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "account_no")
    private String accountNo;

    @Column(name = "account_name")
    private String accountName;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_vat_no")
    private String companyVatNo;

    @Column(name = "company_reg_no")
    private String companyRegNo;

    @Column(name = "company_address")
    private String companyAddress;

    @Column(name = "country")
    private String country;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "swift_code")
    private String swiftCode;

    public Vendor() {
    }

    public void update(Vendor vendor) {
        if (vendor.getAccountNo() != null) {
            this.accountNo = vendor.getAccountNo();
        }
        if (vendor.getAccountName() != null) {
            this.accountName = vendor.getAccountName();
        }
        if (vendor.getBankName() != null) {
            this.bankName = vendor.getBankName();
        }
        if (vendor.getCompanyName() != null) {
            this.companyName = vendor.getCompanyName();
        }
        if (vendor.getCompanyVatNo() != null) {
            this.companyVatNo = vendor.getCompanyVatNo();
        }
        if (vendor.getCompanyRegNo() != null) {
            this.companyRegNo = vendor.getCompanyRegNo();
        }
        if (vendor.getCompanyAddress() != null) {
            this.companyAddress = vendor.getCompanyAddress();
        }
        if (vendor.getCountry() != null) {
            this.country = vendor.getCountry();
        }
        if (vendor.getContactName() != null) {
            this.contactName = vendor.getContactName();
        }
        if (vendor.getContactEmail() != null) {
            this.contactEmail = vendor.getContactEmail();
        }
        if (vendor.getBankName() != null) {
            this.bankName = vendor.getBankName();
        }
        if (vendor.getSwiftCode() != null) {
            this.swiftCode = vendor.getSwiftCode();
        }
    }

}
