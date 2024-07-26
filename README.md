## About

This repository hosts information to UtiP-DAM as part of NGI TRUSTCHAIN project.

https://trustchain.ngi.eu/utip-dam/

## Motivation

Correlation Systems is developing UtiP-DAM with a core focus on customer needs in
the context of privacy-compliant crowd data management. Our innovative solution
addresses the challenges associated with adhering to strict local privacy laws when
collecting, storing, and analyzing crowd-sourced data.
Notably, UtiP-DAM will empower users, including its existing customers, to:

* Distribute data openly, securely and in compliance with data privacy laws:
Through UtiP-DAM, dataset owners will be able to share anonymized data in
open-source frameworks such as the International Data Space, and private
frameworks such as the UtiP-DAM marketplace, fostering collaboration and
innovation for mobility and location- based solutions.
* Unlock new revenue streams: the UtiP-DAM marketplace will enable the resell
of anonymized data while protecting individual privacy, potentially generating
additional income for Correlation Systems and dataset owners.


## Functionalities

* General auditing tool: this tool analyzes a mobility data file (CSV format) and
outputs the lowest K value within the data. This provides a quick assessment
of the overall anonymization strength of the dataset. 
* Detailed auditing tool: this tool delves deeper, providing a K value for each
individual mobility sequence within the data. This granular analysis enables
developers to pinpoint specific areas within the dataset that might require
additional anonymization measures. 
* K-anonymization tool: This tool addresses the core challenge of anonymizing
mobility data. It replaces identifiers of mobility patterns below K using random
IDs. This anonymization technique ensures that individual movements cannot
be linked with another, while preserving valuable data insights for analysis.

## Integration in other Ecosystems

UtiP-DAM enables the users to share their datasets to Mobility Data Spaces (MDS)

## Github

[Backend services](https://github.com/NGI-TRUSTCHAIN/UtiP-DAM/tree/master/utip-dam-backend)

[Marketplace](https://github.com/NGI-TRUSTCHAIN/UtiP-DAM/tree/main)

# Contact

Feel free to reach out to us for more information https://ngi.cs.co.il/contact

