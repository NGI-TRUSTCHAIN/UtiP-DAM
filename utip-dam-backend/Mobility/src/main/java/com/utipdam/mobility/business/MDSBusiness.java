package com.utipdam.mobility.business;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utipdam.mobility.SendEmail;
import com.utipdam.mobility.config.BusinessService;
import com.utipdam.mobility.model.Email;
import com.utipdam.mobility.model.entity.DatasetDefinition;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@BusinessService
public class MDSBusiness {
    final Logger logger = LoggerFactory.getLogger(MDSBusiness.class);

    @Value("${mds.app.management-api}")
    private String MDS_MANAGEMENT_API;

    @Value("${mds.app.id}")
    private String MDS_CLIENT_ID;

    @Value("${mds.app.password}")
    private String MDS_CLIENT_SECRET;

    @Value("${mds.app.url}")
    private String MDS_ACCESS_TOKEN_URL;

    @Value("${mds.app.env}")
    private String MDS_ENV;

    @Value("${utipdam.app.domain}")
    private String DOMAIN;

    @Autowired
    private SendEmail sendEmail;

    public void createAsset(DatasetDefinition ds, String accessToken) {

        if (MDS_MANAGEMENT_API == null) {
            logger.error("Management api undefined");
            return;
        }
        if (DOMAIN == null) {
            logger.error("Domain undefined");
            return;
        }
        String mdsURL = MDS_MANAGEMENT_API + "/wrapper/ui/pages/asset-page/assets";
        logger.info(mdsURL);

        try {
            JSONObject request = new JSONObject();
            request.put("id", getId(ds.getName(), accessToken));
            request.put("title", ds.getName());
            request.put("language", "https://w3id.org/idsa/code/EN");
            request.put("description", ds.getDescription());
            request.put("publisherHomepage", DOMAIN);
            request.put("licenseUrl", "");
            request.put("version", "1.0");
            request.put("keywords", new JSONArray("[\"mobility\", \"anonymization\"]"));
            request.put("mediaType", "text/csv");
            request.put("landingPageUrl", "");
            request.put("dataCategory", "Various");
            request.put("dataUpdateFrequency", "");
            request.put("dataAddressProperties", getDataRequest(ds));
            request.put("dataSource", null);

            sendHttp(accessToken, request, mdsURL, ds);
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }

    }

    private Integer getAssetCount(String accessToken) {
        String url = MDS_MANAGEMENT_API + "/wrapper/ui/pages/asset-page";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(null, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url,
                    HttpMethod.GET, entity, String.class);
            if (response.getBody() != null) {
                JSONObject obj = new JSONObject(response.getBody());
                JSONArray arr = (JSONArray) obj.get("assets");
                return arr.length();
            }
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }

