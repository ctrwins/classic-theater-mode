# Chrome Web Store einrichten

Stand: 08.10.2026. Die Erweiterung ist noch nicht im Store veröffentlicht. Entwicklerkonto und Registrierungsgebühr sind erledigt. Die folgenden Schritte führst du im Dashboard aus; Bezeichnungen können je nach Sprache leicht abweichen.

**Dashboard:** https://chrome.google.com/webstore/devconsole

## 1. Konto / Account

- Herausgebername: den gewünschten öffentlichen Namen verwenden, z. B. `ctrwins`.
- Öffentliche Kontakt-E-Mail: `ctrwins@googlemail.com`.
- Falls noch nicht verifiziert: **Add email / Verify email** wählen und den Bestätigungslink in der E-Mail öffnen.
- Eventuelle Hinweise zu Kontoverifizierung, Zwei-Faktor-Anmeldung oder Händlerstatus wahrheitsgemäß selbst bearbeiten. Die Registrierung allein bestätigt nicht, dass alle diese Punkte abgeschlossen sind.

## 2. Paket hochladen

[Erweiterungs-ZIP herunterladen](https://github.com/ctrwins/classic-watch-layout/releases/download/v0.1.1/classic-theater-mode-for-youtube-0.1.1.zip) und unverändert hochladen.

Im bereits angelegten Store-Eintrag **Paket → Neues Paket hochladen** wählen. Name und Version werden aus dem Manifest übernommen. Keinen zweiten Eintrag für die Umbenennung anlegen. Nur bei der erstmaligen Einrichtung **Add new item** verwenden.

Nicht das GitHub-Quellcodearchiv oder das Bilder-ZIP hochladen. Das richtige Paket enthält `manifest.json` direkt im Root.

## 3. Store-Eintrag / Store listing

| Feld | Eintrag |
|---|---|
| Name | `Classic Theater Mode for YouTube` (aus dem Manifest) |
| Kurzbeschreibung | Aus dem Manifest; siehe unten |
| Beschreibung / Detailed description | Den unten stehenden Satz kopieren |
| Sprache / Language | English |
| Kategorie / Category | Entertainment |
| Support URL | `https://github.com/ctrwins/classic-watch-layout/issues` |
| Homepage / Website, falls angeboten | `https://github.com/ctrwins/classic-watch-layout` |
| Official URL / verifizierte Website | Leer lassen, wenn keine eigene verifizierte Website vorhanden ist; GitHub nicht als eigene Domain verifizieren |
| Mature content | Nein; die Erweiterung bietet keine Erwachsenenfunktion |

**Beschreibung:**

> A small extension that restores the classic theater mode for affected YouTube accounts.

[Store-Bilder herunterladen](https://github.com/ctrwins/classic-watch-layout/releases/download/v0.1.1/classic-theater-mode-for-youtube-store-assets-0.1.1.zip), entpacken und einzeln zuordnen. Bereits hochgeladene Bilder mit dem alten Namen ersetzen:

| Bildfeld | Datei |
|---|---|
| Store icon | `icon-128.png` |
| Screenshots | `screenshot-1280x800.png` |
| Small promotional tile | `promo-440x280.png` |

Ein zusätzliches Werbevideo oder eine große Marquee-Grafik ist für dieses vorbereitete Listing nicht vorgesehen. Falls das Dashboard weitere Angaben verlangt, dessen Hinweise prüfen.

## 4. Datenschutz / Privacy practices

### Single purpose description

> Restore the classic YouTube watch layout and theater mode for accounts affected by the newer layout.

### Host permission justification / Zugriff auf YouTube

Nur bei den tatsächlich angezeigten Berechtigungsfeldern eintragen. Es werden keine zusätzlichen API-Permissions angefordert.

> The content script runs only on https://www.youtube.com/* and only in the top-level document. It must run at document_start to adjust YouTube's layout configuration before the page initializes. MAIN-world execution is necessary because the configuration belongs to the page's JavaScript context. The extension does not read account data, browsing history or cookies, and makes no network requests.

### Remote code

**No, I am not using remote code.** Falls eine Begründung verlangt wird:

> All executable code is included in the extension package. No remote scripts or executable resources are downloaded or evaluated.

### Data usage

- In der Liste erhobener Datentypen **keinen Datentyp auswählen**: Die Erweiterung erhebt keine Nutzerdaten.
- Die getrennten Erklärungen zur zulässigen Datennutzung lesen und bestätigen, soweit sie zutreffen. Diese Bestätigungen nicht mit der Datentypen-Liste verwechseln.
- E-Mail-Support erfolgt außerhalb der Erweiterung; das ist in der Datenschutzerklärung gesondert erläutert.

### Privacy policy URL

`https://github.com/ctrwins/classic-watch-layout/blob/main/docs/privacy.md`

## 5. Vertrieb / Distribution

- Für einen öffentlichen kostenlosen Start: **Public**, **Free**, sofern ein Preisfeld angeboten wird.
- Gewünschte Länder auswählen; bei weltweiter Veröffentlichung alle angebotenen Länder.
- Etwaige rechtliche Angaben zum Händlerstatus selbst anhand der tatsächlichen Situation ausfüllen.

## 6. Test instructions

> Install the extension and reload an existing YouTube watch page. On an account affected by the newer watch layout, select theater mode and verify that the classic wide layout is restored. Also check navigation to another video and entering/exiting fullscreen. There is no popup, extension login or setup. The effect depends on YouTube's account-specific rollout; an unaffected account may show no visual difference.

Keine persönlichen Anmeldedaten hinterlegen. Die Erweiterung hat kein eigenes Benutzerkonto.

## 7. Prüfen und einreichen

Alle Abschnitte speichern, Dashboard-Warnungen prüfen und einen kurzen Funktionstest mit dem endgültigen Paket durchführen. Erst dann **Submit for review** wählen. Ob nach Freigabe automatisch veröffentlicht werden soll, im Bestätigungsdialog bewusst entscheiden.

Sobald eine konkrete öffentliche Store-Adresse vorliegt, kann sie oben in der README als Installationslink eingesetzt werden. Bis dahin wird keine Store-Verfügbarkeit behauptet. Eine GitHub-Veröffentlichung ersetzt nicht Googles Prüfung.

## Offizielle Quellen

- [Veröffentlichen und Dashboard](https://developer.chrome.com/docs/webstore/publish)
- [Kontaktadresse verifizieren](https://developer.chrome.com/docs/webstore/set-up-account)
- [Store-Eintrag](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)
- [Kategorien](https://developer.chrome.com/docs/webstore/best_practices#choose-your-extensions-category-well)
- [Datenschutzangaben](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Vertrieb](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution)
