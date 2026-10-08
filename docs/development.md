# Entwicklung und Tests

## Funktionsweise und Grenzen

Das lokal mitgelieferte Script läuft bei `document_start` in der MAIN-Welt auf `https://www.youtube.com/*`. Es hält ausschließlich diese Layoutflags auf `false`:

- `kevlar_watch_grid`
- `kevlar_watch_fixie`
- `web_side_rail_dismissible_panels`
- `web_watch_imax_theater_mode`
- `disable_theater_mode`

Die Pfade `ytcfg.data_.EXPERIMENT_FLAGS` und `yt.config_.EXPERIMENT_FLAGS` werden auch bei späteren Zuweisungen berücksichtigt. Keine globalen Prototype-Patches, kein Polling und keine CSS-/DOM-Rekonstruktion. Vorhandene eigene Accessors und nicht veränderbare Eigenschaften werden nicht überschrieben; in solchen Fällen kann die Korrektur ausbleiben. Die alten YouTube-Komponenten müssen noch vorhanden sein. Entfernt YouTube sie oder benennt Schalter um, muss die Erweiterung angepasst werden.

Kein Popup und keine weitere Einrichtung. Die Erweiterung erzwingt weder Vollbild noch automatische Wiedergabe. Keine Cookies, kein Storage, keine Account-/Verlaufsabfrage, keine Telemetrie und keine eigenen Netzwerkzugriffe. YouTube selbst bleibt ein Onlinedienst. Details: [Datenschutz](privacy.md).

## Tests

Node.js 22+, npm und für Browserprüfungen eine installierte Brave-Version:

```sh
npm ci --ignore-scripts
npm test
node --check extension/restore.js
npm run test:browser
```

`npm test` prüft Konfigurationslogik, Manifestumfang und Icon-Dateien ohne Netzwerk oder Browser. `test:browser` lädt die Erweiterung in ein temporäres Brave-Profil und verwendet lokale Testseiten. Bestehende Browserprofile bleiben unberührt; das Testprofil wird anschließend gelöscht. Bei anderer Installation `BRAVE_EXECUTABLE` auf die Brave-Programmdatei setzen.

`tests/live.mjs` ruft YouTube ohne Anmeldung auf und erfasst Layoutmaße. Die Erkennung des Cookie-Dialogs ist unzuverlässig. Der Test ersetzt weder eine Sichtprüfung noch einen Test im betroffenen Konto und gehört nicht zur regulären Testsuite. Details: [Tests und bekannte Einschränkungen](verification.md).

## Pakete

Das Erweiterungs-ZIP enthält nur Dateien aus `extension`, mit `manifest.json` direkt im Archivroot. Es eignet sich für die manuelle Installation und den Store-Upload. Das Quellcode-ZIP unter **Code → Download ZIP** enthält dagegen das gesamte Repository und ist kein Store-Paket.

Store-Bilder werden separat hochgeladen. Anleitung: [Store-Einrichtung](store-setup.md).
