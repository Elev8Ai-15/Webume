# LockUp Security Scanner -- Comprehensive Compliance & Security Checks Research

**Date:** 2026-03-25
**Researcher:** Ops Research Analyst for Brad / Elev8 AI
**Purpose:** Identify every web-scannable security check across all major compliance frameworks

---

## CURRENT LOCKUP CAPABILITIES (Baseline)

- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- TLS/SSL analysis
- Sensitive file exposure
- CORS configuration
- Cookie security
- Server version disclosure
- Some ISO 27001 Annex A controls

---

## 1. ISO 27001:2022 ANNEX A -- TECHNOLOGICAL CONTROLS (A.8.x)

All 34 technological controls listed. Those marked [WEB-SCANNABLE] can be validated via HTTP/web scanning.

| Control ID | Control Name | Web-Scannable Check | Severity |
|------------|-------------|---------------------|----------|
| A.8.1 | User Endpoint Devices | N/A -- internal control | -- |
| A.8.2 | Privileged Access Rights | Check for admin panels exposed (e.g., /admin, /wp-admin, /cpanel) | High |
| A.8.3 | Information Access Restriction | Check for directory listings enabled, accessible restricted paths | High |
| A.8.4 | Access to Source Code | Check for exposed .git/, .svn/, source map files (.map), backup files | Critical |
| A.8.5 | Secure Authentication | Check for login pages over HTTP (not HTTPS), missing MFA indicators, weak password policy indicators | High |
| A.8.6 | Capacity Management | N/A -- internal operational control | -- |
| A.8.7 | Protection Against Malware | Check for malware indicators in page content, suspicious scripts, known malicious domains in script sources | High |
| A.8.8 | Management of Technical Vulnerabilities | Check for known vulnerable library versions (jQuery, Bootstrap, etc.), outdated server software versions | High |
| A.8.9 | Configuration Management | [WEB-SCANNABLE] Check for default configurations, default error pages, default credentials pages, debug mode enabled | High |
| A.8.10 | Information Deletion | Check for data retention policy links, privacy policy references | Low |
| A.8.11 | Data Masking | N/A -- internal data handling | -- |
| A.8.12 | Data Leakage Prevention | [WEB-SCANNABLE] Check for sensitive data in HTML comments, exposed PII patterns in responses, API keys in client-side JS | Critical |
| A.8.13 | Information Backup | N/A -- internal operational | -- |
| A.8.14 | Redundancy of Information Processing | N/A -- infrastructure level | -- |
| A.8.15 | Logging | Check for verbose error messages that reveal logging details, stack traces exposed to users | Medium |
| A.8.16 | Monitoring Activities | Check for Reporting-Endpoints header, Report-To header, NEL header (indicates monitoring is configured) | Low |
| A.8.17 | Clock Synchronisation | Check Date header accuracy vs current time | Low |
| A.8.18 | Use of Privileged Utility Programs | N/A -- internal | -- |
| A.8.19 | Installation of Software | N/A -- internal | -- |
| A.8.20 | Networks Security | [WEB-SCANNABLE] Check for TLS configuration, cipher suites, protocol versions | High |
| A.8.21 | Security of Network Services | [WEB-SCANNABLE] Check for exposed services on common ports, unnecessary open ports | High |
| A.8.22 | Segregation of Networks | Check for internal IP addresses leaking in headers (X-Forwarded-For, Via) | Medium |
| A.8.23 | Web Filtering | N/A -- client-side control | -- |
| A.8.24 | Use of Cryptography | [WEB-SCANNABLE] Check TLS version (must be 1.2+), cipher strength, certificate validity, key size | Critical |
| A.8.25 | Secure Development Life Cycle | Check for security.txt file, responsible disclosure policy | Low |
| A.8.26 | Application Security Requirements | [WEB-SCANNABLE] Check all security headers present, CSP properly configured, CORS restrictive | High |
| A.8.27 | Secure System Architecture | Check for separation of concerns indicators (API on different subdomain, static assets on CDN) | Low |
| A.8.28 | Secure Coding | [WEB-SCANNABLE] Check for inline scripts without nonce/hash (CSP violations), eval() usage in scripts | Medium |
| A.8.29 | Security Testing | Check for security.txt with bug bounty info, /.well-known/security.txt | Low |
| A.8.30 | Outsourced Development | N/A -- contractual | -- |
| A.8.31 | Separation of Environments | Check for staging/dev subdomains exposed, debug headers (X-Debug, X-Debug-Token) | High |
| A.8.32 | Change Management | N/A -- process control | -- |
| A.8.33 | Test Information | Check for test data exposed in responses, test endpoints accessible | Medium |
| A.8.34 | Protection During Audit | N/A -- process control | -- |

**WEB-SCANNABLE COUNT: ~18 of 34 controls can be partially or fully validated externally**

---

## 2. OWASP TOP 10:2025 (Updated from 2021)

NOTE: OWASP released a 2025 update. Key changes: SSRF merged into A01, Supply Chain is now A03, Mishandling Exceptional Conditions is new at A10.

