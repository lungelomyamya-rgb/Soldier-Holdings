# TECHNICAL ARCHITECTURE DOCUMENT
## Soldier Holdings - Political Funding Compliance Platform

**Version**: 1.0 (Demo Phase)  
**Date**: February 2026  
**Classification**: For Stakeholder Review

---

## EXECUTIVE SUMMARY

The Soldier Holdings Political Funding Compliance Platform represents a paradigm shift in how democratic nations can monitor, enforce, and ensure transparency in political finance. This document outlines the technical architecture that will be implemented following successful demonstration to key stakeholders.

### Key Innovations
1. **Dual-Rail Processing**: Simultaneous handling of traditional fiat and cryptocurrency donations
2. **Real-Time Compliance**: Automatic rule enforcement preventing violations before they occur
3. **Immutable Audit Trail**: Court-admissible, tamper-evident transaction records
4. **National Security Integration**: Proactive detection of foreign influence attempts

---

## 1. SYSTEM OVERVIEW

### 1.1 Purpose
To create a national infrastructure for political funding that:
- Ensures compliance with South African Political Funding Act
- Prevents foreign interference in democratic processes
- Provides transparency to regulators and the public
- Automates compliance monitoring and reporting
- Scales to regional (SADC) and continental (AU) levels

### 1.2 Core Principles
- **Zero-Trust Security**: Verify every transaction, trust nothing
- **Audit-First Design**: Every action is logged and immutable
- **Compliance-by-Design**: Rules enforced at the code level
- **Transparency-by-Default**: Public access to permitted data
- **Privacy-by-Design**: POPIA/GDPR compliant data handling

---

## 2. ARCHITECTURAL LAYERS

### 2.1 Presentation Layer (Frontend)

#### Technology Stack
```
Framework:     React 18+ with TypeScript
State:         Redux Toolkit / Zustand
Styling:       Tailwind CSS + Custom Design System
Charts:        Chart.js / D3.js for data visualization
Security:      Content Security Policy, XSS Protection
Accessibility: WCAG 2.1 AA Compliance
```

#### User Interfaces
1. **Regulator Dashboard** (IEC/Parliament)
   - System-wide oversight
   - Risk scoring visualization
   - Alert management
   - Report generation

2. **Political Party Portal**
   - Donation management
   - Compliance status
   - Donor communications
   - Financial reporting

3. **Public Transparency Interface**
   - Aggregated donation data
   - Party funding summaries
   - Search and filter capabilities
   - Data export (CSV/JSON)

4. **Auditor Workbench**
   - Forensic analysis tools
   - Transaction drilling
   - Pattern detection
   - Evidence collection

5. **Bank Integration Portal**
   - Transaction submission
   - Status tracking
   - Reconciliation tools

---

### 2.2 API Gateway Layer

#### Technology Stack
```
Framework:     Kong Gateway / AWS API Gateway
Protocol:      RESTful + GraphQL for complex queries
Security:      OAuth 2.0 + JWT tokens
Rate Limiting: Intelligent throttling per user role
Monitoring:    Real-time API health metrics
```

#### Key Functions
- Request authentication and authorization
- Rate limiting and DDoS protection
- Request/response transformation
- API versioning management
- Centralized logging

#### API Endpoints (Planned)
```
Authentication:
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/mfa/verify

Donations:
POST   /api/v1/donations/submit
GET    /api/v1/donations/{id}
GET    /api/v1/donations/search
PATCH  /api/v1/donations/{id}/status

Compliance:
GET    /api/v1/compliance/rules
POST   /api/v1/compliance/evaluate
GET    /api/v1/compliance/flags

Reports:
POST   /api/v1/reports/generate
GET    /api/v1/reports/{id}/download

Blockchain:
POST   /api/v1/crypto/scan
GET    /api/v1/crypto/escrow/{id}
POST   /api/v1/crypto/settle
```

---

### 2.3 Authentication & Authorization Layer

#### Technology Stack
```
Protocol:       OAuth 2.0 / OpenID Connect
MFA:            TOTP (Google Authenticator) + SMS
Session:        JWT with short-lived access tokens
User Store:     PostgreSQL with encrypted passwords
Audit:          All auth events logged to immutable store
```

