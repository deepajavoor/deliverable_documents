# Test Catalogue: 45 Scenarios

| Range | Coverage | Count |
|---|---|---:|
| TC-001 to TC-012 | Positive functional | 12 |
| TC-013 to TC-020 | Negative functional | 8 |
| TC-021 to TC-025 | Security | 5 |
| TC-026 to TC-028 | Privacy | 3 |
| TC-029 to TC-033 | Accessibility | 5 |
| TC-034 to TC-036 | Network/resilience | 3 |
| TC-037 to TC-039 | HTTP/API contract | 3 |
| TC-040 to TC-042 | Performance budgets | 3 |
| TC-043 to TC-045 | Cross-browser/platform | 3 |
| **Total** |  | **45** |

## Important scope notes
- The public SauceDemo UI does not expose a documented business API in this package. API tests therefore validate observable HTTP contracts. Replace or extend them when authenticated service endpoints and schemas are available.
- Performance tests are lightweight browser timing budgets, not a substitute for load testing. Use k6, JMeter or an approved enterprise performance tool for concurrency, soak and capacity testing.
- Security checks are safe, non-destructive browser checks. They do not replace a formal penetration test, SAST, DAST or threat-model review.
- Accessibility checks use axe plus keyboard and accessible-name assertions. Confirm exceptions with accessibility specialists and manual assistive-technology testing.
- Proposed thresholds must be agreed with the client and adjusted through environment variables.
