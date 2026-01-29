# Pricing Model

## Philosophy

**"Pay for creators. Collaborators join free."**

We use a **Core + Collaborators** model that:
- Aligns cost with value (creators use it daily, collaborators dip in)
- Differentiates from StudioBinder's per-seat pricing
- Encourages teams to actually invite collaborators (network effects)
- Matches how film/video production actually works

## The Problem with Per-Seat Pricing

StudioBinder charges $25/user/month. For a 5-person team, that's $125/month.

But not all users are equal:
- The **screenwriter** uses it daily
- The **gaffer** checks the call sheet once per shoot

Charging them equally is unfair and creates collaboration friction.

## Seat Types

| Role | Definition | Cost |
|------|------------|------|
| **Creator** | Can create/edit projects, assets, scripts, exports | Paid |
| **Collaborator** | Can comment, suggest, limited edits | Free (or cheap) |
| **Viewer** | View-only link, no account required | Free |

### What Each Role Can Do

| Action | Creator | Collaborator | Viewer |
|--------|---------|--------------|--------|
| Create projects | ✅ | ❌ | ❌ |
| Create/edit assets | ✅ | Limited | ❌ |
| Write/edit scripts | ✅ | Suggest only | ❌ |
| Export (PDF, FDX, CSV) | ✅ | ❌ | ❌ |
| Comment | ✅ | ✅ | ❌ |
| View all content | ✅ | ✅ | ✅ |
| Invite others | ✅ | ❌ | ❌ |

## Pricing Tiers

### Free Tier
**For trying it out and writers/worldbuilders**

| Included | Limit |
|----------|-------|
| Creator seats | 1 |
| Collaborator seats | 2 |
| Viewer links | Unlimited |
| Projects | 1 |
| Storage | 500MB |
| AI features | Limited (X calls/month) |
| Export | Watermarked / limited |

**Why a free tier:**
- Hooks users with import + basic AI
- Serves price-sensitive writers/worldbuilders
- Builds word-of-mouth

### Creator - $15/month ($144/year)
**For solo filmmakers and screenwriters**

| Included | Limit |
|----------|-------|
| Creator seats | 1 |
| Collaborator seats | 5 |
| Viewer links | Unlimited |
| Projects | Unlimited |
| Storage | 5GB |
| AI features | Full |
| Export | Full (no watermark) |

**Target users:**
- Independent screenwriters
- Solo filmmakers
- YouTube narrative creators

### Team - $35/month ($336/year)
**For small production teams**

| Included | Limit |
|----------|-------|
| Creator seats | 3 |
| Collaborator seats | 15 |
| Viewer links | Unlimited |
| Projects | Unlimited |
| Storage | 25GB |
| AI features | Full |
| Export | Full |
| Priority support | ✅ |

**Target users:**
- Web series teams
- Short film productions
- Small production companies

### Studio - $79/month ($790/year)
**For larger productions**

| Included | Limit |
|----------|-------|
| Creator seats | 10 |
| Collaborator seats | Unlimited |
| Viewer links | Unlimited |
| Projects | Unlimited |
| Storage | 100GB |
| AI features | Full + priority |
| Export | Full + custom templates |
| Priority support | ✅ |
| Team admin features | ✅ |

**Target users:**
- Production companies
- Multi-project teams
- Agencies

### Enterprise - Custom
**For studios with specific needs**

- Custom seat limits
- SSO / security features
- Regional hosting (APAC)
- Dedicated support
- Custom integrations
- On-premise option (future)

## Competitive Comparison

| Tool | 5-Person Team Cost | Model |
|------|-------------------|-------|
| **StudioBinder** | ~$125/month | Per-seat ($25/user) |
| **Celtx** | ~$30-60/month | Tiered |
| **Vixio Team** | **$35/month** | Core + Collaborators |

**Vixio advantage:** 3 creators + 15 collaborators for $35. StudioBinder would charge $125 for the same 5 people with full access.

## Messaging

### On Pricing Page

**Headline:** "Professional tools. Fair pricing."

**Subhead:** "Same powerful features whether you're solo or a 10-person team. No per-user fees. No feature gatekeeping."

**CTA:** "Start free, upgrade when you need more."

### Competitive Wedge

> "StudioBinder-level features without StudioBinder pricing."

> "Pay for creators. Collaborators join free."

## Implementation Notes

### What Counts as a "Creator"?

A creator is someone who:
- Creates new projects
- Creates/fully edits assets
- Writes/edits scripts
- Exports production docs
- Invites team members

### Upgrade Triggers

Users should upgrade when they:
- Need more creator seats
- Hit storage limits
- Need more collaborator seats
- Want team admin features

### Anti-Abuse

- Creator seats are named (not shared)
- Fair use policy for AI calls
- Storage limits prevent abuse
- Project limits on free tier

## Future Considerations

### Worldbuilder + Studio Pricing (Future)

With the product architecture split into Worldbuilder (creative) and Studio (production), pricing may evolve:

**Current approach (MVP):** Single pricing model covers both products. Simpler for users, validates demand.

**Future options to consider:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Bundled** | Both products in all tiers | Simple, encourages full adoption | May overprice writers who only need Worldbuilder |
| **Separate** | Worldbuilder and Studio priced independently | Matches value, lower entry point | Complexity, potential friction |
| **Worldbuilder Free + Studio Paid** | Worldbuilder as free tier, Studio as upgrade | Natural funnel, hooks creators | Revenue only from production teams |
| **Add-on** | Worldbuilder included, Studio as add-on | Clear upsell path | May feel like paywall |

**Recommendation for now:** Keep current model. Validate that users want both products before splitting pricing. The integration (Lore Link) is the value—don't create friction in adopting it.

**Decision trigger:** Revisit pricing when Studio MVP launches and usage patterns are clear.

### Add-Ons (Possible)

| Add-On | Price | Description |
|--------|-------|-------------|
| Extra storage | $5/10GB/month | For asset-heavy productions |
| Extra AI calls | $10/month | Heavy AI users |
| Custom exports | $10/month | Custom templates, branding |
| 3D AI generation credits | TBD | Direct Tripo/Meshy generation in-app |

### Annual Discounts

~20% discount for annual billing (reflected in /year prices above).

### Education/Non-Profit

Consider future discounts for:
- Film schools
- Student filmmakers
- Non-profit productions

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-29 | Core + Collaborators model | Differentiates from StudioBinder; aligns cost with value |
| 2026-01-29 | Free tier included | Hooks users; serves price-sensitive writers |
| 2026-01-29 | No per-seat fees | Major competitor complaint; competitive wedge |
| 2026-01-29 | Viewer links free | Encourages sharing with clients/stakeholders |
| 2026-01-29 | Keep unified pricing for now | Worldbuilder/Studio split doesn't require pricing split yet; validate demand first |
