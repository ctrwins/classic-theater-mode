# Chrome Web Store: Checkliste

**Stand: 08.10.2026.** Die Erweiterung ist noch nicht eingereicht. Maßgeblich sind die zum Zeitpunkt der Einreichung geltenden Google-Richtlinien. Die [Dashboard-Anleitung](store-setup.md) enthält alle vorbereiteten Einträge und Downloadlinks.

## Für dieses Projekt

- **Zweck:** Die klassische YouTube-Watch-Ansicht und Kinomodus-Auswahl wiederherstellen. Keine Nebenfunktionen, kein Popup.
- **Manifest V3:** `extension/manifest.json` ist MV3; der statische Content Script läuft `document_start` auf `https://www.youtube.com/*`, `all_frames: false` und `world: "MAIN"`.
- **MAIN-Welt:** Das Script benötigt Zugriff auf YouTubes JavaScript-Konfiguration und läuft deshalb im Seitenkontext statt in der isolierten Erweiterungswelt. Dabei gilt die CSP der Seite. Dieser Zugriff muss bei der Einreichung begründet werden; die technische Unterstützung der Option garantiert keine Store-Zulassung.
- **Zugriff:** Der YouTube-Host-Match ist für diese Funktion erforderlich und muss als minimale Berechtigung/Host-Nutzung erklärt werden. Es werden keine zusätzlichen API-Permissions benötigt.
- **Kein Remote-Code:** Der ausführbare Code liegt vollständig im Paket. Es werden keine Skripte oder ausführbaren Inhalte nachgeladen.

## Konto, Gebühr, 2FA

- Ein **Chrome Web Store Developer Account** mit Entwickler-E-Mail ist erforderlich. Die Registrierung umfasst die Zustimmung zu den Bedingungen und eine **einmalige Registrierungsgebühr**: [Developer registration](https://developer.chrome.com/docs/webstore/register).
- **Erledigt:** Entwicklerkonto eingerichtet und Registrierungsgebühr bezahlt.
- **2FA/2SV:** Die konkrete Anforderung für das verwendete Entwicklerkonto muss vor der Einreichung im Dashboard geprüft werden. Dieser Punkt ist noch offen.

## Paket und Listing

- Upload ist eine **ZIP-Datei**, in deren **Wurzel** `manifest.json` und alle zur Erweiterung gehörenden Dateien liegen; kein übergeordnetes Projektverzeichnis und kein `node_modules`: [Prepare your extension](https://developer.chrome.com/docs/webstore/prepare#zip).
- Vor Upload Manifest prüfen: Name, Version, Beschreibung (max. 132 Zeichen laut Vorbereitungsseite), Icons; nach Upload sind Manifest-Metadaten im Dashboard nicht einfach editierbar: [Review your manifest](https://developer.chrome.com/docs/webstore/prepare#manifest).
- Das Listing benötigt mindestens **einen Screenshot**; zulässige Größen sind **1280×800 oder 640×400**, bis zu fünf Screenshots: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing) und [Store images](https://developer.chrome.com/docs/webstore/images).
- Das **128×128-Erweiterungsicon** liegt unter `extension/icons/icon-128.png` und ist im Manifest eingebunden. Die Grafik hat 16 Pixel transparenten Rand; zusätzliche Größen für den Browser sind 16, 32 und 48 Pixel. Die bearbeitbare Vorlage liegt unter `assets/icon.svg`.
- Der **1280×800-Screenshot** liegt unter `assets/store/screenshot-1280x800.png`. Das Original wurde proportional skaliert und mit einem Rahmen ergänzt; das Profil-Initial ist verdeckt.
- Die **440×280-Werbegrafik** liegt unter `assets/store/promo-440x280.png`. Beide Listing-Bilder sind PNG-Dateien ohne Transparenz und gehören nicht in das Erweiterungs-ZIP.

## Datenschutz- und Review-Schritte

Im Dashboard müssen Single Purpose, jede Berechtigung/Host-Nutzung, Remote-Code-Nutzung und Datennutzung wahrheitsgemäß erklärt werden. Die offizielle Anleitung verlangt minimale Berechtigungen, eine Begründung je Permission, Data-Use-Zertifizierung und einen Link zu einer Privacy Policy: [Privacy practices](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).

Die Erweiterung erhebt oder übermittelt keine Nutzerdaten, liest oder schreibt keine Cookies und verwendet keine Analytics oder eigenen Netzwerkzugriffe. Sie ändert nur lokale Layoutwerte in der YouTube-Seitenkonfiguration. Vor dem Upload müssen Paket, Datenschutzerklärung und Dashboard-Angaben übereinstimmen.

## Keine Zulassungsgarantie

Die Einreichung unterliegt Googles Prüfung. Die Einhaltung der [Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies) garantiert keine automatische Zulassung.

## Vor der Einreichung

1. Etwaige offene Kontoverifizierung und 2FA-Anforderung prüfen; Konto und Registrierungsgebühr sind erledigt.
2. Die [Datenschutzerklärung](https://github.com/ctrwins/classic-watch-layout/blob/main/docs/privacy.md) im Dashboard verlinken. Kontaktadresse: `ctrwins@googlemail.com`; im Entwicklerkonto eintragen und gegebenenfalls verifizieren.
3. Die vorbereiteten Grafiken im Store-Listing hochladen.
4. Das geprüfte Erweiterungs-ZIP aus `dist/classic-theater-mode-for-youtube-0.1.1.zip` im bestehenden Store-Eintrag als neues Paket hochladen. Nur Erweiterungsdateien sind darin enthalten, mit Manifest im Root. Abschließende Verträglichkeitstests stehen noch aus.
5. Zweck, MAIN-Welt, YouTube-Zugriff und Datennutzung im Dashboard erläutern. Textvorlage: [Store-Beschreibung](store-listing.md).
