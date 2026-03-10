/**
 * JSON-to-HTML renderers for legal documents.
 * Text from JSON sources is rendered unchanged.
 */

// ── Helpers ──────────────────────────────────────────────────────────

function nl2html(text: string): string {
  return text
    .split('\n\n')
    .map((block) => block.replace(/\n/g, '<br/>'))
    .join('</p>\n    <p>');
}

function renderUl(items: string[]): string {
  return `<ul>\n${items.map((i) => `      <li>${i}</li>`).join('\n')}\n    </ul>`;
}

// ── Cookies Policy ───────────────────────────────────────────────────

export function renderCookiesPolicy(d: any): string {
  const s = d.sections;
  return `
    <h1>${d.title}</h1>

    <p>${d.effectiveDate}.<br/>${d.previousVersions}.<br/>${d.introduction.description}<br/>${d.introduction.consent}</p>

    <h2>${s.whatAreCookies.title}</h2>
    <p>${s.whatAreCookies.content}</p>

    <h2>${s.typesOfCookies.title}</h2>
    <p>${s.typesOfCookies.description}</p>
    <p><strong>${s.typesOfCookies.necessary.title}</strong> – ${s.typesOfCookies.necessary.description}</p>
    <p><strong>${s.typesOfCookies.functional.title}</strong> – ${s.typesOfCookies.functional.description}</p>
    <p><strong>${s.typesOfCookies.analytical.title}</strong> – ${s.typesOfCookies.analytical.description}</p>
    <p><strong>${s.typesOfCookies.marketing.title}</strong> – ${s.typesOfCookies.marketing.description}</p>

    <h2>${s.localStorage.title}</h2>
    <p>${s.localStorage.description}</p>
    <p>${s.localStorage.localStorage.title}.<br/>${s.localStorage.localStorage.purpose}.<br/>${s.localStorage.localStorage.data}.<br/>${s.localStorage.localStorage.retention}.</p>
    <p>${s.localStorage.indexedDB.title}.<br/>${s.localStorage.indexedDB.purpose}.<br/>${s.localStorage.indexedDB.data}.<br/>${s.localStorage.indexedDB.retention}.</p>
    <p>${s.localStorage.sharedPreferences.title}.<br/>${s.localStorage.sharedPreferences.purpose}.<br/>${s.localStorage.sharedPreferences.data}.<br/>${s.localStorage.sharedPreferences.retention}.</p>

    <h2>${s.thirdPartyServices.title}</h2>
    <p>${s.thirdPartyServices.firebase.title}.<br/><strong>Provider:</strong> ${s.thirdPartyServices.firebase.provider}.<br/><strong>Purpose:</strong> ${s.thirdPartyServices.firebase.purpose}.<br/><strong>Data Collected:</strong> ${s.thirdPartyServices.firebase.dataCollected}.<br/><strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy">${s.thirdPartyServices.firebase.privacyPolicy}</a><br/><strong>Opt-out:</strong> ${s.thirdPartyServices.firebase.optOut}.</p>
    <p>${s.thirdPartyServices.youtube.title}.<br/><strong>Provider:</strong> ${s.thirdPartyServices.youtube.provider}.<br/><strong>Purpose:</strong> ${s.thirdPartyServices.youtube.purpose}.<br/><strong>Data Collected:</strong> ${s.thirdPartyServices.youtube.dataCollected}.<br/><strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy">${s.thirdPartyServices.youtube.privacyPolicy}</a></p>
    <p>${s.thirdPartyServices.googleFonts.title}<br/><strong>Provider:</strong> ${s.thirdPartyServices.googleFonts.provider}.<br/><strong>Purpose:</strong> ${s.thirdPartyServices.googleFonts.purpose}.<br/><strong>Data Collected:</strong> ${s.thirdPartyServices.googleFonts.dataCollected}.<br/><strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy">${s.thirdPartyServices.googleFonts.privacyPolicy}</a></p>

    <h2>${s.cookieManagement.title}</h2>
    <p>${s.cookieManagement.browserSettings.title}<br/>${s.cookieManagement.browserSettings.description}</p>
    ${renderUl(s.cookieManagement.browserSettings.browsers)}
    <p>${s.cookieManagement.optOutOptions.title}</p>
    ${renderUl(s.cookieManagement.optOutOptions.options)}
    <p>${s.cookieManagement.consequences.title}<br/>${s.cookieManagement.consequences.description}</p>
    ${renderUl(s.cookieManagement.consequences.effects)}

    <h2>${s.dataSecurity.title}</h2>
    <p>${s.dataSecurity.description}</p>
    ${renderUl(s.dataSecurity.measures)}

    <h2>${s.internationalTransfers.title}</h2>
    <p>${s.internationalTransfers.content}</p>
    ${renderUl(s.internationalTransfers.safeguards)}

    <h2>${s.policyUpdates.title}</h2>
    <p>${s.policyUpdates.description}</p>
    ${renderUl(s.policyUpdates.methods)}

    <h2>${s.contact.title}</h2>
    <p>${s.contact.description}<br/>${s.contact.email}<br/>${s.contact.address.replace(/\n/g, '<br/>')}</p>

    <p>${d.footer.lastUpdated}<br/>${d.footer.previousVersions}</p>
  `;
}

