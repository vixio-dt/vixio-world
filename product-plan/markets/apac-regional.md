# APAC Regional Market Considerations

## Overview

APAC markets (China, Japan, Korea) have specific requirements that go beyond language translation. These concerns apply to **all users in these regions**, regardless of whether they're in animation, live-action, or prose writing.

## Core Challenge: Regional Versions Required

**Not just translation - separate regional products.**

| Aspect | Why Separate Versions |
|--------|----------------------|
| **Data Residency** | IP assets must stay in-region |
| **Legal Compliance** | Different data protection laws |
| **Cultural Fit** | UI/UX conventions vary significantly |
| **Ecosystem Integration** | Local apps and services |

---

## IP Asset Governance & Data Residency

### Why This Matters

**Studios and creators won't use tools that store their IP outside their jurisdiction.**

| Concern | Requirement |
|---------|-------------|
| **Data sovereignty** | Assets must be stored in-region |
| **Legal compliance** | Must comply with local data protection laws |
| **Client contracts** | Many contracts specify data location |
| **Government projects** | Some projects require domestic-only storage |

### Regional Data Laws

| Region | Law | Key Requirements |
|--------|-----|------------------|
| **China** | PIPL (Personal Information Protection Law) | Data localization, cross-border transfer restrictions |
| **Japan** | APPI (Act on Protection of Personal Information) | Consent for cross-border transfers |
| **Korea** | PIPA (Personal Information Protection Act) | Data localization for certain categories |

### Vixio Approach

| Version | Market | Data Center | Compliance |
|---------|--------|-------------|------------|
| **Vixio** (Global) | International | US/EU | GDPR, standard |
| **Vixio CN** | China | Alibaba/Tencent Cloud (China) | PIPL compliant |
| **Vixio JP** | Japan | AWS Tokyo / Azure Japan | APPI compliant |
| **Vixio KR** | Korea | AWS Seoul / NCloud | PIPA compliant |

**Key guarantees:**
- Assets never leave the region unless explicitly exported
- Clear data residency terms in ToS
- Option for on-premise deployment (enterprise, future)

---

## Cultural & Design Differences

### UI/UX Conventions

| Aspect | China | Japan | Korea | Global |
|--------|-------|-------|-------|--------|
| **Information density** | High | Clean/minimal | Balanced | Balanced |
| **Color associations** | Red/gold positive | Varied | Bright, modern | Neutral |
| **Navigation patterns** | Super-app (WeChat-like) | Traditional app | Hybrid | Standard web |
| **Typography** | Simplified Chinese | Japanese (kanji/kana) | Korean (Hangul) | Latin |

### Design Implications

Each regional version needs:
- Native typography and text rendering
- Culturally appropriate color schemes
- Familiar navigation patterns
- Local iconography and visual language

---

## Ecosystem Integrations

### Communication Apps

| Region | Primary Apps | Integration Needs |
|--------|--------------|-------------------|
| **China** | WeChat, DingTalk, Feishu | Login, sharing, notifications |
| **Japan** | LINE, Slack | Login, sharing, notifications |
| **Korea** | KakaoTalk, Slack | Login, sharing, notifications |

### Cloud Services

| Region | Preferred Providers |
|--------|---------------------|
| **China** | Alibaba Cloud, Tencent Cloud, Huawei Cloud |
| **Japan** | AWS Japan, Azure Japan, local providers |
| **Korea** | NCloud, AWS Seoul, KT Cloud |

### Payment Methods

| Region | Primary Methods |
|--------|-----------------|
| **China** | Alipay, WeChat Pay |
| **Japan** | Credit cards, carrier billing, PayPay |
| **Korea** | KakaoPay, credit cards, Naver Pay |

---

## Narrative & Content Templates

### Region-Specific Story Structures

| Region | Popular Templates |
|--------|-------------------|
| **China** | 武侠 (Wuxia), 修仙 (Xianxia), 玄幻 (Xuanhuan), 都市 (Urban fantasy) |
| **Japan** | 異世界 (Isekai), メカ (Mecha), 少年 (Shonen), 少女 (Shojo) |
| **Korea** | 회귀 (Regression), 헌터 (Hunter), 로맨스 (Romance), 웹툰 (Webtoon) |

### Why This Matters

Western worldbuilding tools offer templates for:
- Hero's Journey
- Three-Act Structure
- Save the Cat

But they lack templates for dominant APAC narrative structures. This is a differentiation opportunity.

---

## Market Size & Opportunity

### Animation Industry

| Market | Annual Value | Key Players |
|--------|--------------|-------------|
| **China** | $30B+ (donghua) | Bilibili, Tencent, iQiyi |
| **Japan** | $25B+ (anime) | Toei, Sunrise, MAPPA |
| **Korea** | $10B+ (manhwa/animation) | Kakao, Naver, Studio Mir |

### Why They Need Vixio

- No integrated pre-production tools designed for their workflows
- Western tools don't meet data residency requirements
- Visual asset-driven approach matches how they work

---

## Implementation Phases

### Phase 1: Global Version (MVP)
- English-first
- US/EU data centers
- Standard integrations

### Phase 2: APAC Preparation
- Architecture supports multi-region deployment
- Internationalization framework in place
- API design supports regional backends

### Phase 3: Regional Versions (Future)
- Vixio CN with China data center
- Vixio JP with Japan data center
- Vixio KR with Korea data center
- Local integrations per region

### Phase 4: Local Partnerships (Future)
- Distribution partnerships in each region
- Local payment provider integrations
- Marketing localization

---

## Competitive Advantage

**No Western worldbuilding/production tool offers:**
- Regional data centers
- True cultural adaptation
- Local ecosystem integration
- APAC narrative templates

This creates a significant barrier for competitors and an opportunity for Vixio to own the APAC creative tools market.

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Separate regional versions | Data residency requirements make this mandatory |
| Local data centers | Studios won't use tools storing IP outside region |
| Cultural adaptation | Translation alone doesn't work |
| Regional partnerships | Local knowledge and distribution |