### A01:2025 -- Broken Access Control (now includes SSRF)
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Directory traversal attempts (../) | HTTP request | Critical | No |
| IDOR pattern detection (sequential IDs in URLs) | HTTP response analysis | High | No |
| Missing access control on API endpoints | HTTP request | High | No |
| CORS misconfiguration allowing credential theft | HTTP header check | High | YES |
| Exposed admin/management interfaces | HTTP request probing | High | No |
| robots.txt revealing sensitive paths | HTTP GET /robots.txt | Medium | No |
| SSRF indicators (internal IP in responses) | HTTP response analysis | Critical | No |
| Missing anti-CSRF tokens in forms | HTML parsing | Medium | No |
| Open redirect detection | HTTP response analysis | Medium | No |

### A02:2025 -- Security Misconfiguration (moved up from #5)
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Default error pages (Apache, Nginx, IIS default) | HTTP response analysis | Medium | No |
| Debug mode enabled (X-Debug headers, stack traces) | HTTP header/response | High | No |
| Directory listing enabled | HTTP request | High | No |
| Unnecessary HTTP methods (PUT, DELETE, TRACE, OPTIONS) | HTTP OPTIONS request | Medium | No |
| Missing security headers | HTTP header check | High | YES |
| Default credentials pages accessible | HTTP request | Critical | No |
| Verbose error messages with stack traces | HTTP response analysis | High | No |
| Server information disclosure | HTTP header check | Medium | YES |
| .env file exposed | HTTP request | Critical | YES |
| phpinfo() page accessible | HTTP request | High | No |
| Exposed .git directory | HTTP request | Critical | YES |
| Backup files accessible (.bak, .old, .sql, .zip) | HTTP request | Critical | Partial |
| TRACE method enabled (XST attack) | HTTP TRACE request | Medium | No |

### A03:2025 -- Software Supply Chain Failures (NEW -- replaces A06:2021)
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Outdated JavaScript libraries (jQuery, Angular, React) | HTML/JS analysis | High | No |
| Known CVE in detected libraries | Version fingerprinting + CVE DB | Critical | No |
| Missing Subresource Integrity (SRI) on CDN scripts | HTML analysis | High | No |
| Third-party scripts from untrusted domains | HTML analysis | Medium | No |
| Compromised or typosquatted CDN domains | DNS/domain analysis | Critical | No |
| Missing integrity attributes on external resources | HTML parsing | Medium | No |
| Number of third-party script origins | HTML analysis | Info | No |
| Script loading from HTTP (not HTTPS) | HTML analysis | High | No |

### A04:2025 -- Cryptographic Failures
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| TLS version < 1.2 | TLS handshake | Critical | YES |
| Weak cipher suites | TLS analysis | High | YES |
| Certificate expiry approaching | Certificate check | High | YES |
| Self-signed certificate | Certificate check | High | YES |
| Mixed content (HTTP resources on HTTPS page) | HTML analysis | High | No |
| Sensitive data transmitted over HTTP | HTTP analysis | Critical | No |
| Weak key size (< 2048 bit RSA) | Certificate check | High | Partial |
| Missing HSTS header | HTTP header | High | YES |
| Certificate chain incomplete | Certificate check | Medium | Partial |
| OCSP stapling not enabled | TLS analysis | Low | No |

### A05:2025 -- Injection
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Reflected XSS detection (basic patterns) | HTTP response analysis | High | No |
| SQL error messages in responses | HTTP response analysis | Critical | No |
| Template injection indicators | HTTP response analysis | High | No |
| Missing Content-Type header on API responses | HTTP header check | Medium | No |
| CSP missing or allows unsafe-inline/unsafe-eval | HTTP header analysis | High | Partial |
| X-Content-Type-Options missing (MIME sniffing) | HTTP header check | Medium | YES |

### A06:2025 -- Insecure Design
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Rate limiting not detected on login/API | HTTP request analysis | Medium | No |
| CAPTCHA absence on forms | HTML analysis | Low | No |
| Predictable resource locations | URL pattern analysis | Medium | No |
| Missing security.txt | HTTP request | Low | No |

### A07:2025 -- Identification and Authentication Failures
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Login page over HTTP | HTTP analysis | Critical | No |
| Session token in URL | HTTP response analysis | High | No |
| Missing Secure flag on session cookies | HTTP Set-Cookie header | High | YES |
| Missing HttpOnly flag on session cookies | HTTP Set-Cookie header | High | YES |
| Missing SameSite attribute on cookies | HTTP Set-Cookie header | Medium | YES |
| Weak session ID entropy | Cookie analysis | Medium | No |
| Password autocomplete not disabled on login | HTML analysis | Low | No |

### A08:2025 -- Software and Data Integrity Failures
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Missing SRI on external scripts/styles | HTML analysis | High | No |
| Unsigned or unverified CDN resources | HTML analysis | Medium | No |
| Deserialization endpoints exposed | HTTP response analysis | High | No |

### A09:2025 -- Security Logging and Alerting Failures
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Missing Reporting-Endpoints header | HTTP header check | Low | No |
| Missing Report-To header | HTTP header check | Low | No |
| Missing NEL (Network Error Logging) header | HTTP header check | Low | No |
| No CSP report-uri / report-to configured | HTTP header analysis | Medium | No |