// ── Privacy Policy (current version) ─────────────────────────────────

export function renderPrivacyPolicy(d: any): string {
  const s = d.sections;

  const purposeTableRows = s.dataUsage.purposes.table
    .map(
      (row: any) => `
        <tr>
          <td>${row.purpose}</td>
          <td>${row.legalBasis}</td>
          <td>${row.example}</td>
        </tr>`,
    )
    .join('');

  const processorRows = s.dataSharing.processors.list
    .map(
      (row: any) => `
        <tr>
          <td>${row.processor}</td>
          <td>${row.activity}</td>
        </tr>`,
    )
    .join('');

  const securityMeasures = s.dataSecurity.measures
    .map(
      (m: any) => `
    <p><strong>${m.title}</strong></p>
    <p>${m.content}</p>`,
    )
    .join('');

  return `
    <h1>${d.title}</h1>

    <p>${d.effectiveDate}.<br/>${d.previousVersions}</p>

    <p>${d.introduction.description}</p>
    <p>${d.introduction.disclaimer}</p>

    <p><strong>${d.keyPoints.title}</strong></p>
    ${renderUl(d.keyPoints.points)}

    <h2>${s.intro.title}</h2>
    <p>${nl2html(s.intro.content)}</p>

    <h2>${s.dataCollection.title}</h2>
    <p>${s.dataCollection.intro}</p>
    <p><strong>${s.dataCollection.directCollection.title}</strong></p>
    ${renderUl(s.dataCollection.directCollection.items)}
    <p>${s.dataCollection.directCollection.note}</p>
    <p><strong>${s.dataCollection.automaticCollection.title}</strong></p>
    ${renderUl(s.dataCollection.automaticCollection.items)}

    <h2>${s.dataUsage.title}</h2>
    <p>${s.dataUsage.intro}</p>
    ${renderUl(s.dataUsage.legalBases)}
    <p>${s.dataUsage.purposes.title}</p>
    <table>
      <thead>
        <tr>
          <th>${s.dataUsage.purposes.tableHeaders.purpose}</th>
          <th>${s.dataUsage.purposes.tableHeaders.legalBasis}</th>
          <th>${s.dataUsage.purposes.tableHeaders.example}</th>
        </tr>
      </thead>
      <tbody>${purposeTableRows}
      </tbody>
    </table>
    <p>${s.dataUsage.additionalInfo.dataMinimization}</p>
    <p>${s.dataUsage.additionalInfo.advertisement}</p>
    <p>${nl2html(s.dataUsage.additionalInfo.anonymousData)}</p>
    <p>${nl2html(s.dataUsage.additionalInfo.communication)}</p>
    <p>${s.dataUsage.additionalInfo.automatedDecisions}</p>
    <p>${s.dataUsage.additionalInfo.clinicalDecisions}</p>

    <h2>${s.dataRetention.title}</h2>
    <p>${nl2html(s.dataRetention.content)}</p>

    <h2>${s.dataSharing.title}</h2>
    <p>${nl2html(s.dataSharing.intro)}</p>
    <p><strong>${s.dataSharing.processors.title}</strong></p>
    <table>
      <thead>
        <tr>
          <th>Processor</th>
          <th>Activity</th>
        </tr>
      </thead>
      <tbody>${processorRows}
      </tbody>
    </table>
    <h3>${s.dataSharing.otherSharing.title}</h3>
    ${s.dataSharing.otherSharing.scenarios.map((sc: any) => `<p><strong>${sc.title}</strong></p>\n    <p>${sc.content}</p>`).join('\n    ')}

    <h2>${s.privacyRights.title}</h2>
    <p>${nl2html(s.privacyRights.intro)}</p>
    ${renderUl(s.privacyRights.rights)}
    <p><strong>${s.privacyRights.exerciseRights.title}</strong></p>
    <p>${nl2html(s.privacyRights.exerciseRights.content)}</p>
    <p>${s.privacyRights.optOut}</p>
    <p>${s.privacyRights.targetedAdvertising}</p>
    <p>${s.privacyRights.proofOfIdentity}</p>
    <p>${s.privacyRights.nationalLaws}</p>

    <h2>${s.otherSites.title}</h2>
    <p>${s.otherSites.content}</p>

    <h2>${s.dataSecurity.title}</h2>
    <p>${nl2html(s.dataSecurity.intro)}</p>
    ${securityMeasures}

    <h2>${s.crossBorderTransfers.title}</h2>
    <p>${nl2html(s.crossBorderTransfers.content)}</p>

    <h2>${s.childrensPrivacy.title}</h2>
    <p>${nl2html(s.childrensPrivacy.content)}</p>

    <h2>${s.contact.title}</h2>
    <p>${nl2html(s.contact.content)}</p>
  `;
}