#### Role Hierarchy
```
ROLE: Super Admin (System Administrators)
  - Full system access
  - User management
  - System configuration

ROLE: Regulator (IEC, Parliament)
  - View all transactions
  - Generate reports
  - Manage compliance rules
  - Access audit logs

ROLE: Political Party (Registered Parties)
  - View own transactions
  - Submit declarations
  - Manage party profile
  - Download reports

ROLE: Auditor (Independent Auditors)
  - Read-only access to all data
  - Forensic analysis tools
  - Export capabilities
  - No data modification

ROLE: Financial Institution (Banks)
  - Submit transactions
  - View submission status
  - Reconciliation access
  - Limited data visibility
```

#### Multi-Factor Authentication Flow
```
1. User enters username + password
2. System validates credentials
3. If valid, send MFA challenge (TOTP or SMS)
4. User enters MFA code
5. System validates MFA code
6. If valid, issue JWT access token (15 min expiry)
7. Issue refresh token (7 day expiry)
8. Log authentication event to audit trail
```

---

### 2.4 Business Logic Layer

#### Technology Stack
```
Language:      Python 3.11+
Framework:     FastAPI (async/await support)
ORM:           SQLAlchemy 2.0
Validation:    Pydantic
Background:    Celery + Redis for async tasks
Testing:       Pytest + 90% coverage requirement
```

#### Core Services

**A. Political Funding Service**
```python
class PoliticalFundingService:
    - register_party()
    - register_donor()
    - submit_donation()
    - validate_donation()
    - calculate_annual_total()
    - check_threshold_compliance()
```

**B. Compliance Rules Engine**
```python
class ComplianceEngine:
    - load_rules()
    - evaluate_donation()
    - flag_violation()
    - generate_alert()
    - update_rule_version()
```

**C. Identity Verification Service**
```python
class IdentityService:
    - verify_id_document()
    - check_beneficial_ownership()
    - validate_company_registration()
    - screen_sanctioned_entities()
```

**D. Blockchain Integration Service**
```python
class CryptoService:
    - scan_wallet_address()
    - calculate_risk_score()
    - initiate_escrow()
    - settle_transaction()
    - track_provenance()
```

**E. Reporting Service**
```python
class ReportingService:
    - generate_quarterly_report()
    - create_party_summary()
    - export_public_data()
    - schedule_automated_reports()
```

---

### 2.5 Compliance Rules Engine (CRITICAL)

This is the "brain" of the system. All rules are:
- **Versioned**: Track changes over time
- **Auditable**: Every rule evaluation is logged
- **Updateable**: Rules change when laws change
- **Testable**: Unit tests for every rule

#### Rule Categories

**1. Threshold Rules**
```python
RULE_THRESHOLD_ANNUAL = {
    "id": "R001",
    "name": "Annual Donation Limit",
    "description": "No donor may contribute > R15M annually",
    "logic": "donor.annual_total + donation.amount <= 15_000_000",
    "severity": "HIGH",
    "action": "BLOCK",
    "version": "1.0",
    "effective_date": "2026-01-01"
}
```

**2. Source Rules**
```python
RULE_FOREIGN_DONOR = {
    "id": "R002",
    "name": "Foreign Donor Prohibition",
    "description": "No foreign nationals or entities may donate",
    "logic": "donor.country == 'ZA' AND donor.citizenship == 'ZA'",
    "severity": "CRITICAL",
    "action": "REJECT",
    "alert": ["IEC", "SSA"],
    "version": "1.0"
}
```

**3. Crypto-Specific Rules**
```python
RULE_CRYPTO_FORENSICS = {
    "id": "R003",
    "name": "Crypto Wallet Risk Screening",
    "description": "Wallets with risk score > 75 are rejected",
    "logic": "wallet.risk_score <= 75",
    "severity": "CRITICAL",
    "action": "REJECT",
    "forensics_required": True,
    "version": "1.0"
}
```

**4. Transparency Rules**
```python
RULE_DISCLOSURE_THRESHOLD = {
    "id": "R004",
    "name": "Public Disclosure Requirement",
    "description": "Donations > R100k must be publicly disclosed",
    "logic": "donation.amount > 100_000",
    "severity": "MEDIUM",
    "action": "MARK_PUBLIC",
    "delay_days": 30,
    "version": "1.0"
}
```

---

### 2.6 Data Persistence Layer

#### Database Architecture

**Primary Database: PostgreSQL 15+**