### A10:2025 -- Mishandling of Exceptional Conditions (NEW)
| Check | Method | Severity | Currently Have? |
|-------|--------|----------|-----------------|
| Detailed error messages exposed to users | HTTP response (404, 500) | Medium | No |
| Stack traces in error responses | HTTP response analysis | High | No |
| Different error messages for valid vs invalid users | HTTP response comparison | Medium | No |
| Application crashes on malformed input | HTTP response analysis | High | No |

---

## 3. NIST CYBERSECURITY FRAMEWORK (CSF 2.0) -- Web-Scannable Mappings

| NIST Function | Category | Web-Scannable Check | Maps To |
|---------------|----------|---------------------|---------|
| **IDENTIFY** | ID.AM - Asset Management | Technology fingerprinting (server, framework, CMS detection) | OWASP A02 |
| **IDENTIFY** | ID.RA - Risk Assessment | Vulnerability scanning, CVE detection in components | OWASP A03 |
| **PROTECT** | PR.AC - Access Control | Authentication checks, session management, CORS | OWASP A01, A07 |
| **PROTECT** | PR.DS - Data Security | TLS/encryption validation, mixed content, data in transit | OWASP A04, ISO A.8.24 |
| **PROTECT** | PR.IP - Information Protection | Security headers validation, CSP, HSTS, cookie flags | ISO A.8.26 |
| **PROTECT** | PR.PT - Protective Technology | WAF detection, rate limiting, bot protection | OWASP A02 |
| **DETECT** | DE.AE - Anomalies and Events | NEL header, Reporting-Endpoints presence | OWASP A09 |
| **DETECT** | DE.CM - Continuous Monitoring | Certificate monitoring, header consistency checks | ISO A.8.16 |

---

## 4. PCI-DSS v4.0 -- Externally Scannable Requirements

| Requirement | Description | Web-Scannable Check | Severity |
|-------------|-------------|---------------------|----------|
| 2.2.7 | All non-console admin access encrypted | Check admin panels use HTTPS | High |
| 4.2.1 | Strong cryptography for transmission | TLS 1.2+ required, strong ciphers | Critical |
| 4.2.1.1 | Certificates trusted and valid | Certificate validity, chain, trust | Critical |
| 4.2.1.2 | Wireless transmission encryption | N/A for web scanner | -- |
| 6.2.4 | Software engineering techniques prevent attacks | CSP, input validation indicators | High |
| 6.3.3 | Known vulnerabilities addressed | Library version detection, CVE matching | Critical |
| 6.4.1 | Public-facing web apps protected | WAF detection, security headers | High |
| 6.4.2 | Automated technical solution for public web apps | WAF presence detection | Medium |
| **6.4.3** | **Payment page scripts managed** | **Script inventory on payment pages, SRI validation, unauthorized script detection** | **Critical** |
| 8.2.1 | Unique user IDs | Login page analysis | Medium |
| 8.3.1 | MFA for admin access | MFA indicators on admin login | High |
| 11.3.2 | External vulnerability scans (ASV) | Full external vulnerability scan | Critical |
| 11.3.2.1 | Scans after significant changes | Scan scheduling/comparison | High |
| 11.4.1 | Penetration testing | Beyond automated scanning | -- |
| 12.3.1 | Risk assessments performed | security.txt, responsible disclosure | Low |

**PCI-DSS 6.4.3 is a major opportunity for LockUp** -- monitoring payment page scripts is a new v4.0 requirement that many organizations struggle with.

---

## 5. SOC 2 TYPE II -- Externally Validatable Trust Service Criteria

| Criteria | Category | Web-Scannable Check | Severity |
|----------|----------|---------------------|----------|
| CC6.1 | Logical Access Security | Authentication mechanisms, session management | High |
| CC6.6 | Security for Transmitted Information | TLS configuration, HSTS, encryption in transit | Critical |
| CC6.7 | Restricting Transmission | CORS policy, CSP restrictions | High |
| CC6.8 | Prevention of Unauthorized Software | SRI checks, script inventory | Medium |
| CC7.1 | Monitor Infrastructure | NEL, Reporting-Endpoints, monitoring headers | Low |
| CC7.2 | Monitor System Components | Server version disclosure, technology fingerprint | Medium |
| CC8.1 | Changes to Infrastructure | Debug headers, staging environment exposure | Medium |
| A1.1 | Availability Monitoring | Response time measurement, uptime check | Low |
| A1.2 | Recovery Mechanisms | N/A -- internal process | -- |
| PI1.2 | Input Validation | Form validation indicators, error handling | Medium |
| C1.1 | Confidentiality of Information | Data exposure checks, PII in responses | High |
| P1.1-P8.1 | Privacy Criteria | Privacy policy presence, cookie consent | Medium |

---

## 6. GDPR TECHNICAL REQUIREMENTS -- Web-Scannable Checks