// ── Privacy Policy V1 (old version) ──────────────────────────────────

export function renderPrivacyPolicyV1(d: any): string {
  const s = d.sections;
  return `
    <h1>${d.title} (Version 1)</h1>
    <p>${d.lastUpdated}</p>
    <p><strong>Note:</strong> This is a previous version of our Privacy Policy. <a href="?">View the current version</a>.</p>

    <h2>${s.introduction.title}</h2>
    <p>${s.introduction.content}</p>

    <h2>${s.dataController.title}</h2>
    <p>${s.dataController.content}</p>

    <h2>${s.dataTypes.title}</h2>
    <p>${s.dataTypes.intro}</p>
    <p>${s.dataTypes.contact}</p>
    <p>${s.dataTypes.payment}</p>
    <p>${s.dataTypes.business}</p>
    <p>${s.dataTypes.compliance}</p>
    <p>${s.dataTypes.preferences}</p>
    <p>${s.dataTypes.platform}</p>
    <p>${s.dataTypes.public}</p>
    <p>${s.dataTypes.statutory}</p>
    <p>${s.dataTypes.medical}</p>
    <p>${s.dataTypes.usage}</p>
    <p>${s.dataTypes.technical}</p>

    <h2>${s.purpose.title}</h2>
    <p>${s.purpose.intro}</p>
    <p>${s.purpose.service}</p>
    <p>${s.purpose.communication}</p>
    <p>${s.purpose.research}</p>
    <p>${s.purpose.compliance}</p>

    <h2>${s.retention.title}</h2>
    <p>${s.retention.content}</p>

    <h2>${s.dataController2.title}</h2>
    <p>${s.dataController2.intro}</p>
    <p>${s.dataController2.internal}</p>
    <p>${s.dataController2.thirdParty}</p>
    <p>${s.dataController2.research}</p>
    <p>${s.dataController2.legal}</p>
    <p>${s.dataController2.note}</p>

    <h2>${s.rights.title}</h2>
    <p>${s.rights.intro}</p>
    <p>${s.rights.access}</p>
    <p>${s.rights.rectification}</p>
    <p>${s.rights.erasure}</p>
    <p>${s.rights.restriction}</p>
    <p>${s.rights.portability}</p>
    <p>${s.rights.objection}</p>
    <p>${s.rights.contact}</p>

    <h2>${s.security.title}</h2>
    <p>${s.security.content}</p>

    <h2>${s.transfers.title}</h2>
    <p>${s.transfers.content}</p>

    <h2>${s.testing.title}</h2>
    <p>${s.testing.intro}</p>
    <p>${s.testing.functionality}</p>
    <p>${s.testing.advice}</p>
    <p>${s.testing.data}</p>

    <h2>${s.changes.title}</h2>
    <p>${s.changes.content}</p>

    <h2>${s.contact.title}</h2>
    <p>${s.contact.content}</p>

    <h2>${s.cookies.title}</h2>
    <p>${s.cookies.content}</p>

    <h2>${s.related.title}</h2>
    <p>${s.related.content}</p>

    <h2>${s.other.title}</h2>
    <p>${s.other.content}</p>
  `;
}

