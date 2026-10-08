# Classic Watch Layout

Kleine Manifest-V3-Erweiterung für Brave und kompatible Chromium-Browser. Sie wählt YouTubes noch vorhandene klassische Watch-Ansicht statt bestimmter neuer Konto-/Layoutvarianten.

**Version 0.1.0 – Testversion.** Die klassische Darstellung wurde für eine betroffene Kontovariante durch eine Nutzerrückmeldung bestätigt. Andere YouTube-Rollouts können abweichen. Das Projekt ist unabhängig von YouTube und Google.

## Installation in Brave

1. Dieses Repository über **Code → Download ZIP** herunterladen und entpacken oder mit Git klonen.
2. `brave://extensions` öffnen und **Entwicklermodus** einschalten.
3. **Entpackte Erweiterung laden** wählen und den Ordner `extension` auswählen.
4. Bereits geöffnete YouTube-Tabs neu laden.

Kein Popup und keine weitere Einrichtung. Der gewählte Wiedergabemodus bleibt grundsätzlich YouTubes Entscheidung; die Erweiterung erzwingt weder Vollbild noch automatische Wiedergabe. Wenn die betreffende Sitzung bisher den Kinomodus nutzte, sollte wieder die breite klassische Playerfläche erscheinen.

**Rückgängig:** Erweiterung deaktivieren/entfernen und YouTube neu laden. Bereits geladene Seiten müssen neu geladen werden, weil die Konfigurationsänderungen bis dahin im Seitenspeicher verbleiben.

## Funktionsweise und Grenzen

Ein lokal mitgeliefertes Script läuft bei `document_start` in der MAIN-Welt auf `https://www.youtube.com/*`. Es hält ausschließlich diese Layoutflags auf `false`:

- `kevlar_watch_grid`
- `kevlar_watch_fixie`
- `web_side_rail_dismissible_panels`
- `web_watch_imax_theater_mode`
- `disable_theater_mode`

Die Pfade `ytcfg.data_.EXPERIMENT_FLAGS` und `yt.config_.EXPERIMENT_FLAGS` werden auch bei späteren Zuweisungen berücksichtigt. Keine globalen Prototype-Patches, kein Polling und keine CSS-/DOM-Rekonstruktion. Vorhandene eigene Accessors und nicht veränderbare Eigenschaften werden absichtlich nicht überschrieben; in solchen Fällen kann die Korrektur ausbleiben. Die noch vorhandenen alten YouTube-Komponenten sind Voraussetzung. Entfernt YouTube sie oder benennt Schalter um, muss die Erweiterung angepasst werden.

Keine Cookies, kein Storage, keine Account-/Verlaufsabfrage, keine Telemetrie und keine eigenen Netzwerkzugriffe. YouTube selbst bleibt unverändert ein Onlinedienst. Details: [Datenschutzentwurf](docs/privacy.md).

## Entwicklung und Tests

Node.js 22+, npm und für Browserprüfungen eine installierte Brave-Version:

```sh
npm ci --ignore-scripts
npm test
node --check extension/restore.js
npm run test:browser
```

`npm test` prüft die Konfigurationslogik und den Manifestumfang ohne Netzwerk oder Browser. `test:browser` lädt die Erweiterung in ein temporäres Brave-Profil und verwendet lokale Testseiten. Bestehende Browserprofile bleiben unberührt; das Testprofil wird anschließend gelöscht. Bei anderer Installation `BRAVE_EXECUTABLE` auf die Brave-Programmdatei setzen.

`tests/live.mjs` ruft YouTube ohne Anmeldung auf und erfasst Layoutmaße. Die Erkennung des Cookie-Dialogs ist noch unzuverlässig. Der Test ersetzt deshalb weder eine Sichtprüfung noch einen Test im betroffenen Konto und gehört nicht zur regulären Testsuite. Details: [Tests und bekannte Einschränkungen](docs/verification.md).

## Veröffentlichung

Das Store-Paket enthält nur die Dateien aus `extension`, mit `manifest.json` direkt im Archivroot. Das ZIP unter **Code → Download ZIP** enthält dagegen das gesamte Repository und ist nicht für den Store-Upload geeignet. Entwicklungsabhängigkeiten werden nicht ausgeliefert.

Die Erweiterung ist noch nicht im Chrome Web Store verfügbar. Für die Einreichung fehlen Icons, Storebilder, die abschließende Datenschutzerklärung mit Kontaktadresse und die Angaben im Entwickler-Dashboard. Siehe [Store-Checkliste](docs/store-release.md) und [Beschreibung für den Store](docs/store-listing.md).

## Support und Lizenz

Fehlerberichte und Verbesserungsvorschläge: [GitHub Issues](https://github.com/ctrwins/classic-watch-layout/issues). Bitte Browser-/Erweiterungsversion und Schritte zum Nachstellen angeben. Keine Kontodaten oder sonstigen privaten Informationen veröffentlichen.

Das Repository ist öffentlich einsehbar. Eine Open-Source-Lizenz ist noch nicht festgelegt.