| Check | What to Scan | Severity | Method |
|-------|-------------|----------|--------|
| Cookie consent banner presence | HTML analysis for consent mechanisms | High | HTML parsing |
| Pre-consent cookie firing | Check if non-essential cookies set before consent | Critical | HTTP analysis |
| Cookie categorization | Detect if cookies are properly categorized (necessary, analytics, marketing) | High | Cookie analysis |
| Privacy policy page exists | Check for /privacy, /privacy-policy links | High | HTTP request + link analysis |
| Cookie policy page exists | Check for /cookie-policy links | Medium | HTTP request + link analysis |
| Terms of service page exists | Check for /terms, /tos links | Medium | HTTP request |
| HTTPS enforcement | All pages served over HTTPS | Critical | HTTP analysis |
| Data processing agreement links | Check footer/legal pages for DPA references | Low | HTML analysis |
| Right to deletion mechanism | Check for account deletion or data request options | Medium | HTML analysis |
| Third-party tracking scripts pre-consent | Detect GA, Meta Pixel, etc. loading before consent | Critical | HTML/JS analysis |
| Cookie banner reject option | Verify reject is equally prominent as accept | High | HTML analysis |
| Do Not Track (DNT) header respect | Check if DNT header is acknowledged | Low | HTTP header |
| Data subject rights page | Check for DSAR form or process | Medium | Link analysis |
| Cross-border transfer indicators | Check for CDN origins outside EU/EEA | Low | DNS/header analysis |
| Cookie expiration compliance | Check cookie max-age values (GDPR recommends max 13 months for analytics) | Medium | Cookie analysis |
| Fingerprinting scripts detection | Detect canvas fingerprinting, WebGL fingerprinting, audio context fingerprinting | High | JS analysis |
| Third-party script inventory | Count and categorize all third-party scripts | Medium | HTML analysis |

---

## 7. CIS BENCHMARKS -- Web Server Checks via HTTP Response

| CIS Check | What to Validate | Applies To | Severity |
|-----------|-----------------|------------|----------|
| Server signature suppression | Server header should not reveal version | Apache/Nginx/IIS | Medium |
| X-Powered-By header removal | Should not be present | All servers | Medium |
| X-AspNet-Version header removal | Should not be present | IIS/.NET | Medium |
| X-AspNetMvc-Version header removal | Should not be present | IIS/MVC | Medium |
| Directory listing disabled | Directory requests return 403/404, not file list | All | High |
| HTTP TRACE disabled | TRACE method returns 405 | All | Medium |
| ETags not revealing inodes | ETag header should not contain inode information | Apache | Low |
| Default content removed | Default welcome/test pages not present | All | Medium |
| SSL/TLS protocols restricted | Only TLS 1.2+ supported | All | Critical |
| Strong cipher suites only | No weak/null/export ciphers | All | High |
| HSTS enabled | Strict-Transport-Security present | All | High |
| Cookie HttpOnly flag | Set on session cookies | All | High |
| Cookie Secure flag | Set on all cookies when HTTPS | All | High |
| Content-Security-Policy present | CSP header configured | All | High |
| X-Content-Type-Options: nosniff | Prevent MIME sniffing | All | Medium |
| X-Frame-Options set | Prevent clickjacking | All | Medium |
| Cache-Control for sensitive pages | no-store, no-cache on sensitive content | All | Medium |
| HTTP to HTTPS redirect | Port 80 redirects to 443 | All | High |
| OCSP Stapling enabled | OCSP response in TLS handshake | All | Low |
| Request size limits | Large request handling (413 response) | All | Low |

---

## 8. HIPAA TECHNICAL SAFEGUARDS -- Externally Validatable

| HIPAA Requirement | Web-Scannable Check | Severity |
|-------------------|---------------------|----------|
| 164.312(a)(1) -- Access Control | Login mechanism analysis, session management | High |
| 164.312(a)(2)(iv) -- Encryption & Decryption | TLS 1.2+ enforcement, strong ciphers | Critical |
| 164.312(c)(1) -- Integrity | Missing integrity checks (SRI), content tampering indicators | High |
| 164.312(d) -- Person/Entity Authentication | Authentication mechanism detection, MFA indicators | High |
| 164.312(e)(1) -- Transmission Security | HTTPS enforcement, HSTS, mixed content | Critical |
| 164.312(e)(2)(ii) -- Encryption in Transit | TLS configuration, cipher suite analysis | Critical |
| Vulnerability Scanning (Proposed 2025) | Biannual external vulnerability scanning | Critical |
| Penetration Testing (Proposed 2025) | Annual penetration testing | Critical |

---

## 9. SECURITY HEADERS -- COMPLETE LIST (Including What LockUp is Missing)