// ── Terms of Use (current version) ───────────────────────────────────

export function renderTermsOfUse(d: any): string {
  const s = d.sections;

  return `
    <h1>${d.title}</h1>

    <p>${d.effectiveDate}</p>
    ${d.previousVersions ? `<p>${d.previousVersions}</p>` : ''}

    <p>${d.introduction.description}</p>
    <p>${d.introduction.agreement}</p>
    <p>${d.introduction.betaDisclaimer}</p>
    <p>${d.introduction.betaWarning}</p>
    ${d.introduction.notAMedicalDevice ? `<p>${d.introduction.notAMedicalDevice}</p>` : ''}

    <h2>${s.generalConditions.title}</h2>
    <p>${s.generalConditions.content}</p>
    ${renderUl(s.generalConditions.requirements)}
    <p>${s.generalConditions.validity}</p>
    <p>${s.generalConditions.binding}</p>

    <h2>${s.theAgreement.title}</h2>
    <p>${s.theAgreement.description}</p>
    <p>${s.theAgreement.paidServices}</p>
    <p>${s.theAgreement.serviceProvision}</p>

    <h2>${s.medicalAdviceDisclaimer.title}</h2>
    <p>${s.medicalAdviceDisclaimer.mainDisclaimer}</p>
    <p>${s.medicalAdviceDisclaimer.liability}</p>
    <p>${s.medicalAdviceDisclaimer.aiContent}</p>
    <p>${s.medicalAdviceDisclaimer.accurateInfo}</p>

    <h2>${s.registration.title}</h2>
    <p>${s.registration.accountCreation}</p>
    <p>${s.registration.ageRequirement}</p>
    <p>${s.registration.ageVerification}</p>
    <p>${s.registration.accountRules}</p>

    <h2>${s.userContent.title}</h2>
    <p>${s.userContent.definition}</p>
    <p>${s.userContent.license}</p>
    <p>${s.userContent.advertising}</p>
    <p>${s.userContent.warranties}</p>
    <p>${s.userContent.moderation}</p>
    <p>${s.userContent.removal}</p>
    <p>${s.userContent.prohibitedContent.intro}</p>
    ${renderUl(s.userContent.prohibitedContent.items)}
    <p>${s.userContent.additionalModeration}</p>

    <h2>${s.serviceUse.title}</h2>
    <p>${s.serviceUse.responsibility}</p>
    <p>${s.serviceUse.prohibitedActions.intro}</p>
    ${renderUl(s.serviceUse.prohibitedActions.items)}
    <p>${s.serviceUse.termination}</p>
    <p>${s.serviceUse.accountability}</p>

    <h2>${s.exportControls.title}</h2>
    <p>${s.exportControls.regulations}</p>
    <p>${s.exportControls.warranties}</p>
    <p>${s.exportControls.compliance}</p>

    <h2>${s.paidServices.title}</h2>
    <p>${s.paidServices.availability}</p>
    <p>${s.paidServices.subscriptions}</p>
    <p>${s.paidServices.changes}</p>
    <p>${s.paidServices.priceChanges}</p>
    <p>${s.paidServices.errors}</p>
    <p>${s.paidServices.renewal}</p>
    <p>${s.paidServices.cancellation}</p>
    <p>${s.paidServices.purchaseProcess.title}</p>
    ${renderUl(s.paidServices.purchaseProcess.steps)}
    <p>${s.paidServices.confirmation}</p>
    <p>${s.paidServices.promotions}</p>
    <p>${s.paidServices.donations}</p>

    <h2>${s.privacyAI.title}</h2>
    <p>${s.privacyAI.privacy}</p>
    <p>${s.privacyAI.aiLimitations}</p>
    <p>${s.privacyAI.automatedDecisions}</p>
    <p>${s.privacyAI.aiClassification}</p>

    <h2>${s.limitedLicense.title}</h2>
    <p>${s.limitedLicense.license}</p>
    <p>${s.limitedLicense.permissions}</p>
    <p>${s.limitedLicense.ownership}</p>

    <h2>${s.links.title}</h2>
    <p>${s.links.content}</p>

    <h2>${s.indemnification.title}</h2>
    <p>${s.indemnification.content}</p>

    <h2>${s.warrantyDisclaimer.title}</h2>
    <p>${s.warrantyDisclaimer.responsibility}</p>
    <p>${s.warrantyDisclaimer.termination}</p>
    <p>${s.warrantyDisclaimer.userControl}</p>
    <p>${s.warrantyDisclaimer.userLiability}</p>
    <p>${s.warrantyDisclaimer.availability}</p>
    <p>${s.warrantyDisclaimer.asIsDisclaimer}</p>
    <p>${s.warrantyDisclaimer.liabilityLimitation}</p>

    <h2>${s.disputeResolution.title}</h2>
    <p>${s.disputeResolution.euJurisdiction}</p>
    <p>${s.disputeResolution.arbitration}</p>
    <p>${s.disputeResolution.arbitrationPlace}</p>
    <p>${s.disputeResolution.noticeDispute}</p>
    <p>${s.disputeResolution.arbitrationCosts}</p>
    <p>${s.disputeResolution.arbitrationAward}</p>
    <p>${s.disputeResolution.optOut}</p>
    <p>${s.disputeResolution.changes}</p>
    <p>${s.disputeResolution.exceptions}</p>
    <p>${s.disputeResolution.additionalProvisions.title}</p>
    ${renderUl(s.disputeResolution.additionalProvisions.items)}
    <p>${s.disputeResolution.governingLaw}</p>

    <h2>${s.electronicCommunications.title}</h2>
    <p>${s.electronicCommunications.content}</p>

    <h2>${s.termination.title}</h2>
    <p>${s.termination.grounds}</p>
    <p>${s.termination.consequences}</p>
    <p>${s.termination.survival}</p>

    <h2>${s.severability.title}</h2>
    <p>${s.severability.content}</p>

    <h2>${s.takedownProcedures.title}</h2>
    <p>${s.takedownProcedures.content}</p>
    ${renderUl(s.takedownProcedures.requirements)}

    <h2>${s.otherProvisions.title}</h2>
    <p>${s.otherProvisions.modifications}</p>
    <p>${s.otherProvisions.acceptance}</p>
    <p>${s.otherProvisions.disagreement}</p>
    <p>${s.otherProvisions.assignment}</p>

    <h2>${s.contact.title}</h2>
    <p>${s.contact.content}</p>
  `;
}