```sql
-- Schema: Transactional Data
CREATE SCHEMA political_funding;

-- Core Tables
CREATE TABLE political_funding.parties (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(50) UNIQUE,
    status VARCHAR(50),
    founded_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE political_funding.donors (
    id UUID PRIMARY KEY,
    donor_type VARCHAR(50), -- INDIVIDUAL, COMPANY, TRUST, UNION
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    id_number VARCHAR(20), -- Encrypted
    company_name VARCHAR(255),
    registration_number VARCHAR(50),
    country VARCHAR(2), -- ISO country code
    risk_score INTEGER DEFAULT 0,
    kyc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE political_funding.donations (
    id UUID PRIMARY KEY,
    donor_id UUID REFERENCES political_funding.donors(id),
    party_id UUID REFERENCES political_funding.parties(id),
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    donation_type VARCHAR(50), -- FIAT, CRYPTO
    transaction_reference VARCHAR(100),
    wallet_address VARCHAR(255), -- For crypto
    status VARCHAR(50), -- PENDING, SCANNING, VERIFIED, REJECTED, SETTLED
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    settled_at TIMESTAMP
);

CREATE TABLE political_funding.compliance_flags (
    id UUID PRIMARY KEY,
    donation_id UUID REFERENCES political_funding.donations(id),
    rule_id VARCHAR(20),
    rule_name VARCHAR(255),
    severity VARCHAR(20), -- LOW, MEDIUM, HIGH, CRITICAL
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Audit Database: Immutable Append-Only Store**

```sql
-- Schema: Audit Logging
CREATE SCHEMA audit_trail;

