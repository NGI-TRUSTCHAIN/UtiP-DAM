import React, { useEffect } from 'react';

import Aos from 'aos';
import TagManager from 'react-gtm-module';
import wave from '../assets/svgs/wavesOpacity.svg';

const TermsOfService = () => {
  useEffect(() => {
    Aos.init();
    window.scrollTo(0, 0);

    TagManager.dataLayer({
      dataLayer: {
        page: 'terms-of-service',
        category: 'PageView',
        value: 1,
      },
      dataLayerName: 'PageDataLayer',
    });
  }, []);

  return (
    <div className="w-full m-auto">
      <img src={wave} alt="" className="h-[30px] w-full" />;
      <div
        data-aos="fade-down"
        className="prose w-[60] m-auto px-4 pb-12 text-primary-dark text-justify">
        <div className="text-4xl prose-h2: font-semibold" id="terms-of-service">
          Terms of Service
        </div>
        <small>Last updated: April 22, 2024</small>
        <h3 id="introduction">Introduction</h3>
        <p>
          Welcome to UtiP-DAM, owned and operated by Correlation Systems LTD.
          d/b/a Correlation Systems ("Correlation Systems," "we," "us", or
          "our").
        </p>
        <p>
          These Terms of Service ("Terms") govern your access to and use of the
          Correlation Systems' website(s), our APIs, and any support, software,
          tools, features, or functionalities provided on or in connection with
          our services; including without limitation using our services to view,
          explore, help display and distribute datasets, and using our tools, at
          your own discretion, to sell proprietary datasets (collectively, the
          "Service").
        </p>
        <p>
          For purposes of these Terms, "user", "you", and "your" mean you as the
          user of the Service. If you use the Service on behalf of a company or
          other entity then "you" includes you and that entity, and you
          represent and warrant that (a) you are an authorized representative of
          the entity with the authority to bind the entity to these Terms, and
          (b) you agree to these Terms on the entity's behalf.
        </p>
        <p>
          PLEASE READ THESE TERMS OF SERVICE CAREFULLY AS THEY CONTAIN IMPORTANT
          INFORMATION AND AFFECT YOUR LEGAL RIGHTS.
          <br />
          BY CLICKING TO ACCEPT, SIGN, AND/OR USING OUR SERVICE, YOU AGREE TO BE
          BOUND BY THESE TERMS AND ALL OF THE TERMS INCORPORATED HEREIN BY
          REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS, YOU MAY NOT ACCESS OR
          USE THE SERVICE.
          <br />
          <br />
          Correlation Systems is not a party to any agreement between any users.
          You bear full responsibility for verifying the identity, legitimacy,
          and authenticity of datasets that you purchase from third-party
          sellers using the Service and we make no claims, guarantees, or
          recommendations about the identity, legitimacy, functionality, or
          authenticity of users or datasets (and any content associated with
          such datasets) visible on the Service.
        </p>
        <h3 id="accessing-the-service">Accessing the Service</h3>
        <p>
          Your Account on ngi.cs.co.il will be associated with your email
          address, the one you indicate when signing up to the Service. We may
          require you to provide additional information and documents in certain
          circumstances, such as at the request of any government authority, as
          any applicable law or regulation dictates, to provide you with a
          requested service, or to investigate a potential violation of these
          Terms. In such cases, we, in our sole discretion, may disable your
          Account and block your ability to access the Service until such
          additional information and documents are processed by Correlation
          Systems. If you do not provide complete and accurate information in
          response to such a request, we may refuse to restore your access to
          the Service.
        </p>
        <p>
          Your access and use of the Service may be interrupted from time to
          time for any of several reasons, including, without limitation, the
          malfunction of equipment, periodic updating, maintenance, or repair of
          the Service, geographic restrictions, potential violation of these
          Terms, or other actions that we, in our sole discretion, may elect to
          take. You understand that we, in our sole discretion, may disable your
          Account and/or reassign your username or associated url.
        </p>
        <p>
          We require all users to be at least 18 years old. If you are at least
          13 years old but under 18 years old, you may only use the Service
          through a parent or guardian's Account and with their approval and
          oversight. That account holder is responsible for your actions using
          the Account. It is prohibited to use our Service if you are under 13
          years old.
        </p>
        <h3 id="ownership">Ownership</h3>
        <p>
          The Service, including its "look and feel" (e.g., text, graphics,
          images, logos, page headers, button icons, urls, and scripts),
          proprietary content, information and other materials, and all content
          and other materials contained therein, including, without limitation,
          the UtiP-DAM logo and all designs, text, graphics, pictures, data,
          software, sound files, other files, and the selection and arrangement
          thereof are the proprietary property of Correlation Systems or our
          affiliates, licensors, or users, as applicable, and you agree not to
          take any action(s) inconsistent with such ownership interests. We and
          our affiliates, licensors, and users, as applicable, reserve all
          rights in connection with the Service and its content, including,
          without limitation, the exclusive right to create derivative works.
        </p>
        <p>
          Correlation Systems' name, logo, trademarks, and any Correlation
          Systems product or service names, designs, logos, and slogans are the
          intellectual property of Correlation Systems or our affiliates or
          licensors and may not be copied, imitated or used, in whole or in
          part, without our prior written permission in each instance. You may
          not use any metatags or other "hidden text" utilizing "Correlation
          Systems" or any other name, trademark or product or service name of
          Correlation Systems or our affiliates or licensors without our prior
          written permission. In addition, the "look and feel" of the Service
          constitutes the service mark, trademark or trade dress of Correlation
          Systems and may not be copied, imitated or used, in whole or in part,
          without our prior written permission.
        </p>
        <p>
          All other third-party trademarks, registered trademarks, and product
          names mentioned on the Service or contained in the content linked to
          or associated with any dataset displayed on the Service are the
          property of their respective owners and may not be copied, imitated or
          used, in whole or in part, without the permission of the applicable
          intellectual property rights holder.
        </p>
        <p>
          Reference to any products, services, processes or other information by
          name, trademark, manufacturer, supplier or otherwise does not
          constitute or imply endorsement, sponsorship, or recommendation by
          Correlation Systems.
        </p>
        <h3 id="license-to-access-and-use-our-service-and-content">
          License to Access and Use Our Service and Content
        </h3>
        <p>
          You are hereby granted a limited, nonexclusive, nontransferable,
          nonsublicensable, and personal license to access and use the Service
          provided, however, that such license is subject to your compliance
          with these Terms. If any software, content, or other materials owned
          by, controlled by, or licensed to us are distributed or made available
          to you as part of your use of the Service, we hereby grant you a
          non-commercial, personal, non-assignable, non-sublicensable,
          non-transferrable, and non-exclusive right and license to access and
          display such software, content, and materials provided to you as part
          of the Service, in each case for the sole purpose of enabling you to
          use the Service as permitted by these Terms.
        </p>
        <h3 id="third-party-content-agreements-and-services">
          Third-Party Content, Agreements, and Services
        </h3>
        <p>
          Sellers are solely responsible for determining and establishing the
          price of a dataset, inclusive of any applicable tax.
          <br />
          For its Service, Correlation Systems may receive certain fees for
          premium datasets.
        </p>
        <p>
          The Service may also contain links or functionality to access or use
          third-party websites ("Third-Party Websites") and applications
          ("Third-Party Applications"), or otherwise display, include, or make
          available content, data, information, services, applications, or
          materials from third parties ("Third-Party Materials"). When you click
          on a link to, or access and use, a Third-Party Website or Third-Party
          Application, though we may not warn you that you have left our
          Service, you are subject to the terms and conditions (including
          privacy policies) of another website or destination.
        </p>
        <p>
          Such Third-Party Websites, Third-Party Applications, and Third-Party
          Materials are not under the control of Correlation Systems. We are not
          responsible or liable for any Third-Party Websites, Third-Party
          Applications, and Third-Party Materials. We provide links to these
          Third-Party Websites and Third-Party Applications only as a
          convenience and does not review, approve, monitor, endorse, warrant,
          or make any representations with respect to Third-Party Websites or
          Third-Party Applications, or their products or services or associated
          Third-Party Materials. You use all links in Third-Party Websites,
          Third-Party Applications, and Third-Party Materials at your own risk.
        </p>
        <h3 id="user-conduct">User Conduct</h3>
        <p>
          To protect our community and comply with our legal obligations, we
          reserve the right to take action, with or without advance notice, if
          we believe in our sole discretion that you have violated these Terms
          or that you may use our Service for unlawful activity. This may
          include: removing or limiting the ability to view or interact with
          certain datasets; disabling or restricting the ability to use the
          Service (or certain aspects of the Service); and/or other actions.
          <br />
          You agree that you will not violate any law, contract, intellectual
          property or other third-party right, and that you are solely
          responsible for your conduct and content, in connection with using the
          Service. You also agree that you will not:
        </p>
        <ul>
          <li>
            <ol>
              <li>
                Use or attempt to use another user's Account without
                authorization from such user;
              </li>
              <li>Pose as another person or entity,</li>
              <li>
                Claim an account for the purpose of reselling it, confusing
                others, deriving others' goodwill, or otherwise engage in name
                squatting;
              </li>
              <li>
                Distribute spam, including through sharing low-quality datasets
                to other users;
              </li>
              <li>
                Use the Service - including through disseminating any software
                or interacting with any API - that could damage, disable,
                overburden, or impair the functioning of the Service in any
                manner;
              </li>
              <li>
                Bypass or ignore instructions that control access to the
                Service, including attempting to circumvent any rate limiting
                systems, directing traffic through multiple IP addresses, or
                otherwise obfuscating the source of traffic you send to the
                Website;
              </li>
              <li>
                Use our Service, including our APIs, in any way that conflicts
                with our developer policies;
              </li>
              <li>
                Use our Service for commercial purposes inconsistent with these
                Terms or any other instructions;
              </li>
              <li>
                Use any data mining, robot, spider, crawler, scraper, script,
                browser extension, offline reader, or other automated means or
                interface not authorized by us to access the Service, extract
                data, or otherwise interfere with or modify the rendering of
                Service pages or functionality;
              </li>
              <li>
                Reverse engineer, duplicate, decompile, disassemble, or decode
                any aspect of the Service, or do anything that might discover
                source code or bypass or circumvent measures employed to prevent
                or limit access to any service, area, or code of the Service;
              </li>
              <li>
                Sell or resell the Service or attempt to circumvent any
                Correlation Systems fee systems;
              </li>
              <li>
                Engage in behaviors that have the intention or the effect of
                artificially increasing view counts, downloads, or other metrics
                that Correlation Systems might use to surface or sort datasets,
                or search results;
              </li>
              <li>
                Use the Service or data collected from our Service for any
                advertising or direct marketing activity (including without
                limitation, email marketing, SMS marketing, and telemarketing);
              </li>
              <li>
                Use the Service, directly or indirectly, for or in connection
                with money laundering, terrorist financing, or other illicit
                financial activity, or in any way in connection with the
                violation of any law or regulation that applies to you or to
                Correlation Systems;
              </li>
              <li>
                Use the Service, directly or indirectly, for, on behalf of, for
                the benefit of, or in connection with (a) any natural or legal
                person that is the subject of Sanctions; (b) any natural or
                legal person located in, ordinarily resident in, or organized
                under the laws of, any Embargoed Jurisdiction; or (c) any legal
                person owned or controlled, directly or indirectly, by any
                natural or legal person located in, ordinarily resident in, or
                organized under the laws of, any Embargoed Jurisdiction.
              </li>
              <li>
                Use the Service to buy, sell, or transfer stolen data,
                fraudulently obtained data, data taken without authorization,
                and/or any other illegally obtained data;
              </li>
              <li>
                Infringe or violate the intellectual property rights or any
                other rights of others;
              </li>
              <li>
                Create, display, purchase, or sell illegal content, such as
                content that may involve child sexual exploitation;
              </li>
              <li>
                Use the Service for any illegal or unauthorized purpose,
                including creating or displaying illegal content, such as
                content that may involve child sexual exploitation, or
                encouraging or promoting any activity that violates the Terms of
                Service;
              </li>
              <li>Use the Service with the proceeds of unlawful activity;</li>
              <li>
                Use the Service in any manner that could interfere with,
                disrupt, negatively affect or inhibit other users from fully
                enjoying the Service.
              </li>
            </ol>
          </li>
        </ul>
        <h4>Intellectual Property Rights</h4>
        <p>
          You are solely responsible for your use of the Service and for any
          information you provide, including compliance with applicable laws,
          rules, and regulations, as well as these Terms, including the User
          Conduct requirements outlined above.
          <br />
          By using the Service in conjunction with creating, submitting,
          posting, promoting, or displaying datasets, you grant us a worldwide,
          non-exclusive, sublicensable, royalty-free license to use, copy,
          modify, and display any content, including but not limited to text,
          materials, images, files, communications, comments, feedback,
          suggestions, ideas, concepts, questions, data, or otherwise, that you
          submit or post on or through the Service for our current and future
          business purposes, including to provide, promote, and improve the
          Service.
        </p>
        <p>
          Correlation Systems does not claim that submitting, posting, or
          displaying this content on or through the Service gives us any
          ownership of the content. We're not saying we own it. We're just
          saying we might use it for dissemination purposes, mostly.
        </p>
        <p>
          You represent and warrant that you have, or have obtained, all rights,
          licenses, consents, permissions, power and/or authority necessary to
          grant the rights granted herein for any content that you create,
          submit, post, promote, or display on or through the Service.
        </p>
        <p>
          You are solely responsible for the content and metadata associated
          with datasets that you share. You represent and warrant that such
          content does not contain material subject to copyright, trademark,
          publicity rights, or other intellectual property rights, unless you
          have necessary permission or are otherwise legally entitled to post
          the material and to grant Correlation Systems the license described
          above, and that the content does not violate any laws.
        </p>
        <p>
          Correlation Systems will take down works in response to intellectual
          property infringement claims and will terminate a user's access to the
          Service if the user is determined to be a repeat infringer. If you
          believe that your content has been copied in a way that constitutes
          copyright or trademark infringement, or violates your publicity or
          other intellectual property rights, please fill out our form{' '}
          <a href="/contact">here</a>.
        </p>
        <p>
          For us to process your infringement claim regarding content on the
          Service, you must be the rightsholder or someone authorized to act on
          behalf of the rightsholder.
        </p>
        <p>
          Please note that we will forward your notice of intellectual property
          infringement, including your contact information, to the party who
          will have their content removed so they understand why it is no longer
          available on the marketplace and can also contact you to resolve any
          dispute.
        </p>
        <h3 id="communication-preferences">Communication Preferences</h3>
        <p>
          By creating an Account, you consent to receive electronic
          communications from Correlation Systems (e.g., via email). These
          communications may include notices about your Account (e.g.,
          transactional information) and are part of your relationship with us.
        </p>
        <h3 id="indemnification">Indemnification</h3>
        <p>
          By agreeing to these Terms and accessing the Service, you agree, to
          the fullest extent permitted by applicable law, to indemnify, defend,
          and hold harmless Correlation Systems, and our respective past,
          present, and future employees, officers, directors, contractors,
          consultants, equity holders, suppliers, vendors, service providers,
          parent companies, subsidiaries, affiliates, agents, representatives,
          predecessors, successors, and assigns (individually and collectively,
          the "Correlation Systems Parties"), from and against all actual or
          alleged claims, damages, awards, judgments, losses, liabilities,
          obligations, taxes, penalties, interest, fees, expenses (including,
          without limitation, attorneys' fees and expenses), and costs
          (including, without limitation, court costs, costs of settlement, and
          costs of pursuing indemnification and insurance), of every kind and
          nature whatsoever, whether known or unknown, foreseen or unforeseen,
          matured or unmatured, or suspected or unsuspected, in law or equity,
          whether in tort, contract, or otherwise (collectively, "Claims"),
          including, but not limited to, damages to property or personal injury,
          that are caused by, arise out of or are related to (a) your use or
          misuse of the Service, content, datasets, or content linked to or
          associated with any datasets (b) your violation or breach of any term
          of these Terms or applicable law, and (c) your violation of the rights
          of or obligations to a third party, including another user or third
          party, and (d) your negligence or wilful misconduct.
        </p>
        <p>
          You agree to promptly notify Correlation Systems of any Claims and
          cooperate with the Correlation Systems Parties in defending such
          Claims. You further agree that the Correlation Systems Parties shall
          have control of the defense or settlement of any Claims. THIS
          INDEMNITY IS IN ADDITION TO, AND NOT IN LIEU OF, ANY OTHER INDEMNITIES
          SET FORTH IN A WRITTEN AGREEMENT BETWEEN YOU AND CORRELATION SYSTEMS.
        </p>
        <h3 id="disclaimers">Disclaimers</h3>
        <p>
          YOUR ACCESS TO AND USE OF THE SERVICE IS AT YOUR OWN RISK. YOU
          UNDERSTAND AND AGREE THAT THE SERVICE IS PROVIDED ON AN "AS IS" AND
          "AS AVAILABLE" BASIS AND CORRELATION SYSTEMS EXPRESSLY DISCLAIMS
          WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          CORRELATION SYSTEMS (AND ITS SUPPLIERS) MAKE NO WARRANTY OR
          REPRESENTATION AND DISCLAIM ALL RESPONSIBILITY FOR WHETHER THE
          SERVICE: (A) WILL MEET YOUR REQUIREMENTS; (B) WILL BE AVAILABLE ON AN
          UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE BASIS; OR (C) WILL BE
          ACCURATE, RELIABLE, COMPLETE, LEGAL, OR SAFE. CORRELATION SYSTEMS
          DISCLAIMS ALL OTHER WARRANTIES OR CONDITIONS, EXPRESS OR IMPLIED,
          INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND
          NON-INFRINGEMENT. CORRELATION SYSTEMS WILL NOT BE LIABLE FOR ANY LOSS
          OF ANY KIND FROM ANY ACTION TAKEN OR TAKEN IN RELIANCE ON MATERIAL OR
          INFORMATION, CONTAINED ON THE SERVICE. WHILE CORRELATION SYSTEMS
          ATTEMPTS TO MAKE YOUR ACCESS TO AND USE OF THE SERVICE SAFE, WE CANNOT
          AND DO NOT REPRESENT OR WARRANT THAT THE SERVICE, CONTENT, CONTENT
          LINKED TO OR ASSOCIATED WITH ANY DATASET, OR ANY DATASET YOU INTERACT
          WITH USING OUR SERVICE OR OUR SERVICE PROVIDERS' SERVERS ARE FREE OF
          VIRUSES OR OTHER HARMFUL COMPONENTS. WE CANNOT GUARANTEE THE SECURITY
          OF ANY DATA THAT YOU DISCLOSE ONLINE. NO ADVICE OR INFORMATION,
          WHETHER ORAL OR OBTAINED FROM THE CORRELATION SYSTEMS PARTIES OR
          THROUGH THE SERVICE, WILL CREATE ANY WARRANTY OR REPRESENTATION NOT
          EXPRESSLY MADE HEREIN. YOU ACCEPT THE INHERENT SECURITY RISKS OF
          PROVIDING INFORMATION AND DEALING ONLINE OVER THE INTERNET AND WILL
          NOT HOLD CORRELATION SYSTEMS RESPONSIBLE FOR ANY BREACH OF SECURITY.
          <br />
          WE WILL NOT BE RESPONSIBLE OR LIABLE TO YOU FOR ANY LOSS AND TAKE NO
          RESPONSIBILITY FOR, AND WILL NOT BE LIABLE TO YOU FOR, ANY USE OF OR
          LOSS OF USE OF DATASETS, CONTENT, AND/OR CONTENT LINKED TO OR
          ASSOCIATED WITH DATASETS, INCLUDING BUT NOT LIMITED TO ANY LOSSES,
          DAMAGES, OR CLAIMS ARISING FROM: (A) USER ERROR, INCORRECTLY
          CONSTRUCTED TRANSACTIONS, OR MISTYPED EMAIL ADDRESSES; (B) SERVER
          FAILURE OR DATA LOSS; (C) UNAUTHORIZED ACCESS OR USE; (D) ANY
          UNAUTHORIZED THIRD-PARTY ACTIVITIES, INCLUDING WITHOUT LIMITATION THE
          USE OF VIRUSES, PHISHING, BRUTEFORCING OR OTHER MEANS OF ATTACK
          AGAINST THE SERVICE OR DATASETS.
          <br />
          NO CORRELATION SYSTEMS PARTY IS RESPONSIBLE OR LIABLE FOR ANY
          SUSTAINED LOSSES OR INJURY DUE TO VULNERABILITY OR ANY KIND OF
          FAILURE, ABNORMAL BEHAVIOR OF SOFTWARE, OR ANY OTHER FEATURES OF THE
          DATASETS. NO CORRELATION SYSTEMS PARTY IS RESPONSIBLE FOR LOSSES OR
          INJURY DUE TO LATE REPORTS BY DEVELOPERS OR REPRESENTATIVES (OR NO
          REPORT AT ALL) OF ANY ISSUES WITH THE SERVERS SUPPORTING THE DATASETS.
        </p>
        <p>
          Some jurisdictions do not allow the exclusion of implied warranties in
          contracts with consumers, so the above exclusion may not apply to you.
        </p>
        <h3 id="assumption-of-risk">Assumption of Risk</h3>
        <p>You accept and acknowledge:</p>
        <ul>
          <li>
            <ol>
              <li>
                The regulatory regime governing mobility datasets (and personal
                data more generally) is uncertain, and new regulations or
                policies may materially adversely affect the development of the
                Service and the utility of datasets.
              </li>
              <li>
                You are solely responsible for determining what, if any, taxes
                apply to your transactions and to withhold, collect, report, and
                remit the correct amounts of taxes to the appropriate tax
                authorities. Correlation Systems is not responsible for
                determining, withholding, collecting, reporting, or remitting
                any taxes that apply to the sale/purchase of your datasets.
              </li>
              <li>
                There are risks associated with purchasing items associated with
                content created by third parties, including but not limited to,
                the risk of purchasing counterfeit items, mislabeled items,
                items that are vulnerable to metadata decay, and datasets that
                have been improperly anonymised. You represent and warrant that
                you have done sufficient research before making any decisions to
                sell, obtain, transfer, or otherwise interact with any datasets.
              </li>
              <li>
                There are risks associated with using the Internet, including,
                but not limited to, the risk associated with hardware, software,
                and Internet connections, the risk of malicious software
                introduction, and the risk that third parties may obtain
                unauthorized access to your Account. You accept and acknowledge
                that Correlation Systems will not be responsible for any
                communication failures, disruptions, errors, distortions or
                delays you may experience when using the Service, however
                caused.
              </li>
              <li>
                Correlation Systems reserves the right to hide datasets affected
                by any of these issues or by other issues. Datasets you purchase
                may become inaccessible on Correlation Systems. Under no
                circumstances shall the inability to view datasets on
                Correlation Systems or an inability to use the Service in
                conjunction with the purchase, sale, or transfer of datasets
                serve as grounds for a claim against Correlation Systems.
              </li>
              <li>
                If you have a dispute with one or more users, YOU RELEASE US
                FROM CLAIMS, DEMANDS, AND DAMAGES OF EVERY KIND AND NATURE,
                KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH
                SUCH DISPUTES. IN ENTERING INTO THIS RELEASE YOU EXPRESSLY WAIVE
                ANY PROTECTIONS (WHETHER STATUTORY OR OTHERWISE) THAT WOULD
                OTHERWISE LIMIT THE COVERAGE OF THIS RELEASE TO INCLUDE THOSE
                CLAIMS WHICH YOU MAY KNOW OR SUSPECT TO EXIST IN YOUR FAVOR AT
                THE TIME OF AGREEING TO THIS RELEASE.
              </li>
            </ol>
          </li>
        </ul>
        <h3 id="limitation-of-liability">Limitation of Liability</h3>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AGREE THAT IN NO EVENT
          WILL CORRELATION SYSTEMS OR ITS SERVICE PROVIDERS BE LIABLE TO YOU OR
          ANY THIRD PARTY (A) FOR ANY LOST PROFIT OR ANY INDIRECT,
          CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES
          ARISING FROM THESE TERMS OR THE SERVICE, PRODUCTS OR THIRD-PARTY SITES
          AND PRODUCTS, OR FOR ANY DAMAGES RELATED TO LOSS OF REVENUE, LOSS OF
          PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF
          GOODWILL, OR LOSS OF DATA, AND WHETHER CAUSED BY STRICT LIABILITY OR
          TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF
          FORESEEABLE AND EVEN IF CORRELATION SYSTEMS OR ITS SERVICE PROVIDERS
          HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES; OR (B) FOR ANY
          OTHER CLAIM, DEMAND, OR DAMAGES WHATSOEVER RESULTING FROM OR ARISING
          OUT OF OR IN CONNECTION WITH THESE TERMS OF THE DELIVERY, USE, OR
          PERFORMANCE OF THE SERVICE. ACCESS TO, AND USE OF, THE SERVICE,
          PRODUCTS OR THIRD-PARTY SITES, AND PRODUCTS ARE AT YOUR OWN DISCRETION
          AND RISK, AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR
          COMPUTER SYSTEM OR MOBILE DEVICE OR LOSS OF DATA RESULTING THEREFROM.
          <br />
          NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, IN NO EVENT
          SHALL THE MAXIMUM AGGREGATE LIABILITY OF CORRELATION SYSTEMS ARISING
          OUT OF OR IN ANY WAY RELATED TO THESE TERMS, THE ACCESS TO AND USE OF
          THE SERVICE, CONTENT, DATASETS EXCEED THE AMOUNT RECEIVED BY
          CORRELATION SYSTEMS FOR ITS SERVICE TO YOU DIRECTLY RELATING TO THE
          ITEMS THAT ARE THE SUBJECT OF THE CLAIM. THE FOREGOING LIMITATIONS
          WILL APPLY EVEN IF THE ABOVE STATED REMEDY FAILS OF ITS ESSENTIAL
          PURPOSE.
        </p>
        <p>
          Some jurisdictions do not allow the exclusion or limitation of
          incidental or consequential damages, so the above limitation or
          exclusion may not apply to you. Some jurisdictions also limit
          disclaimers or limitations of liability for personal injury from
          consumer products, so this limitation may not apply to personal injury
          claims.
        </p>
        <h3 id="privacy-policy">Privacy Policy</h3>
        <p>
          Please refer to our <a href="/privacy">Privacy Policy</a> for
          information about how we collect, use, and share information from
          and/or about you ("Your Information"). By submitting Your Information
          through our Service, you agree to the terms of our{' '}
          <a href="/privacy">Privacy Policy</a> and you expressly consent to the
          collection, use, and disclosure of Your Information in accordance with
          the <a href="https://opensea.io/privacy">Privacy Policy</a>.
        </p>
        <h3 id="modifications-to-the-service">Modifications to the Service</h3>
        <p>
          We reserve the right in our sole discretion to modify, suspend, or
          discontinue, temporarily or permanently, the Service (or any features
          or parts thereof) at any time and without liability as a result.
        </p>
        <h3 id="dispute-resolution-arbitration">
          Dispute Resolution; Arbitration
        </h3>
        <h4>Dispute Resolution</h4>
        <p>
          Please read the following arbitration agreement in this Section
          ("Arbitration Agreement") carefully. It requires you to arbitrate
          disputes with Correlation Systems and limits the manner in which you
          can seek relief from us. This section does not govern disputes between
          users or between users and third parties. Correlation Systems does not
          provide dispute resolution services for such disagreements and the
          parties must resolve those disputes directly.
        </p>
        <h4>Applicability of Arbitration Agreement</h4>
        <p>
          You agree that any dispute, controversy, or claim relating in any way
          to your access or use of the Service, to any products sold or
          distributed through the Service, or to any aspect of your relationship
          with Correlation Systems, will be resolved by binding arbitration,
          rather than in court, including threshold questions of the
          arbitrability of such dispute, controversy, or claim except that (1)
          you or Correlation Systems may assert claims in small claims court,
          but only if the claims qualify, the claims remain only in such court,
          and the claims remain on an individual, non-representative, and
          non-class basis; and (2) you or Correlation Systems may seek
          injunctive or equitable relief in a court of proper jurisdiction if
          the claim relates to intellectual property infringement or other
          misuse of intellectual property rights.
        </p>
        <h4>Dispute resolution process</h4>
        <p>
          You and Correlation Systems both agree to engage in good-faith efforts
          to resolve disputes prior to either party initiating an arbitration,
          small claims court proceeding, or equitable relief for intellectual
          property infringement. You must initiate this dispute resolution
          process by sending a letter describing the nature of your claim and
          desired resolution by email to{' '}
          <a href="mailto:contact@cs.co.il">contact@cs.co.il</a>. Both parties
          agree to meet and confer personally, by telephone, or by
          videoconference (hereinafter "Conference") to discuss the dispute and
          attempt in good faith to reach a mutually beneficial outcome that
          avoids the expenses of arbitration or, where applicable, litigation.
          If you are represented by counsel, your counsel may participate in the
          Conference as well, but you agree to fully participate in the
          Conference. Likewise, if Correlation Systems is represented by
          counsel, its counsel may participate in the Conference as well, but
          Correlation Systems agrees to have a company representative fully
          participate in the Conference. The statute of limitations and any
          filing fee deadlines shall be tolled while the parties engage in the
          informal dispute resolution process and Conference required by this
          paragraph. If the parties do not reach agreement to resolve the
          dispute within thirty (30) days after initiation of this dispute
          resolution process, either party may commence arbitration, file an
          action in small claims court, or file a claim for injunctive or
          equitable relief in a court of proper jurisdiction for matters
          relating to intellectual property infringement, if the claims qualify.
        </p>
        <h4>Authority of Arbitrator</h4>
        <p>
          The arbitrator shall have exclusive authority to (a) determine the
          scope and enforceability of this Arbitration Agreement and (b) resolve
          any dispute related to the interpretation, applicability,
          enforceability, or formation of this Arbitration Agreement including,
          but not limited to, any claim that all or any part of this Arbitration
          Agreement is void or voidable. The arbitration will decide the rights
          and liabilities, if any, of you and Correlation Systems. The
          arbitration proceeding will not be consolidated with any other matters
          or joined with any other cases or parties. The arbitrator shall have
          the authority to grant motions dispositive of all or part of any
          claim. The arbitrator shall have the authority to award monetary
          damages and to grant any non-monetary remedy or relief available to an
          individual under applicable law, the arbitral forum's rules, and these
          Terms. The arbitrator shall issue a written award and statement of
          decision describing the essential findings and conclusions on which
          the award is based, including the calculation of any damages awarded.
          The arbitrator has the same authority to award relief on an individual
          basis that a judge in a court of law would have. The award of the
          arbitrator is final and binding upon you and us.
        </p>
        <p>
          Waiver of Class Actions and Class Arbitrations. ALL CLAIMS AND
          DISPUTES WITHIN THE SCOPE OF THIS ARBITRATION AGREEMENT MUST BE
          ARBITRATED ON AN INDIVIDUAL BASIS AND NOT ON A REPRESENTATIVE OR
          COLLECTIVE CLASS BASIS. ONLY INDIVIDUAL RELIEF IS AVAILABLE, AND
          CLAIMS OF MORE THAN ONE USER, PERSON, OR ENTITY CANNOT BE ARBITRATED
          OR CONSOLIDATED WITH THOSE OF ANY OTHER USER, PERSON, OR ENTITY.
          Accordingly, under the arbitration procedures outlined in this
          section, an arbitrator shall not combine or consolidate more than one
          party's claims without the written consent of all affected parties to
          an arbitration proceeding. Without limiting the generality of the
          foregoing, you and Correlation Systems agree that no dispute shall
          proceed by way of class arbitration without the written consent of all
          affected parties. If a decision is issued stating that applicable law
          precludes enforcement of any part of this subsection's limitations as
          to a given claim for relief, then that claim must be severed from the
          arbitration and brought in the courts located in Tel Aviv, Israel. All
          other claims shall be arbitrated.
        </p>
        <h4>Severability</h4>
        <p>
          Except as provided in this Section, if any part or parts of this
          Arbitration Agreement are found under the law to be invalid or
          unenforceable, then such specific part or parts shall be of no force
          and effect and shall be severed and the remainder of the Arbitration
          Agreement shall continue in full force and effect.
        </p>
        <h4>Survival of Agreement</h4>
        <p>
          This Arbitration Agreement will survive the termination of your
          relationship with Correlation Systems.
        </p>
        <h4>Modification</h4>
        <p>
          Notwithstanding any provision in these Terms to the contrary, we agree
          that if Correlation Systems makes any future material change to this
          Arbitration Agreement, you may reject that change within thirty (30)
          days of such change becoming effective by writing to Correlation
          Systems at the following email address:{' '}
          <a href="mailto:contact@cs.co.il">contact@cs.co.il</a>
        </p>
        <h3 id="governing-law-and-venue">Governing Law and Venue</h3>
        <p>
          These Terms and your access to and use of the Service shall be
          governed by and construed and enforced in accordance with the laws of
          Israel. Any dispute between the parties that is not subject to
          arbitration or cannot be heard in small claims court, shall be
          resolved in the courts of Tel Aviv, Israel.
        </p>
        <h3 id="termination">Termination</h3>
        <p>
          If you breach any of the provisions of these Terms, all licenses
          granted by Correlation Systems will terminate automatically.
          Additionally, notwithstanding anything contained in these Terms, we
          reserve the right, with or without notice and in our sole discretion,
          to suspend, restrict, disable, terminate, or delete your Account
          and/or your ability to access or use the Service (or any part of the
          foregoing) at any time and for any or no reason, and you acknowledge
          and agree that we shall have no liability or obligation to you in such
          event and that you will not be entitled to a refund of any amounts
          that you have already paid to us. If we terminate your Account or
          restrict your access or use of the Service, you retain ownership of
          the datasets you purchased. You may still access your datasets by
          other means in your possession, including through local copies of the
          purchased datasets, stored on your devices.
        </p>
        <h3 id="severability">Severability</h3>
        <p>
          If any term, clause, or provision of these Terms is held invalid or
          unenforceable, then that term, clause, or provision will be severable
          from these Terms and will not affect the validity or enforceability of
          any remaining part of that term, clause, or provision, or any other
          term, clause, or provision of these Terms.
        </p>
        <h3 id="injunctive-relief">Injunctive Relief</h3>
        <p>
          You agree that a breach of these Terms will cause irreparable injury
          to Correlation Systems for which monetary damages would not be an
          adequate remedy and Correlation Systems shall be entitled to equitable
          relief in addition to any remedies it may have hereunder or at law
          without a bond, other security, or proof of damages.
        </p>
        <h3 id="export-laws">Export Laws</h3>
        <p>
          You agree that you will not export or re-export, directly or
          indirectly, the Service, and/or other information or materials
          provided by Correlation Systems hereunder, to any country for which
          Israel or any other relevant jurisdiction requires any export license
          or other governmental approval at the time of export without first
          obtaining such license or approval. In particular, but without
          limitation, the Service may not be exported or re-exported (a) into
          any U.N. embargoed countries. By using the Service, you represent and
          warrant that you are not located in any such country or on any such
          list. You are responsible for and hereby agree to comply at your sole
          expense with all applicable Israeli export laws and regulations.
        </p>
        <h3 id="survival">Survival</h3>
        <p>
          All sections which by their nature should survive the termination of
          these Terms shall continue in full force and effect subsequent to and
          notwithstanding any termination of these Terms by Correlation Systems
          or you. Termination will not limit any of Correlation Systems' other
          rights or remedies at law or in equity.
        </p>
        <h3 id="miscellaneous">Miscellaneous</h3>
        <p>
          These Terms (and any other applicable terms or policies incorporated
          by reference in these Terms) constitute the entire agreement between
          you and Correlation Systems relating to your access to and use of the
          Service. These Terms, and any rights and licenses granted hereunder,
          may not be transferred or assigned by you without the prior written
          consent of Correlation Systems, and Correlation Systems' failure to
          assert any right or provision under these Terms shall not constitute a
          waiver of such right or provision. No waiver by either party of any
          breach or default hereunder shall be deemed to be a waiver of any
          preceding or subsequent breach or default. The section headings used
          herein are for reference only and shall not be read to have any legal
          effect.
          <br />
          The Service is operated by us in Israel. Those who choose to access
          the Service from locations outside of Israel do so at their own
          initiative and are responsible for compliance with applicable local
          laws.
          <br />
          Except as otherwise provided herein, these Terms are intended solely
          for the benefit of the parties and are not intended to confer
          third-party beneficiary rights upon any other person or entity.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