// ── Terms V1 (old version) ───────────────────────────────────────────

export function renderTermsOfUseV1(d: any): string {
  return `
    <h1>${d.title} (Version 1)</h1>
    <p>${d.lastUpdated}</p>
    <p><strong>Note:</strong> This is a previous version of our Terms. <a href="?">View the current version</a>.</p>

    <h2>${d.introduction.title}</h2>
    <p>${d.introduction.description.part1}</p>

    <h2>${d.testVersionDisclaimer.title}</h2>
    <p>${d.testVersionDisclaimer.description.part1}</p>
    <p>${d.testVersionDisclaimer.description.part2}</p>

    <h2>${d.noMedicalAdvice.title}</h2>
    <p>${d.noMedicalAdvice.description.part1}</p>
    <p>${d.noMedicalAdvice.description.part2}</p>

    <h2>${d.limitationOfLiability.title}</h2>
    <p>${d.limitationOfLiability.description.part1}</p>
    <p>${d.limitationOfLiability.description.part2}</p>

    <h2>${d.useOfDoctorina.title}</h2>
    <p>${d.useOfDoctorina.description.part1}</p>
    <p>${d.useOfDoctorina.description.part2}</p>

    <h2>${d.dataCollectionAndPrivacy.title}</h2>
    <p>${d.dataCollectionAndPrivacy.description.part1}</p>
    <p>${d.dataCollectionAndPrivacy.description.part2}</p>

    <h2>${d.modificationsAndTermination.title}</h2>
    <p>${d.modificationsAndTermination.description.part1}</p>
    <p>${d.modificationsAndTermination.description.part2}</p>

    <h2>${d.governingLaw.title}</h2>
    <p>${d.governingLaw.description.part1}</p>
    <p>${d.governingLaw.description.part2}</p>

    <h2>${d.contactInformation.title}</h2>
    <p>${d.contactInformation.description.part1}</p>
  `;
}