### Currently Implemented
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### MISSING -- Must Add
| Header | Purpose | Severity | Adoption (2025) |
|--------|---------|----------|-----------------|
| **Cross-Origin-Opener-Policy (COOP)** | Prevents XS-Leaks, Spectre attacks on cross-origin window access | High | ~2% |
| **Cross-Origin-Embedder-Policy (COEP)** | Prevents loading cross-origin resources without explicit permission | Medium | ~0.75% |
| **Cross-Origin-Resource-Policy (CORP)** | Prevents cross-origin resource loading by other sites | Medium | ~2.25% |
| **X-Permitted-Cross-Domain-Policies** | Controls Adobe Flash/Acrobat cross-domain access (set to "none") | Low | Legacy but still checked |
| **X-DNS-Prefetch-Control** | Controls browser DNS prefetching (privacy concern) | Low | -- |
| **X-Download-Options** | Prevents IE from opening downloaded files directly (set to "noopen") | Low | IE-specific but still checked |
| **Cache-Control** | Prevents caching of sensitive data (no-store, no-cache, private) | High | -- |
| **Pragma: no-cache** | Legacy cache prevention (supplement to Cache-Control) | Low | -- |
| **Reporting-Endpoints** | Modern replacement for Report-To, defines error reporting destinations | Medium | Emerging |
| **Report-To** | Defines endpoints for browser error/violation reports | Medium | -- |
| **NEL (Network Error Logging)** | Instructs browser to report network-level errors | Low | Niche |
| **Clear-Site-Data** | Allows server to clear browser data on logout | Medium | -- |
| **X-Powered-By** | Should NOT be present (information disclosure) | Medium | Check for absence |
| **X-AspNet-Version** | Should NOT be present (information disclosure) | Medium | Check for absence |
| **X-AspNetMvc-Version** | Should NOT be present (information disclosure) | Medium | Check for absence |
| **X-Generator** | Should NOT be present (CMS disclosure) | Medium | Check for absence |

### Deprecated (Check but Note as Deprecated)
| Header | Status | Note |
|--------|--------|------|
| **Expect-CT** | Deprecated since Chrome 107 (2022) | CT now enforced by default in all browsers |
| **X-XSS-Protection** | Deprecated | Should be set to "0" -- use CSP instead |
| **Public-Key-Pins (HPKP)** | Removed | Was too dangerous (could brick sites) |
| **Feature-Policy** | Replaced | Now called Permissions-Policy |

---

## 10. MODERN WEB SECURITY CHECKS -- Complete Catalog

### DNS Security (requires DNS lookup, not just HTTP)
| Check | Method | Severity | Framework Mapping |
|-------|--------|----------|-------------------|
| **DNSSEC enabled** | DNS query for DNSKEY/DS records | High | NIST ID.AM, ISO A.8.20 |
| **CAA records present** | DNS query for CAA record type | Medium | PCI 4.2.1, ISO A.8.24 |
| **SPF record configured** | DNS TXT lookup for "v=spf1" | High | ISO A.8.20, NIST PR.AC |
| **DKIM record present** | DNS TXT lookup for selector._domainkey | High | ISO A.8.20 |
| **DMARC record configured** | DNS TXT lookup for _dmarc subdomain | High | ISO A.8.20, NIST PR.AC |
| **DMARC policy strength** | Check p=none vs p=quarantine vs p=reject | High | Best practice |
| **MTA-STS record** | DNS TXT lookup for _mta-sts | Medium | Email security |
| **BIMI record** | DNS TXT lookup for _bimi | Low | Brand protection |
| **TLS-RPT record** | DNS TXT lookup for _smtp._tls | Low | Email security |
| **Dangling DNS / subdomain takeover** | CNAME pointing to deprovisioned service | Critical | OWASP A01, A02 |

### TLS/Certificate Deep Analysis
| Check | Method | Severity |
|-------|--------|----------|
| Certificate Transparency logs | CT log lookup | Medium |
| HSTS preload list membership | Check hstspreload.org API | Medium |
| OCSP stapling enabled | TLS handshake analysis | Low |
| Certificate pinning indicators | HTTP header check (deprecated HPKP) | Info |
| TLS 1.3 support | TLS handshake | Medium |
| Forward secrecy cipher suites | TLS cipher analysis | High |
| Certificate key type (RSA vs ECDSA) | Certificate analysis | Low |
| Certificate chain completeness | Certificate validation | Medium |
| Wildcard certificate detection | Certificate CN/SAN analysis | Info |
| HTTP to HTTPS redirect chain | HTTP request following redirects | High |

### Content & HTML Analysis
| Check | Method | Severity |
|-------|--------|----------|
| Mixed content (HTTP resources on HTTPS) | HTML parsing for http:// in src/href | High |
| HTML comments containing sensitive info | HTML parsing | Medium |
| Inline scripts without CSP nonce/hash | HTML + CSP analysis | Medium |
| Forms without CSRF tokens | HTML form parsing | Medium |
| Forms submitting over HTTP | HTML form action analysis | High |
| Autocomplete on password fields | HTML input attribute check | Low |
| Meta refresh redirects | HTML meta tag parsing | Low |
| Exposed email addresses | HTML regex scanning | Low |
| Source map files accessible | HTTP request for .map files | Medium |
| Exposed internal paths in comments/attributes | HTML analysis | Medium |

### Client-Side JavaScript Security
| Check | Method | Severity |
|-------|--------|----------|
| **API keys in JS bundles** | JS content scanning for key patterns | Critical |
| **AWS keys in client-side code** | Regex for AKIA pattern | Critical |
| **Stripe keys in client-side** | Regex for sk_live_ pattern | Critical |
| **Firebase config exposed** | Regex for apiKey in firebase config | High |
| eval() usage detection | JS content scanning | Medium |
| document.write() usage | JS content scanning | Medium |
| innerHTML assignment from user input indicators | JS analysis | Medium |
| PostMessage without origin check | JS analysis | Medium |
| LocalStorage storing sensitive data indicators | JS analysis | Medium |

