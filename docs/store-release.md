# Chrome Web Store: Checkliste

**Stand: 07.10.2026.** Die Erweiterung ist noch nicht eingereicht. Maßgeblich sind die zum Zeitpunkt der Einreichung geltenden Google-Richtlinien.

## Für dieses Projekt

- **Zweck:** Die klassische YouTube-Watch-Ansicht und Kinomodus-Auswahl wiederherstellen. Keine Nebenfunktionen, kein Popup.
- **Manifest V3:** `extension/manifest.json` ist MV3; der statische Content Script läuft `document_start` auf `https://www.youtube.com/*`, `all_frames: false` und `world: "MAIN"`.
- **MAIN-Welt:** Das Script benötigt Zugriff auf YouTubes JavaScript-Konfiguration und läuft deshalb im Seitenkontext statt in der isolierten Erweiterungswelt. Dabei gilt die CSP der Seite. Dieser Zugriff muss bei der Einreichung begründet werden; die technische Unterstützung der Option garantiert keine Store-Zulassung.
- **Zugriff:** Der YouTube-Host-Match ist für diese Funktion erforderlich und muss als minimale Berechtigung/Host-Nutzung erklärt werden. Es werden keine zusätzlichen API-Permissions benötigt.
- **Kein Remote-Code:** Der ausführbare Code liegt vollständig im Paket. Es werden keine Skripte oder ausführbaren Inhalte nachgeladen.

## Konto, Gebühr, 2FA

- Ein **Chrome Web Store Developer Account** mit Entwickler-E-Mail ist erforderlich. Die Registrierung umfasst die Zustimmung zu den Bedingungen und eine **einmalige Registrierungsgebühr**: [Developer registration](https://developer.chrome.com/docs/webstore/register).
- **2FA/2SV:** Die konkrete Anforderung für das verwendete Entwicklerkonto muss vor der Einreichung im Dashboard geprüft werden. Dieser Punkt ist noch offen.

## Paket und Listing

- Upload ist eine **ZIP-Datei**, in deren **Wurzel** `manifest.json` und alle zur Erweiterung gehörenden Dateien liegen; kein übergeordnetes Projektverzeichnis und kein `node_modules`: [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare#zip).
- Vor Upload Manifest prüfen: Name, Version, Beschreibung (max. 132 Zeichen laut Vorbereitungsseite), Icons; nach Upload sind Manifest-Metadaten im Dashboard nicht einfach editierbar: [Review your manifest](https://developer.chrome.com/docs/webstore/prepare#manifest).
- Das Listing benötigt mindestens **einen Screenshot**; zulässige Größen sind **1280×800 oder 640×400**, bis zu fünf Screenshots: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing) und [Store images](https://developer.chrome.com/docs/webstore/images).
- Außerdem werden ein **128×128-Erweiterungsicon im ZIP** und eine kleine Werbegrafik benötigt. Icon, Screenshots und Werbegrafik fehlen noch. Die Anforderungen sind vor dem Upload mit dem Dashboard abzugleichen.

## Datenschutz- und Review-Schritte

Im Dashboard müssen Single Purpose, jede Berechtigung/Host-Nutzung, Remote-Code-Nutzung und Datennutzung wahrheitsgemäß erklärt werden. Die offizielle Anleitung verlangt minimale Berechtigungen, eine Begründung je Permission, Data-Use-Zertifizierung und einen Link zu einer Privacy Policy: [Privacy practices](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).

Die Erweiterung erhebt oder übermittelt keine Nutzerdaten, liest oder schreibt keine Cookies und verwendet keine Analytics oder eigenen Netzwerkzugriffe. Sie ändert nur lokale Layoutwerte in der YouTube-Seitenkonfiguration. Vor dem Upload müssen Paket, Datenschutzerklärung und Dashboard-Angaben übereinstimmen.

## Keine Zulassungsgarantie

Die Einreichung unterliegt Googles Prüfung. Die Einhaltung der [Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies) garantiert keine automatische Zulassung.

## Vor der Einreichung

1. Entwicklerkonto und 2FA-Anforderung prüfen.
2. Den [öffentlichen Datenschutzentwurf](https://github.com/ctrwins/classic-watch-layout/blob/main/docs/privacy.md) um die verantwortliche Kontaktadresse ergänzen, abschließen und mit dem Paket abgleichen.
3. Icon, mindestens einen passenden 1280×800- oder 640×400-Screenshot und Promotional Image erstellen.
4. Finales ZIP mit Manifest im Root bauen; nur Extension-Dateien aufnehmen und lokal entpacken/prüfen.
5. Zweck, MAIN-Welt, YouTube-Zugriff und Datennutzung im Dashboard erläutern. Textvorlage: [Store-Beschreibung](store-listing.md).