        return 0;
    }


    private Integer getContractDefinitionCount(String accessToken) {
        String url = MDS_MANAGEMENT_API + "/wrapper/ui/pages/contract-definition-page";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(null, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url,
                    HttpMethod.GET, entity, String.class);
            if (response.getBody() != null) {
                JSONObject obj = new JSONObject(response.getBody());
                JSONArray arr = (JSONArray) obj.get("contractDefinitions");
                return arr.length();
            }
        } catch (JSONException e) {
            logger.error(e.getMessage());
        }

        return 0;
    }

    private void createContractDefinition(String accessToken, String idName, DatasetDefinition ds) {
        String mdsURL = MDS_MANAGEMENT_API + "/wrapper/ui/pages/contract-definition-page/contract-definitions";

        try {
            JSONObject request = new JSONObject();
            int count = getContractDefinitionCount(accessToken) + 1;
            request.put("contractDefinitionId", "utipdam-contract-" + count);
            request.put("contractPolicyId", "always-true");
            request.put("accessPolicyId", "always-true");
            JSONObject dataRequest = new JSONObject();
            dataRequest.put("operandLeft", "https://w3id.org/edc/v0.0.1/ns/id");
            dataRequest.put("operator", "IN");
            JSONObject opRequest = new JSONObject();
            opRequest.put("type", "VALUE_LIST");
            opRequest.put("valueList", new JSONArray("[" + idName + "]"));
            dataRequest.put("operandRight", opRequest);
            request.put("assetSelector", new JSONArray("[" + dataRequest + "]"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(request.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(mdsURL,
                    HttpMethod.POST, entity, String.class);
            logger.info(response.getBody());

            Email email = new Email();
            email.setRecipientEmail(ds.getOrganization().getEmail());
            email.setSubject("[UtiP-DAM] Dataset Published to Mobility Data Spaces");
            String url = MDS_ENV.equals("prod") ? "https://catalog-next.mobility-dataspace.eu" : "https://catalog-next.test.mobility-dataspace.eu";
            email.setMessage("Your dataset " + ds.getName() + " connector endpoint is now available at Mobility Data Spaces " + url + "<br/>");
            String responseMsg = sendEmail.send(email);
            if (responseMsg.equals("Successfully sent")) {
                logger.info("Published to MDS email sent.");
            }
        } catch (HttpClientErrorException | HttpServerErrorException | JSONException e) {
            logger.error(e.getMessage());
        }

    }

    public String getAuthenticationToken() {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("curl", "-s", "-d", "grant_type=client_credentials", "-d",
                    "client_id=" + MDS_CLIENT_ID, "-d", "client_secret=" + MDS_CLIENT_SECRET, MDS_ACCESS_TOKEN_URL);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(process.getInputStream()));

            // wait for the child process *after*
            // reading all its output
            int exitVal = process.waitFor();

            if (exitVal == 0) {
                String result = getResult(reader);
                try {
                    JSONObject jsonObject = new JSONObject(result);
                    return jsonObject.getString("access_token");
                } catch (JSONException err) {
                    logger.error(err.getMessage());
                }
            }
        } catch (InterruptedException | IOException e) {
            logger.error(e.getMessage());
        }
        return null;
    }

    private void sendHttp(String accessToken, JSONObject request, String mdsURL, DatasetDefinition ds) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(request.toString(), headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> response = restTemplate.exchange(mdsURL,
                    HttpMethod.POST, entity, String.class);
            logger.info(response.getBody());

            JsonFactory jsonFactory = new JsonFactory();
            ObjectMapper objectMapper = new ObjectMapper(jsonFactory);
            String idNamSave = objectMapper.readTree(response.getBody()).get("id").asText();
            createContractDefinition(accessToken, idNamSave, ds);
        } catch (HttpClientErrorException | HttpServerErrorException | JsonProcessingException e) {
            logger.error(e.getMessage());
        }
    }

    private JSONObject getDataRequest(DatasetDefinition ds) {
        JSONObject dataRequest = new JSONObject();
        String uri = getUri(ds.getInternal(), ds.getServer().getDomain());
        logger.info(uri);
        try {
            dataRequest.put("https://w3id.org/edc/v0.0.1/ns/type", "HttpData");
            dataRequest.put("https://w3id.org/edc/v0.0.1/ns/baseUrl", uri);
            dataRequest.put("https://w3id.org/edc/v0.0.1/ns/method", "GET");
            dataRequest.put("https://w3id.org/edc/v0.0.1/ns/queryParams", "datasetDefinition=" + ds.getId());
        }catch(JSONException e){
            logger.error(e.getMessage());
        }
        return dataRequest;
    }

    private String getId(String name, String accessToken) {
        String assetName = name.toLowerCase().replaceAll("[^A-Za-z0-9 ]", "").trim().replaceAll(" +", " ").replaceAll(" ", "-");
        return assetName + "-" + (getAssetCount(accessToken) + 1);
    }

    private String getUri(Boolean isInternal, String domain) {
        return isInternal ? (domain + "/internal/mobility") : (DOMAIN + "/api/mobility");
    }

    private String getResult(BufferedReader reader) {
        StringBuilder builder = new StringBuilder();
        String line;
        try {
            while ((line = reader.readLine()) != null) {
                builder.append(line);
                builder.append(System.lineSeparator());
            }

        } catch (IOException e) {
            logger.error(e.getMessage());
        }
        return builder.toString();
    }
}