### Protocol & Performance Security
| Check | Method | Severity |
|-------|--------|----------|
| HTTP/2 support | Protocol negotiation | Low |
| HTTP/3 (QUIC) support | Alt-Svc header check | Low |
| Redirect chain length | HTTP following redirects | Medium |
| Open redirect vulnerabilities | HTTP response analysis | High |
| HTTP request smuggling indicators | HTTP response analysis | High |
| WebSocket (WSS vs WS) | Check upgrade headers | Medium |
| WebSocket origin validation | WS handshake analysis | Medium |

### Information Leakage
| Check | Method | Severity |
|-------|--------|----------|
| Server version in headers | HTTP Server header | Medium |
| Framework version disclosure | X-Powered-By, X-AspNet-Version | Medium |
| CMS version detection | HTML meta tags, known paths | Medium |
| PHP version exposure | X-Powered-By, phpinfo() | Medium |
| Debug/development mode indicators | X-Debug, X-Debug-Token headers | High |
| Internal IP addresses in headers | X-Forwarded-For, Via, X-Real-IP | High |
| Detailed error pages | 404/500 response analysis | Medium |
| Technology stack fingerprinting | Response header combination analysis | Low |
| WordPress version, plugin enumeration | wp-includes, readme.html paths | Medium |
| robots.txt sensitive path disclosure | robots.txt content analysis | Medium |
| sitemap.xml path disclosure | sitemap analysis | Low |

---

## 11. SUPPLY CHAIN SECURITY CHECKS

| Check | Method | Severity | Framework |
|-------|--------|----------|-----------|
| Third-party script inventory | HTML parsing, script src analysis | Medium | OWASP A03, PCI 6.4.3 |
| SRI (Subresource Integrity) on all external scripts | HTML integrity attribute check | High | OWASP A03, A08 |
| SRI on all external stylesheets | HTML integrity attribute check | Medium | OWASP A08 |
| CDN domain reputation | Domain age/reputation check | Medium | OWASP A03 |
| Number of unique third-party origins | HTML script src counting | Info | OWASP A03 |
| Known vulnerable JS library versions | Version detection + CVE database | Critical | OWASP A03, PCI 6.3.3 |
| Script loading over HTTP (insecure) | HTML src analysis | High | OWASP A04 |
| Typosquatting detection on CDN domains | Domain similarity analysis | High | OWASP A03 |
| Inline script vs external script ratio | HTML analysis | Info | CSP analysis |
| Google Tag Manager / analytics integrity | Script hash verification | Medium | PCI 6.4.3 |
| Total page weight / request count | Performance analysis | Info | Availability |
| Third-party script changes detection (over time) | Hash comparison across scans | High | PCI 6.4.3 |

---

## 12. PRIVACY & DATA PROTECTION CHECKS

| Check | Method | Severity | Framework |
|-------|--------|----------|-----------|
| Cookie consent mechanism present | HTML/JS analysis | High | GDPR, ePrivacy |
| Pre-consent non-essential cookies | Cookie analysis before consent interaction | Critical | GDPR |
| Cookie categorization implemented | Consent banner analysis | High | GDPR |
| Third-party tracking pixels detected | HTML img/script analysis (Meta Pixel, Google Analytics, etc.) | High | GDPR, CCPA |
| Canvas fingerprinting scripts | JS analysis for canvas API abuse | High | GDPR, Privacy |
| WebGL fingerprinting | JS analysis for WebGL renderer strings | Medium | Privacy |
| AudioContext fingerprinting | JS analysis for AudioContext API | Medium | Privacy |
| Font fingerprinting | JS analysis for font enumeration | Medium | Privacy |
| Privacy policy link in footer | HTML analysis | High | GDPR, CCPA |
| Cookie policy link | HTML analysis | Medium | GDPR |
| Data subject access request mechanism | Link/form detection | Medium | GDPR |
| Do Not Track header respect | Server behavior analysis | Low | Best practice |
| Global Privacy Control (GPC) support | Header analysis | Medium | CCPA |
| Number of tracking scripts loaded | Script categorization | Info | Privacy |
| LocalStorage/SessionStorage usage for tracking | JS analysis | Medium | ePrivacy |
| Cross-domain tracking indicators | Script/pixel domain analysis | Medium | Privacy |
| California "Do Not Sell" link (CCPA) | HTML link analysis | Medium | CCPA |
| Age verification mechanisms | HTML/form analysis | Low | COPPA |

---

## 13. ADDITIONAL CHECKS FOR MAXIMUM COVERAGE

