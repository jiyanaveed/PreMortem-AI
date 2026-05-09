# Critical Supplier Continuity Standard — Tier-1 Vendor Operations

## Scope

This standard applies to vendors classified as Tier-1 when their outage would materially impair revenue recognition, regulated service delivery, or committed milestones within ninety days.

## Critical vendor dependency

Tier-1 vendors must register primary and secondary technical contacts in the vendor portal. Updates are honor-system; procurement validates contacts only during annual renewal cycles unless a ticket is opened.

Production workloads may depend on single-region SaaS instances when commercial terms favor cost efficiency. Architecture exceptions require VP approval; historical exceptions were tracked in a workbook that was partially migrated during a tooling change.

## SLA references

Vendor SLAs are summarized in procurement annexes. Incident severity definitions align with vendor catalogs where feasible. Internal clocks for customer communications begin when the vendor acknowledges receipt — acknowledgment channels include email, portal tickets, and informal Slack bridges used by delivery pods.

There is no automated reconciliation between vendor uptime dashboards and internal incident records.

## Backup vendor posture

Secondary vendors are encouraged but not mandatory when primary vendors demonstrate multi-year stability. Where no secondary exists, teams document manual mitigation steps such as inventory buffering or milestone negotiation — depth of documentation varies by account team.

## Manual performance monitoring

Service levels are reviewed monthly using CSV extracts emailed by vendors. Parsing and trending are performed manually; thresholds are not centrally enforced. Missed reviews occur during holiday weeks without automatic escalation.

## Escalation timeline gaps

If a Tier-1 outage exceeds four hours, procurement notifies segment leadership “as soon as practical.” After twelve hours, legal may be engaged when contractual remedies appear relevant — engagement triggers are narrative rather than numeric.

Customer commitments referencing vendor SLAs do not automatically update when annexes change; commercial owners reconcile quarterly “when bandwidth allows.”

## Continuity risk

Without indexed contacts, reconciled telemetry, or enforced backup vendors, continuity relies on heroic coordination during incidents. Evidence requested during procurement reviews often arrives as forwarded threads rather than tamper-evident artifacts.

## Procurement evidence expectations

Procurement maintains a lightweight checklist for Tier-1 diligence: SOC reports, pen-test summaries, and subcontractor notices. Teams sometimes substitute interim letters when annual reports lag; waivers are logged in email threads rather than the vendor record of truth.

During fast-track renewals, checklist completion percentages are tracked informally in status meetings. Items marked “pending vendor response” can remain open across two quarters without automated ageing.

## Financial and delivery coupling

Finance ties revenue milestones to vendor deliverables in the ERP, but milestone definitions occasionally drift from engineering acceptance criteria stored in work-management tools. Reconciliation depends on manual bridges maintained by project administrators who rotate assignments quarterly.

When invoices dispute arises, collections coordinates with delivery leads via side channels; documented dispute narratives may omit operational root cause if deemed commercially sensitive.

## Testing and rehearsal gaps

Tabletop exercises for Tier-1 failure occur annually for most segments. Scenarios emphasize vendor communication channels rather than customer-facing promise alignment. Results are archived as slide summaries without mandatory linkage to remediation owners.

Several teams reported difficulty locating last year’s tabletop binder after folder restructuring; reconstruction relied on participant memory.

Recommended pairing for Live QA: stress scenario **Critical Vendor Fails**.