CREATE TABLE audit_trail.events (
    id BIGSERIAL PRIMARY KEY,
    event_timestamp TIMESTAMP NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    user_id UUID,
    user_role VARCHAR(50),
    ip_address INET,
    payload JSONB,
    hash VARCHAR(64) NOT NULL, -- SHA-256 hash
    previous_hash VARCHAR(64), -- Chain to previous event
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_audit_entity ON audit_trail.events(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_trail.events(event_timestamp);

-- Prevent updates and deletes
CREATE RULE no_update AS ON UPDATE TO audit_trail.events DO INSTEAD NOTHING;
CREATE RULE no_delete AS ON DELETE TO audit_trail.events DO INSTEAD NOTHING;
```

#### Caching Layer: Redis
```
Purpose:        Performance optimization
Structure:      Key-value store
Use Cases:      
  - Session storage
  - API response caching
  - Rate limiting counters
  - Real-time statistics
Expiration:     Configured per use case
```

---

### 2.7 Blockchain Integration Layer

#### Dual-Blockchain Strategy

**Public Chain: Polygon (MATIC)**
- **Purpose**: Crypto donation settlement
- **Advantage**: Low transaction fees, Ethereum compatibility
- **Use Case**: Public ledger of settled crypto donations

**Private Chain: Hyperledger Fabric**
- **Purpose**: Private audit trail for sensitive data
- **Advantage**: Permissioned, enterprise-grade
- **Use Case**: State-level audit requirements

#### Smart Contract Architecture

```solidity
// Donation Escrow Contract
contract DonationEscrow {
    
    struct Donation {
        address donor;
        address party;
        uint256 amount;
        uint256 timestamp;
        bool kycVerified;
        bool complianceApproved;
        bool settled;
    }
    
    mapping(uint256 => Donation) public donations;
    
    // Only settlement authority can release funds
    address public settlementAuthority;
    
    function initiateEscrow(
        address donor,
        address party,
        uint256 amount
    ) external returns (uint256 donationId);
    
    function verifyKYC(uint256 donationId) external;
    
    function approveCompliance(uint256 donationId) external;
    
    function settleDonation(uint256 donationId) external;
    
    function rejectDonation(uint256 donationId) external;
}
```

#### Forensics Integration

**Service Providers**: Chainalysis / Elliptic  
**API Integration**: RESTful endpoints  
**Data Retrieved**:
- Wallet risk score (0-100)
- Transaction history
- Mixing service detection
- Sanctioned entity screening
- Geographic origin analysis

```python
class BlockchainForensics:
    async def scan_wallet(wallet_address: str) -> dict:
        """
        Returns:
        {
            "risk_score": 85,
            "risk_factors": [
                "Mixed with sanctioned wallet",
                "Recent darknet market activity"
            ],
            "recommendation": "REJECT"
        }
        """
```

---

### 2.8 External Integrations

#### A. Banking APIs
**Partners**: Major SA Banks (FNB, Standard Bank, ABSA, Nedbank)  
**Protocol**: ISO 20022 / SWIFT messaging  
**Integration**: Real-time transaction notifications  

```
Flow:
1. Bank detects political donation
2. Bank calls API: POST /api/v1/donations/submit
3. System validates donor identity
4. System applies compliance rules
5. System returns approval/rejection
6. Bank processes or blocks transaction
```

#### B. Home Affairs (ID Verification)
**Service**: DHA ID Verification API  
**Purpose**: Validate South African ID numbers  
**Data Retrieved**: Name, DOB, ID validity  

#### C. CIPC (Company Registration)
**Service**: CIPC Disclosure API  
**Purpose**: Verify company registration and beneficial ownership  
**Data Retrieved**: Directors, shareholders, registration status  

#### D. State Security Agency
**Integration**: Secure portal for critical alerts  
**Trigger**: Foreign donor attempts, high-risk crypto transactions  
**Protocol**: Encrypted messaging, manual review required  

---

## 3. SECURITY ARCHITECTURE

### 3.1 Encryption

**Data at Rest**
```
Algorithm:  AES-256-GCM
Key Store:  AWS KMS / Azure Key Vault
Rotation:   90-day automatic key rotation
Scope:      All PII, financial data, audit logs
```

**Data in Transit**
```
Protocol:   TLS 1.3
Cipher:     ECDHE-RSA-AES256-GCM-SHA384
Cert:       Extended Validation (EV) SSL
HSTS:       Enabled with preload
```

**Sensitive Field Encryption**
```python
# Example: ID numbers stored encrypted
encrypted_id = encrypt_field(
    plaintext=id_number,
    key=get_encryption_key('donor_pii'),
    algorithm='AES-256-GCM'
)
```

### 3.2 Access Control

**Network Segmentation**
```
Internet → WAF → Load Balancer → API Gateway
                                      ↓
                            Application Servers (Private Subnet)
                                      ↓
                            Database Servers (Private Subnet)
                                      ↓
                            Audit Store (Isolated Network)
```

**Principle of Least Privilege**
- Service accounts have minimal permissions
- Database users restricted to specific schemas
- API keys scoped to single service

### 3.3 Threat Mitigation

**DDoS Protection**
- Cloudflare / AWS Shield
- Rate limiting per IP and user
- Geographic restrictions for admin access

**SQL Injection Prevention**
- Parameterized queries only
- ORM-based data access
- Input validation at API level

**XSS Prevention**
- Content Security Policy headers
- Output encoding
- React's built-in XSS protection

---

## 4. DEPLOYMENT ARCHITECTURE

### 4.1 Cloud Infrastructure

**Primary Provider**: AWS (Gov-ready regions)  
**Availability Zones**: Multi-AZ deployment for high availability  
**Disaster Recovery**: Automated backups to separate region  

```
Production Environment:
- 3x Application Servers (Auto-scaling)
- 2x Database Servers (Primary + Standby)
- 1x Redis Cluster (3 nodes)
- Load Balancer (Application Load Balancer)
- CDN (CloudFront for static assets)
```

### 4.2 Containerization

**Container Runtime**: Docker  
**Orchestration**: Kubernetes (EKS)  
**Service Mesh**: Istio (for inter-service communication)  

```yaml
# Example Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: political-funding-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: political-funding-api
  template:
    spec:
      containers:
      - name: api
        image: soldier-holdings/political-funding-api:v1.0
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: connection-string
```

### 4.3 CI/CD Pipeline

```
Developer → Git Push → GitHub
                         ↓
                    GitHub Actions
                         ↓
              [Run Tests (Unit, Integration)]
                         ↓
              [Security Scan (SAST, DAST)]
                         ↓
              [Build Docker Image]
                         ↓
              [Push to Container Registry]
                         ↓
              [Deploy to Staging]
                         ↓
         [Automated Smoke Tests]
                         ↓
         [Manual Approval Required]
                         ↓
         [Deploy to Production]
                         ↓
         [Health Check Monitoring]
```

---

## 5. MONITORING & OBSERVABILITY

### 5.1 Application Monitoring

**Tool**: Datadog / New Relic  
**Metrics Tracked**:
- API response times
- Error rates
- Database query performance
- Cache hit rates
- Background job success/failure

### 5.2 Infrastructure Monitoring

**Tool**: Prometheus + Grafana  
**Metrics Tracked**:
- CPU, Memory, Disk usage
- Network throughput
- Container health
- Auto-scaling events

### 5.3 Security Monitoring

**Tool**: Splunk / ELK Stack  
**Events Tracked**:
- Failed login attempts
- Suspicious API calls
- Database access anomalies
- Privilege escalation attempts

### 5.4 Alerting

**Critical Alerts** (Immediate SMS/Call):
- System downtime
- Database connection failures
- Critical compliance violations
- Security breaches

**High Priority** (Email + Slack):
- High error rates
- Performance degradation
- Flagged transactions requiring review

**Medium Priority** (Email):
- Daily summary of flagged transactions
- Weekly compliance reports

---

## 6. COMPLIANCE & GOVERNANCE

### 6.1 Data Retention Policy

```
Donation Records:       10 years (regulatory requirement)
Audit Logs:             Permanent (immutable)
User Sessions:          24 hours
API Logs:               90 days
Backup Archives:        7 years
```

### 6.2 POPIA Compliance

**Lawful Processing**: Explicit consent for data collection  
**Purpose Limitation**: Data used only for compliance monitoring  
**Data Minimization**: Collect only necessary information  
**Accuracy**: Mechanisms for data correction  
**Storage Limitation**: Retention policy enforcement  
**Security**: Encryption and access controls  
**Accountability**: Regular audits and documentation  

### 6.3 Audit Requirements

**Internal Audits**: Quarterly  
**External Audits**: Annual by independent firm  
**Penetration Testing**: Bi-annual  
**Compliance Review**: After every legal/regulatory change  

---

## 7. SCALABILITY CONSIDERATIONS

### 7.1 Current Capacity Planning

**Expected Load (Year 1)**:
- Registered Parties: 50
- Active Donors: 50,000
- Monthly Transactions: 10,000
- Peak Load: 500 transactions/hour

**Infrastructure Sizing**:
- API Servers: Handle 5,000 req/sec
- Database: 10,000 IOPS, 500GB storage
- Redis: 16GB memory

### 7.2 Growth Path

**Year 3**: Regional expansion (SADC)
- 15 countries
- 500,000 donors
- 100,000 monthly transactions

**Scaling Strategy**:
- Horizontal scaling of API servers
- Database sharding by country/region
- CDN expansion for global access
- Multi-region deployment

---

## 8. RISK ANALYSIS

### 8.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Database breach | CRITICAL | Low | Encryption, access controls, audit logging |
| API DDoS attack | HIGH | Medium | WAF, rate limiting, auto-scaling |
| Smart contract bug | HIGH | Low | Formal verification, extensive testing |
| Integration failure | MEDIUM | Medium | Fallback mechanisms, retries, monitoring |

### 8.2 Operational Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Key personnel loss | MEDIUM | Medium | Documentation, knowledge sharing |
| Third-party service outage | HIGH | Low | Multi-provider strategy, fallbacks |
| Regulatory change | HIGH | High | Modular rules engine, version control |

---

## 9. IMPLEMENTATION ROADMAP

### Phase 1: MVP Development (Months 1-4)
- [ ] Backend API development
- [ ] Database schema implementation
- [ ] Authentication system
- [ ] Basic compliance rules
- [ ] Admin dashboard

### Phase 2: Integration (Months 5-6)
- [ ] Banking API integration (1 pilot bank)
- [ ] DHA ID verification
- [ ] CIPC company lookup
- [ ] Basic reporting

### Phase 3: Crypto Module (Months 7-9)
- [ ] Blockchain forensics integration
- [ ] Smart contract development
- [ ] Escrow system testing
- [ ] Crypto wallet UI

### Phase 4: Public Launch (Months 10-12)
- [ ] Public transparency portal
- [ ] Multi-bank integration
- [ ] Full compliance rules
- [ ] IEC certification
- [ ] Parliamentary oversight dashboard

---

## 10. CONCLUSION

This architecture provides:
- **Security**: Bank-grade encryption and access control
- **Compliance**: Automated rule enforcement and audit trails
- **Scalability**: Regional and continental expansion capability
- **Transparency**: Public access to permitted data
- **Innovation**: First-of-its-kind dual-rail political funding system

The system is designed to be:
- **Defensible**: Aligned with international best practices (US, UK, India, China)
- **Auditable**: Every action logged immutably
- **Extensible**: Modular design for future enhancements
- **Reliable**: High availability and disaster recovery

**This represents genuine national infrastructure for democratic protection.**

---

**Document Classification**: For Stakeholder Review  
**Next Review**: Post-Demo Stakeholder Feedback Session  
**Owner**: Soldier Holdings Technical Team