### Sensitive File Exposure (Expand Current List)
| File/Path | Severity | Currently Check? |
|-----------|----------|-----------------|
| /.git/HEAD | Critical | YES |
| /.git/config | Critical | YES |
| /.env | Critical | YES |
| /.env.local | Critical | Add |
| /.env.production | Critical | Add |
| /.env.development | Critical | Add |
| /wp-config.php | Critical | Add |
| /web.config | High | Add |
| /server-status | High | Add |
| /server-info | High | Add |
| /elmah.axd | High | Add |
| /trace.axd | High | Add |
| /phpinfo.php | High | Add |
| /info.php | High | Add |
| /adminer.php | Critical | Add |
| /phpmyadmin/ | Critical | Add |
| /.htaccess | Medium | Add |
| /.htpasswd | Critical | Add |
| /crossdomain.xml | Medium | Add |
| /clientaccesspolicy.xml | Medium | Add |
| /.well-known/security.txt | Info | Add |
| /.well-known/change-password | Info | Add |
| /package.json | Medium | Add |
| /package-lock.json | Medium | Add |
| /composer.json | Medium | Add |
| /composer.lock | Medium | Add |
| /Gemfile | Medium | Add |
| /Gemfile.lock | Medium | Add |
| /requirements.txt | Medium | Add |
| /Pipfile | Medium | Add |
| /yarn.lock | Medium | Add |
| /pnpm-lock.yaml | Medium | Add |
| /Dockerfile | Medium | Add |
| /docker-compose.yml | High | Add |
| /.dockerenv | High | Add |
| /.DS_Store | Medium | Add |
| /Thumbs.db | Low | Add |
| /.vscode/settings.json | Medium | Add |
| /.idea/ | Medium | Add |
| /backup.zip | Critical | Add |
| /backup.sql | Critical | Add |
| /dump.sql | Critical | Add |
| /database.sql | Critical | Add |
| /db.sql | Critical | Add |
| /.svn/entries | High | Add |
| /.hg/ | High | Add |
| /config.yml | High | Add |
| /config.yaml | High | Add |
| /config.json | High | Add |
| /secrets.yml | Critical | Add |
| /credentials.json | Critical | Add |
| /serviceAccountKey.json | Critical | Add |
| /firebase-adminsdk.json | Critical | Add |
| /id_rsa | Critical | Add |
| /id_rsa.pub | Medium | Add |
| /.ssh/authorized_keys | Critical | Add |
| /wp-login.php | Info | Add |
| /administrator/ | Info | Add |
| /admin/ | Info | Add |
| /login | Info | Add |
| /api/swagger.json | Medium | Add |
| /api/openapi.json | Medium | Add |
| /swagger-ui.html | Medium | Add |
| /graphql | Medium | Add |
| /.well-known/openid-configuration | Info | Add |
| /actuator | High | Add (Spring Boot) |
| /actuator/health | Medium | Add |
| /actuator/env | Critical | Add |
| /health | Info | Add |
| /metrics | High | Add |
| /debug/ | High | Add |
| /test/ | Medium | Add |
| /staging/ | Medium | Add |

### Well-Known URIs
| URI | Purpose | Severity |
|-----|---------|----------|
| /.well-known/security.txt | Security contact info, bug bounty | Info (presence is good) |
| /.well-known/change-password | Password change redirect | Info (presence is good) |
| /.well-known/openid-configuration | OIDC discovery | Info |
| /.well-known/apple-app-site-association | iOS app association | Info |
| /.well-known/assetlinks.json | Android app association | Info |
| /.well-known/dnt-policy.txt | Do Not Track policy | Low |

---

## SEVERITY SCORING RECOMMENDATION

| Level | Score | Criteria |
|-------|-------|----------|
| Critical | 9.0-10.0 | Immediate exploitation possible, data breach risk (exposed credentials, critical CVE, API keys) |
| High | 7.0-8.9 | Significant security weakness, exploitation likely (missing encryption, weak TLS, XSS) |
| Medium | 4.0-6.9 | Security concern that increases attack surface (info disclosure, missing headers) |
| Low | 1.0-3.9 | Best practice improvement, minimal direct risk (deprecated headers, optimization) |
| Info | 0.1-0.9 | Informational finding, no direct security impact |

---

## IMPLEMENTATION PRIORITY FOR LOCKUP

### Phase 1 -- Quick Wins (Simple HTTP checks, highest value)
1. All missing security headers (COOP, COEP, CORP, Cache-Control, etc.)
2. Expanded sensitive file exposure list (50+ paths)
3. DNS security checks (SPF, DKIM, DMARC, DNSSEC, CAA)
4. Information leakage detection (version headers, debug headers)
5. HTTP method enumeration (TRACE, PUT, DELETE)
6. robots.txt and sitemap.xml analysis
7. Technology fingerprinting

### Phase 2 -- HTML/Content Analysis
1. Mixed content detection
2. SRI (Subresource Integrity) validation
3. Third-party script inventory and risk assessment
4. Cookie consent/GDPR compliance checks
5. Privacy policy and legal page detection
6. Form security analysis (CSRF, autocomplete, HTTP submission)
7. HTML comment scanning for sensitive data

### Phase 3 -- JavaScript Deep Analysis
1. API key exposure detection (AWS, Stripe, Firebase, OpenAI, Google)
2. Known vulnerable JS library detection (Retire.js database)
3. Inline script analysis
4. Tracking script categorization
5. Fingerprinting script detection

### Phase 4 -- Advanced Checks
1. HSTS preload list verification
2. Certificate Transparency verification
3. Open redirect detection
4. Subdomain enumeration
5. HTTP request smuggling indicators
6. WebSocket security analysis
7. Payment page script monitoring (PCI 6.4.3)

---

## COMPLIANCE FRAMEWORK COVERAGE MATRIX

When all checks are implemented, LockUp would cover:

| Framework | Coverage | Key Checks |
|-----------|----------|------------|
| ISO 27001 A.8 | ~18/34 controls | Headers, TLS, access, data leakage, monitoring |
| OWASP Top 10:2025 | 8/10 categories (partial) | Access control, misconfig, supply chain, crypto, injection, auth, integrity, logging |
| NIST CSF | Identify, Protect, Detect | Asset discovery, encryption, headers, monitoring |
| PCI-DSS v4.0 | ~12 requirements | TLS, headers, scripts, vulnerability scanning, CVE detection |
| SOC 2 | CC6, CC7, CC8, A1, C1, P1 | Access, encryption, monitoring, availability, confidentiality, privacy |
| GDPR | Technical measures | Cookie consent, privacy policy, tracking, encryption |
| CIS Benchmarks | ~20 checks | Server hardening, headers, TLS, directory protection |
| HIPAA | 164.312 safeguards | Encryption, access, integrity, transmission security |

---

## TOTAL CHECK COUNT

| Category | Count |
|----------|-------|
| Security Headers (including missing headers to check for) | 22 |
| TLS/Certificate Analysis | 15 |
| Sensitive File Exposure | 70+ |
| DNS Security | 10 |
| OWASP-mapped checks | 50+ |
| Privacy/GDPR compliance | 18 |
| Supply Chain / SRI | 12 |
| Information Leakage | 15 |
| Content Analysis | 15 |
| JavaScript Security | 10 |
| Protocol Checks | 7 |
| CIS Benchmark Checks | 20 |
| **TOTAL UNIQUE CHECKS** | **~250+** |

---

## SOURCES

- [ISO 27001 Annex A Controls Reference](https://hightable.io/iso-27001-annex-a-controls-reference-guide/)
- [ISO 27002 Clause 8 Technological Controls](https://cyberzoni.com/standards/iso-27001/8-technological-controls/)
- [OWASP Top 10:2025](https://owasp.org/Top10/2025/en/)
- [OWASP Top 10:2025 Changes (Aikido)](https://www.aikido.dev/blog/owasp-top-10-2025-changes-for-developers)
- [OWASP Top 10:2025 Changes (Fastly)](https://www.fastly.com/blog/new-2025-owasp-top-10-list-what-changed-what-you-need-to-know)
- [ZAP - ZAPping the OWASP Top 10](https://www.zaproxy.org/docs/guides/zapping-the-top-10-2021/)
- [PCI DSS v4.0 ASV Scanning Guide](https://www.foregenix.com/blog/pci-dss-v4.0-asv-scanning-guide-for-compliance)
- [PCI DSS 4.0 Vulnerability Scanning Guide](https://ideasplusbusiness.com/pci-dss-vulnerability-scanning/)
- [NIST CSF Functions](https://www.nist.gov/cyberframework/getting-started/online-learning/five-functions)
- [NIST CSF Categories](https://www.cybersaint.io/blog/nist-csf-categories)
- [SOC 2 Trust Services Criteria (Secureframe)](https://secureframe.com/hub/soc-2/trust-services-criteria)
- [SOC 2 Trust Services Criteria (Schellman)](https://www.schellman.com/blog/soc-examinations/soc-2-trust-services-criteria-with-tsc)
- [GDPR Cookie Consent Requirements 2025](https://secureprivacy.ai/blog/gdpr-cookie-consent-requirements-2025)
- [GDPR Consent Management (Secureprivacy)](https://secureprivacy.ai/blog/gdpr-consent-management)
- [CIS Apache HTTP Server Benchmarks](https://www.cisecurity.org/benchmark/apache_http_server)
- [CIS NGINX Benchmarks](https://www.cisecurity.org/benchmark/nginx)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [HTTP Headers Cheat Sheet (OWASP)](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [HIPAA Security Rule 2025 Updates](https://www.rubinbrown.com/insights-events/insight-articles/hipaa-security-rule-changes-2025-2026-hipaa-updates/)
- [HIPAA Vulnerability Scanning Requirements 2025](https://censinet.com/perspectives/2025-hipaa-requirements-vulnerability-scanning)
- [Security Headers Adoption Study 2026](https://appsecsanta.com/research/security-headers-study-2026)
- [Web Almanac Security 2025](https://almanac.httparchive.org/en/2025/security)
- [HSTS Preload List Submission](https://hstspreload.org/)
- [Expect-CT Deprecation (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Expect-CT)
- [Cross-Origin Headers Guide](https://web.dev/articles/coop-coep)
- [NEL Specification (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Network_Error_Logging)
- [API Key Exposure (Truffle Security)](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules)
- [Secrets in JS Bundles (Hacker News)](https://thehackernews.com/2026/01/why-secrets-in-javascript-bundles-are.html)
- [STEWS WebSocket Security Tool](https://github.com/PalindromeLabs/STEWS)
- [PCI DSS 6.4.3 Payment Page Scripts](https://spideraf.com/articles/client-side-security-monitoring-detect-script-threats)
- [Domain Security Scanner](https://domainsecurityscanner.com/)
- [DNS Security Checker (AppSecSanta)](https://appsecsanta.com/tools/dns-security-checker)
